import {
  FolderPlus, UploadCloud, MessagesSquare, GraduationCap, Rocket, TrendingUp, Check,
} from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Tilt } from "@/components/mkt/Tilt";
import { Reveal } from "@/components/mkt/Reveal";
import { SectionHead, CTABand } from "@/components/mkt/Kit";

const STEPS = [
  {
    icon: FolderPlus,
    title: "Create a workspace",
    copy: "One workspace per subject, course, or research theme. Everything you upload stays organized and searchable inside it.",
    tag: "30 seconds",
    badge: "bg-indigo-600",
    soft: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: UploadCloud,
    title: "Upload your documents",
    copy: "Drop in PDFs, DOCX or text. ZEVQYN parses, chunks and embeds them into a pgvector index — you get a progress bar, not a black box.",
    tag: "2 minutes",
    badge: "bg-violet-600",
    soft: "bg-violet-100 text-violet-700",
  },
  {
    icon: MessagesSquare,
    title: "Chat with citations",
    copy: "Ask anything. Answers come back grounded in your documents with page and section citations you can click to verify.",
    tag: "Instant",
    badge: "bg-sky-600",
    soft: "bg-sky-100 text-sky-700",
  },
  {
    icon: GraduationCap,
    title: "Generate study tools",
    copy: "Turn any document into summaries, key points, exam questions and flashcards — quiz prep without the all-nighter.",
    tag: "1 click",
    badge: "bg-amber-500",
    soft: "bg-amber-100 text-amber-700",
  },
  {
    icon: Rocket,
    title: "Convert to projects",
    copy: "Promote findings into structured projects with tech stacks, each one traced back to the papers that inspired it.",
    tag: "1 click",
    badge: "bg-emerald-600",
    soft: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: TrendingUp,
    title: "Export proof & grow",
    copy: "Build an ATS resume, publish a public portfolio, and let Career AI find your gaps and plan your next moves.",
    tag: "Ongoing",
    badge: "bg-rose-500",
    soft: "bg-rose-100 text-rose-700",
  },
];

export default function HowItWorks() {
  return (
    <MktShell>
      <MarketingHeader />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="mkt-dotgrid absolute inset-x-0 top-0 h-[420px] [mask-image:radial-gradient(70%_60%_at_50%_10%,black,transparent)]" />
            <div className="animate-mkt-drift absolute -top-24 left-1/3 h-[320px] w-[520px] rounded-full bg-emerald-200/50 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:pt-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">How it works</p>
              <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                From a PDF to a portfolio in <span className="text-indigo-600">six steps.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
                No setup, no pipelines to configure. The whole journey — research, study, build, prove — happens in
                one connected flow.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="relative mx-auto max-w-5xl px-4 pb-24 sm:px-6">
          <div
            aria-hidden
            className="absolute bottom-10 left-1/2 top-10 hidden w-px -translate-x-1/2 bg-gradient-to-b from-indigo-200 via-zinc-200 to-emerald-200 md:block"
          />
          <div className="space-y-10">
            {STEPS.map((s, i) => {
              const left = i % 2 === 0;
              return (
                <Reveal key={s.title} delay={50}>
                  <div className="relative md:grid md:grid-cols-2 md:gap-16">
                    <div aria-hidden className="absolute left-1/2 top-6 z-10 hidden -translate-x-1/2 md:block">
                      <span
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.badge} font-mono text-sm font-bold text-white shadow-[0_16px_32px_-12px_rgba(15,18,45,0.45)]`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className={left ? "md:col-start-1" : "md:col-start-2"}>
                      <Tilt max={5}>
                        <article
                          className="rounded-3xl border border-zinc-900/[0.08] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(15,18,45,0.1)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-24px_rgba(15,18,45,0.28)]"
                          style={{ transform: `rotate(${left ? -0.7 : 0.7}deg)` }}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.soft}`}>
                              <s.icon className="h-5 w-5" />
                            </span>
                            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600">
                              {s.tag}
                            </span>
                            <span className="font-mono text-[11px] font-bold text-zinc-300 md:hidden">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="font-display mt-4 text-xl font-semibold tracking-tight">{s.title}</h3>
                          <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{s.copy}</p>
                        </article>
                      </Tilt>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={100} className="mt-16">
            <div className="mx-auto flex max-w-2xl items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="h-5 w-5" />
              </span>
              <p className="text-sm leading-relaxed text-emerald-900">
                <span className="font-semibold">Setup takes minutes.</span> Sign up, create a workspace, and ask
                your first question with cited sources.
              </p>
            </div>
          </Reveal>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <SectionHead
            eyebrow="Under the hood"
            title="Real infrastructure, invisible complexity."
            sub="FastAPI on Render, pgvector on Supabase, Gemini embeddings and generation — production-grade pieces you never have to touch."
          />
        </section>

        <CTABand
          title="Your first cited answer is minutes away."
          sub="Upload a document and see the difference grounded AI makes."
          cta="Start free now"
          href="/register"
        />
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
