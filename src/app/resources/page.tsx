import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Eyebrow, CTABand } from "@/components/mkt/Kit";
import { Reveal } from "@/components/mkt/Reveal";
import { ARTICLES, CATEGORIES, formatDate, type Article } from "@/lib/resources";

export const metadata: Metadata = {
  title: "Resources — ZEVQYN",
  description:
    "Practical guides on AI and research, computer science, careers, resumes, and portfolios — written by the ZEVQYN team.",
  alternates: { canonical: "https://zevqyn.dev/resources" },
  openGraph: {
    title: "Resources — ZEVQYN",
    description: "Practical guides on AI, research, careers, resumes, and portfolios.",
    url: "https://zevqyn.dev/resources",
    type: "website",
  },
};

const CATEGORY_STYLES: Record<string, string> = {
  "AI & Research": "bg-indigo-100 text-indigo-700",
  "Computer Science": "bg-sky-100 text-sky-700",
  Career: "bg-emerald-100 text-emerald-700",
  "Resume & Portfolio": "bg-amber-100 text-amber-700",
  Guides: "bg-violet-100 text-violet-700",
};

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-900/[0.08] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_64px_-32px_rgba(15,18,45,0.35)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <span
        className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${CATEGORY_STYLES[article.category] ?? "bg-zinc-100 text-zinc-700"}`}
      >
        {article.category}
      </span>
      <h3 className="font-display mt-4 text-xl font-semibold leading-snug tracking-tight text-zinc-950 transition-colors group-hover:text-indigo-700">
        {article.title}
      </h3>
      <p className="mt-3 flex-1 text-[15px] leading-relaxed text-zinc-600">{article.description}</p>
      <div className="mt-6 flex items-center justify-between border-t border-zinc-900/[0.06] pt-4 text-xs text-zinc-400">
        <span>{formatDate(article.published)}</span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {article.readingMinutes} min read
        </span>
      </div>
      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600">
        Read article
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </span>
    </Link>
  );
}

export default function Resources() {
  return (
    <MktShell>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <Eyebrow>Learn</Eyebrow>
          <h1 className="font-display mt-4 text-4xl font-semibold tracking-[-0.02em] text-zinc-950 sm:text-5xl">
            Resources
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-600">
            Practical, no-fluff guides on AI and research, computer science, careers, resumes, and
            portfolios — written by the team behind ZEVQYN.
          </p>
        </Reveal>

        {CATEGORIES.map((cat) => {
          const items = ARTICLES.filter((a) => a.category === cat);
          if (!items.length) return null;
          return (
            <section key={cat} className="mt-14" aria-label={cat}>
              <Reveal>
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950">
                    {cat}
                  </h2>
                  <span className="text-sm text-zinc-400">
                    {items.length} article{items.length === 1 ? "" : "s"}
                  </span>
                </div>
              </Reveal>
              <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((a, i) => (
                  <Reveal key={a.slug} delay={Math.min(i * 60, 240)}>
                    <ArticleCard article={a} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}
      </main>
      <div className="pt-12">
        <CTABand
          title="Put it into practice"
          sub="Reading is step one. Upload your own documents and let ZEVQYN turn them into answers, flashcards, and career proof."
          cta="Create free account"
          href="/register"
        />
      </div>
      <MarketingFooter />
    </MktShell>
  );
}
