import Link from "next/link";
import { ArrowRight, ArrowUpRight, Puzzle, BadgeCheck, Sprout, Quote } from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { JsonLd } from "@/components/JsonLd";
import { Tilt } from "@/components/mkt/Tilt";
import { Reveal } from "@/components/mkt/Reveal";
import { SectionHead, CTABand } from "@/components/mkt/Kit";

const CARDS = [
  {
    k: "The problem",
    icon: Puzzle,
    t: "Fragmented tools",
    d: "Notes in one app, projects in GitHub, resume in a doc, portfolio nowhere. Recruiters see fragments; you lived a story.",
    c: "bg-rose-100 text-rose-700",
  },
  {
    k: "Our belief",
    icon: BadgeCheck,
    t: "Proof beats claims",
    d: "A bullet you can trace to a paper and a repository is stronger than a keyword list. ZEVQYN makes that traceability automatic.",
    c: "bg-indigo-100 text-indigo-700",
  },
  {
    k: "Still becoming",
    icon: Sprout,
    t: "Built in the open",
    d: "ZEVQYN is an online product built for students, developers and early-career professionals — evolving with its users.",
    c: "bg-emerald-100 text-emerald-700",
  },
];

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://zevqyn.dev/#hussnain-ahmad",
  name: "Hussnain Ahmad",
  url: "https://zevqyn.dev/founder",
  image: "https://zevqyn.dev/founder/hussnain-ahmad-founder-zevqyn.jpg",
  jobTitle: "Founder of ZEVQYN",
  worksFor: { "@id": "https://zevqyn.dev/#organization" },
  sameAs: ["https://hussnainportfolio.vercel.app/"],
};

const PRINCIPLES = [
  ["Grounded, not generated", "Every AI answer cites the document it came from. If it can't cite it, it doesn't say it."],
  ["Your data stays yours", "Workspaces are private by default. Public sharing is always an explicit choice, never a default."],
  ["Proof over decoration", "We'd rather show one verified project than ten designed templates. Substance first, polish second."],
  ["Compounding work", "Research, study, projects, resume and portfolio are one chain — effort in one place pays off everywhere."],
];

export default function About() {
  return (
    <MktShell>
      <MarketingHeader />
      <main>
        <JsonLd data={PERSON_JSON_LD} />
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="mkt-dotgrid absolute inset-x-0 top-0 h-[480px] [mask-image:radial-gradient(70%_60%_at_50%_10%,black,transparent)]" />
            <div className="animate-mkt-drift absolute -top-24 right-1/4 h-[340px] w-[540px] rounded-full bg-indigo-200/50 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:pt-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">About ZEVQYN</p>
              <h1 className="font-display mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                Your work deserves a <span className="text-indigo-600">through-line</span>, not a folder of PDFs.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-600">
                Students and early-career builders do real research, then lose it when it is time to apply. ZEVQYN keeps
                the chain intact: paper → project → resume → portfolio → next opportunity.
              </p>
            </Reveal>

            <div className="perspective-1400 mt-14">
              <Reveal delay={140}>
                <Tilt max={6} className="mx-auto max-w-3xl">
                  <div
                    className="preserve-3d rounded-3xl border border-zinc-900/[0.08] bg-white p-8 shadow-[0_40px_80px_-32px_rgba(15,18,45,0.3)] sm:p-10"
                    style={{ transform: "rotateX(5deg)" }}
                  >
                    <Quote className="h-8 w-8 text-indigo-300" />
                    <p className="font-display mt-4 text-2xl font-medium leading-snug tracking-[-0.01em] text-zinc-900 sm:text-[1.7rem]">
                      The students doing the deepest work are often the worst at showing it. We exist to fix that
                      asymmetry.
                    </p>
                    <p className="mt-4 text-sm text-zinc-500">— The idea ZEVQYN is built on</p>
                  </div>
                </Tilt>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {CARDS.map((c, i) => (
              <Reveal key={c.k} delay={i * 90}>
                <Tilt max={7} className="h-full">
                  <div
                    className={`h-full rounded-3xl border border-zinc-900/[0.08] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(15,18,45,0.1)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-24px_rgba(15,18,45,0.28)] ${
                      i === 1 ? "md:-translate-y-4" : ""
                    }`}
                  >
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400">{c.k}</p>
                    <span className={`mt-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${c.c}`}>
                      <c.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{c.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{c.d}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="Principles"
            title="What we refuse to compromise."
            sub="Four rules that shape every feature we ship."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
            {PRINCIPLES.map(([t, d], i) => (
              <Reveal key={t} delay={i * 70}>
                <div className="flex gap-4 rounded-2xl border border-zinc-900/[0.08] bg-white p-6 shadow-[0_2px_10px_-4px_rgba(15,18,45,0.08)]">
                  <span className="font-display flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{t}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="Founder"
            title="ZEVQYN was founded and built by Hussnain Ahmad."
            sub="One builder, one through-line: from research to career."
          />
          <div className="mx-auto mt-12 max-w-4xl">
            <Reveal>
              <div className="flex flex-col items-center gap-8 rounded-3xl border border-zinc-900/[0.08] bg-white p-8 shadow-[0_2px_12px_-6px_rgba(15,18,45,0.1)] sm:flex-row sm:p-10">
                <img
                  src="/founder/hussnain-ahmad-founder-zevqyn.jpg"
                  alt="Hussnain Ahmad, founder of ZEVQYN"
                  width={320}
                  height={320}
                  className="h-40 w-40 shrink-0 rounded-3xl border border-zinc-900/[0.08] object-cover sm:h-48 sm:w-48"
                />
                <div className="text-center sm:text-left">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-zinc-900">Hussnain Ahmad</h3>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-indigo-600">
                    Founder of ZEVQYN
                  </p>
                  <p className="mt-4 leading-relaxed text-zinc-600">
                    ZEVQYN was founded and built by Hussnain Ahmad, a Computer Science student and developer focused
                    on AI-powered research, productivity, and career tools.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                    <Link
                      href="/founder"
                      className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
                    >
                      Meet the Founder <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="https://hussnainportfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-zinc-900/15 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-zinc-900/30"
                    >
                      View Portfolio <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
              Research. Build proof. Grow your career.
            </h2>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>

        <CTABand
          title="Built for students like you."
          sub="If you've ever done the work and struggled to show it, ZEVQYN is yours."
          cta="Create free account"
          href="/register"
        />
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
