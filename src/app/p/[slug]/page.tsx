import { env } from "@/lib/env";
import Link from "next/link";
import { Globe, Award, Briefcase, GraduationCap, Sparkles, ExternalLink, MapPin } from "lucide-react";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
);

async function getPortfolio(slug: string) {
  try {
    const r = await fetch(`${env.apiBase}/api/v1/public/portfolios/${slug}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json() as Promise<Record<string, any>>;
  } catch { return null; }
}

function SectionTitle({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
        <Icon className="h-4.5 w-4.5" />
      </span>
      <h2 className="font-display text-xl font-bold tracking-tight text-zinc-950">{children}</h2>
    </div>
  );
}

export default async function PublicPortfolio({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPortfolio(slug);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFAF7] px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-zinc-950">Portfolio not found</h1>
          <p className="mt-2 text-zinc-500">This public portfolio does not exist or is private.</p>
          <Link href="/" className="mt-4 inline-block font-medium text-indigo-600 hover:text-indigo-700">Go to ZEVQYN</Link>
        </div>
      </div>
    );
  }

  const name = String(data.display_name || slug);
  const projects: any[] = data.projects || [];
  const skills: any[] = data.skills || [];
  const education: any[] = data.education || [];
  const certificates: any[] = data.certificates || [];

  return (
    <div className="min-h-screen bg-[#FBFAF7] text-zinc-950">
      {/* Nav */}
      <header className="sticky top-0 z-10 border-b border-zinc-900/[0.06] bg-[#FBFAF7]/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg font-bold tracking-tight">{name}</span>
          <div className="flex items-center gap-3">
            {data.github_url && <a href={String(data.github_url)} target="_blank" rel="noopener" aria-label="GitHub" className="text-zinc-500 transition hover:text-zinc-950"><GithubIcon className="h-5 w-5" /></a>}
            {data.linkedin_url && <a href={String(data.linkedin_url)} target="_blank" rel="noopener" aria-label="LinkedIn" className="text-zinc-500 transition hover:text-zinc-950"><LinkedinIcon className="h-5 w-5" /></a>}
            {data.website_url && <a href={String(data.website_url)} target="_blank" rel="noopener" aria-label="Website" className="text-zinc-500 transition hover:text-zinc-950"><Globe className="h-5 w-5" /></a>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Hero */}
        <section className="py-16 sm:py-24 text-center">
          {data.profile_image_url && (
            <img src={String(data.profile_image_url)} alt={name} className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-indigo-100 shadow-lg" />
          )}
          <p className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" /> Open to opportunities
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{name}</h1>
          {data.headline && <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 leading-relaxed">{String(data.headline)}</p>}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {data.github_url && <a href={String(data.github_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"><GithubIcon className="h-4 w-4" /> GitHub</a>}
            {data.linkedin_url && <a href={String(data.linkedin_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-zinc-900/15 bg-white px-5 py-2.5 text-sm font-medium transition hover:border-zinc-400"><LinkedinIcon className="h-4 w-4 text-[#0A66C2]" /> LinkedIn</a>}
            {data.website_url && <a href={String(data.website_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-zinc-900/15 bg-white px-5 py-2.5 text-sm font-medium transition hover:border-zinc-400"><Globe className="h-4 w-4" /> Website <ExternalLink className="h-3.5 w-3.5" /></a>}
          </div>
        </section>

        {/* About */}
        {data.about && (
          <section className="py-10">
            <div className="rounded-3xl border border-zinc-900/[0.07] bg-white p-8 shadow-sm sm:p-10">
              <SectionTitle icon={MapPin}>About</SectionTitle>
              <p className="mt-4 leading-relaxed text-zinc-700 whitespace-pre-wrap">{String(data.about)}</p>
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="py-10">
            <SectionTitle icon={Sparkles}>Skills & Technologies</SectionTitle>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {skills.map((s, i) => (
                <span key={i} className="rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-800 transition hover:bg-indigo-100">
                  {String(s.name || s.title || s)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="py-10">
            <SectionTitle icon={Briefcase}>Featured Projects</SectionTitle>
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              {projects.map((p, i) => (
                <article key={i} className="group rounded-3xl border border-zinc-900/[0.07] bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="font-display text-lg font-bold tracking-tight">{String(p.title || p.name || "Project")}</h3>
                  {p.description && <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 line-clamp-4">{String(p.description)}</p>}
                  {p.technologies && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {String(p.technologies).split(",").slice(0, 5).map((t: string, j: number) => (
                        <span key={j} className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex gap-3">
                    {p.github_url && <a href={String(p.github_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-700 hover:text-zinc-950"><GithubIcon className="h-4 w-4" /> Code</a>}
                    {p.live_url && <a href={String(p.live_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700"><ExternalLink className="h-4 w-4" /> Live demo</a>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="py-10">
            <SectionTitle icon={GraduationCap}>Education</SectionTitle>
            <div className="mt-6 space-y-4">
              {education.map((e, i) => (
                <div key={i} className="rounded-3xl border border-zinc-900/[0.07] bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">{String(e.institution || e.title || "Institution")}</h3>
                      {e.degree && <p className="mt-0.5 text-sm text-zinc-600">{String(e.degree)}{e.field && ` · ${String(e.field)}`}</p>}
                    </div>
                    {(e.start_date || e.end_date) && (
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                        {e.start_date ? String(e.start_date).slice(0, 4) : ""}{e.end_date ? ` — ${String(e.end_date).slice(0, 4)}` : " — Present"}
                      </span>
                    )}
                  </div>
                  {e.description && <p className="mt-2.5 text-sm text-zinc-600 leading-relaxed">{String(e.description)}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates */}
        {certificates.length > 0 && (
          <section className="py-10">
            <SectionTitle icon={Award}>Certifications</SectionTitle>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {certificates.map((c, i) => (
                <div key={i} className="flex items-start gap-3 rounded-2xl border border-amber-200/60 bg-amber-50/50 p-5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Award className="h-5 w-5" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{String(c.title || c.name)}</p>
                    {c.issuer && <p className="mt-0.5 text-xs text-zinc-500">{String(c.issuer)}</p>}
                    {c.credential_url && <a href={String(c.credential_url)} target="_blank" rel="noopener" className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">Verify <ExternalLink className="h-3 w-3" /></a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contact CTA */}
        <section className="py-16">
          <div className="rounded-3xl bg-zinc-950 px-8 py-12 text-center text-white sm:px-12">
            <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Let's work together</h2>
            <p className="mx-auto mt-3 max-w-md text-zinc-400">Interested in collaborating or have an opportunity? I'd love to hear from you.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {data.linkedin_url && <a href={String(data.linkedin_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"><LinkedinIcon className="h-4 w-4" /> Connect</a>}
              {data.github_url && <a href={String(data.github_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-2.5 text-sm font-semibold transition hover:bg-white/10"><GithubIcon className="h-4 w-4" /> Follow</a>}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900/[0.06] py-8">
        <p className="text-center text-xs text-zinc-400">Built with <Link href="/" className="font-medium text-zinc-500 hover:text-zinc-700">ZEVQYN</Link> — research to career proof.</p>
      </footer>
    </div>
  );
}
