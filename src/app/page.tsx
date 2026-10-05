import Link from "next/link";
import { ArrowRight, FileText, Briefcase, FileUser, Globe, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Tilt } from "@/components/mkt/Tilt";
import { Reveal } from "@/components/mkt/Reveal";
import { ChatMock, DocMock, ResumeMock } from "@/components/mkt/Mocks";
import { SectionHead, CTABand } from "@/components/mkt/Kit";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="mkt-dotgrid absolute inset-x-0 top-0 h-[560px] [mask-image:radial-gradient(70%_60%_at_50%_20%,black,transparent)]" />
        <div className="animate-mkt-drift absolute -top-32 left-1/4 h-[420px] w-[620px] rounded-full bg-indigo-200/50 blur-[110px]" />
        <div className="animate-mkt-drift absolute -right-24 top-40 h-[360px] w-[420px] rounded-full bg-emerald-200/40 blur-[110px] [animation-delay:-7s]" />
      </div>
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 pb-24 pt-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-24">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-zinc-900/10 bg-white/70 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-700 shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            AI Research + Career Workspace
          </p>
          <h1 className="font-display mt-6 text-5xl font-semibold leading-[1.02] tracking-[-0.035em] text-zinc-950 sm:text-6xl lg:text-[4.4rem]">
            Turn research into your <span className="text-indigo-600">career advantage.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
            Upload your papers, chat with your documents with page-level citations, and turn that work into verified
            projects, ATS-ready resumes, and a public portfolio — in one connected workspace.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-900/15 bg-white/70 px-7 py-3.5 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:-translate-y-0.5 hover:border-zinc-900/30"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Grounded in your real documents
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-indigo-600" /> ATS resume export
            </span>
            <span>No credit card required</span>
          </p>
        </Reveal>

        <Reveal delay={150} className="perspective-1400">
          <Tilt max={9} className="relative mx-auto max-w-[520px]">
            <div
              className="preserve-3d relative"
              style={{ transform: "rotateX(10deg) rotateY(-14deg)" }}
            >
              <div className="animate-mkt-float relative z-10">
                <ChatMock />
              </div>
              <div
                className="animate-mkt-float-slow absolute -left-10 -top-8 z-20 w-44 sm:w-52"
                style={{ transform: "translateZ(90px)" }}
              >
                <DocMock />
              </div>
              <div
                className="animate-mkt-float-slow absolute -bottom-10 -right-6 z-20 w-48 sm:w-60 [animation-delay:-4.5s]"
                style={{ transform: "translateZ(60px)" }}
              >
                <ResumeMock />
              </div>
            </div>
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-indigo-200/60 via-transparent to-emerald-200/50 blur-2xl"
            />
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
}

const PILLARS = [
  {
    n: "01 / Research",
    t: "Source-backed analysis",
    d: "PDF, DOCX and text with Gemini RAG and exact citations.",
    icon: FileText,
    c: "bg-indigo-100 text-indigo-700",
  },
  {
    n: "02 / Project",
    t: "Proof-of-work",
    d: "Convert findings into structured projects with tech stacks.",
    icon: Briefcase,
    c: "bg-emerald-100 text-emerald-700",
  },
  {
    n: "03 / Resume",
    t: "ATS generation",
    d: "Attach verified work into a clean, parseable resume with PDF export.",
    icon: FileUser,
    c: "bg-amber-100 text-amber-700",
  },
  {
    n: "04 / Growth",
    t: "Showcase & copilot",
    d: "Publish a portfolio and use Career AI to plan your next steps.",
    icon: Globe,
    c: "bg-sky-100 text-sky-700",
  },
];

export default function Home() {
  return (
    <MktShell>
      <MarketingHeader />
      <main>
        <Hero />
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((c, i) => (
              <Reveal key={c.n} delay={i * 90}>
                <Tilt max={7} className="h-full">
                  <div className="group h-full rounded-2xl border border-zinc-900/[0.08] bg-white p-6 shadow-[0_2px_10px_-4px_rgba(15,18,45,0.08)] transition-shadow duration-300 hover:shadow-[0_28px_56px_-20px_rgba(15,18,45,0.25)]">
                    <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400">{c.n}</p>
                    <span className={`mt-5 inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.c}`}>
                      <c.icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display mt-4 text-lg font-semibold tracking-tight">{c.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{c.d}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <SectionHead
            eyebrow="Why ZEVQYN"
            title="Not another chatbot. A lineage from paper to portfolio."
            sub="Every resume bullet traces back to a project, and every project traces back to research. That is the difference between claiming skills and proving them."
          />
          <div className="perspective-1400 mt-12">
            <Reveal delay={120}>
              <Tilt max={6} className="mx-auto max-w-3xl">
                <div
                  className="preserve-3d relative rounded-3xl border border-zinc-900/[0.08] bg-white p-8 shadow-[0_40px_80px_-32px_rgba(15,18,45,0.3)] sm:p-10"
                  style={{ transform: "rotateX(6deg)" }}
                >
                  <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                    Source citation
                  </p>
                  <blockquote className="mt-4 text-lg leading-relaxed text-zinc-800">
                    “The experimental results indicate reduced inference latency when quantizing embedding
                    layers, validating our initial architecture hypothesis.”
                  </blockquote>
                  <p className="mt-3 text-xs text-zinc-500">
                    Distributed_Inference_Optimization.pdf · Page 14, Section 3.2
                  </p>
                  <div className="mt-6 flex items-center gap-4 border-t border-zinc-900/[0.07] pt-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Briefcase className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                        Associated project
                      </p>
                      <p className="mt-0.5 text-sm font-semibold">FastAPI Embedding Cache</p>
                      <p className="text-xs text-zinc-500">Python · pgvector · Docker</p>
                    </div>
                  </div>
                </div>
              </Tilt>
            </Reveal>
          </div>
          <Reveal delay={150} className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900"
            >
              Explore all capabilities <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </section>

        <CTABand
          title="Start with one document."
          sub="Create a workspace, upload a paper, and ask your first cited question in minutes."
          cta="Create free account"
          href="/register"
        />
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
