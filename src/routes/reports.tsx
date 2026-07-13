import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Target, Download, Calendar } from "lucide-react";
import { PageHeader, GlassCard, StatCard, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — UniqueCRM" },
      { name: "description", content: "Analytics on revenue, pipeline, and team performance." },
    ],
  }),
  component: ReportsPage,
});

const MONTHLY = [
  { m: "Jan", v: 62 }, { m: "Feb", v: 78 }, { m: "Mar", v: 71 },
  { m: "Apr", v: 92 }, { m: "May", v: 108 }, { m: "Jun", v: 124 },
  { m: "Jul", v: 141 },
];
const SOURCES = [
  { label: "Referral", pct: 32, color: "oklch(0.68 0.24 310)" },
  { label: "Website", pct: 26, color: "oklch(0.72 0.25 340)" },
  { label: "Outbound", pct: 18, color: "oklch(0.65 0.22 280)" },
  { label: "Events", pct: 14, color: "oklch(0.78 0.18 20)" },
  { label: "Ads", pct: 10, color: "oklch(0.60 0.20 220)" },
];
const WON_LOST = [
  { m: "Feb", won: 14, lost: 6 }, { m: "Mar", won: 18, lost: 5 },
  { m: "Apr", won: 22, lost: 8 }, { m: "May", won: 27, lost: 6 },
  { m: "Jun", won: 31, lost: 9 }, { m: "Jul", won: 38, lost: 7 },
];
const TEAM = [
  { name: "Ava Reynolds", tone: 0, quota: 100, actual: 128 },
  { name: "Marcus Chen", tone: 1, quota: 100, actual: 96 },
  { name: "Priya Natarajan", tone: 2, quota: 100, actual: 112 },
  { name: "Diego Alvarez", tone: 3, quota: 100, actual: 74 },
  { name: "Sofia Petrov", tone: 4, quota: 100, actual: 88 },
];

