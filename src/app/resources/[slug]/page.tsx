import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, CalendarDays } from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Eyebrow, CTABand } from "@/components/mkt/Kit";
import { Reveal } from "@/components/mkt/Reveal";
import { ArticleBody } from "@/components/mkt/Article";
import { ARTICLES, getArticle, relatedArticles, formatDate } from "@/lib/resources";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article not found — ZEVQYN" };
  const url = `https://zevqyn.dev/resources/${article.slug}`;
  return {
    title: `${article.title} — ZEVQYN Resources`,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      type: "article",
      publishedTime: article.published,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const related = relatedArticles(article);

  return (
    <MktShell>
      <MarketingHeader />
      <main className="mx-auto w-full max-w-3xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <Reveal>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition hover:text-zinc-950"
          >
            <ArrowLeft className="h-4 w-4" />
            All resources
          </Link>
        </Reveal>

        <article className="mt-8">
          <Reveal>
            <Eyebrow>{article.category}</Eyebrow>
            <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] text-zinc-950 sm:text-[2.75rem]">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-zinc-600">{article.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-zinc-900/[0.07] py-4 text-sm text-zinc-500">
              <span className="font-medium text-zinc-700">ZEVQYN Team</span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {formatDate(article.published)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {article.readingMinutes} min read
              </span>
            </div>
          </Reveal>

          <Reveal className="mt-10">
            <ArticleBody blocks={article.content} />
          </Reveal>
        </article>

        {related.length > 0 && (
          <section className="mt-16" aria-label="Related resources">
            <Reveal>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-zinc-950">
                Keep reading
              </h2>
            </Reveal>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {related.map((r) => (
                <Reveal key={r.slug}>
                  <Link
                    href={`/resources/${r.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-zinc-900/[0.08] bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_48px_-24px_rgba(15,18,45,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      {r.category}
                    </span>
                    <span className="font-display mt-2 flex-1 text-[15px] font-semibold leading-snug text-zinc-950">
                      {r.title}
                    </span>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-zinc-400 transition group-hover:text-indigo-600">
                      Read
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </main>
      <div className="pt-8">
        <CTABand
          title="Try it on your own documents"
          sub="ZEVQYN turns your uploads into citation-backed answers, flashcards, and study material."
          cta="Create free account"
          href="/register"
        />
      </div>
      <MarketingFooter />
    </MktShell>
  );
}
