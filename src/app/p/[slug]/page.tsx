import { env } from "@/lib/env";
import Link from "next/link";
import { Globe, Award, Briefcase, GraduationCap, Sparkles, ExternalLink, ArrowRight, Code2, User } from "lucide-react";

async function getPortfolio(slug: string) {
  try {
    const r = await fetch(`${env.apiBase}/api/v1/public/portfolios/${slug}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json() as Promise<Record<string, any>>;
  } catch { return null; }
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12v3.15c0 .3.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
);

export default async function PublicPortfolio({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getPortfolio(slug);

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a12] px-4">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-white">Portfolio not found</h1>
          <p className="mt-2 text-zinc-400">This public portfolio does not exist or is private.</p>
          <Link href="/" className="mt-4 inline-block font-medium text-indigo-400 hover:text-indigo-300">Go to ZEVQYN</Link>
        </div>
      </div>
    );
  }

  const name = String(data.display_name || slug);
  const projects: any[] = data.projects || [];
  const skills: any[] = data.skills || [];
  const education: any[] = data.education || [];
  const certificates: any[] = data.certificates || [];
  const hasContent = projects.length + skills.length + education.length + certificates.length > 0 || data.about;

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white antialiased">
      {/* Nav */}
      <header className="fixed top-0 z-20 w-full border-b border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{name}</span>
          <div className="flex items-center gap-2">
            {data.github_url && <a href={String(data.github_url)} target="_blank" rel="noopener" aria-label="GitHub" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"><GithubIcon className="h-4.5 w-4.5" /></a>}
            {data.linkedin_url && <a href={String(data.linkedin_url)} target="_blank" rel="noopener" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"><LinkedinIcon className="h-4.5 w-4.5" /></a>}
            {data.website_url && <a href={String(data.website_url)} target="_blank" rel="noopener" aria-label="Website" className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 transition hover:bg-white/10 hover:text-white"><Globe className="h-4.5 w-4.5" /></a>}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/25 blur-[120px]" />
          <div className="absolute top-1/3 -left-32 h-[300px] w-[300px] rounded-full bg-violet-600/15 blur-[100px]" />
          <div className="absolute top-1/2 -right-32 h-[300px] w-[300px] rounded-full bg-fuchsia-600/10 blur-[100px]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          {data.profile_image_url ? (
            <img src={String(data.profile_image_url)} alt={name} className="mx-auto h-28 w-28 rounded-full object-cover ring-2 ring-indigo-500/50 shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)]" />
          ) : (
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-bold shadow-[0_0_60px_-10px_rgba(99,102,241,0.6)]">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="mt-7 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-300">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
            Open to opportunities
          </div>
          <h1 className="font-display mt-5 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="bg-gradient-to-br from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">{name}</span>
          </h1>
          {data.headline ? (
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">{String(data.headline)}</p>
          ) : (
            <p className="mx-auto mt-5 max-w-xl text-lg text-zinc-500">Building, learning, and shipping.</p>
          )}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {data.github_url && <a href={String(data.github_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"><GithubIcon className="h-4 w-4" /> GitHub</a>}
            {data.linkedin_url && <a href={String(data.linkedin_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[#0A66C2] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0958a8]"><LinkedinIcon className="h-4 w-4" /> LinkedIn</a>}
            {data.website_url && <a href={String(data.website_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/10">Website <ExternalLink className="h-4 w-4" /></a>}
            {!data.github_url && !data.linkedin_url && !data.website_url && (
              <span className="text-sm text-zinc-600">Add social links in your portfolio settings to show them here.</span>
            )}
          </div>
        </div>
      </section>

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* About */}
        {data.about && (
          <section className="py-8">
            <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-8 backdrop-blur sm:p-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-300"><User className="h-5 w-5" /></span>
                <h2 className="font-display text-2xl font-bold tracking-tight">About</h2>
              </div>
              <p className="mt-5 leading-relaxed text-zinc-300 whitespace-pre-wrap">{String(data.about)}</p>
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="py-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300"><Code2 className="h-5 w-5" /></span>
              <h2 className="font-display text-2xl font-bold tracking-tight">Skills & Technologies</h2>
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {skills.map((s, i) => (
                <span key={i} className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-medium text-zinc-200 backdrop-blur transition hover:border-indigo-400/40 hover:bg-indigo-500/15 hover:text-white">
                  {String(s.name || s.title || s)}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="py-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/15 text-fuchsia-300"><Briefcase className="h-5 w-5" /></span>
              <h2 className="font-display text-2xl font-bold tracking-tight">Featured Projects</h2>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {projects.map((p, i) => (
                <article key={i} className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03] p-7 backdrop-blur transition hover:border-indigo-400/30 hover:bg-white/[0.05]">
                  <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo-600/15 blur-[60px] transition group-hover:bg-indigo-600/25" />
                  <div className="relative">
                    <h3 className="font-display text-xl font-bold tracking-tight">{String(p.title || p.name || "Project")}</h3>
                    {p.description && <p className="mt-3 text-sm leading-relaxed text-zinc-400 line-clamp-4">{String(p.description)}</p>}
                    {p.technologies && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {String(p.technologies).split(",").slice(0, 6).map((t: string, j: number) => (
                          <span key={j} className="rounded-lg bg-white/[0.07] px-2.5 py-1 text-[11px] font-medium text-zinc-300">{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    <div className="mt-5 flex gap-4">
                      {p.github_url && <a href={String(p.github_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-200 transition hover:text-white"><GithubIcon className="h-4 w-4" /> Code</a>}
                      {p.live_url && <a href={String(p.live_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 transition hover:text-indigo-200">Live demo <ArrowRight className="h-4 w-4" /></a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Education + Certificates */}
        {(education.length > 0 || certificates.length > 0) && (
          <section className="grid gap-5 py-8 md:grid-cols-2">
            {education.length > 0 && (
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-7 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-300"><GraduationCap className="h-5 w-5" /></span>
                  <h2 className="font-display text-xl font-bold tracking-tight">Education</h2>
                </div>
                <div className="mt-5 space-y-5">
                  {education.map((e, i) => (
                    <div key={i} className="relative border-l-2 border-white/10 pl-5">
                      <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-indigo-400" />
                      <p className="font-semibold">{String(e.institution || e.title)}</p>
                      {e.degree && <p className="mt-0.5 text-sm text-zinc-400">{String(e.degree)}{e.field && ` · ${String(e.field)}`}</p>}
                      {(e.start_date || e.end_date) && <p className="mt-1 text-xs text-zinc-500">{e.start_date ? String(e.start_date).slice(0, 4) : ""}{e.end_date ? ` — ${String(e.end_date).slice(0, 4)}` : " — Present"}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {certificates.length > 0 && (
              <div className="rounded-3xl border border-white/[0.07] bg-white/[0.03] p-7 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-300"><Award className="h-5 w-5" /></span>
                  <h2 className="font-display text-xl font-bold tracking-tight">Certifications</h2>
                </div>
                <div className="mt-5 space-y-4">
                  {certificates.map((c, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300"><Award className="h-4.5 w-4.5" /></span>
                      <div>
                        <p className="text-sm font-semibold">{String(c.title || c.name)}</p>
                        {c.issuer && <p className="text-xs text-zinc-500">{String(c.issuer)}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Empty state */}
        {!hasContent && (
          <section className="py-8">
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-zinc-600" />
              <p className="mt-3 font-medium text-zinc-300">This portfolio is just getting started</p>
              <p className="mt-1 text-sm text-zinc-500">Projects, skills, and credentials added in Zevqyn will appear here.</p>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-14">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-indigo-600 via-violet-700 to-fuchsia-800 p-10 text-center sm:p-14">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_0%,rgba(255,255,255,0.12),transparent)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Let's work together</h2>
              <p className="mx-auto mt-3 max-w-md text-indigo-100">Have an opportunity or want to collaborate? I'd love to hear from you.</p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {data.linkedin_url && <a href={String(data.linkedin_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200"><LinkedinIcon className="h-4 w-4" /> Connect on LinkedIn</a>}
                {data.github_url && <a href={String(data.github_url)} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20"><GithubIcon className="h-4 w-4" /> GitHub</a>}
                {!data.linkedin_url && !data.github_url && <span className="text-sm text-indigo-200">Add social links in portfolio settings to enable contact buttons.</span>}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] py-8">
        <p className="text-center text-xs text-zinc-600">Built with <Link href="/" className="font-medium text-zinc-400 hover:text-zinc-200">ZEVQYN</Link></p>
      </footer>
    </div>
  );
}
