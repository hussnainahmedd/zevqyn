"use client";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/services";
import { LoadingState, EmptyState, ErrorState } from "@/components/PageStates";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, FileText, Briefcase, FileUser, Globe, Sparkles, ArrowRight, ArrowUpRight } from "lucide-react";

export default function Dashboard() {
  const me = useQuery({ queryKey: ["me"], queryFn: api.me });
  const ws = useQuery({ queryKey: ["workspaces"], queryFn: api.workspaces });
  const docs = useQuery({ queryKey: ["documents"], queryFn: () => api.documents("?limit=100") });
  const proj = useQuery({ queryKey: ["projects"], queryFn: api.projects });
  const res = useQuery({ queryKey: ["resumes"], queryFn: api.resumes });
  const pf = useQuery({ queryKey: ["portfolios"], queryFn: api.portfolios });

  if (me.isLoading || ws.isLoading) return <LoadingState />;
  const err = me.error || ws.error;
  if (err) return <ErrorState message={err instanceof Error ? err.message : "Failed to load dashboard"} onRetry={() => me.refetch()} />;

  const firstName = (me.data as any)?.email?.split("@")[0] || "there";
  const stats = [
    { label: "Research workspaces", value: ws.data?.length ?? 0, href: "/app/workspaces", icon: BookOpen, color: "bg-indigo-100 text-indigo-700" },
    { label: "Documents", value: docs.data?.length ?? 0, href: "/app/documents", icon: FileText, color: "bg-sky-100 text-sky-700" },
    { label: "Projects", value: proj.data?.length ?? 0, href: "/app/projects", icon: Briefcase, color: "bg-amber-100 text-amber-700" },
    { label: "Resumes", value: res.data?.length ?? 0, href: "/app/resume", icon: FileUser, color: "bg-emerald-100 text-emerald-700" },
    { label: "Portfolios", value: pf.data?.length ?? 0, href: "/app/portfolio", icon: Globe, color: "bg-rose-100 text-rose-700" },
  ];

  const journey = [
    { t: "Research", d: "Upload documents, get cited answers", href: "/app/workspaces", icon: BookOpen },
    { t: "Projects", d: "Turn findings into proof-of-work", href: "/app/projects", icon: Briefcase },
    { t: "Resume", d: "ATS format, export to PDF", href: "/app/resume", icon: FileUser },
    { t: "Portfolio", d: "Publish a page recruiters love", href: "/app/portfolio", icon: Globe },
    { t: "Career AI", d: "Close skill gaps with a plan", href: "/app/career-ai", icon: Sparkles },
  ];

  return (
    <div>
      <div className="rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 p-8 text-white sm:p-10">
        <p className="text-sm font-medium text-indigo-200">Welcome back{firstName !== "there" ? `, ${firstName}` : ""}</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your career workspace</h1>
        <p className="mt-2 max-w-lg text-indigo-100">Research → Project → Resume → Portfolio → Growth. Everything connects.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/app/workspaces"><Button variant="secondary" size="sm">New workspace <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
          <Link href="/app/career-ai"><Button variant="outline" size="sm" className="border-white/30 bg-white/10 text-white hover:bg-white/20">Ask Career AI <Sparkles className="ml-1 h-4 w-4" /></Button></Link>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map(s => (
          <Link key={s.label} href={s.href} className="group">
            <Card className="transition group-hover:shadow-md group-hover:-translate-y-0.5">
              <CardContent className="pt-5">
                <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.color}`}><s.icon className="h-4.5 w-4.5" /></span>
                <p className="mt-3 text-3xl font-bold tracking-tight">{s.value}</p>
                <p className="mt-1 flex items-center gap-1 text-sm text-zinc-500">{s.label} <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" /></p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent workspaces</CardTitle></CardHeader>
          <CardContent>
            {!ws.data?.length ? (
              <EmptyState title="No workspaces yet" desc="Create one to upload research and start asking cited questions." action={<Link href="/app/workspaces"><Button size="sm">Create workspace</Button></Link>} />
            ) : (
              <ul className="divide-y divide-zinc-900/[0.06]">
                {(ws.data as any[]).slice(0, 5).map(x => (
                  <li key={x.id} className="flex items-center justify-between py-3">
                    <Link href={`/app/workspaces/${x.id}`} className="font-medium hover:underline">{x.name}</Link>
                    <span className="text-xs text-zinc-500">{formatDate(x.created_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Your journey</CardTitle></CardHeader>
          <CardContent>
            <ol className="space-y-1">
              {journey.map((s, i) => (
                <li key={s.t}>
                  <Link href={s.href} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-zinc-50">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700"><s.icon className="h-4 w-4" /></span>
                    <span className="flex-1"><span className="block text-sm font-medium">{i + 1}. {s.t}</span><span className="block text-xs text-zinc-500">{s.d}</span></span>
                    <ArrowRight className="h-4 w-4 text-zinc-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                  </Link>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
