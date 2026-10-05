"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState, ErrorState, LoadingState } from "@/components/PageStates";
import type { ContactMessage } from "@/lib/api/admin";

interface InboxPanelProps {
  queryKey: string[];
  fetchMessages: () => Promise<ContactMessage[]>;
  updateMessage: (id: string, body: { status: string }) => Promise<unknown>;
}

/** Shared contact-inbox UI. Used by both the legacy /app/admin/inbox page
 *  (Supabase admin-role token) and the new /admin/inbox page (admin JWT). */
export function InboxPanel({ queryKey, fetchMessages, updateMessage }: InboxPanelProps) {
  const qc = useQueryClient();
  const q = useQuery({ queryKey, queryFn: fetchMessages });
  const [search, setSearch] = useState("");

  const upd = useMutation({
    mutationFn: (v: { id: string; status: string }) => updateMessage(v.id, { status: v.status }),
    onSuccess: () => qc.invalidateQueries({ queryKey }),
  });

  if (q.isLoading) return <LoadingState />;
  if (q.error)
    return <ErrorState message="Admin access required or failed to load inbox." />;

  const list = (q.data || []).filter(
    (m) =>
      (m.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-zinc-950">
        Admin Inbox
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Contact messages. Visible only to admins.
      </p>
      <Input
        className="mt-5 max-w-sm"
        placeholder="Search messages…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {!list.length ? (
        <div className="mt-5">
          <EmptyState
            title="No messages"
            desc="New contact submissions will appear here."
          />
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-zinc-900/[0.06] rounded-2xl border border-zinc-900/[0.08] bg-white/80 shadow-sm backdrop-blur-xl">
          {list.map((m) => (
            <li key={m.id} className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium text-zinc-900">
                  {m.name}{" "}
                  <span className="text-sm font-normal text-zinc-500">· {m.subject}</span>
                </p>
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                  {m.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-500">{m.message}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["read", "replied", "archived"].map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant="outline"
                    disabled={upd.isPending}
                    onClick={() => upd.mutate({ id: m.id, status: s })}
                  >
                    {s}
                  </Button>
                ))}
                {m.email && (
                  <a href={`mailto:${m.email}`}>
                    <Button size="sm">Reply</Button>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
