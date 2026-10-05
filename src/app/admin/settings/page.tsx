"use client";

import { useState } from "react";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/PasswordInput";
import { AdminApiError, adminApi } from "@/lib/api/admin";

export default function AdminSecurity() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setOk("");
    if (next !== confirm) {
      setErr("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      setErr("New password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await adminApi.changePassword(current, next);
      setOk("Admin password updated successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (e) {
      setErr(
        e instanceof AdminApiError ? e.message : "Could not update the password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-950">
        Security
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Change the admin panel password. Do this right after first setup.
      </p>

      <div className="motion-spring mt-8 rounded-3xl border border-white/60 bg-white/70 p-6 shadow-[0_16px_40px_-20px_rgba(24,24,40,0.25)] backdrop-blur-2xl transition-all duration-500 md:p-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
            <KeyRound className="h-5 w-5" />
          </span>
          <h2 className="font-display text-lg font-semibold tracking-tight text-zinc-950">
            Change admin password
          </h2>
        </div>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sec-current">Current password</Label>
            <PasswordInput
              id="sec-current"
              required
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sec-new">New password (min 8 characters)</Label>
            <PasswordInput
              id="sec-new"
              required
              minLength={8}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sec-confirm">Confirm new password</Label>
            <PasswordInput
              id="sec-confirm"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </div>
          {err && (
            <p className="text-sm text-rose-600" role="alert">
              {err}
            </p>
          )}
          {ok && (
            <p className="flex items-center gap-2 text-sm text-emerald-700" role="status">
              <ShieldCheck className="h-4 w-4" />
              {ok}
            </p>
          )}
          <Button type="submit" disabled={loading}>
            {loading ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>

      <div className="mt-6 rounded-3xl border border-amber-200/60 bg-amber-50/70 p-5 text-sm text-amber-800 backdrop-blur-xl">
        <p className="font-medium">Keep this credential private.</p>
        <p className="mt-1 text-amber-700">
          Anyone with the admin ID and password gets full control over users
          and the inbox. After changing it here, you can remove the initial
          password from your Render environment variables.
        </p>
      </div>
    </div>
  );
}
