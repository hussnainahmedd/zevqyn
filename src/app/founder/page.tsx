import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpenCheck, GraduationCap, FileUser } from "lucide-react";
import { MktShell, MarketingHeader, MarketingFooter } from "@/components/Marketing";
import { JsonLd } from "@/components/JsonLd";
import { Tilt } from "@/components/mkt/Tilt";
import { Reveal } from "@/components/mkt/Reveal";
import { SectionHead, CTABand, Eyebrow } from "@/components/mkt/Kit";

const SITE = "https://zevqyn.dev";
const FOUNDER_URL = `${SITE}/founder`;
const PORTRAIT_URL = `${SITE}/founder/hussnain-ahmad-founder-portrait.jpg`;
const POSTER_URL = `${SITE}/founder/hussnain-ahmad-founder-video-poster.jpg`;
const PORTFOLIO_URL = "https://hussnainportfolio.vercel.app/";
const PERSON_ID = `${SITE}/#hussnain-ahmad`;

const TITLE = "Hussnain Ahmad | Founder of ZEVQYN";
const DESCRIPTION =
  "Meet Hussnain Ahmad, founder of ZEVQYN, a Computer Science student and developer building AI-powered tools for research, productivity, and career growth.";

function publicFileExists(relPath: string): boolean {
  try {
    return existsSync(join(process.cwd(), "public", relPath));
  } catch {
    return false;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const ogImage = publicFileExists("founder/hussnain-ahmad-founder-video-poster.jpg")
    ? POSTER_URL
    : PORTRAIT_URL;
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: FOUNDER_URL },
    robots: { index: true, follow: true },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: FOUNDER_URL,
      siteName: "ZEVQYN",
      type: "profile",
      images: [{ url: ogImage, alt: "Hussnain Ahmad, founder of ZEVQYN" }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [ogImage],
    },
  };
}

const JSON_LD = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Hussnain Ahmad",
    url: FOUNDER_URL,
    image: PORTRAIT_URL,
    jobTitle: "Founder of ZEVQYN",
    worksFor: { "@id": `${SITE}/#organization` },
    sameAs: [PORTFOLIO_URL],
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${FOUNDER_URL}#profile`,
    url: FOUNDER_URL,
    mainEntity: { "@id": PERSON_ID },
    about: { "@id": `${SITE}/#organization` },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${FOUNDER_URL}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Founder", item: FOUNDER_URL },
    ],
  },
];

const BUILDING = [
  {
    icon: BookOpenCheck,
    t: "Research workspace",
    d: "Upload papers and documents, then chat with them — answers cite the exact page they came from, never invented.",
    c: "bg-indigo-100 text-indigo-700",
  },
  {
    icon: GraduationCap,
    t: "Study tools",
    d: "Turn your own documents into summaries, flashcards, and exam-style questions.",
    c: "bg-emerald-100 text-emerald-700",
  },
  {
    icon: FileUser,
    t: "Career proof",
    d: "Convert research into projects, an ATS-ready resume, and a public portfolio — one connected chain.",
    c: "bg-violet-100 text-violet-700",
  },
];

const EXPLORE = [
  {
    t: "Explore features",
    d: "Research, chat, resume, and portfolio tools in one workspace.",
    href: "/features",
  },
  {
    t: "Read resources",
    d: "Guides on research workflows and career building.",
    href: "/resources",
  },
  {
    t: "Start building free",
    d: "Create an account and connect your first paper.",
    href: "/register",
  },
];

