import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DollarSign, TrendingUp, TrendingDown, Target, Download, FileText, Users, UserPlus,
  UserCheck, Briefcase, Percent, AlertTriangle, BarChart3,
} from "lucide-react";
import { PageHeader, GlassCard, StatCard } from "@/components/crm-ui";
import { useGlobalIndex, type IndexedRecord } from "@/lib/global-index";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [
    { title: "Reports & Analytics — UniqueCRM" },
    { name: "description", content: "Sales, lead and team performance reports built from your CRM records." },
    { property: "og:title", content: "Reports & Analytics — UniqueCRM" },
    { property: "og:description", content: "Sales, lead and team performance reports built from your CRM records." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: ReportsPage,
});

const money = (v: number) => `$${Math.round(v).toLocaleString()}`;
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0);
const str = (v: unknown) => String(v ?? "").trim();
const RANGES = [
  { id: "30d", label: "Last 30 days", days: 30 },
  { id: "90d", label: "Last 90 days", days: 90 },
  { id: "6m", label: "Last 6 months", days: 183 },
  { id: "12m", label: "Last 12 months", days: 365 },
  { id: "all", label: "All time", days: 0 },
];
const DEAL_STATUSES = ["All", "Open", "Won", "Lost"];
const STAGES = ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"];

function recordDate(r: IndexedRecord): Date | null {
  const raw = r.raw as Record<string, unknown>;
  for (const k of ["created", "createdAt", "due", "date"]) {
    const d = new Date(str(raw[k]));
    if (str(raw[k]) && !Number.isNaN(d.getTime())) return d;
  }
  const m = /(\d{10,})/.exec(r.id);
  if (m) { const d = new Date(Number(m[1])); if (!Number.isNaN(d.getTime())) return d; }
  const b36 = /-([a-z0-9]{8})\d{0,3}$/.exec(r.id);
  if (b36) { const d = new Date(parseInt(b36[1], 36)); if (d.getFullYear() > 2015 && d.getFullYear() < 2100) return d; }
  return null;
}
const isWon = (d: IndexedRecord) => /won/i.test(str(d.raw.stage));
const isLost = (d: IndexedRecord) => /lost/i.test(str(d.raw.stage));
const isConverted = (l: IndexedRecord) => /won|converted/i.test(str(l.raw.status));

