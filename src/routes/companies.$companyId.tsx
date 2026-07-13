import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, Globe, Phone, Mail, Users, TrendingUp, Building2,
  FileText, Receipt, StickyNote, Activity, Plus, DollarSign,
} from "lucide-react";
import { GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { COMPANIES } from "./companies";

export const Route = createFileRoute("/companies/$companyId")({
  head: () => ({
    meta: [{ title: "Company Details — UniqueCRM" }],
  }),
  loader: ({ params }) => {
    const company = COMPANIES.find((c) => c.id === params.companyId);
    if (!company) throw notFound();
    return { company };
  },
  component: CompanyDetail,
  notFoundComponent: () => (
    <div className="glass rounded-2xl p-10 text-center">Company not found.</div>
  ),
});

const CONTACTS = [
  { name: "Ava Reynolds", role: "VP Sales", email: "ava@company.io", tone: 0 },
  { name: "Marcus Chen", role: "CTO", email: "marcus@company.io", tone: 1 },
  { name: "Priya Natarajan", role: "Head of Ops", email: "priya@company.io", tone: 2 },
];
const DEALS = [
  { name: "Enterprise renewal", stage: "Negotiation", value: "$85,000", tone: "warning" as const },
  { name: "Add-on: Analytics", stage: "Proposal", value: "$24,500", tone: "info" as const },
  { name: "Multi-year expansion", stage: "Won", value: "$210,000", tone: "success" as const },
];
const INVOICES = [
  { id: "INV-2081", amount: "$12,400", status: "Paid" as const, due: "Jun 12" },
  { id: "INV-2114", amount: "$8,900", status: "Sent" as const, due: "Jul 20" },
  { id: "INV-2130", amount: "$3,200", status: "Overdue" as const, due: "May 30" },
];
const NOTES = [
  { by: "You", when: "2h ago", text: "Discussed Q3 roadmap. They want SSO + audit logs before renewal." },
  { by: "Diego", when: "yesterday", text: "Signed NDA. Sharing security package next week." },
];
const TIMELINE = [
  { icon: Mail, text: "Email sent — 'Q3 pricing proposal'", when: "10:24 AM" },
  { icon: Phone, text: "Call with Marcus (34 min)", when: "Yesterday" },
  { icon: FileText, text: "Proposal 'Enterprise plan v3' created", when: "2 days ago" },
  { icon: Users, text: "Priya added to account", when: "Last week" },
];

const invoiceTone: Record<"Paid" | "Sent" | "Overdue", "success" | "info" | "warning"> = {
  Paid: "success", Sent: "info", Overdue: "warning",
};

function CompanyDetail() {
  const { company } = Route.useLoaderData();

  return (
    <div>
      <Link to="/companies" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Companies
      </Link>

      <GlassCard className="mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-30 blur-3xl [background:var(--gradient-brand)]" />
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="gradient-brand-bg grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white glow-shadow-sm">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-bold sm:text-3xl">{company.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge tone="brand">{company.industry}</Badge>
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{company.website}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{company.employees}</span>
                <span className="flex items-center gap-1"><TrendingUp className="h-3 w-3" />{company.revenue}</span>
              </div>
            </div>
          </div>
          <button className="gradient-brand-bg inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm">
            <Plus className="h-4 w-4" /> New Deal
          </button>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <GlassCard>
            <SectionHeader icon={<Users className="h-4 w-4" />} title="Contacts" />
            <div className="mt-4 divide-y divide-white/5">
              {CONTACTS.map((c) => (
                <div key={c.name} className="flex items-center gap-3 py-3">
                  <Avatar name={c.name} tone={c.tone} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.role} · {c.email}</div>
                  </div>
                  <button className="glass rounded-lg p-1.5"><Mail className="h-3.5 w-3.5" /></button>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionHeader icon={<DollarSign className="h-4 w-4" />} title="Deals" />
            <div className="mt-4 space-y-2">
              {DEALS.map((d) => (
                <div key={d.name} className="glass flex items-center justify-between rounded-xl p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.stage}</div>
                  </div>
                  <Badge tone={d.tone}>{d.value}</Badge>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <SectionHeader icon={<Receipt className="h-4 w-4" />} title="Invoices" />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[420px] text-sm">
                <thead className="text-left text-xs uppercase text-muted-foreground">
                  <tr><th className="py-2 font-medium">Invoice</th><th className="py-2 font-medium">Amount</th><th className="py-2 font-medium">Due</th><th className="py-2 font-medium">Status</th></tr>
                </thead>
                <tbody>
                  {INVOICES.map((i) => (
                    <tr key={i.id} className="border-t border-white/5">
                      <td className="py-3 font-medium">{i.id}</td>
                      <td className="py-3 text-muted-foreground">{i.amount}</td>
                      <td className="py-3 text-muted-foreground">{i.due}</td>
                      <td className="py-3"><Badge tone={invoiceTone[i.status]}>{i.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          <GlassCard>
            <SectionHeader icon={<StickyNote className="h-4 w-4" />} title="Notes" />
            <div className="mt-4 space-y-3">
              {NOTES.map((n, i) => (
                <div key={i} className="glass rounded-xl p-3">
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{n.by}</span>
                    <span>{n.when}</span>
                  </div>
                  <p className="text-sm">{n.text}</p>
                </div>
              ))}
              <textarea placeholder="Add a note…" className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30" rows={2} />
            </div>
          </GlassCard>
        </div>

        <div>
          <GlassCard className="lg:sticky lg:top-4">
            <SectionHeader icon={<Activity className="h-4 w-4" />} title="Activity Timeline" />
            <ol className="relative mt-4 space-y-4 border-l border-white/10 pl-5">
              {TIMELINE.map((t, i) => {
                const Icon = t.icon;
                return (
                  <li key={i} className="relative">
                    <span className="gradient-brand-bg absolute -left-[26px] top-0.5 grid h-5 w-5 place-items-center rounded-full text-white glow-shadow-sm">
                      <Icon className="h-3 w-3" />
                    </span>
                    <div className="text-sm">{t.text}</div>
                    <div className="text-xs text-muted-foreground">{t.when}</div>
                  </li>
                );
              })}
            </ol>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="gradient-brand-bg grid h-7 w-7 place-items-center rounded-lg text-white">{icon}</span>
      <h2 className="text-sm font-semibold uppercase tracking-wider">{title}</h2>
    </div>
  );
}
