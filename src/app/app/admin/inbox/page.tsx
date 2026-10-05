"use client";

import { InboxPanel } from "@/components/admin/InboxPanel";
import { api } from "@/lib/api/services";

/** Legacy inbox — gated by the Supabase app_metadata.role == "admin" token.
 *  Kept working alongside the new /admin panel (see backend docs/ADMIN.md). */
export default function AdminInbox() {
  return (
    <InboxPanel
      queryKey={["admin-messages"]}
      fetchMessages={api.adminMessages}
      updateMessage={api.adminUpdateMessage}
    />
  );
}
