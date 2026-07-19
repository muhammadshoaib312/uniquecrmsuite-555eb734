import { createFileRoute } from "@tanstack/react-router";
import { Bot, Sparkles, BookOpen, MessageSquare, Users } from "lucide-react";
import { PageHeader, GlassCard, Badge } from "@/components/crm-ui";

export const Route = createFileRoute("/ai-assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — UniqueCRM" }, { name: "description", content: "AI assistant for CRM — coming soon." }] }),
  component: AIAssistantPage,
});

function AIAssistantPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="AI Assistant" subtitle="Conversational AI grounded in your CRM data" actions={<Badge tone="warning">Development Preview</Badge>} />

      <GlassCard className="mb-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="gradient-brand-bg glow-shadow grid h-14 w-14 place-items-center rounded-2xl text-white"><Bot className="h-7 w-7" /></div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">Not yet connected</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The AI Assistant module is scaffolded and ready to plug into a real model. No fake responses are generated — the flow below shows the intended architecture.
            </p>
          </div>
        </div>
      </GlassCard>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Planned flow</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {[
          { icon: MessageSquare, label: "Customer message", desc: "Inbound question via chat or email" },
          { icon: Bot, label: "AI Assistant", desc: "Interprets intent and context" },
          { icon: BookOpen, label: "Knowledge base", desc: "Retrieves grounded answers" },
          { icon: Sparkles, label: "AI response", desc: "Drafts reply with confidence score" },
          { icon: Users, label: "Human handoff", desc: "Escalates when confidence is low" },
        ].map((s, i) => (
          <GlassCard key={i} className="text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl gradient-brand-bg text-white glow-shadow-sm"><s.icon className="h-5 w-5" /></div>
            <p className="mt-3 text-sm font-semibold">{s.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold">Try the assistant</p>
            <p className="mt-1 text-xs text-muted-foreground">Coming soon — requires backend + model provider integration.</p>
          </div>
          <button disabled className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-muted-foreground opacity-60">Integration required</button>
        </div>
      </GlassCard>
    </div>
  );
}
