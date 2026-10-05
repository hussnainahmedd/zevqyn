import Link from "next/link";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Eyebrow } from "@/components/mkt/Kit";
import { Reveal } from "@/components/mkt/Reveal";

/**
 * Shared shell for legal / trust pages.
 * Narrow readable column, consistent with the marketing design language.
 */
export function LegalShell({
  eyebrow,
  title,
  intro,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <MktShell>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pt-20">
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.02em] text-zinc-950 sm:text-5xl">
            {title}
          </h1>
          {intro && <p className="mt-5 text-lg leading-relaxed text-zinc-600">{intro}</p>}
          <p className="mt-4 text-sm font-medium text-zinc-400">Last updated: {updated}</p>
        </Reveal>
        <Reveal className="mt-10">
          <div className="rounded-3xl border border-zinc-900/[0.08] bg-white p-6 shadow-[0_24px_64px_-32px_rgba(15,18,45,0.25)] sm:p-10">
            <div className="legal-prose">{children}</div>
          </div>
        </Reveal>
        <p className="mt-8 text-center text-sm text-zinc-500">
          Questions about this page?{" "}
          <Link href="/contact" className="font-medium text-indigo-600 hover:text-indigo-700">
            Contact us
          </Link>
          .
        </p>
      </main>
      <MarketingFooter />
    </MktShell>
  );
}

export const UPDATED = "October 5, 2026";
