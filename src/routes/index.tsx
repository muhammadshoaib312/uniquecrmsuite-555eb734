import { createFileRoute, Link } from "@tanstack/react-router";
import {
  DollarSign,
  Users,
  Target,
  CheckSquare,
  ArrowUpRight,
  Video,
  Phone,
  UserPlus,
  CalendarPlus,
  ListPlus,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { PageHeader, StatCard, GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { useGlobalIndex, type IndexedRecord } from "@/lib/global-index";

const fmtCurrency = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(1)}K`
      : `$${n}`;

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Dashboard — UniqueCRM" },
    { name: "description", content: "View your saved leads, deals, tasks, and meetings in UniqueCRM." },
    { property: "og:title", content: "Dashboard — UniqueCRM" },
    { property: "og:description", content: "View your saved leads, deals, tasks, and meetings in UniqueCRM." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Dashboard,
});

// The global index also includes built-in sample rows. Keep those available elsewhere,
// but never count or display them as real activity on the dashboard.
const sampleIds: Record<string, Set<string>> = {
  leads: new Set(["L-1042", "L-1041", "L-1040", "L-1039", "L-1038", "L-1037", "L-1036", "L-1035", "L-2201", "L-2202", "L-2203"]),
  deals: new Set([...Array.from({ length: 14 }, (_, i) => `d${i + 1}`), "dd1", "dd2", "dd3", "dd4"]),
  tasks: new Set(["1", "2", "3", "4", "5", "td1", "td2", "td3"]),
  meetings: new Set(["m1", "m2", "m3", "m4", "md1", "md2"]),
};

function savedRecords(items: IndexedRecord[], module: IndexedRecord["module"]) {
  return items.filter((item) => item.module === module && !sampleIds[module]?.has(item.id.slice(module.length + 1)));
}

function Dashboard() {
  const index = useGlobalIndex();
  const leads = savedRecords(index, "leads");
  const deals = savedRecords(index, "deals");
  const tasks = savedRecords(index, "tasks");
  const meetings = savedRecords(index, "meetings");
  const today = new Date().toLocaleDateString("en-CA");
  const openDeals = deals.filter((d) => !/won|lost/i.test(String(d.raw.stage ?? "")));
  const wonDeals = deals.filter((d) => /won/i.test(String(d.raw.stage ?? "")));
  const lostDeals = deals.filter((d) => /lost/i.test(String(d.raw.stage ?? "")));
  const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.raw.value ?? 0), 0);
  const wonValue = wonDeals.reduce((sum, d) => sum + Number(d.raw.value ?? 0), 0);
  const overdue = tasks.filter((t) => String(t.raw.due ?? "") < today && Boolean(t.raw.due) && t.raw.status !== "Completed").length;
  const dueToday = tasks.filter((t) => t.raw.due === today && t.raw.status !== "Completed").length;
  const closedDeals = wonDeals.length + lostDeals.length;
  const winRate = closedDeals ? Math.round(wonDeals.length / closedDeals * 100) : 0;
  const stages = ["New Lead", "Qualified", "Proposal Sent", "Negotiation", "Won"];
  const pipelineStages = stages.map((name) => {
    const entries = deals.filter((d) => name === "New Lead" ? /^(new|new lead)$/i.test(String(d.raw.stage)) : name === "Proposal Sent" ? /proposal/i.test(String(d.raw.stage)) : d.raw.stage === name);
    const value = entries.reduce((sum, d) => sum + Number(d.raw.value ?? 0), 0);
    return { name, count: entries.length, value: fmtCurrency(value), pct: deals.length ? entries.length / deals.length * 100 : 0 };
  });
  const activities = [...leads, ...deals, ...tasks, ...meetings].slice(0, 5);
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Dashboard"
        subtitle="Your workspace at a glance."
        actions={
          <Link to="/reports" className="gradient-brand-bg glow-shadow-sm hidden items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] sm:inline-flex">
            <ArrowUpRight className="h-4 w-4" />
            View report
          </Link>
        }
      />

      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Leads" value={String(leads.length)} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Open Deals" value={String(openDeals.length)} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Revenue Won" value={fmtCurrency(wonValue)} icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Tasks Due Today" value={String(dueToday)} icon={<CheckSquare className="h-5 w-5" />} />
      </div>

      {/* Sales Pipeline + Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sales Pipeline</h2>
              <p className="text-xs text-muted-foreground">{fmtCurrency(pipelineValue)} in open opportunities</p>
            </div>
            <span className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground">All deals</span>
          </div>

          {/* Funnel bars */}
          <div className="space-y-3">
            {pipelineStages.map((s, i) => (
              <div key={s.name}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        background: `linear-gradient(135deg, oklch(0.68 0.24 ${310 + i * 8}), oklch(0.72 0.25 ${340 + i * 4}))`,
                        boxShadow: "0 0 8px oklch(0.72 0.25 325 / 0.6)",
                      }}
                    />
                    <span className="font-medium">{s.name}</span>
                    <span className="text-muted-foreground">· {s.count} deals</span>
                  </div>
                  <span className="gradient-text font-semibold">{s.value}</span>
                </div>
                <div className="relative h-3 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${s.pct}%`,
                      background: `linear-gradient(90deg, oklch(0.68 0.24 310), oklch(0.72 0.25 ${330 + i * 4}))`,
                      boxShadow: "0 0 16px oklch(0.72 0.25 325 / 0.55)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Revenue trend frame: no fabricated series when there is no historical data. */}
          <div className="mt-6 border-t border-white/5 pt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium">Revenue trend · 12 months</span>
            </div>
            <div className="flex h-32 items-center justify-center border-b border-white/5 text-xs text-muted-foreground">No revenue history yet</div>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="relative overflow-hidden">
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-pink)]" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>

            <div className="space-y-2.5">
              <QuickAction icon={UserPlus} label="Create Lead" desc="Capture a new prospect" module="leads" />
              <QuickAction icon={ListPlus} label="Create Task" desc="Add a follow-up to your list" module="tasks" />
              <QuickAction icon={CalendarPlus} label="Create Meeting" desc="Book a call or demo" module="meetings" />
            </div>

            <div className="glass mt-5 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Win rate
                  </p>
                  <p className="mt-1 text-2xl font-bold gradient-text">{winRate}%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Closed deals</p>
                  <p className="text-sm font-semibold">{wonDeals.length} won / {closedDeals} total</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${winRate}%`,
                    background: "var(--gradient-brand)",
                  }}
                />
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Activities + Meetings */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activities</h2>
            <Link to="/activities" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
          </div>
          {activities.length ? <ul className="space-y-4">
            {activities.map((a, i) => (
              <li key={a.id} className="flex items-start gap-3">
                <Avatar name={a.title} tone={i} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{a.title}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {a.module === "deals" ? String(a.raw.stage ?? "Deal") : a.module === "tasks" ? String(a.raw.status ?? "Task") : a.module === "meetings" ? String(a.raw.time ?? "Meeting") : String(a.raw.created ?? "Lead")}
                  </p>
                </div>
                <Badge tone="default">{a.module.slice(0, -1)}</Badge>
              </li>
            ))}
          </ul> : <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">No activity yet</div>}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
            <Link to="/calendar" className="text-xs text-muted-foreground hover:text-foreground">Calendar</Link>
          </div>
          {meetings.length ? <ul className="space-y-3">
            {meetings.slice(0, 4).map((m) => {
              const Icon = m.raw.type === "Call" ? Phone : m.raw.type === "Onsite" ? MapPin : Video;
              return (
                <li
                  key={m.id}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.05]"
                >
                  <div className="gradient-brand-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {String(m.raw.time ?? "")} {m.raw.with ? `· with ${m.raw.with}` : ""}
                    </p>
                  </div>
                  <Badge tone="default">{String(m.raw.type ?? "Meeting")}</Badge>
                </li>
              );
            })}
          </ul> : <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">No meetings scheduled</div>}
        </GlassCard>
      </div>

      {/* Latest Leads */}
      <GlassCard className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Latest Leads</h2>
            <p className="text-xs text-muted-foreground">Recently added prospects</p>
          </div>
          <Link to="/leads" className="glass rounded-lg px-3 py-1.5 text-xs font-medium">View all</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Lead</th>
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Source</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((l, i) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={l.title} tone={i} />
                      <span className="font-medium">{l.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{String(l.raw.company ?? "—")}</td>
                  <td className="py-3 pr-4">
                    <Badge tone="default">{String(l.raw.source ?? "—")}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <Badge tone="default">{String(l.raw.status ?? "New")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!leads.length && <div className="flex min-h-32 items-center justify-center text-sm text-muted-foreground">No leads yet</div>}
        </div>
      </GlassCard>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  desc,
  module,
}: {
  icon: typeof UserPlus;
  label: string;
  desc: string;
  module: string;
}) {
  return (
    <button onClick={() => window.dispatchEvent(new CustomEvent("uniquecrm:open-create", { detail: module }))} className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-white/10 hover:bg-white/[0.05]">
      <div className="gradient-brand-bg grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white transition-transform group-hover:scale-105 group-hover:glow-shadow-sm">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </button>
  );
}
