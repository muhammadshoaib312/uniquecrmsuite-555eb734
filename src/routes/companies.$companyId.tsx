import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Globe, Users, TrendingUp, Building2, Receipt, StickyNote, Activity, DollarSign, Mail } from "lucide-react";
import { GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { useRecordStore } from "@/lib/record-store";
import type { Company } from "./companies";

type Contact = { id: string; name: string; company: string; jobTitle?: string; email?: string; tone?: number };
type Deal = { id: string; company: string; value: number; stage?: string };
type Invoice = { id: string; client: string; amount: number; status: string; due?: string };
export const Route = createFileRoute("/companies/$companyId")({
  head: () => ({ meta: [
    { title: "Company Details — UniqueCRM" },
    { name: "description", content: "Company contacts, deals, and account activity." },
    { property: "og:title", content: "Company Details — UniqueCRM" },
    { property: "og:description", content: "Company contacts, deals, and account activity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CompanyDetail,
});
function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return <div className="flex items-center gap-2"><span className="gradient-brand-bg grid h-7 w-7 place-items-center rounded-lg text-white">{icon}</span><h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2></div>;
}
function CompanyDetail() {
  const { companyId } = Route.useParams();
  const { items: companies } = useRecordStore<Company>("companies");
  const { items: contacts } = useRecordStore<Contact>("contacts");
  const { items: deals } = useRecordStore<Deal>("deals");
  const { items: invoices } = useRecordStore<Invoice>("invoices");
  const company = companies.find((c) => c.id === companyId);
  if (!company) return <div><Link to="/companies" className="text-xs text-muted-foreground">← Back to Companies</Link><GlassCard className="mt-4 text-center">Company not found.</GlassCard></div>;
  const relatedContacts = contacts.filter((c) => c.company === company.name);
  const relatedDeals = deals.filter((d) => d.company === company.name);
  const relatedInvoices = invoices.filter((i) => i.client === company.name);
  const empty = <p className="mt-4 text-sm text-muted-foreground">No records yet.</p>;
  return <div>
    <Link to="/companies" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="h-3.5 w-3.5" />Back to Companies</Link>
    <GlassCard className="mb-6 relative overflow-hidden"><div className="flex items-center gap-4"><div className="gradient-brand-bg grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white glow-shadow-sm"><Building2 className="h-6 w-6" /></div><div className="min-w-0"><h1 className="truncate text-2xl font-bold sm:text-3xl">{company.name}</h1><div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"><Badge tone="brand">{company.industry || "—"}</Badge>{company.website && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{company.website}</span>}<span className="flex items-center gap-1"><Users className="h-3 w-3" />{company.employees ?? 0}</span>{company.revenue && <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{company.revenue}</span>}</div></div></div></GlassCard>
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3"><div className="space-y-5 lg:col-span-2">
      <GlassCard><SectionHeader icon={<Users className="h-4 w-4" />} title="Contacts" />{relatedContacts.length ? relatedContacts.map((c) => <div key={c.id} className="mt-4 flex items-center gap-3 border-b border-white/5 py-2"><Avatar name={c.name} tone={c.tone} /><div className="min-w-0 flex-1"><p className="text-sm font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.jobTitle || "Contact"}</p></div>{c.email && <a href={`mailto:${c.email}`} aria-label={`Email ${c.name}`}><Mail className="h-4 w-4" /></a>}</div>) : empty}</GlassCard>
      <GlassCard><SectionHeader icon={<DollarSign className="h-4 w-4" />} title="Deals" />{relatedDeals.length ? relatedDeals.map((d) => <p key={d.id} className="mt-4 text-sm">{d.stage || "Deal"} · ${d.value.toLocaleString()}</p>) : empty}</GlassCard>
      <GlassCard><SectionHeader icon={<Receipt className="h-4 w-4" />} title="Invoices" />{relatedInvoices.length ? relatedInvoices.map((i) => <p key={i.id} className="mt-4 text-sm">{i.id} · ${i.amount.toLocaleString()} · {i.status}</p>) : empty}</GlassCard>
      <GlassCard><SectionHeader icon={<StickyNote className="h-4 w-4" />} title="Notes" />{empty}<textarea placeholder="Add a note…" className="mt-4 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none" rows={2} /></GlassCard>
    </div><GlassCard className="h-fit"><SectionHeader icon={<Activity className="h-4 w-4" />} title="Activity Timeline" />{empty}</GlassCard></div>
  </div>;
}
