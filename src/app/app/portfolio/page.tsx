"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { LoadingState, EmptyState } from "@/components/PageStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ExternalLink, Eye, Settings2, Plus, Check, Camera, Loader2, X } from "lucide-react";

type AnyRec = Record<string, any>;
const errMsg = (e: unknown) => e instanceof Error ? e.message : "Something went wrong. Try again.";

export default function PortfolioPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["portfolios"], queryFn: api.portfolios });
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [sel, setSel] = useState("");
  const [formErr, setFormErr] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  const portfolio = (q.data as AnyRec[] | undefined)?.find(p => p.id === sel);
  const proj = useQuery({ queryKey: ["projects"], queryFn: api.projects });
  const skills = useQuery({ queryKey: ["skills"], queryFn: api.skills });

  const [settings, setSettings] = useState<AnyRec>({});
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  useEffect(() => {
    if (portfolio) {
      setSettings({
        display_name: portfolio.display_name || "",
        headline: portfolio.headline || "",
        about: portfolio.about || "",
        github_url: portfolio.github_url || "",
        linkedin_url: portfolio.linkedin_url || "",
        website_url: portfolio.website_url || "",
        is_published: portfolio.is_published ?? true,
        profile_image_url: portfolio.profile_image_url || "",
      });
      setPreview(null);
    }
  }, [sel]);

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFormErr("");
    setPreview(URL.createObjectURL(f));
    setUploading(true);
    try {
      const { url } = await api.uploadImage(f);
      setSettings(s => ({ ...s, profile_image_url: url }));
      setPreview(null);
    } catch (err) {
      setFormErr(errMsg(err));
      setPreview(null);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  const create = useMutation({
    mutationFn: () => api.createPortfolio({ display_name: title, slug }),
    onSuccess: (p: AnyRec) => { qc.invalidateQueries({ queryKey: ["portfolios"] }); setTitle(""); setSlug(""); setSel(p.id); setFormErr(""); },
    onError: (e) => setFormErr(errMsg(e)),
  });

  const saveSettings = useMutation({
    mutationFn: () => api.updatePortfolio(sel, settings),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["portfolios"] }); setFormErr(""); setShowSettings(false); },
    onError: (e) => setFormErr(errMsg(e)),
  });

  const [attached, setAttached] = useState<{ projects: string[]; skills: string[] }>({ projects: [], skills: [] });

  async function toggleProject(pid: string) {
    try {
      if (attached.projects.includes(pid)) {
        await api.pfRemoveProject(sel, pid);
        setAttached(a => ({ ...a, projects: a.projects.filter(x => x !== pid) }));
      } else {
        await api.pfAddProject(sel, { project_id: pid });
        setAttached(a => ({ ...a, projects: [...a.projects, pid] }));
      }
    } catch (e) { setFormErr(errMsg(e)); }
  }

  async function toggleSkill(sid: string) {
    try {
      if (attached.skills.includes(sid)) {
        await api.pfRemoveSkill(sel, sid);
        setAttached(a => ({ ...a, skills: a.skills.filter(x => x !== sid) }));
      } else {
        await api.pfAddSkill(sel, { skill_id: sid });
        setAttached(a => ({ ...a, skills: [...a.skills, sid] }));
      }
    } catch (e) { setFormErr(errMsg(e)); }
  }

  if (q.isLoading) return <LoadingState />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight">Portfolio Builder</h1>
      <p className="mt-1 text-sm text-zinc-500">Design a public page recruiters will actually want to open.</p>

      <form onSubmit={e => { e.preventDefault(); setFormErr(""); create.mutate(); }} className="mt-6 flex max-w-2xl flex-wrap gap-2">
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Portfolio title (e.g. Hussnain Ahmad)" required aria-label="Title" className="flex-1 min-w-[200px]" />
        <Input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="slug (e.g. hussnain)" required aria-label="Slug" className="w-44" />
        <Button type="submit" disabled={create.isPending}><Plus className="mr-1 h-4 w-4" />{create.isPending ? "Creating…" : "Create"}</Button>
      </form>
      {formErr && <p className="mt-2 text-sm text-rose-600" role="alert">{formErr}</p>}

      {!q.data?.length ? (
        <div className="mt-6"><EmptyState title="No portfolios yet" desc="Create one above — it'll get a public link like zevqyn.dev/p/yourname." /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(q.data as AnyRec[]).map(p => (
            <div key={p.id} className={`rounded-2xl border p-5 transition ${sel === p.id ? "border-indigo-500 bg-indigo-50/50 shadow-sm" : "border-zinc-900/[0.08] bg-white hover:border-zinc-300 hover:shadow-sm"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-semibold">{p.display_name || p.title}</p>
                  <p className="mt-0.5 font-mono text-xs text-zinc-500">/p/{p.slug}</p>
                </div>
                {p.is_published ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">Live</span>
                ) : (
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">Draft</span>
                )}
              </div>
              {p.headline && <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{p.headline}</p>}
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant={sel === p.id ? "default" : "outline"} onClick={() => setSel(p.id)}>
                  <Settings2 className="mr-1 h-3.5 w-3.5" /> {sel === p.id ? "Editing" : "Edit"}
                </Button>
                {p.slug && <Link href={`/p/${p.slug}`} target="_blank"><Button size="sm" variant="outline"><Eye className="mr-1 h-3.5 w-3.5" /> View</Button></Link>}
              </div>
            </div>
          ))}
        </div>
      )}

      {sel && portfolio && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Settings */}
          <div className="rounded-2xl border border-zinc-900/[0.08] bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">Profile & Appearance</h2>
              <Button size="sm" variant="outline" onClick={() => setShowSettings(!showSettings)}>{showSettings ? "Hide" : "Edit"}</Button>
            </div>
            {showSettings ? (
              <div className="mt-4 space-y-4">
                {/* Profile picture */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {preview || settings.profile_image_url ? (
                      <img src={preview || settings.profile_image_url} alt="Profile" className="h-20 w-20 rounded-full object-cover ring-2 ring-indigo-200" />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-2xl font-bold text-indigo-500">
                        {(settings.display_name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/70">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label>Profile picture</Label>
                    <p className="mt-0.5 text-xs text-zinc-500">JPG, PNG, WebP or GIF · max 5 MB. Shows on your public page.</p>
                    <div className="mt-2 flex gap-2">
                      <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50">
                        <Camera className="h-4 w-4" />
                        {settings.profile_image_url ? "Change photo" : "Upload photo"}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImagePick} disabled={uploading} />
                      </label>
                      {settings.profile_image_url && (
                        <button type="button" onClick={() => setSettings(s => ({ ...s, profile_image_url: "" }))} className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-zinc-500 transition hover:text-rose-600">
                          <X className="h-4 w-4" /> Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5"><Label>Display name</Label><Input value={settings.display_name || ""} onChange={e => setSettings({ ...settings, display_name: e.target.value })} /></div>
                <div className="space-y-1.5"><Label>Headline</Label><Input value={settings.headline || ""} onChange={e => setSettings({ ...settings, headline: e.target.value })} placeholder="e.g. CS Student building AI products" /></div>
                <div className="space-y-1.5"><Label>About</Label><Textarea value={settings.about || ""} onChange={e => setSettings({ ...settings, about: e.target.value })} rows={4} placeholder="A few lines about you…" /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>GitHub URL</Label><Input value={settings.github_url || ""} onChange={e => setSettings({ ...settings, github_url: e.target.value })} placeholder="https://github.com/..." /></div>
                  <div className="space-y-1.5"><Label>LinkedIn URL</Label><Input value={settings.linkedin_url || ""} onChange={e => setSettings({ ...settings, linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." /></div>
                </div>
                <div className="space-y-1.5"><Label>Website URL</Label><Input value={settings.website_url || ""} onChange={e => setSettings({ ...settings, website_url: e.target.value })} placeholder="https://..." /></div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={settings.is_published ?? true} onChange={e => setSettings({ ...settings, is_published: e.target.checked })} className="h-4 w-4 rounded" />
                  Published (visible at public link)
                </label>
                <Button onClick={() => saveSettings.mutate()} disabled={saveSettings.isPending}>{saveSettings.isPending ? "Saving…" : "Save changes"}</Button>
              </div>
            ) : (
              <div className="mt-4 space-y-2 text-sm">
                <p><span className="text-zinc-500">Headline:</span> {portfolio.headline || <span className="text-zinc-400">Not set</span>}</p>
                <p><span className="text-zinc-500">About:</span> {portfolio.about ? `${String(portfolio.about).slice(0, 80)}…` : <span className="text-zinc-400">Not set</span>}</p>
                <div className="flex gap-2 pt-1">
                  {portfolio.github_url && <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs">GitHub ✓</span>}
                  {portfolio.linkedin_url && <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs">LinkedIn ✓</span>}
                  {portfolio.website_url && <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs">Website ✓</span>}
                </div>
              </div>
            )}

            {portfolio.slug && (
              <a href={`/p/${portfolio.slug}`} target="_blank" rel="noopener" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                Open public page <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Attach content */}
          <div className="rounded-2xl border border-zinc-900/[0.08] bg-white p-6">
            <h2 className="font-display font-semibold">Showcase Content</h2>
            <p className="mt-1 text-xs text-zinc-500">Tap to attach or remove from your public page.</p>

            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-zinc-500">Projects</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {((proj.data as AnyRec[]) || []).map(p => {
                const active = attached.projects.includes(p.id);
                return (
                  <button key={p.id} onClick={() => toggleProject(p.id)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-indigo-600 bg-indigo-600 text-white" : "border-zinc-900/15 bg-white hover:border-indigo-400"}`}>
                    {active && <Check className="h-3.5 w-3.5" />}{String(p.title || p.name)}
                  </button>
                );
              })}
              {!proj.data?.length && <p className="text-sm text-zinc-400">No projects yet — add some in Career Hub.</p>}
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-zinc-500">Skills</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {((skills.data as AnyRec[]) || []).map(s => {
                const active = attached.skills.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleSkill(s.id)} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-indigo-600 bg-indigo-600 text-white" : "border-zinc-900/15 bg-white hover:border-indigo-400"}`}>
                    {active && <Check className="h-3.5 w-3.5" />}{s.name}
                  </button>
                );
              })}
              {!skills.data?.length && <p className="text-sm text-zinc-400">No skills yet — add some in Career Hub.</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