function ReportsPage() {
  const [range, setRange] = useState("Last 6 months");

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Everything that matters, at a glance."
        actions={
          <>
            <button className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm">
              <Calendar className="h-4 w-4" /> {range}
            </button>
            <button className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm">
              <Download className="h-4 w-4" /> Export
            </button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Revenue (MTD)" value="$141k" delta="+18.4%" icon={<DollarSign className="h-4 w-4" />} />
        <StatCard label="Deals Won" value="38" delta="+22%" icon={<TrendingUp className="h-4 w-4" />} />
        <StatCard label="Deals Lost" value="7" delta="-12%" icon={<TrendingDown className="h-4 w-4" />} />
        <StatCard label="Quota Attainment" value="99.6%" delta="+4.1%" icon={<Target className="h-4 w-4" />} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider">Monthly Revenue</h3>
            <span className="text-xs text-muted-foreground">$k</span>
          </div>
          <AreaChart data={MONTHLY} />
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Lead Sources</h3>
          <Donut items={SOURCES} />
          <ul className="mt-4 space-y-2">
            {SOURCES.map((s) => (
              <li key={s.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="text-muted-foreground">{s.pct}%</span>
              </li>
            ))}
          </ul>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Deals Won vs Lost</h3>
          <WonLostChart data={WON_LOST} />
        </GlassCard>

        <GlassCard>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Sales Performance</h3>
          <div className="mb-3 text-3xl font-bold">99.6%</div>
          <div className="mb-4 text-xs text-muted-foreground">of team quota this period</div>
          <div className="h-3 overflow-hidden rounded-full bg-white/5">
            <div className="h-full rounded-full [background:var(--gradient-brand)] glow-shadow-sm" style={{ width: "99.6%" }} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 text-center">
            <div className="glass rounded-xl p-3">
              <div className="text-lg font-bold">$682k</div>
              <div className="text-xs text-muted-foreground">Closed</div>
            </div>
            <div className="glass rounded-xl p-3">
              <div className="text-lg font-bold">$214k</div>
              <div className="text-xs text-muted-foreground">Committed</div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-3">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Revenue by Employee</h3>
          <div className="space-y-3">
            {TEAM.map((t) => {
              const pct = Math.min(140, t.actual);
              return (
                <div key={t.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar name={t.name} tone={t.tone} />
                    <span className="truncate text-sm font-medium">{t.name}</span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full [background:var(--gradient-brand)] glow-shadow-sm transition-all"
                      style={{ width: `${(pct / 140) * 100}%` }}
                    />
                  </div>
                  <span className="w-14 text-right text-sm font-semibold">{t.actual}%</span>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function AreaChart({ data }: { data: { m: string; v: number }[] }) {
  const w = 640, h = 200, pad = 30;
  const max = Math.max(...data.map((d) => d.v)) * 1.15;
  const step = (w - pad * 2) / (data.length - 1);
  const pts = data.map((d, i) => [pad + i * step, h - pad - (d.v / max) * (h - pad * 2)] as const);
  const line = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${h - pad} L${pts[0][0]},${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
      <defs>
        <linearGradient id="rev-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.24 310)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.72 0.25 340)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="rev-line" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.24 310)" />
          <stop offset="100%" stopColor="oklch(0.72 0.25 340)" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#rev-fill)" />
      <path d={line} fill="none" stroke="url(#rev-line)" strokeWidth="2.5" />
      {pts.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3.5" fill="oklch(0.72 0.25 340)" />
          <text x={x} y={h - 8} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">{data[i].m}</text>
        </g>
      ))}
    </svg>
  );
}

function Donut({ items }: { items: { label: string; pct: number; color: string }[] }) {
  const size = 160, r = 60, cx = size / 2, cy = size / 2;
  let cursor = 0;
  const total = items.reduce((s, i) => s + i.pct, 0);
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="mx-auto h-40 w-40">
      {items.map((it) => {
        const frac = it.pct / total;
        const start = cursor * Math.PI * 2 - Math.PI / 2;
        cursor += frac;
        const end = cursor * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
        const large = frac > 0.5 ? 1 : 0;
        return (
          <path
            key={it.label}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`}
            fill={it.color}
            opacity="0.9"
          />
        );
      })}
      <circle cx={cx} cy={cy} r={38} fill="var(--card)" />
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6">Total</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor">100%</text>
    </svg>
  );
}

function WonLostChart({ data }: { data: { m: string; won: number; lost: number }[] }) {
  const w = 640, h = 220, pad = 30;
  const max = Math.max(...data.map((d) => d.won + d.lost)) * 1.2;
  const bw = (w - pad * 2) / data.length;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-56 w-full">
      <defs>
        <linearGradient id="won" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.24 310)" />
          <stop offset="100%" stopColor="oklch(0.72 0.25 340)" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const x = pad + i * bw + bw * 0.15;
        const wonH = (d.won / max) * (h - pad * 2);
        const lostH = (d.lost / max) * (h - pad * 2);
        const barW = bw * 0.32;
        return (
          <g key={d.m}>
            <rect x={x} y={h - pad - wonH} width={barW} height={wonH} rx="4" fill="url(#won)" />
            <rect x={x + barW + 4} y={h - pad - lostH} width={barW} height={lostH} rx="4" fill="oklch(1 0 0 / 0.12)" />
            <text x={x + barW + 2} y={h - 8} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.5">{d.m}</text>
          </g>
        );
      })}
      <g transform={`translate(${pad}, 10)`}>
        <rect width="10" height="10" rx="2" fill="url(#won)" />
        <text x="14" y="9" fontSize="10" fill="currentColor" opacity="0.7">Won</text>
        <rect x="52" width="10" height="10" rx="2" fill="oklch(1 0 0 / 0.15)" />
        <text x="66" y="9" fontSize="10" fill="currentColor" opacity="0.7">Lost</text>
      </g>
    </svg>
  );
}
