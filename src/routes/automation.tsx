import { createFileRoute } from "@tanstack/react-router";
import { Workflow, Zap, GitBranch, Timer } from "lucide-react";
import { PageHeader, GlassCard, Badge } from "@/components/crm-ui";

export const Route = createFileRoute("/automation")({
  head: () => ({ meta: [{ title: "Automation — UniqueCRM" }, { name: "description", content: "Workflow automation and rules." }] }),
  component: AutomationPage,
});

const templates = [
  { icon: Zap, name: "Auto-assign new leads", desc: "Round-robin new leads to available reps." },
  { icon: Timer, name: "Follow-up reminders", desc: "Create a task 3 days after a proposal is sent." },
  { icon: GitBranch, name: "Stage change alerts", desc: "Notify the deal owner on Won/Lost transitions." },
  { icon: Workflow, name: "Onboarding sequence", desc: "Trigger a 4-week welcome email flow on Won deals." },
];

function AutomationPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader title="Automation" subtitle="Workflow rules and no-code sequences" actions={<Badge tone="warning">Coming Soon</Badge>} />

      <GlassCard className="mb-6">
        <div className="flex flex-wrap items-start gap-4">
          <div className="gradient-brand-bg glow-shadow grid h-14 w-14 place-items-center rounded-2xl text-white"><Workflow className="h-7 w-7" /></div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold">Automation engine — integration required</h2>
            <p className="mt-1 text-sm text-muted-foreground">Rule builder UI is in progress. Templates below preview the shape of the finished product.</p>
          </div>
        </div>
      </GlassCard>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Template library</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {templates.map((t, i) => (
          <GlassCard key={i}>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-brand-bg text-white glow-shadow-sm"><t.icon className="h-5 w-5" /></div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
              </div>
              <Badge tone="default">Preview</Badge>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
