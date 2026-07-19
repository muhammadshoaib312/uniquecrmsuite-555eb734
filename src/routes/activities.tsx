import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, UserPlus, Target, CheckSquare, CalendarDays, Building2, Users } from "lucide-react";
import { PageHeader, GlassCard, Badge } from "@/components/crm-ui";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/activities")({
  head: () => ({
    meta: [
      { title: "Activities — UniqueCRM" },
      { name: "description", content: "Chronological feed of everything happening in your workspace." },
    ],
  }),
  component: ActivitiesPage,
});

type Kind = "lead" | "deal" | "task" | "meeting" | "contact" | "company";
type Item = { id: string; kind: Kind; title: string; when: number; meta?: string };

const kindMeta: Record<Kind, { icon: typeof Activity; label: string; tone: "brand" | "info" | "warning" | "success" | "default" }> = {
  lead: { icon: UserPlus, label: "Lead", tone: "brand" },
  deal: { icon: Target, label: "Deal", tone: "info" },
  task: { icon: CheckSquare, label: "Task", tone: "warning" },
  meeting: { icon: CalendarDays, label: "Meeting", tone: "success" },
  contact: { icon: Users, label: "Contact", tone: "default" },
  company: { icon: Building2, label: "Company", tone: "default" },
};

function readStore<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function collect(): Item[] {
  if (typeof window === "undefined") return [];
  const items: Item[] = [];
  const now = Date.now();
  readStore<{ id: string; name: string; company: string }>("uniquecrm-leads-added").forEach((l, i) =>
    items.push({ id: `l-${l.id}`, kind: "lead", title: `New lead: ${l.name}`, meta: l.company, when: now - i * 3600_000 }),
  );
  readStore<{ id: string; name: string; company: string }>("uniquecrm:contacts").forEach((c, i) =>
    items.push({ id: `c-${c.id}`, kind: "contact", title: `Contact added: ${c.name}`, meta: c.company, when: now - i * 5400_000 }),
  );
  readStore<{ id: string; name: string; industry?: string }>("uniquecrm:companies").forEach((c, i) =>
    items.push({ id: `co-${c.id}`, kind: "company", title: `Company added: ${c.name}`, meta: c.industry, when: now - i * 7200_000 }),
  );
  readStore<{ id: string; title: string; status?: string }>("uniquecrm:tasks").forEach((t, i) =>
    items.push({ id: `t-${t.id}`, kind: "task", title: `Task: ${t.title}`, meta: t.status, when: now - i * 4800_000 }),
  );
  readStore<{ id: string; title: string; time?: string }>("uniquecrm:meetings").forEach((m, i) =>
    items.push({ id: `m-${m.id}`, kind: "meeting", title: `Meeting scheduled: ${m.title}`, meta: m.time, when: now - i * 6000_000 }),
  );
  try {
    const board = JSON.parse(window.localStorage.getItem("uniquecrm:deals-board") || "{}");
    Object.entries(board).forEach(([stage, list]) => {
      if (!Array.isArray(list)) return;
      list.forEach((d: { id: string; company: string; value: number }, i: number) =>
        items.push({ id: `d-${d.id}`, kind: "deal", title: `Deal in ${stage}: ${d.company}`, meta: `$${d.value.toLocaleString()}`, when: now - i * 4200_000 }),
      );
    });
  } catch {}
  return items.sort((a, b) => b.when - a.when);
}

const SEED: Item[] = [
  { id: "s1", kind: "deal", title: "Deal moved to Negotiation: Globex", meta: "$67,200", when: Date.now() - 90 * 60_000 },
  { id: "s2", kind: "lead", title: "New lead: Priya Nair", meta: "Northwind", when: Date.now() - 3 * 3600_000 },
  { id: "s3", kind: "task", title: "Task completed: Send Northwind renewal proposal", meta: "Completed", when: Date.now() - 5 * 3600_000 },
  { id: "s4", kind: "meeting", title: "Meeting scheduled: Demo — Umbrella Co.", meta: "Today, 2:00 PM", when: Date.now() - 7 * 3600_000 },
  { id: "s5", kind: "contact", title: "Contact added: Emma Wilson", meta: "Umbrella Co.", when: Date.now() - 26 * 3600_000 },
];

function timeAgo(ts: number) {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function ActivitiesPage() {
  const [dynamic, setDynamic] = useState<Item[]>([]);
  const [filter, setFilter] = useState<Kind | "all">("all");

  useEffect(() => {
    const load = () => setDynamic(collect());
    load();
    const evts = ["uniquecrm:leads-changed", "uniquecrm:contacts-changed", "uniquecrm:companies-changed", "uniquecrm:tasks-changed", "uniquecrm:meetings-changed", "storage"];
    evts.forEach((e) => window.addEventListener(e, load));
    return () => evts.forEach((e) => window.removeEventListener(e, load));
  }, []);

  const all = useMemo(() => [...dynamic, ...SEED].sort((a, b) => b.when - a.when), [dynamic]);
  const filtered = filter === "all" ? all : all.filter((i) => i.kind === filter);

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="Activities" subtitle={`${all.length} events in your workspace timeline`} />

      <div className="mb-4 flex flex-wrap gap-2">
        {(["all", "lead", "deal", "task", "meeting", "contact", "company"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition ${
              filter === k ? "gradient-brand-bg text-white glow-shadow-sm" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {k === "all" ? "All" : `${kindMeta[k].label}s`}
          </button>
        ))}
      </div>

      <GlassCard>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Activity className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">No activity yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Create leads, tasks, or deals to build your timeline.</p>
          </div>
        ) : (
          <ol className="relative ml-3 space-y-4 border-l border-white/10 pl-6">
            {filtered.map((it) => {
              const Icon = kindMeta[it.kind].icon;
              return (
                <li key={it.id} className="relative">
                  <span className="absolute -left-[34px] top-0.5 grid h-6 w-6 place-items-center rounded-full gradient-brand-bg text-white glow-shadow-sm">
                    <Icon className="h-3 w-3" />
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{it.title}</p>
                    <Badge tone={kindMeta[it.kind].tone}>{kindMeta[it.kind].label}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {it.meta && <span>{it.meta} · </span>}
                    {timeAgo(it.when)}
                  </p>
                </li>
              );
            })}
          </ol>
        )}
      </GlassCard>

      <div className="mt-4 flex justify-end">
        <Button variant="secondary" onClick={() => setDynamic(collect())}>Refresh</Button>
      </div>
    </div>
  );
}
