"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { AdminApiError, adminApi, setAdminToken } from "@/lib/api/admin";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await adminApi.login(username.trim(), password);
      setAdminToken(res.access_token);
      router.replace("/admin");
    } catch (e) {
      setErr(
        e instanceof AdminApiError
          ? e.message
          : "Could not reach the admin service."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FBFAF7] px-4">
      <div className="mkt-dotgrid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
      <div className="motion-spring relative w-full max-w-md rounded-3xl border border-white/60 bg-white/70 p-8 shadow-[0_24px_70px_-24px_rgba(24,24,40,0.25)] backdrop-blur-2xl transition-all duration-500">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-semibold text-zinc-950"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950 text-sm font-bold text-white">
            Z
          </span>
          ZEVQYN
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[11px] font-semibold text-indigo-700">
            ADMIN
          </span>
        </Link>
        <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight text-zinc-950">
          Admin sign in
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Restricted area. Sign in with your admin ID and password.
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-id">Admin ID</Label>
            <Input
              id="admin-id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="Your admin ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pw">Password</Label>
            <PasswordInput
              id="admin-pw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          {err && (
            <p className="text-sm text-rose-600" role="alert">
              {err}
            </p>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Sign in to admin"}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-zinc-400">
          Not an admin?{" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