export default function Founder() {
  const video = {
    mp4: publicFileExists("founder/hussnain-ahmad-founder-video.mp4"),
    poster: publicFileExists("founder/hussnain-ahmad-founder-video-poster.jpg"),
    captions: publicFileExists("founder/hussnain-ahmad-founder-video-captions.vtt"),
  };

  return (
    <MktShell>
      <MarketingHeader />
      <main>
        <JsonLd data={JSON_LD} />

        {/* Hero */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="mkt-dotgrid absolute inset-x-0 top-0 h-[480px] [mask-image:radial-gradient(70%_60%_at_50%_10%,black,transparent)]" />
            <div className="animate-mkt-drift absolute -top-24 right-1/4 h-[340px] w-[540px] rounded-full bg-indigo-200/50 blur-[100px]" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 lg:pt-24">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <Reveal>
                <Eyebrow>Founder</Eyebrow>
                <h1 className="font-display mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.03em] text-zinc-950 sm:text-5xl lg:text-6xl">
                  Hussnain Ahmad
                </h1>
                <h2 className="mt-3 text-sm font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Founder of ZEVQYN
                </h2>
                <p className="font-display mt-6 text-xl font-medium leading-snug text-zinc-900 sm:text-2xl">
                  ZEVQYN was founded and built by Hussnain Ahmad.
                </p>
                <p className="mt-4 max-w-xl text-lg leading-relaxed text-zinc-600">
                  Hussnain Ahmad is a Computer Science student and developer focused on building AI-powered tools for
                  research, productivity, and career growth.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <a
                    href={PORTFOLIO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
                  >
                    View Founder Portfolio <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </a>
                  <Link
                    href="/features"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-900/15 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-zinc-900/30"
                  >
                    Explore ZEVQYN <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <Tilt max={5} className="mx-auto w-full max-w-sm">
                  <div className="overflow-hidden rounded-3xl border border-zinc-900/[0.08] bg-white shadow-[0_40px_80px_-32px_rgba(15,18,45,0.3)]">
                    <img
                      src="/founder/hussnain-ahmad-founder-portrait.jpg"
                      alt="Hussnain Ahmad, founder of ZEVQYN"
                      width={900}
                      height={1200}
                      className="aspect-[3/4] w-full object-cover"
                    />
                  </div>
                </Tilt>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Founder video — rendered only when the production video assets exist */}
        {video.mp4 && (
          <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
            <SectionHead
              eyebrow="Founder video"
              title="Meet the founder"
              sub="A short introduction from Hussnain Ahmad."
            />
            <Reveal className="mx-auto mt-10 max-w-4xl">
              <div className="overflow-hidden rounded-3xl border border-zinc-900/[0.08] bg-zinc-950 shadow-[0_40px_80px_-32px_rgba(15,18,45,0.35)]">
                <video
                  className="aspect-video w-full"
                  controls
                  playsInline
                  preload="metadata"
                  {...(video.poster ? { poster: "/founder/hussnain-ahmad-founder-video-poster.jpg" } : {})}
                  aria-label="Hussnain Ahmad introduces ZEVQYN"
                >
                  <source src="/founder/hussnain-ahmad-founder-video.mp4" type="video/mp4" />
                  {video.captions && (
                    <track
                      kind="captions"
                      src="/founder/hussnain-ahmad-founder-video-captions.vtt"
                      srcLang="en"
                      label="English"
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
              </div>
            </Reveal>
          </section>
        )}

        {/* About */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="Profile"
            title="About Hussnain Ahmad"
            align="left"
          />
          <div className="mt-8 max-w-3xl space-y-5 text-[17px] leading-relaxed text-zinc-600">
            <Reveal>
              <p>
                Hussnain Ahmad is a Computer Science student and developer. He founded and built ZEVQYN himself —
                from the research workspace and citation-backed chat to the resume and portfolio builders that turn
                study into career proof.
              </p>
            </Reveal>
            <Reveal>
              <p>
                His focus is practical AI: tools that help students and early-career professionals do real research,
                prove what they learned, and convert that proof into opportunities. He shares his broader work and
                experiments on his{" "}
                <a
                  href={PORTFOLIO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-indigo-700 underline decoration-indigo-300 underline-offset-4 transition hover:text-indigo-900"
                >
                  personal portfolio
                </a>
                .
              </p>
            </Reveal>
          </div>
        </section>

        {/* Why */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="Origin"
            title="Why I built ZEVQYN"
            sub="The gap between doing the work and proving it."
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-5 text-[17px] leading-relaxed text-zinc-600">
            <Reveal>
              <p>
                Students do deep, real research — then lose it the moment they need to apply for something. Notes
                live in one app, code in GitHub, the resume in a document, and the portfolio nowhere. Recruiters see
                fragments; the student lived a story.
              </p>
            </Reveal>
            <Reveal>
              <p>
                ZEVQYN started from that gap: one workspace that keeps the chain intact — paper → project → resume →
                portfolio → next opportunity. Every step feeds the next, so effort compounds instead of scattering.
              </p>
            </Reveal>
          </div>
        </section>

        {/* What ZEVQYN is building */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="The product"
            title="What ZEVQYN is building"
            sub="One intelligent workspace for research, productivity, and career growth."
          />
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">
            {BUILDING.map((b, i) => (
              <Reveal key={b.t} delay={i * 90}>
                <Tilt max={6} className="h-full">
                  <div className="h-full rounded-3xl border border-zinc-900/[0.08] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(15,18,45,0.1)] transition-shadow duration-300 hover:shadow-[0_32px_64px_-24px_rgba(15,18,45,0.28)]">
                    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${b.c}`}>
                      <b.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="font-display mt-4 text-xl font-semibold tracking-tight text-zinc-950">{b.t}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-zinc-600">{b.d}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="perspective-1400">
            <Reveal>
              <Tilt max={5} className="mx-auto max-w-3xl">
                <div
                  className="preserve-3d rounded-3xl border border-zinc-900/[0.08] bg-white p-8 shadow-[0_40px_80px_-32px_rgba(15,18,45,0.3)] sm:p-10"
                  style={{ transform: "rotateX(5deg)" }}
                >
                  <Eyebrow>Founder vision</Eyebrow>
                  <p className="font-display mt-4 text-2xl font-medium leading-snug tracking-[-0.01em] text-zinc-900 sm:text-[1.7rem]">
                    Research should compound. Every paper you read and every project you build should make the next
                    opportunity easier to earn — not disappear into a folder.
                  </p>
                  <p className="mt-4 text-sm text-zinc-500">— Hussnain Ahmad, Founder of ZEVQYN</p>
                </div>
              </Tilt>
            </Reveal>
          </div>
        </section>

        {/* Explore */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHead
            eyebrow="Explore"
            title="Explore ZEVQYN"
            sub="See what the workspace does, or start using it."
          />
          <div className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-3">
            {EXPLORE.map((e, i) => (
              <Reveal key={e.t} delay={i * 90}>
                <Link
                  href={e.href}
                  className="group flex h-full flex-col rounded-3xl border border-zinc-900/[0.08] bg-white p-7 shadow-[0_2px_12px_-6px_rgba(15,18,45,0.1)] transition hover:-translate-y-1 hover:shadow-[0_32px_64px_-24px_rgba(15,18,45,0.28)]"
                >
                  <h3 className="font-display text-lg font-semibold tracking-tight text-zinc-950">{e.t}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{e.d}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700">
                    Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Portfolio CTA */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow>Personal work</Eyebrow>
              <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.02em] text-zinc-950 sm:text-4xl">
                View my portfolio
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-relaxed text-zinc-600">
                For Hussnain&apos;s broader work — projects, experiments, and background beyond ZEVQYN — visit his
                official personal portfolio.
              </p>
              <a
                href={PORTFOLIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-zinc-950 px-8 py-4 text-sm font-semibold text-white shadow-[0_18px_36px_-12px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
              >
                View Founder Portfolio <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
              <p className="mt-4 text-xs text-zinc-400">Opens hussnainportfolio.vercel.app in a new tab</p>
            </Reveal>
          </div>
        </section>

        <CTABand
          title="Research. Build proof. Grow your career."
          sub="The workspace Hussnain built for students like you."
          cta="Start building"
          href="/register"
        />
      </main>
      <MarketingFooter />
    </MktShell>
  );
}
