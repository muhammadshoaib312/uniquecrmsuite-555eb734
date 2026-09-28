import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader, GlassCard } from "@/components/crm-ui";

export const Route = createFileRoute("/inbox")({
  head: () => ({
    meta: [
      { title: "Inbox — UniqueCRM" },
      { name: "description", content: "Unified inbox for every conversation." },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Inbox" subtitle="Unified email, chat, and calls" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        <GlassCard className="!p-3">
          <div className="relative mb-3">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Search inbox" className="h-9 w-full rounded-lg border-0 bg-white/5 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--ring)]" />
          </div>
          <p className="py-12 text-center text-sm text-muted-foreground">No conversations yet.</p>
        </GlassCard>
        <GlassCard className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">
          Select a conversation to read it.
        </GlassCard>
      </div>
    </div>
  );
}
