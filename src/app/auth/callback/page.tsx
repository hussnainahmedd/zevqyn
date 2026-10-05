"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";

/**
 * Handles the redirect back from Supabase email verification / OAuth.
 * Exchanges the `code` param for a session, then sends the user to the app.
 */
export default function AuthCallback() {
  const router = useRouter();
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (!cancelled) setErr(error.message);
            return;
          }
        }
        // Give the client a moment to settle the session (covers implicit-flow hashes too).
        for (let i = 0; i < 10; i++) {
          const { data } = await supabase.auth.getSession();
          if (data.session) {
            router.replace("/app/dashboard");
            return;
          }
          await new Promise((r) => setTimeout(r, 300));
        }
        if (!cancelled) setErr("We couldn't verify your email. Please try signing in.");
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : "Verification failed.");
      }
    })();
    return () => { cancelled = true; };
  }, [router]);

  return (
    <MktShell>
      <MarketingHeader />
      <main className="mx-auto flex min-h-[60vh] w-full max-w-md flex-col items-center justify-center px-4 text-center">
        {err ? (
          <>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950">Verification didn't work</h1>
            <p className="mt-3 text-sm text-zinc-600">{err}</p>
            <Link href="/login" className="mt-6 rounded-full bg-zinc-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800">
              Go to sign in
            </Link>
          </>
        ) : (
          <>
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" aria-hidden />
            <h1 className="font-display mt-5 text-2xl font-semibold tracking-tight text-zinc-950">Verifying your email…</h1>
            <p className="mt-2 text-sm text-zinc-500">This takes just a moment.</p>
          </>
        )}
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
