"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Users, FolderOpen, FileText, Briefcase, Inbox, ArrowUpRight } from "lucide-react";
import { adminApi, AdminApiError, clearAdminToken } from "@/lib/api/admin";
import { ErrorState, LoadingState } from "@/components/PageStates";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const CARDS = [
  { key: "users", label: "Total users", icon: Users, href: "/admin/users", tint: "bg-indigo-100 text-indigo-700" },
  { key: "workspaces", label: "Workspaces", icon: FolderOpen, href: null, tint: "bg-sky-100 text-sky-700" },
  { key: "documents", label: "Documents", icon: FileText, href: null, tint: "bg-amber-100 text-amber-700" },
  { key: "projects", label: "Projects", icon: Briefcase, href: null, tint: "bg-emerald-100 text-emerald-700" },
  { key: "contact_messages", label: "Inbox messages", icon: Inbox, href: "/admin/inbox", tint: "bg-rose-100 text-rose-700" },
] as const;

export default function AdminOverview() {
  const router = useRouter();
  const q = useQuery({ queryKey: ["admin-stats"], queryFn: adminApi.stats });

  useEffect(() => {
    if (q.error instanceof AdminApiError && q.error.status === 401) {
      clearAdminToken();
      router.replace("/admin/login");
    }
  }, [q.error, router]);

  if (q.isLoading) return <LoadingState />;
  if (q.error)
    return (
      <ErrorState message="Could not load admin stats. Check the backend connection." />
    );

  const stats = q.data!;

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-950">
        Overview
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Platform health at a glance. Everything is under your control.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {CARDS.map((c) => {
          const inner = (
            <div className={`motion-spring group rounded-3xl border border-white/60 bg-white/70 p-5 shadow-[0_16px_40px_-20px_rgba(24,24,40,0.25)] backdrop-blur-2xl transition-all duration-500 ${c.href ? "hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-20px_rgba(24,24,40,0.3)]" : ""}`}>
              <div className="flex items-center justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${c.tint}`}
                >
                  <c.icon className="h-5 w-5" />
                </span>
                {c.href && <ArrowUpRight className="h-4 w-4 text-zinc-300 transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-indigo-600" />}
              </div>
              <p className="mt-4 font-display text-3xl font-semibold tracking-tight text-zinc-950">
                {stats[c.key] ?? "—"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">{c.label}</p>
            </div>
          );
          return c.href ? <Link key={c.key} href={c.href}>{inner}</Link> : <div key={c.key}>{inner}</div>;
        })}
      </div>

      <div className="motion-spring mt-8 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_16px_40px_-20px_rgba(24,24,40,0.25)] backdrop-blur-2xl transition-all duration-500">
        <h2 className="font-display text-lg font-semibold tracking-tight text-zinc-950">
          Quick actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/users"
            className="motion-spring rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-[0_10px_25px_-10px_rgba(79,70,229,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-700"
          >
            Manage users
          </Link>
          <Link
            href="/admin/inbox"
            className="motion-spring rounded-xl border border-zinc-900/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            Open inbox
          </Link>
          <Link
            href="/admin/settings"
            className="motion-spring rounded-xl border border-zinc-900/10 bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
          >
            Change admin password
          </Link>
        </div>
      </div>
    </div>
  );
}
