"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { LoadingState, EmptyState } from "@/components/PageStates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { apiUrl } from "@/lib/api/client";
import { supabase } from "@/lib/supabase";
import { Trash2, ArrowUp, ArrowDown, Plus } from "lucide-react";

type AnyRec = Record<string, any>;
const errMsg = (e: unknown) => e instanceof Error ? e.message : "Something went wrong. Try again.";

const SECTIONS = [
  { id: "experience", label: "Experience" },
  { id: "project", label: "Projects" },
  { id: "education", label: "Education" },
  { id: "skill", label: "Skills" },
  { id: "certificate", label: "Certifications" },
];

function ATSPreview({ resume, items }: { resume: AnyRec; items: AnyRec[] }) {
  const bySection = (s: string) => items.filter(i => i.section_type === s);
  const contact = [resume.email, resume.phone, resume.location].filter(Boolean).join(" · ");
  const links = [resume.linkedin_url && "LinkedIn", resume.github_url && "GitHub", resume.portfolio_url && "Portfolio"].filter(Boolean).join(" · ");

  return (
    <div className="bg-white p-8 text-zinc-900 shadow-sm" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {/* Header */}
      <div className="border-b-2 border-zinc-900 pb-4 text-center">
        <h1 className="text-2xl font-bold tracking-wide uppercase">{resume.full_name || "Your Name"}</h1>
        {resume.professional_title && <p className="mt-1 text-sm font-medium text-zinc-700">{resume.professional_title}</p>}
        {contact && <p className="mt-2 text-xs text-zinc-600">{contact}</p>}
        {links && <p className="mt-1 text-xs text-zinc-600">{links}</p>}
      </div>

      {/* Summary */}
      {resume.professional_summary && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1">Professional Summary</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">{resume.professional_summary}</p>
        </div>
      )}

      {/* Skills */}
      {bySection("skill").length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1">Skills</h2>
          <p className="mt-2 text-sm text-zinc-700">{bySection("skill").map(s => s.title).join(" · ")}</p>
        </div>
      )}

      {/* Experience */}
      {bySection("experience").length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1">Experience</h2>
          {bySection("experience").map(it => (
            <div key={it.id} className="mt-3">
              <div className="flex justify-between baseline">
                <p className="text-sm font-bold">{it.title}</p>
                {it.subtitle && <p className="text-xs text-zinc-600">{it.subtitle}</p>}
              </div>
              {it.description && <p className="mt-1 text-sm text-zinc-700 whitespace-pre-wrap">{it.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {bySection("project").length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1">Projects</h2>
          {bySection("project").map(it => (
            <div key={it.id} className="mt-3">
              <p className="text-sm font-bold">{it.title}{it.subtitle && <span className="font-normal text-zinc-600"> — {it.subtitle}</span>}</p>
              {it.description && <p className="mt-1 text-sm text-zinc-700 whitespace-pre-wrap">{it.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {bySection("education").length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1">Education</h2>
          {bySection("education").map(it => (
            <div key={it.id} className="mt-3">
              <div className="flex justify-between baseline">
                <p className="text-sm font-bold">{it.title}</p>
                {it.subtitle && <p className="text-xs text-zinc-600">{it.subtitle}</p>}
              </div>
              {it.description && <p className="mt-1 text-sm text-zinc-700">{it.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {bySection("certificate").length > 0 && (
        <div className="mt-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-300 pb-1">Certifications</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-700">
            {bySection("certificate").map(it => <li key={it.id}>{it.title}{it.subtitle && ` — ${it.subtitle}`}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ResumePage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["resumes"], queryFn: api.resumes });
  const [title, setTitle] = useState("");
  const [sel, setSel] = useState("");
  const [formErr, setFormErr] = useState("");
  const [activeTab, setActiveTab] = useState<"details" | "items">("details");

  const resume = (q.data as AnyRec[] | undefined)?.find(r => r.id === sel);
  const items = useQuery({ queryKey: ["resume-items", sel], queryFn: () => api.resumeItems(sel), enabled: !!sel });

  // Details form state
  const [details, setDetails] = useState<AnyRec>({});
  useEffect(() => {
    if (resume) {
      setDetails({
        full_name: resume.full_name || "",
        professional_title: resume.professional_title || "",
        email: resume.email || "",
        phone: resume.phone || "",
        location: resume.location || "",
        linkedin_url: resume.linkedin_url || "",
        github_url: resume.github_url || "",
        portfolio_url: resume.portfolio_url || "",
        professional_summary: resume.professional_summary || "",
      });
    }
  }, [sel]);

  const create = useMutation({
    mutationFn: () => api.createResume({ name: title }),
    onSuccess: (r: AnyRec) => { qc.invalidateQueries({ queryKey: ["resumes"] }); setTitle(""); setSel(r.id); setFormErr(""); },
    onError: (e) => setFormErr(errMsg(e)),
  });

  const saveDetails = useMutation({
    mutationFn: () => api.updateResume(sel, details),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resumes"] }); setFormErr(""); },
    onError: (e) => setFormErr(errMsg(e)),
  });

  const [itTitle, setItTitle] = useState("");
  const [itSection, setItSection] = useState("project");
  const [itSubtitle, setItSubtitle] = useState("");
  const [itDesc, setItDesc] = useState("");

  const addItem = useMutation({
    mutationFn: () => api.addResumeItem(sel, { section_type: itSection, title: itTitle, subtitle: itSubtitle || undefined, description: itDesc || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["resume-items", sel] }); setItTitle(""); setItSubtitle(""); setItDesc(""); setFormErr(""); },
    onError: (e) => setFormErr(errMsg(e)),
  });

  const delItem = useMutation({
    mutationFn: (iid: string) => api.deleteResumeItem(sel, iid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["resume-items", sel] }),
  });

  async function move(idx: number, dir: -1 | 1) {
    const arr = items.data as AnyRec[] | undefined;
    if (!arr) return;
    const copy = [...arr];
    const j = idx + dir;
    if (j < 0 || j >= copy.length) return;
    [copy[idx], copy[j]] = [copy[j], copy[idx]];
    await api.reorderResumeItems(sel, copy.map((x, i) => ({ id: x.id, sort_order: i })));
    qc.invalidateQueries({ queryKey: ["resume-items", sel] });
  }

  async function downloadPdf() {
    const { data } = await supabase.auth.getSession();
    const url = apiUrl(`/api/v1/resumes/${sel}/pdf`);
    const r = await fetch(url, { headers: { Authorization: `Bearer ${data.session?.access_token}` } });
    const b = await r.blob();
    const u = URL.createObjectURL(b);
    window.open(u, "_blank");
  }

  if (q.isLoading) return <LoadingState />;

  const field = (key: string, label: string, placeholder?: string, type = "text") => (
    <div className="space-y-1.5">
      <Label htmlFor={`rd-${key}`}>{label}</Label>
      <Input id={`rd-${key}`} type={type} value={details[key] || ""} onChange={e => setDetails({ ...details, [key]: e.target.value })} placeholder={placeholder} />
    </div>
  );

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Resume Builder</h1>
          <p className="mt-1 text-sm text-zinc-500">ATS-friendly format. Fill in your details, organize sections, preview live.</p>
        </div>
        {sel && <Button onClick={downloadPdf}>Download PDF</Button>}
      </div>

      <form onSubmit={e => { e.preventDefault(); setFormErr(""); create.mutate(); }} className="mt-6 flex max-w-lg gap-2">
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Resume title (e.g. Software Engineer 2026)" required aria-label="Resume title" />
        <Button type="submit" disabled={create.isPending}>{create.isPending ? "Creating…" : "New resume"}</Button>
      </form>
      {formErr && <p className="mt-2 text-sm text-rose-600" role="alert">{formErr}</p>}

      {!q.data?.length ? (
        <div className="mt-5"><EmptyState title="No resumes yet" desc="Create your first ATS resume above." /></div>
      ) : (
        <div className="mt-5 flex flex-wrap gap-2">
          {(q.data as AnyRec[]).map(r => (
            <button key={r.id} onClick={() => setSel(r.id)} className={`rounded-xl border px-4 py-3 text-left transition ${sel === r.id ? "border-indigo-500 bg-indigo-50 shadow-sm" : "border-zinc-900/[0.08] bg-white hover:border-zinc-300"}`}>
              <p className="text-sm font-semibold">{r.name || r.title}</p>
              <p className="text-xs text-zinc-500">{r.full_name || "No name set"}</p>
            </button>
          ))}
        </div>
      )}

      {sel && resume && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* Editor */}
          <div>
            <div className="flex gap-2 border-b border-zinc-900/[0.08]">
              {(["details", "items"] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition ${activeTab === t ? "border-indigo-600 text-indigo-700" : "border-transparent text-zinc-500 hover:text-zinc-800"}`}>
                  {t === "details" ? "Personal Details" : "Sections & Items"}
                </button>
              ))}
            </div>

            {activeTab === "details" && (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("full_name", "Full name", "Hussnain Ahmad")}
                  {field("professional_title", "Professional title", "Computer Science Student")}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("email", "Email", "you@example.com", "email")}
                  {field("phone", "Phone", "+92 300 0000000", "tel")}
                </div>
                {field("location", "Location", "Islamabad, Pakistan")}
                <div className="grid gap-4 sm:grid-cols-2">
                  {field("linkedin_url", "LinkedIn URL", "https://linkedin.com/in/...")}
                  {field("github_url", "GitHub URL", "https://github.com/...")}
                </div>
                {field("portfolio_url", "Portfolio URL", "https://...")}
                <div className="space-y-1.5">
                  <Label htmlFor="rd-summary">Professional summary</Label>
                  <Textarea id="rd-summary" rows={4} value={details.professional_summary || ""} onChange={e => setDetails({ ...details, professional_summary: e.target.value })} placeholder="2-3 lines about who you are, what you do, and what you're looking for." />
                </div>
                <Button onClick={() => saveDetails.mutate()} disabled={saveDetails.isPending}>
                  {saveDetails.isPending ? "Saving…" : "Save details"}
                </Button>
              </div>
            )}

            {activeTab === "items" && (
              <div className="mt-5">
                <form onSubmit={e => { e.preventDefault(); setFormErr(""); addItem.mutate(); }} className="space-y-3 rounded-xl border border-zinc-900/[0.08] bg-white p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Section</Label>
                      <select value={itSection} onChange={e => setItSection(e.target.value)} className="h-9 w-full rounded-lg border border-zinc-900/15 bg-white px-2 text-sm shadow-sm" aria-label="Section">
                        {SECTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Title</Label>
                      <Input value={itTitle} onChange={e => setItTitle(e.target.value)} placeholder={itSection === "skill" ? "e.g. Python" : "e.g. Senior Developer"} required />
                    </div>
                  </div>
                  {itSection !== "skill" && (
                    <div className="space-y-1.5">
                      <Label>Subtitle <span className="text-zinc-400">(dates, company, or institution)</span></Label>
                      <Input value={itSubtitle} onChange={e => setItSubtitle(e.target.value)} placeholder="e.g. 2023 — Present · Tech Corp" />
                    </div>
                  )}
                  {itSection !== "skill" && itSection !== "certificate" && (
                    <div className="space-y-1.5">
                      <Label>Description</Label>
                      <Textarea value={itDesc} onChange={e => setItDesc(e.target.value)} rows={3} placeholder="Bullet points or paragraph describing impact…" />
                    </div>
                  )}
                  <Button type="submit" size="sm" disabled={addItem.isPending}><Plus className="mr-1 h-4 w-4" />{addItem.isPending ? "Adding…" : "Add item"}</Button>
                </form>

                <div className="mt-5 space-y-4">
                  {SECTIONS.map(sec => {
                    const secItems = ((items.data as AnyRec[]) || []).filter(i => i.section_type === sec.id);
                    if (!secItems.length) return null;
                    return (
                      <div key={sec.id}>
                        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{sec.label}</p>
                        <ul className="mt-2 space-y-2">
                          {secItems.map((it) => {
                            const globalIdx = ((items.data as AnyRec[]) || []).indexOf(it);
                            return (
                              <li key={it.id} className="flex items-center justify-between rounded-lg border border-zinc-900/[0.08] bg-white px-3 py-2.5">
                                <div className="min-w-0">
                                  <p className="truncate text-sm font-medium">{it.title}</p>
                                  {it.subtitle && <p className="truncate text-xs text-zinc-500">{it.subtitle}</p>}
                                </div>
                                <div className="flex shrink-0 gap-1">
                                  <Button size="sm" variant="ghost" onClick={() => move(globalIdx, -1)} aria-label="Move up"><ArrowUp className="h-3.5 w-3.5" /></Button>
                                  <Button size="sm" variant="ghost" onClick={() => move(globalIdx, 1)} aria-label="Move down"><ArrowDown className="h-3.5 w-3.5" /></Button>
                                  <Button size="sm" variant="ghost" onClick={() => { if (confirm("Delete this item?")) delItem.mutate(it.id); }} aria-label="Delete"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></Button>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })}
                  {!items.data?.length && <p className="text-sm text-zinc-500">No items yet. Add your first above.</p>}
                </div>
              </div>
            )}
          </div>

          {/* ATS Preview */}
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">Live ATS Preview</h2>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">ATS-Friendly</span>
            </div>
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-900/[0.1]">
              <ATSPreview resume={{ ...resume, ...details }} items={(items.data as AnyRec[]) || []} />
            </div>
            <p className="mt-2 text-xs text-zinc-500">Preview mirrors the exported PDF layout.</p>
          </div>
        </div>
      )}
    </div>
  );
}
