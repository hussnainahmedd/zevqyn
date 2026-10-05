"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Ban, CheckCircle2, Search } from "lucide-react";
import {
  adminApi,
  clearAdminToken,
  AdminApiError,
  type AdminUser,
} from "@/lib/api/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordStrength, checkPassword } from "@/components/PasswordStrength";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { EmptyState, ErrorState, LoadingState } from "@/components/PageStates";

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "—" : d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AdminUsers() {
  const router = useRouter();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);
  const [formErr, setFormErr] = useState("");

  const q = useQuery({ queryKey: ["admin-users"], queryFn: () => adminApi.users(1, 100) });

  useEffect(() => {
    if (q.error instanceof AdminApiError && q.error.status === 401) {
      clearAdminToken();
      router.replace("/admin/login");
    }
  }, [q.error, router]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-users"] });

  const createMut = useMutation({
    mutationFn: (b: { email: string; password: string; full_name?: string }) =>
      adminApi.createUser(b),
    onSuccess: () => { setAddOpen(false); setFormErr(""); invalidate(); },
    onError: (e) => setFormErr(e instanceof Error ? e.message : "Failed to create user."),
  });

  const updateMut = useMutation({
    mutationFn: (v: { id: string; body: { email?: string; password?: string; banned?: boolean } }) =>
      adminApi.updateUser(v.id, v.body),
    onSuccess: () => { setEditUser(null); setFormErr(""); invalidate(); },
    onError: (e) => setFormErr(e instanceof Error ? e.message : "Failed to update user."),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => adminApi.deleteUser(id),
    onSuccess: () => { setDeleteUser(null); invalidate(); },
    onError: (e) => setFormErr(e instanceof Error ? e.message : "Failed to delete user."),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.error) return <ErrorState message="Could not load users." />;

  const list = (q.data || []).filter((u) =>
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.full_name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-950">
            Users
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {list.length} user{list.length === 1 ? "" : "s"} — add, edit, ban or remove.
          </p>
        </div>
        <Button onClick={() => { setFormErr(""); setAddOpen(true); }}>
          <Plus className="h-4 w-4" /> Add user
        </Button>
      </div>

      <div className="relative mt-6 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          className="pl-9"
          placeholder="Search by email or name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!list.length ? (
        <div className="mt-6">
          <EmptyState title="No users found" desc="Try a different search, or add the first user." />
        </div>
      ) : (
        <div className="motion-spring mt-6 overflow-hidden rounded-3xl border border-white/60 bg-white/70 shadow-[0_16px_40px_-20px_rgba(24,24,40,0.25)] backdrop-blur-2xl transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-900/[0.06] text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Joined</th>
                  <th className="px-5 py-3 font-medium">Last sign in</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/[0.05]">
                {list.map((u) => (
                  <tr key={u.id} className="transition-colors hover:bg-white/60">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-zinc-900">{u.full_name || "—"}</p>
                      <p className="text-xs text-zinc-500">{u.email || u.id.slice(0, 8)}</p>
                    </td>
                    <td className="px-5 py-3.5 text-zinc-500">{fmtDate(u.created_at)}</td>
                    <td className="px-5 py-3.5 text-zinc-500">{fmtDate(u.last_sign_in_at)}</td>
                    <td className="px-5 py-3.5">
                      {u.banned ? (
                        <Badge className="bg-rose-100 text-rose-700">Banned</Badge>
                      ) : (
                        <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          title={u.banned ? "Unban" : "Ban"}
                          onClick={() => updateMut.mutate({ id: u.id, body: { banned: !u.banned } })}
                        >
                          {u.banned ? <CheckCircle2 className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Edit"
                          onClick={() => { setFormErr(""); setEditUser(u); }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Delete"
                          className="hover:bg-rose-50 hover:text-rose-700"
                          onClick={() => { setFormErr(""); setDeleteUser(u); }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add user */}
      <Dialog open={addOpen} onClose={() => setAddOpen(false)} title="Add user manually">
        <AddUserForm
          error={formErr}
          pending={createMut.isPending}
          onSubmit={(b) => createMut.mutate(b)}
        />
      </Dialog>

      {/* Edit user */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} title="Edit user">
        {editUser && (
          <EditUserForm
            key={editUser.id}
            user={editUser}
            error={formErr}
            pending={updateMut.isPending}
            onSubmit={(b) => updateMut.mutate({ id: editUser.id, body: b })}
          />
        )}
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteUser} onClose={() => setDeleteUser(null)} title="Delete user">
        {deleteUser && (
          <div>
            <p className="text-sm text-zinc-600">
              Permanently delete{" "}
              <span className="font-semibold text-zinc-900">
                {deleteUser.email || deleteUser.id}
              </span>
              ? Their sign-in will stop working immediately. This cannot be undone.
            </p>
            {formErr && (
              <p className="mt-3 text-sm text-rose-600" role="alert">{formErr}</p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteUser(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteMut.isPending}
                onClick={() => deleteMut.mutate(deleteUser.id)}
              >
                {deleteMut.isPending ? "Deleting…" : "Delete permanently"}
              </Button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function AddUserForm({
  error,
  pending,
  onSubmit,
}: {
  error: string;
  pending: boolean;
  onSubmit: (b: { email: string; password: string; full_name?: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [localErr, setLocalErr] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const c = checkPassword(password);
        if (!c.valid) { setLocalErr("Password too weak: needs " + c.errors.join(", ") + "."); return; }
        setLocalErr("");
        onSubmit({ email: email.trim(), password, full_name: fullName.trim() || undefined });
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="nu-email">Email</Label>
        <Input id="nu-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nu-name">Full name (optional)</Label>
        <Input id="nu-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Doe" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nu-pw">Password</Label>
        <Input id="nu-pw" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        <PasswordStrength password={password} />
      </div>
      {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
      {localErr && <p className="text-sm text-rose-600" role="alert">{localErr}</p>}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Creating…" : "Create user"}</Button>
      </div>
      <p className="text-xs text-zinc-400">The account is email-confirmed immediately — the user can sign in right away.</p>
    </form>
  );
}

function EditUserForm({
  user,
  error,
  pending,
  onSubmit,
}: {
  user: AdminUser;
  error: string;
  pending: boolean;
  onSubmit: (b: { email?: string; password?: string }) => void;
}) {
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const body: { email?: string; password?: string } = {};
        if (email.trim() && email.trim() !== user.email) body.email = email.trim();
        if (password) body.password = password;
        onSubmit(body);
      }}
    >
      <div className="space-y-2">
        <Label htmlFor="eu-email">Email</Label>
        <Input id="eu-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="eu-pw">New password (leave blank to keep)</Label>
        <Input id="eu-pw" type="password" minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      {error && <p className="text-sm text-rose-600" role="alert">{error}</p>}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Save changes"}</Button>
      </div>
    </form>
  );
}