function ReportsPage() {
  const index = useGlobalIndex();
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 150); return () => clearTimeout(t); }, []);
  const [range, setRange] = useState("6m");
  const [owner, setOwner] = useState("All");
  const [source, setSource] = useState("All");
  const [dealStatus, setDealStatus] = useState("All");

  const allLeads = index.filter((i) => i.module === "leads");
  const allDeals = index.filter((i) => i.module === "deals");
  const owners = [...new Set([...allLeads, ...allDeals].map((r) => str(r.raw.owner)).filter(Boolean))].sort();
  const sourcesList = [...new Set(allLeads.map((l) => str(l.raw.source) || "Other"))].sort();

  const report = useMemo(() => {
    try {
      const days = RANGES.find((r) => r.id === range)?.days ?? 0;
      const since = days ? Date.now() - days * 86400000 : 0;
      const inRange = (r: IndexedRecord) => { if (!since) return true; const d = recordDate(r); return !d || d.getTime() >= since; };
      const ownerOk = (r: IndexedRecord) => owner === "All" || str(r.raw.owner) === owner;
      const leads = allLeads.filter((l) => inRange(l) && ownerOk(l) && (source === "All" || (str(l.raw.source) || "Other") === source));
      const deals = allDeals.filter((d) => inRange(d) && ownerOk(d) && (dealStatus === "All" || (dealStatus === "Won" ? isWon(d) : dealStatus === "Lost" ? isLost(d) : !isWon(d) && !isLost(d))));
      const won = deals.filter(isWon), lost = deals.filter(isLost);
      const revenue = won.reduce((s, d) => s + Number(d.raw.value ?? 0), 0);
      const converted = leads.filter(isConverted).length;
      const newLeads = leads.filter((l) => /^new$/i.test(str(l.raw.status))).length;
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(new Date().getFullYear(), new Date().getMonth() - 5 + i, 1);
        const same = (r: IndexedRecord) => { const x = recordDate(r); return !!x && x.getMonth() === d.getMonth() && x.getFullYear() === d.getFullYear(); };
        return {
          label: d.toLocaleDateString(undefined, { month: "short" }),
          revenue: won.filter(same).reduce((s, x) => s + Number(x.raw.value ?? 0), 0),
          won: won.filter(same).length, lost: lost.filter(same).length, leads: leads.filter(same).length,
        };
      });
      const byKey = (list: IndexedRecord[], key: string, fallback: string) => {
        const m = new Map<string, number>();
        list.forEach((r) => { const k = str(r.raw[key]) || fallback; m.set(k, (m.get(k) ?? 0) + 1); });
        return [...m.entries()].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);
      };
      const pipeline = STAGES.map((stage) => {
        const list = deals.filter((d) => str(d.raw.stage).toLowerCase() === stage.toLowerCase());
        return { stage, count: list.length, value: list.reduce((s, d) => s + Number(d.raw.value ?? 0), 0) };
      });
      const team = [...new Set([...leads, ...deals].map((r) => str(r.raw.owner)).filter(Boolean))].map((name) => {
        const myLeads = leads.filter((l) => str(l.raw.owner) === name);
        const myWon = won.filter((d) => str(d.raw.owner) === name);
        const myClosed = deals.filter((d) => str(d.raw.owner) === name && (isWon(d) || isLost(d))).length;
        return { name, leads: myLeads.length, won: myWon.length, revenue: myWon.reduce((s, d) => s + Number(d.raw.value ?? 0), 0), rate: pct(myWon.length, myClosed) };
      }).sort((a, b) => b.revenue - a.revenue);
      return { leads, deals, won, lost, revenue, converted, newLeads, months, pipeline, team,
        byStatus: byKey(leads, "status", "Unspecified"), bySource: byKey(leads, "source", "Other"), error: null as string | null };
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Unable to build report" } as const;
    }
  }, [allLeads, allDeals, range, owner, source, dealStatus]);

  const exportCsv = () => {
    if (report.error) return;
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Section", "Label", "Value"],
      ["Overview", "Total leads", report.leads.length], ["Overview", "New leads", report.newLeads],
      ["Overview", "Converted leads", report.converted], ["Overview", "Total deals", report.deals.length],
      ["Overview", "Won deals", report.won.length], ["Overview", "Lost deals", report.lost.length],
      ["Overview", "Total revenue", report.revenue], ["Overview", "Conversion rate %", pct(report.converted, report.leads.length)],
      ...report.months.map((m) => ["Revenue by month", m.label, m.revenue]),
      ...report.pipeline.map((p) => ["Pipeline", p.stage, p.value]),
      ...report.bySource.map((s) => ["Lead source", s.label, s.count]),
      ...report.team.map((t) => ["Team revenue", t.name, t.revenue]),
    ];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(esc).join(",")).join("\n")], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `uniquecrm-report-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  const hasData = !report.error && (report.leads.length > 0 || report.deals.length > 0);
  const select = "glass min-w-0 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 [&>option]:bg-background";

  return <div className="mx-auto max-w-7xl">
    <PageHeader title="Reports & Analytics" subtitle="Sales, lead and team performance from your CRM records." actions={<>
      <button onClick={exportCsv} disabled={!hasData} className="glass inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm disabled:opacity-50"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export CSV</span></button>
      <button onClick={() => window.print()} disabled={!hasData} title="Opens your browser's print dialog — choose “Save as PDF”" className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm disabled:opacity-50"><FileText className="h-4 w-4" /><span className="hidden sm:inline">Export PDF</span></button>
    </>} />

    <GlassCard className="mb-5 !p-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Filter label="Date range"><select className={select} value={range} onChange={(e) => setRange(e.target.value)}>{RANGES.map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}</select></Filter>
        <Filter label="User / team"><select className={select} value={owner} onChange={(e) => setOwner(e.target.value)}><option>All</option>{owners.map((o) => <option key={o}>{o}</option>)}</select></Filter>
        <Filter label="Lead source"><select className={select} value={source} onChange={(e) => setSource(e.target.value)}><option>All</option>{sourcesList.map((o) => <option key={o}>{o}</option>)}</select></Filter>
        <Filter label="Deal status"><select className={select} value={dealStatus} onChange={(e) => setDealStatus(e.target.value)}>{DEAL_STATUSES.map((o) => <option key={o}>{o}</option>)}</select></Filter>
      </div>
    </GlassCard>

    {!ready ? <LoadingState /> : report.error ? (
      <GlassCard><div className="flex flex-col items-center gap-3 py-16 text-center"><AlertTriangle className="h-8 w-8 text-rose-400" /><p className="font-semibold">We couldn't build this report</p><p className="text-sm text-muted-foreground">{report.error}</p><button onClick={() => { setRange("6m"); setOwner("All"); setSource("All"); setDealStatus("All"); }} className="glass rounded-xl px-4 py-2 text-sm">Reset filters</button></div></GlassCard>
    ) : <>
      <Section title="Reports overview">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard label="Total Leads" value={String(report.leads.length)} icon={<Users className="h-4 w-4" />} />
          <StatCard label="New Leads" value={String(report.newLeads)} icon={<UserPlus className="h-4 w-4" />} />
          <StatCard label="Converted Leads" value={String(report.converted)} icon={<UserCheck className="h-4 w-4" />} />
          <StatCard label="Conversion Rate" value={`${pct(report.converted, report.leads.length)}%`} icon={<Percent className="h-4 w-4" />} />
          <StatCard label="Total Deals" value={String(report.deals.length)} icon={<Briefcase className="h-4 w-4" />} />
          <StatCard label="Won Deals" value={String(report.won.length)} icon={<TrendingUp className="h-4 w-4" />} />
          <StatCard label="Lost Deals" value={String(report.lost.length)} icon={<TrendingDown className="h-4 w-4" />} />
          <StatCard label="Total Revenue" value={money(report.revenue)} icon={<DollarSign className="h-4 w-4" />} />
        </div>
      </Section>

      {!hasData && <GlassCard className="mb-6"><div className="flex flex-col items-center gap-2 py-10 text-center"><BarChart3 className="h-8 w-8 text-muted-foreground" /><p className="font-semibold">No report data yet</p><p className="max-w-md text-sm text-muted-foreground">Add leads and deals, or adjust the filters above. Charts fill in automatically from your saved records.</p></div></GlassCard>}

      <Section title="Sales analytics">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <ChartCard title="Revenue over time" className="lg:col-span-2" empty={!report.months.some((m) => m.revenue)}>
            <Bars data={report.months.map((m) => ({ label: m.label, value: m.revenue, hint: money(m.revenue) }))} />
          </ChartCard>
          <ChartCard title="Won vs lost" empty={!report.won.length && !report.lost.length}>
            <div className="space-y-4">
              <Meter label="Won" value={report.won.length} total={report.won.length + report.lost.length} />
              <Meter label="Lost" value={report.lost.length} total={report.won.length + report.lost.length} muted />
              <p className="pt-2 text-sm text-muted-foreground">Win rate <span className="font-semibold text-foreground">{pct(report.won.length, report.won.length + report.lost.length)}%</span></p>
            </div>
          </ChartCard>
          <ChartCard title="Pipeline value by stage" className="lg:col-span-2" empty={!report.deals.length}>
            <div className="space-y-3">{report.pipeline.map((p) => <Meter key={p.stage} label={`${p.stage} · ${p.count}`} value={p.value} total={Math.max(1, ...report.pipeline.map((x) => x.value))} display={money(p.value)} />)}</div>
          </ChartCard>
          <ChartCard title="Monthly performance" empty={!report.months.some((m) => m.won || m.lost || m.leads)}>
            <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="pb-2">Month</th><th className="pb-2 text-right">Leads</th><th className="pb-2 text-right">Won</th><th className="pb-2 text-right">Lost</th></tr></thead>
              <tbody>{report.months.map((m) => <tr key={m.label} className="border-t border-border/40"><td className="py-2">{m.label}</td><td className="py-2 text-right">{m.leads}</td><td className="py-2 text-right">{m.won}</td><td className="py-2 text-right">{m.lost}</td></tr>)}</tbody></table></div>
          </ChartCard>
        </div>
      </Section>

      <Section title="Lead analytics">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <ChartCard title="Leads by status" empty={!report.leads.length}>
            <div className="space-y-3">{report.byStatus.map((s) => <Meter key={s.label} label={s.label} value={s.count} total={report.leads.length} display={String(s.count)} />)}</div>
          </ChartCard>
          <ChartCard title="Leads by source" empty={!report.leads.length}>
            <div className="space-y-3">{report.bySource.map((s) => <Meter key={s.label} label={s.label} value={s.count} total={report.leads.length} />)}</div>
          </ChartCard>
          <ChartCard title="Lead conversion rate" empty={!report.leads.length}>
            <div className="flex flex-col items-center justify-center gap-2 py-6"><div className="gradient-brand-text text-5xl font-bold">{pct(report.converted, report.leads.length)}%</div><p className="text-sm text-muted-foreground">{report.converted} of {report.leads.length} leads converted</p></div>
          </ChartCard>
          <ChartCard title="New leads over time" className="md:col-span-2 lg:col-span-3" empty={!report.months.some((m) => m.leads)}>
            <Bars data={report.months.map((m) => ({ label: m.label, value: m.leads, hint: `${m.leads} leads` }))} />
          </ChartCard>
        </div>
      </Section>

      <Section title="Team performance">
        <ChartCard title="Sales by user" empty={!report.team.length} emptyText="Assign owners to leads and deals to see team performance">
          <div className="-mx-2 overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="px-2 pb-3">User</th><th className="px-2 pb-3 text-right">Leads assigned</th><th className="px-2 pb-3 text-right">Deals won</th><th className="px-2 pb-3 text-right">Revenue</th><th className="px-2 pb-3 text-right">Conversion</th></tr></thead>
            <tbody>{report.team.map((t) => <tr key={t.name} className="border-t border-border/40"><td className="px-2 py-3 font-medium">{t.name}</td><td className="px-2 py-3 text-right">{t.leads}</td><td className="px-2 py-3 text-right">{t.won}</td><td className="px-2 py-3 text-right font-semibold">{money(t.revenue)}</td><td className="px-2 py-3 text-right">{t.rate}%</td></tr>)}</tbody>
          </table></div>
        </ChartCard>
      </Section>
    </>}
  </div>;
}

function Filter({ label, children }: { label: string; children: ReactNode }) {
  return <label className="flex min-w-0 flex-col gap-1"><span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>{children}</label>;
}
function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mb-6"><h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>{children}</section>;
}
function ChartCard({ title, children, empty, emptyText = "No data for this report yet", className = "" }: { title: string; children: ReactNode; empty?: boolean; emptyText?: string; className?: string }) {
  return <GlassCard className={className}><h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">{title}</h3>{empty ? <p className="flex h-40 items-center justify-center text-center text-sm text-muted-foreground">{emptyText}</p> : children}</GlassCard>;
}
function Bars({ data }: { data: { label: string; value: number; hint: string }[] }) {
  const peak = Math.max(1, ...data.map((d) => d.value));
  return <div className="flex h-52 items-end gap-2 sm:gap-3">{data.map((d) => <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2"><div className="w-full rounded-t-lg gradient-brand-bg transition-all" style={{ height: `${Math.max(2, (d.value / peak) * 100)}%` }} title={d.hint} /><span className="text-[10px] text-muted-foreground sm:text-xs">{d.label}</span></div>)}</div>;
}
function Meter({ label, value, total, display, muted }: { label: string; value: number; total: number; display?: string; muted?: boolean }) {
  return <div><div className="mb-1 flex justify-between gap-2 text-sm"><span className="truncate text-muted-foreground">{label}</span><span className="font-semibold">{display ?? `${pct(value, total)}%`}</span></div><div className="h-2 overflow-hidden rounded-full bg-muted/40"><div className={`h-full rounded-full ${muted ? "bg-muted-foreground/40" : "gradient-brand-bg"}`} style={{ width: `${total ? (value / total) * 100 : 0}%` }} /></div></div>;
}
function LoadingState() {
  return <div className="space-y-5" aria-busy="true"><div className="grid grid-cols-2 gap-4 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="glass h-28 animate-pulse rounded-2xl" />)}</div><div className="grid grid-cols-1 gap-5 lg:grid-cols-3"><div className="glass h-72 animate-pulse rounded-2xl lg:col-span-2" /><div className="glass h-72 animate-pulse rounded-2xl" /></div></div>;
}
