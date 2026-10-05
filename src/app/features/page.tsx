import {
  BookOpen, MessagesSquare, GraduationCap, Rocket, UserRound, FileUser, Globe2, Sparkles,
} from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { Tilt } from "@/components/mkt/Tilt";
import { Reveal } from "@/components/mkt/Reveal";
import { SectionHead, CTABand } from "@/components/mkt/Kit";

type F = { icon: typeof BookOpen; name: string; tag: string; copy: string; accent: string; visual: React.ReactNode };

function Bar({ w, c = "bg-zinc-200" }: { w: string; c?: string }) {
  return <div className={`h-1.5 rounded-full ${c} ${w}`} />;
}

const FEATURES: F[] = [
  {
    icon: BookOpen, name: "Research Workspace", tag: "Ingest",
    copy: "Document intelligence with multi-format parsing, 1500-token chunking and pgvector search across everything you upload.",
    accent: "bg-indigo-100 text-indigo-700",
    visual: (
      <div className="space-y-2 rounded-xl border border-zinc-900/[0.07] bg-zinc-50 p-3">
        {["paper_a.pdf · 24 pages", "notes.docx · 8 pages", "dataset.txt · 310 chunks"].map((t) => (
          <div key={t} className="flex items-center justify-between rounded-lg bg-white px-2.5 py-2 shadow-sm">
            <p className="text-[11px] font-medium text-zinc-700">{t}</p>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: MessagesSquare, name: "AI Research Assistant", tag: "Chat",
    copy: "Multi-turn grounded chat over your documents with page-level citations — answers trace to the exact paragraph, never invented.",
    accent: "bg-violet-100 text-violet-700",
    visual: (
      <div className="space-y-2">
        <div className="ml-auto w-fit rounded-xl rounded-br-sm bg-indigo-600 px-3 py-2 text-[11px] text-white">Explain figure 4</div>
        <div className="w-fit rounded-xl rounded-bl-sm bg-zinc-100 px-3 py-2 text-[11px] text-zinc-700">Figure 4 compares quantized vs full precision…</div>
        <div className="flex gap-1.5"><span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-medium text-indigo-700">p.15 · fig.4</span></div>
      </div>
    ),
  },
  {
    icon: GraduationCap, name: "Study Tools", tag: "Learn",
    copy: "Summaries, key points, exam questions and flashcards generated straight from your material — quiz prep in one click.",
    accent: "bg-amber-100 text-amber-700",
    visual: (
      <div className="grid grid-cols-3 gap-2">
        {["Summary", "Q&A", "Cards"].map((t) => (
          <div key={t} className="rounded-xl border border-zinc-900/[0.07] bg-white p-2.5 text-center shadow-sm">
            <p className="text-[11px] font-semibold text-zinc-800">{t}</p>
            <div className="mx-auto mt-2 space-y-1"><Bar w="w-full" /><Bar w="w-4/5" /></div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Rocket, name: "Research-to-Project", tag: "Build",
    copy: "One-click project proposals with technologies and traceability — every project links back to the papers that inspired it.",
    accent: "bg-emerald-100 text-emerald-700",
    visual: (
      <div className="rounded-xl border border-zinc-900/[0.07] bg-white p-3 shadow-sm">
        <p className="text-[11px] font-semibold text-zinc-800">Quantized Embedding Search</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["FastAPI", "pgvector", "Docker"].map((t) => (
            <span key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-600">{t}</span>
          ))}
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-100"><div className="h-full w-2/3 rounded-full bg-emerald-400" /></div>
      </div>
    ),
  },
  {
    icon: UserRound, name: "Career Hub", tag: "Profile",
    copy: "Structured profile, skills, education and certificates in one place — a single source of truth for everything career.",
    accent: "bg-sky-100 text-sky-700",
    visual: (
      <div className="space-y-2">
        <div className="flex items-center gap-2.5 rounded-xl border border-zinc-900/[0.07] bg-white p-2.5 shadow-sm">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-[11px] font-bold text-white">AM</span>
          <div><p className="text-[11px] font-semibold">Alex Morgan</p><p className="text-[10px] text-zinc-500">CS · AI & Web</p></div>
        </div>
        <div className="flex flex-wrap gap-1">{["Python", "React", "RAG"].map((t) => (<span key={t} className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-700">{t}</span>))}</div>
      </div>
    ),
  },
  {
    icon: FileUser, name: "Resume Builder", tag: "Export",
    copy: "Section ordering, live preview and ATS PDF export from verified records — bullets backed by real projects.",
    accent: "bg-rose-100 text-rose-700",
    visual: (
      <div className="rounded-xl border border-zinc-900/[0.07] bg-white p-3 shadow-sm">
        <div className="flex items-center justify-between"><p className="text-[11px] font-bold">Resume.pdf</p><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">ATS-ready</span></div>
        <div className="mt-2.5 space-y-1.5"><Bar w="w-3/4" c="bg-zinc-800" /><Bar w="w-full" /><Bar w="w-5/6" /><Bar w="w-2/3" /></div>
      </div>
    ),
  },
  {
    icon: Globe2, name: "Portfolio Builder", tag: "Showcase",
    copy: "Curate projects and career data into a shareable public portfolio — your proof, live at a link.",
    accent: "bg-teal-100 text-teal-700",
    visual: (
      <div className="rounded-xl border border-zinc-900/[0.07] bg-white p-3 shadow-sm">
        <div className="h-16 rounded-lg bg-gradient-to-br from-teal-100 via-white to-indigo-100" />
        <p className="mt-2 text-[11px] font-semibold">zevqyn.dev/p/yourname</p>
        <p className="text-[10px] text-emerald-600">● live</p>
      </div>
    ),
  },
  {
    icon: Sparkles, name: "Career AI", tag: "Copilot",
    copy: "Profile analysis, skill gaps, project ideas, resume and portfolio reviews, action plans — a copilot for what's next.",
    accent: "bg-fuchsia-100 text-fuchsia-700",
    visual: (
      <div className="space-y-2">
        {["Skill gap: System design", "Idea: RAG evaluation harness", "Plan: 4-week roadmap"].map((t) => (
          <div key={t} className="flex items-center gap-2 rounded-xl bg-fuchsia-50/70 px-2.5 py-2">
            <Sparkles className="h-3 w-3 shrink-0 text-fuchsia-600" />
            <p className="text-[11px] font-medium text-zinc-700">{t}</p>
          </div>
        ))}
      </div>
    ),
  },
];

export default function Features() {
  return (
    <MktShell>
      <MarketingHeader />
      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="mkt-dotgrid absolute inset-x-0 top-0 h-[420px] [mask-image:radial-gradient(70%_60%_at_50%_10%,black,transparent)]" />
            <div className="animate-mkt-drift absolute -top-24 right-1/4 h-[320px] w-[520px] rounded-full bg-indigo-200/50 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:pt-24">
            <Reveal>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-indigo-600">Features</p>
              <h1 className="font-display mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                Eight capabilities. <span className="text-indigo-600">One workflow.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
                Each tool feeds the next, so your research compounds into career evidence instead of scattering across
                apps.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.name} delay={(i % 2) * 90}>
                <Tilt max={6} className="h-full">
                  <article
                    className={`relative h-full overflow-hidden rounded-3xl border border-zinc-900/[0.08] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(15,18,45,0.1)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-24px_rgba(15,18,45,0.28)] ${
                      i % 2 === 1 ? "md:translate-y-8" : ""
                    }`}
                  >
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-100/80 to-transparent blur-2xl"
                    />
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${f.accent} shadow-sm`}>
                          <f.icon className="h-5 w-5" />
                        </span>
                        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                          {String(i + 1).padStart(2, "0")} · {f.tag}
                        </span>
                      </div>
                      <h3 className="font-display mt-5 text-xl font-semibold tracking-tight">{f.name}</h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{f.copy}</p>
                      <div className="mt-5">{f.visual}</div>
                    </div>
                  </article>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
          <SectionHead
            eyebrow="The compound effect"
            title="Research in. Proof out."
            sub="Upload once, and the same material powers your chat answers, your study decks, your projects, your resume and your portfolio."
          />
        </section>

        <CTABand
          title="See what your documents can become."
          sub="Create a workspace and try every capability free."
          cta="Try ZEVQYN free"
          href="/register"
        />
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
