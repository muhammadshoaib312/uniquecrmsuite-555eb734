import { createFileRoute } from "@tanstack/react-router";
import {
  DollarSign,
  Users,
  Target,
  CheckSquare,
  ArrowUpRight,
  MoreHorizontal,
  Video,
  Phone,
  UserPlus,
  CalendarPlus,
  ListPlus,
  Clock,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHeader, StatCard, GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { useDashboardMetrics } from "@/lib/global-index";

const fmtCurrency = (n: number) =>
  n >= 1_000_000
    ? `$${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
      ? `$${(n / 1_000).toFixed(1)}K`
      : `$${n}`;

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const pipelineStages = [
  { name: "Lead", count: 42, value: "$128K", pct: 100 },
  { name: "Qualified", count: 28, value: "$264K", pct: 78 },
  { name: "Proposal", count: 14, value: "$412K", pct: 58 },
  { name: "Negotiation", count: 8, value: "$298K", pct: 38 },
  { name: "Won", count: 12, value: "$186K", pct: 22 },
];

const activities = [
  { user: "Ava Chen", action: "closed deal with", target: "Initech", time: "12m ago", tone: "success" as const },
  { user: "Liam Patel", action: "called", target: "Sarah at Acme Corp", time: "1h ago", tone: "info" as const },
  { user: "Sofia Reyes", action: "sent proposal to", target: "Globex", time: "3h ago", tone: "brand" as const },
  { user: "Noah Kim", action: "scheduled demo with", target: "Umbrella Co.", time: "Yesterday", tone: "warning" as const },
  { user: "Ava Chen", action: "added note on", target: "Stark Industries", time: "Yesterday", tone: "default" as const },
];

const meetings = [
  { title: "Demo — Umbrella Co.", time: "Today, 2:00 PM", type: "Video", icon: Video, with: "Emma Wilson" },
  { title: "Discovery call — Hooli", time: "Today, 4:30 PM", type: "Call", icon: Phone, with: "Lucas Meyer" },
  { title: "QBR — Acme Corp", time: "Tomorrow, 10:00 AM", type: "Video", icon: Video, with: "Sarah Johnson" },
  { title: "Onsite — Stark Industries", time: "Aug 16, 9:00 AM", type: "Onsite", icon: MapPin, with: "James O'Brien" },
];

const leads = [
  { name: "Priya Nair", company: "Northwind", source: "Website", score: 92, tone: "brand" as const },
  { name: "Michael Chen", company: "Globex", source: "Referral", score: 88, tone: "success" as const },
  { name: "James O'Brien", company: "Stark Industries", source: "LinkedIn", score: 76, tone: "info" as const },
  { name: "Aiko Tanaka", company: "Wayne Enterprises", source: "Event", score: 71, tone: "info" as const },
  { name: "Lucas Meyer", company: "Hooli", source: "Cold outbound", score: 54, tone: "warning" as const },
];

function Dashboard() {
  const m = useDashboardMetrics();
  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Welcome back, Ava"
        subtitle="Here's what's happening across your pipeline today."
        actions={
          <button className="gradient-brand-bg glow-shadow-sm hidden items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] sm:inline-flex">
            <ArrowUpRight className="h-4 w-4" />
            View report
          </button>
        }
      />

      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Leads" value={m.totalLeads.toLocaleString()} delta={`${m.qualifiedLeads} qualified`} icon={<Users className="h-5 w-5" />} />
        <StatCard label="Open Deals" value={m.openDeals.toLocaleString()} delta={fmtCurrency(m.pipelineValue) + " in pipeline"} icon={<Target className="h-5 w-5" />} />
        <StatCard label="Revenue Won" value={fmtCurrency(m.wonValue)} delta="+ all time" icon={<DollarSign className="h-5 w-5" />} />
        <StatCard label="Tasks Due Today" value={m.tasksDueToday.toString()} delta={`${m.overdueTasks} overdue`} icon={<CheckSquare className="h-5 w-5" />} />
      </div>

      {/* Sales Pipeline + Quick Actions */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sales Pipeline</h2>
              <p className="text-xs text-muted-foreground">$1.28M in open opportunities</p>
            </div>
            <button className="glass rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
              This quarter
            </button>
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

          {/* Revenue trend */}
          <div className="mt-6 border-t border-white/5 pt-5">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium">Revenue trend · 12 months</span>
              <span className="gradient-text inline-flex items-center gap-1 font-semibold">
                <TrendingUp className="h-3 w-3" />
                +22.4% YoY
              </span>
            </div>
            <svg viewBox="0 0 600 140" className="h-32 w-full">
              <defs>
                <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.72 0.25 340)" stopOpacity="0.55" />
                  <stop offset="100%" stopColor="oklch(0.68 0.24 310)" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="stroke" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor="oklch(0.68 0.24 310)" />
                  <stop offset="100%" stopColor="oklch(0.72 0.25 340)" />
                </linearGradient>
              </defs>
              <path
                d="M0,110 C60,90 100,100 160,75 C220,50 260,85 320,60 C380,35 420,65 480,40 C540,20 580,30 600,18 L600,140 L0,140 Z"
                fill="url(#area)"
              />
              <path
                d="M0,110 C60,90 100,100 160,75 C220,50 260,85 320,60 C380,35 420,65 480,40 C540,20 580,30 600,18"
                fill="none"
                stroke="url(#stroke)"
                strokeWidth="2.5"
                style={{ filter: "drop-shadow(0 2px 8px oklch(0.72 0.25 340 / 0.6))" }}
              />
              {[
                [0, 110], [160, 75], [320, 60], [480, 40], [600, 18],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="oklch(0.72 0.25 340)" style={{ filter: "drop-shadow(0 0 6px oklch(0.72 0.25 340))" }} />
              ))}
            </svg>
          </div>
        </GlassCard>

        {/* Quick Actions */}
        <GlassCard className="relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-16 -right-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
            style={{ background: "var(--gradient-brand)" }}
          />
          <div className="relative">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[color:var(--brand-pink)]" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>

            <div className="space-y-2.5">
              <QuickAction icon={UserPlus} label="Create Lead" desc="Capture a new prospect" />
              <QuickAction icon={ListPlus} label="Create Task" desc="Add a follow-up to your list" />
              <QuickAction icon={CalendarPlus} label="Create Meeting" desc="Book a call or demo" />
            </div>

            <div className="glass mt-5 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Win rate
                  </p>
                  <p className="mt-1 text-2xl font-bold gradient-text">42%</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Quota</p>
                  <p className="text-sm font-semibold">$1.2M / $2M</p>
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "60%",
                    background: "var(--gradient-brand)",
                    boxShadow: "0 0 16px oklch(0.72 0.25 340 / 0.6)",
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
            <button className="text-xs text-muted-foreground hover:text-foreground">View all</button>
          </div>
          <ul className="space-y-4">
            {activities.map((a, i) => (
              <li key={i} className="flex items-start gap-3">
                <Avatar name={a.user} tone={i} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="font-medium">{a.target}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {a.time}
                  </p>
                </div>
                <Badge tone={a.tone}>{a.tone === "success" ? "Won" : a.tone === "brand" ? "Sent" : a.tone === "info" ? "Call" : a.tone === "warning" ? "Meeting" : "Note"}</Badge>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Meetings</h2>
            <button className="text-xs text-muted-foreground hover:text-foreground">Calendar</button>
          </div>
          <ul className="space-y-3">
            {meetings.map((m) => {
              const Icon = m.icon;
              return (
                <li
                  key={m.title}
                  className="group flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition hover:border-white/10 hover:bg-white/[0.05]"
                >
                  <div className="gradient-brand-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {m.time} · with {m.with}
                    </p>
                  </div>
                  <Badge tone="default">{m.type}</Badge>
                </li>
              );
            })}
          </ul>
        </GlassCard>
      </div>

      {/* Latest Leads */}
      <GlassCard className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Latest Leads</h2>
            <p className="text-xs text-muted-foreground">Freshest prospects, ranked by lead score</p>
          </div>
          <button className="glass rounded-lg px-3 py-1.5 text-xs font-medium">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Lead</th>
                <th className="pb-3 pr-4 font-medium">Company</th>
                <th className="pb-3 pr-4 font-medium">Source</th>
                <th className="pb-3 pr-4 font-medium">Score</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {leads.map((l, i) => (
                <tr key={l.name} className="border-t border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} tone={i} />
                      <span className="font-medium">{l.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{l.company}</td>
                  <td className="py-3 pr-4">
                    <Badge tone={l.tone}>{l.source}</Badge>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${l.score}%`,
                            background: "var(--gradient-brand)",
                            boxShadow: "0 0 10px oklch(0.72 0.25 340 / 0.5)",
                          }}
                        />
                      </div>
                      <span className="font-semibold">{l.score}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  desc,
}: {
  icon: typeof UserPlus;
  label: string;
  desc: string;
}) {
  return (
    <button className="group flex w-full items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-left transition hover:border-white/10 hover:bg-white/[0.05]">
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
