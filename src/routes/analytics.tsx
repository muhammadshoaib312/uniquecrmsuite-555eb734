import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Target, DollarSign, Zap } from "lucide-react";
import { PageHeader, GlassCard, StatCard } from "@/components/crm-ui";
import { useGlobalIndex } from "@/lib/global-index";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [
    { title: "Analytics — UniqueCRM" },
    { name: "description", content: "Revenue, pipeline velocity, and team performance." },
    { property: "og:title", content: "Analytics — UniqueCRM" },
    { property: "og:description", content: "Revenue, pipeline velocity, and team performance." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: AnalyticsPage,
});
const money = (value: number) => `$${value.toLocaleString()}`;
function AnalyticsPage() {
  const index = useGlobalIndex();
  const deals = index.filter((item) => item.module === "deals");
  const leads = index.filter((item) => item.module === "leads");
  const won = deals.filter((item) => /won/i.test(String(item.raw.stage ?? "")));
  const lost = deals.filter((item) => /lost/i.test(String(item.raw.stage ?? "")));
  const revenue = won.reduce((sum, item) => sum + Number(item.raw.value ?? 0), 0);
  const sources = [...new Set(leads.map((item) => String(item.raw.source ?? "Other")))].map((name) => ({ name, count: leads.filter((item) => String(item.raw.source ?? "Other") === name).length }));
  const owners = [...new Set(won.map((item) => String(item.raw.owner ?? "")).filter(Boolean))].map((name) => ({ name, value: won.filter((item) => item.raw.owner === name).reduce((sum, item) => sum + Number(item.raw.value ?? 0), 0) }));
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth() - 11 + index, 1);
    return { label: date.toLocaleDateString(undefined, { month: "narrow" }), value: won.filter((item) => { const due = new Date(String(item.raw.due ?? "")); return !Number.isNaN(due.getTime()) && due.getMonth() === date.getMonth() && due.getFullYear() === date.getFullYear(); }).reduce((sum, item) => sum + Number(item.raw.value ?? 0), 0) };
  });
  const peak = Math.max(1, ...months.map((month) => month.value));
  return <div className="mx-auto max-w-7xl">
    <PageHeader title="Analytics" subtitle="Performance across pipeline, team, and revenue" actions={<button onClick={() => { const csv = ["stage,company,value",...deals.map((deal) => `${deal.raw.stage ?? ""},${deal.raw.company ?? ""},${deal.raw.value ?? 0}`)].join("\n"); const url = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); const link = document.createElement("a");link.href=url;link.download="analytics.csv";link.click();URL.revokeObjectURL(url); }} className="glass inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium">Export CSV</button>} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Revenue" value={money(revenue)} icon={<DollarSign className="h-5 w-5" />} />
      <StatCard label="Win rate" value={`${won.length + lost.length ? Math.round(100 * won.length / (won.length + lost.length)) : 0}%`} icon={<Target className="h-5 w-5" />} />
      <StatCard label="Avg deal size" value={money(won.length ? Math.round(revenue / won.length) : 0)} icon={<TrendingUp className="h-5 w-5" />} />
      <StatCard label="Cycle length" value="—" icon={<Zap className="h-5 w-5" />} />
    </div>
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <GlassCard className="lg:col-span-2"><h2 className="mb-4 text-lg font-semibold">Revenue by month</h2>{months.some((m) => m.value) ? <div className="flex h-64 items-end gap-2">{months.map((month, i) => <div key={i} className="flex flex-1 flex-col items-center gap-2"><div className="w-full rounded-t-lg gradient-brand-bg" style={{ height: `${Math.max(2, month.value / peak * 200)}px` }} title={money(month.value)} /><span className="text-[10px] text-muted-foreground">{month.label}</span></div>)}</div> : <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No revenue history yet</div>}</GlassCard>
      <GlassCard><h2 className="mb-4 text-lg font-semibold">Lead sources</h2>{sources.length ? <ul className="space-y-3">{sources.map((source) => <li key={source.name}><div className="mb-1 flex justify-between text-sm"><span className="text-muted-foreground">{source.name}</span><span className="font-semibold">{Math.round(source.count / leads.length * 100)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-white/5"><div className="h-full gradient-brand-bg" style={{width:`${source.count / leads.length * 100}%`}} /></div></li>)}</ul> : <p className="py-20 text-center text-sm text-muted-foreground">No leads yet</p>}</GlassCard>
      <GlassCard className="lg:col-span-3"><h2 className="mb-4 text-lg font-semibold">Team performance</h2>{owners.length ? <div className="space-y-4">{owners.map((owner) => <div key={owner.name} className="grid grid-cols-[minmax(0,180px)_1fr_auto] items-center gap-4"><span className="truncate text-sm font-medium">{owner.name}</span><div className="h-3 overflow-hidden rounded-full bg-white/5"><div className="h-full gradient-brand-bg" style={{width:`${revenue ? owner.value / revenue * 100 : 0}%`}} /></div><span className="text-sm font-semibold">{money(owner.value)}</span></div>)}</div> : <p className="py-12 text-center text-sm text-muted-foreground">No team performance data yet</p>}</GlassCard>
    </div>
  </div>;
}
