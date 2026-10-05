"use client";

import { InboxPanel } from "@/components/admin/InboxPanel";
import { adminApi } from "@/lib/api/admin";

export default function PanelInbox() {
  return (
    <InboxPanel
      queryKey={["panel-messages"]}
      fetchMessages={adminApi.messages}
      updateMessage={adminApi.updateMessage}
    />
  );
}
