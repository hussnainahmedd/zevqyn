"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Inbox,
  ShieldCheck,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { clearAdminToken, getAdminToken } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/inbox", label: "Inbox", icon: Inbox },
  { href: "/admin/settings", label: "Security", icon: ShieldCheck },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFAF7]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-indigo-600" />
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-zinc-900/[0.06] px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 font-display text-sm font-bold text-white">
          Z
        </span>
        <span className="font-display font-semibold tracking-tight text-zinc-950">
          ZEVQYN
        </span>
        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
          ADMIN
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((i) => {
          const active = path === i.href;
          return (
            <Link
              key={i.href}
              href={i.href}
              onClick={() => setOpen(false)}
              className={cn(
                "motion-spring flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300",
                active
                  ? "bg-indigo-600 text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,0.6)]"
                  : "text-zinc-500 hover:translate-x-0.5 hover:bg-white hover:text-zinc-900 hover:shadow-sm"
              )}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-zinc-900/[0.06] p-3">
        <button
          onClick={() => {
            clearAdminToken();
            router.replace("/admin/login");
          }}
          className="motion-spring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-zinc-600 transition-all duration-300 hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#FBFAF7] text-zinc-950">
      <div className="mkt-dotgrid pointer-events-none fixed inset-0 opacity-40" />
      {/* Desktop sidebar — frosted glass */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/60 bg-white/70 backdrop-blur-2xl md:block">
        {sidebar}
      </aside>
      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-zinc-950/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 border-r border-white/60 bg-white/90 backdrop-blur-2xl">
            {sidebar}
          </aside>
        </div>
      )}
      <div className="relative md:pl-64">
        <header className="sticky top-0 z-20 border-b border-white/60 bg-[#FBFAF7]/70 backdrop-blur-2xl">
          <div className="flex h-16 items-center gap-3 px-4 md:px-8">
            <button
              className="rounded-lg p-2 hover:bg-white md:hidden"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <p className="font-display text-sm font-semibold tracking-tight text-zinc-900">
              Admin Console
            </p>
          </div>
        </header>
        <main className="relative px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
