import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Target, Download, Calendar } from "lucide-react";
import { PageHeader, GlassCard, StatCard } from "@/components/crm-ui";
import { useGlobalIndex } from "@/lib/global-index";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports — UniqueCRM" },
    { name: "description", content: "Analytics on revenue, pipeline, and team performance." },
    { property: "og:title", content: "Reports — UniqueCRM" },
    { property: "og:description", content: "Analytics on revenue, pipeline, and team performance." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: ReportsPage,
});
const money = (value: number) => `$${value.toLocaleString()}`;
function ReportsPage() {
  const [range, setRange] = useState("Last 6 months");
  const index = useGlobalIndex();
  const deals = index.filter((item) => item.module === "deals");
  const leads = index.filter((item) => item.module === "leads");
  const won = deals.filter((deal) => /won/i.test(String(deal.raw.stage ?? "")));
  const lost = deals.filter((deal) => /lost/i.test(String(deal.raw.stage ?? "")));
  const revenue = won.reduce((sum, deal) => sum + Number(deal.raw.value ?? 0), 0);
  const committed = deals.filter((deal) => /proposal|negotiation/i.test(String(deal.raw.stage ?? ""))).reduce((sum, deal) => sum + Number(deal.raw.value ?? 0), 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const revenueMonth = won.filter((deal) => String(deal.raw.due ?? "").startsWith(currentMonth)).reduce((sum, deal) => sum + Number(deal.raw.value ?? 0), 0);
  const sources = [...new Set(leads.map((lead) => String(lead.raw.source ?? "Other")))].map((label) => ({ label, count: leads.filter((lead) => String(lead.raw.source ?? "Other") === label).length }));
  const performance = [...new Set(won.map((deal) => String(deal.raw.owner ?? "")).filter(Boolean))].map((name) => ({ name, value: won.filter((deal) => deal.raw.owner === name).reduce((sum, deal) => sum + Number(deal.raw.value ?? 0), 0) }));
  const exportCsv = () => { const csv = ["stage,company,value",...deals.map((deal) => `${deal.raw.stage ?? ""},${deal.raw.company ?? ""},${deal.raw.value ?? 0}`)].join("\n"); const url=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));const a=document.createElement("a");a.href=url;a.download="reports.csv";a.click();URL.revokeObjectURL(url); };
  const empty = <p className="flex h-48 items-center justify-center text-sm text-muted-foreground">No data for this report yet</p>;
  return <div>
    <PageHeader title="Reports" subtitle="Everything that matters, at a glance." actions={<><button onClick={() => setRange(range === "Last 6 months" ? "All time" : "Last 6 months")} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm"><Calendar className="h-4 w-4" />{range}</button><button onClick={exportCsv} className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm"><Download className="h-4 w-4" />Export</button></>} />
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Revenue (MTD)" value={money(revenueMonth)} icon={<DollarSign className="h-4 w-4" />} /><StatCard label="Deals Won" value={String(won.length)} icon={<TrendingUp className="h-4 w-4" />} /><StatCard label="Deals Lost" value={String(lost.length)} icon={<TrendingDown className="h-4 w-4" />} /><StatCard label="Win Rate" value={`${won.length + lost.length ? Math.round(won.length / (won.length + lost.length) * 100) : 0}%`} icon={<Target className="h-4 w-4" />} /></div>
    <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
      <GlassCard className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Monthly Revenue</h3>{empty}</GlassCard>
      <GlassCard><h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Lead Sources</h3>{sources.length ? <ul className="space-y-3">{sources.map((source) => <li key={source.label} className="flex items-center justify-between text-sm"><span>{source.label}</span><span className="text-muted-foreground">{Math.round(source.count / leads.length * 100)}%</span></li>)}</ul> : empty}</GlassCard>
      <GlassCard className="lg:col-span-2"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Deals Won vs Lost</h3>{won.length || lost.length ? <div className="flex h-48 items-end justify-center gap-8"><div className="w-20 text-center text-sm"><div className="gradient-brand-bg rounded-t-md" style={{height:`${Math.max(4, won.length / Math.max(won.length,lost.length) * 140)}px`}} />Won · {won.length}</div><div className="w-20 text-center text-sm"><div className="glass rounded-t-md" style={{height:`${Math.max(4, lost.length / Math.max(won.length,lost.length) * 140)}px`}} />Lost · {lost.length}</div></div> : empty}</GlassCard>
      <GlassCard><h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Sales Performance</h3><div className="mb-3 text-3xl font-bold">{money(revenue)}</div><div className="mb-4 text-xs text-muted-foreground">Closed revenue</div><div className="h-3 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full gradient-brand-bg" style={{width:`${revenue + committed ? revenue / (revenue + committed) * 100 : 0}%`}} /></div><div className="mt-6 grid grid-cols-2 gap-2 text-center"><div className="glass rounded-xl p-3"><div className="text-lg font-bold">{money(revenue)}</div><div className="text-xs text-muted-foreground">Closed</div></div><div className="glass rounded-xl p-3"><div className="text-lg font-bold">{money(committed)}</div><div className="text-xs text-muted-foreground">Committed</div></div></div></GlassCard>
      <GlassCard className="lg:col-span-3"><h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">Revenue by Employee</h3>{performance.length ? <div className="space-y-3">{performance.map((person) => <div key={person.name} className="grid grid-cols-[auto_1fr_auto] items-center gap-3"><span className="text-sm font-medium">{person.name}</span><div className="h-2.5 overflow-hidden rounded-full bg-white/5"><div className="h-full gradient-brand-bg" style={{width:`${revenue ? person.value / revenue * 100 : 0}%`}} /></div><span className="text-sm font-semibold">{money(person.value)}</span></div>)}</div> : empty}</GlassCard>
    </div>
  </div>;
}
