"use client"; import { useQuery } from "@tanstack/react-query"; import { api } from "@/lib/api/services"; import { LoadingState } from "@/components/PageStates"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input"; import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; import { useState } from "react";

type AnyRec = Record<string, any>;
const errMsg = (e: unknown) => e instanceof Error ? e.message : "Something went wrong. Try again.";

function Section({ title, items }: { title: string; items?: string[] }) {
  if (!items || !items.length) return null;
  return (
    <div className="mt-4">
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <ul className="mt-1.5 list-disc space-y-1 pl-5 text-sm leading-relaxed text-zinc-700">
        {items.map((s, i) => <li key={i}>{s}</li>)}
      </ul>
    </div>
  );
}

function Score({ value }: { value?: number }) {
  if (typeof value !== "number") return null;
  const color = value >= 70 ? "text-emerald-700 bg-emerald-50 border-emerald-200" : value >= 40 ? "text-amber-700 bg-amber-50 border-amber-200" : "text-rose-700 bg-rose-50 border-rose-200";
  return <span className={`inline-block rounded-full border px-3 py-1 text-sm font-semibold ${color}`}>Score: {value}/100</span>;
}

function RenderResult({ tool, data }: { tool: string; data: AnyRec }) {
  if (tool === "analyze") {
    return <div><Score value={data.readiness_score} />{data.summary && <p className="mt-3 text-sm leading-relaxed text-zinc-700">{data.summary}</p>}<Section title="Strengths" items={data.strengths} /><Section title="Areas to improve" items={data.improvement_areas} /><Section title="Next actions" items={data.next_actions} /></div>;
  }
  if (tool === "skill-gap") {
    return <div>{data.target_role && <p className="text-sm font-semibold text-zinc-900">Target role: {data.target_role}</p>}<Section title="Your strengths" items={data.current_strengths} />
      {data.skill_gaps?.length > 0 && <div className="mt-4"><p className="text-sm font-semibold text-zinc-900">Skill gaps</p><ul className="mt-1.5 space-y-1.5">{data.skill_gaps.map((g: AnyRec, i: number) => <li key={i} className="text-sm text-zinc-700"><span className="font-medium">{g.skill}</span>{g.importance && <span className="text-zinc-500"> · {g.importance}</span>}{g.why && <span className="block text-zinc-600">{g.why}</span>}</li>)}</ul></div>}
      <Section title="Recommended learning" items={data.recommended_learning} /><Section title="Recommended projects" items={data.recommended_projects} /></div>;
  }
  if (tool === "suggest-projects") {
    return <div>{data.suggestions?.length > 0 ? <ul className="space-y-3">{data.suggestions.map((s: AnyRec, i: number) => <li key={i} className="rounded-lg border border-zinc-900/[0.08] bg-white p-3"><p className="text-sm font-semibold text-zinc-900">{s.title}</p>{s.description && <p className="mt-1 text-sm text-zinc-600">{s.description}</p>}{s.skills_used?.length > 0 && <p className="mt-1.5 text-xs text-zinc-500">Skills: {s.skills_used.join(", ")}</p>}</li>)}</ul> : <p className="text-sm text-zinc-500">No suggestions yet — add skills to your Career Hub first.</p>}</div>;
  }
  if (tool === "review-resume" || tool === "review-portfolio") {
    return <div><Score value={data.score} />{data.summary && <p className="mt-3 text-sm leading-relaxed text-zinc-700">{data.summary}</p>}<Section title="Strengths" items={data.strengths} /><Section title="Improvements" items={data.improvements} /><Section title="ATS suggestions" items={data.ats_suggestions} /><Section title="Content suggestions" items={data.content_suggestions} /><Section title="Presentation suggestions" items={data.presentation_suggestions} /><Section title="Missing elements" items={data.missing_elements} /></div>;
  }
  if (tool === "action-plan") {
    const Phase = ({ label, items }: { label: string; items?: AnyRec[] }) => !items?.length ? null : (
      <div className="mt-4"><p className="text-sm font-semibold text-zinc-900">{label}</p><ul className="mt-1.5 space-y-2">{items.map((a, i) => <li key={i} className="rounded-lg border border-zinc-900/[0.08] bg-white p-3 text-sm"><span className="font-medium text-zinc-900">{a.title}</span>{a.priority && <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${a.priority === "High" ? "bg-rose-100 text-rose-700" : a.priority === "Medium" ? "bg-amber-100 text-amber-700" : "bg-zinc-100 text-zinc-600"}`}>{a.priority}</span>}{a.description && <span className="mt-0.5 block text-zinc-600">{a.description}</span>}</li>)}</ul></div>
    );
    return <div>{data.target_role && <p className="text-sm font-semibold text-zinc-900">Target role: {data.target_role}</p>}{data.summary && <p className="mt-2 text-sm leading-relaxed text-zinc-700">{data.summary}</p>}<Phase label="First 30 days" items={data.days_30} /><Phase label="Days 31–60" items={data.days_60} /><Phase label="Days 61–90" items={data.days_90} /></div>;
  }
  if (tool === "chat") {
    return <div>{data.answer ? <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{data.answer}</p> : <p className="text-sm text-zinc-500">No answer returned.</p>}{data.profile_used && <p className="mt-3 border-t border-zinc-900/[0.06] pt-2 text-xs text-zinc-500">Based on your profile: {[data.profile_used.skills_count ? `${data.profile_used.skills_count} skills` : null, data.profile_used.projects_count ? `${data.profile_used.projects_count} projects` : null, data.profile_used.education_count ? `${data.profile_used.education_count} education` : null].filter(Boolean).join(" · ") || "no career data yet — add some in Career Hub"}</p>}</div>;
  }
  return <pre className="whitespace-pre-wrap text-sm text-zinc-700">{JSON.stringify(data, null, 2)}</pre>;
}

export default function CareerAI() {
  const convs = useQuery({ queryKey: ["career-convs"], queryFn: api.careerConversations });
  const resumes = useQuery({ queryKey: ["resumes"], queryFn: api.resumes });
  const portfolios = useQuery({ queryKey: ["portfolios"], queryFn: api.portfolios });
  const [out, setOut] = useState<{ tool: string; data: AnyRec } | null>(null);
  const [chatIn, setChatIn] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  async function run(tool: string, body: Record<string, unknown> = {}) {
    setBusy(tool); setOut(null); setErr("");
    try {
      const d = await api.careerAi(tool, body) as AnyRec;
      setOut({ tool, data: d });
    } catch (e) { setErr(errMsg(e)); }
    setBusy("");
  }

  function runTool(t: string) {
    if (t === "review-resume") {
      const r = resumes.data?.[0];
      if (!r) { setErr("You have no resumes yet — create one in Resume Builder first, then come back for a review."); setOut(null); return; }
      run(t, { resume_id: r.id });
    } else if (t === "review-portfolio") {
      const p = portfolios.data?.[0];
      if (!p) { setErr("You have no portfolios yet — create one in Portfolio Builder first, then come back for a review."); setOut(null); return; }
      run(t, { portfolio_id: p.id });
    } else if (t === "action-plan") {
      if (!targetRole.trim()) { setErr("Tell me your target role first — type it in the field below, then run the action plan."); setOut(null); return; }
      run(t, { target_role: targetRole.trim() });
    } else {
      run(t);
    }
  }

  const tools: [string, string][] = [["analyze", "Analyze my profile"], ["skill-gap", "Skill-gap analysis"], ["suggest-projects", "Suggest projects"], ["review-resume", "Review resume"], ["review-portfolio", "Review portfolio"], ["action-plan", "30/60/90 action plan"]];

  return <div><h1 className="font-display text-2xl font-semibold tracking-tight">Career AI</h1><p className="mt-1 text-sm text-zinc-500">Distinct tools, not a generic chat box. Each runs against your real career data — profile, skills, education, projects, resumes and portfolios.</p>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{tools.map(([t, l]) => <Button key={t} variant="outline" className="h-auto justify-start py-4" onClick={() => runTool(t)} disabled={!!busy}>{busy === t ? "Running…" : l}</Button>)}</div>
    <div className="mt-4 flex max-w-md gap-2"><Input value={targetRole} onChange={e => setTargetRole(e.target.value)} placeholder="Target role for action plan (e.g. Frontend Developer)" aria-label="Target role" /><Button variant="outline" onClick={() => runTool("action-plan")} disabled={!!busy || !targetRole.trim()}>{busy === "action-plan" ? "Running…" : "Action plan"}</Button></div>
    <Card className="mt-8"><CardHeader><CardTitle>Career conversation</CardTitle></CardHeader><CardContent>
      <form onSubmit={e => { e.preventDefault(); if (chatIn.trim() && !busy) { run("chat", { message: chatIn }); setChatIn(""); } }} className="flex gap-2">
        <Input value={chatIn} onChange={e => setChatIn(e.target.value)} placeholder="Ask about roles, skills, next steps…" aria-label="Career question" />
        <Button type="submit" disabled={!chatIn.trim() || !!busy}>{busy === "chat" ? "Sending…" : "Send"}</Button>
      </form>
      {convs.data && convs.data.length > 0 && <div className="mt-4"><p className="text-xs text-zinc-500">Past conversations: {convs.data.length}</p></div>}
      {err && <p className="mt-4 text-sm text-rose-600" role="alert">{err}</p>}
      {out && <div className="mt-4 rounded-2xl border border-zinc-900/[0.08] bg-white p-5 shadow-sm"><RenderResult tool={out.tool} data={out.data} /></div>}
    </CardContent></Card></div>;
}
