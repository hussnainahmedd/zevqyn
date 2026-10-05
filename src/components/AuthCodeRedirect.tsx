"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * If Supabase redirected an email-verification (or OAuth) code to the site
 * root, forward it to /auth/callback which performs the code exchange.
 * Mounted on the marketing homepage; renders nothing.
 */
export function AuthCodeRedirect() {
  const router = useRouter();
  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("code")) {
      router.replace(`/auth/callback${url.search}`);
    }
  }, [router]);
  return null;
}
