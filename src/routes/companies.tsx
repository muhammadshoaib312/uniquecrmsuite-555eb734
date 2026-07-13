import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Plus, Building2, Globe, Phone, Mail, Users, TrendingUp, Filter, Download,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/companies")({
  head: () => ({
    meta: [
      { title: "Companies — UniqueCRM" },
      { name: "description", content: "Organizations, industries, and account managers." },
    ],
  }),
  component: CompaniesPage,
});

export type Company = {
  id: string;
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  employees: number;
  revenue: string;
  manager: string;
  tone: number;
};

export const COMPANIES: Company[] = [
  { id: "northwind", name: "Northwind Labs", industry: "SaaS", website: "northwind.io", phone: "+1 415 555 2201", email: "hello@northwind.io", employees: 240, revenue: "$18.4M", manager: "Ava Reynolds", tone: 0 },
  { id: "lumen", name: "Lumen Studios", industry: "Design", website: "lumen.co", phone: "+1 628 555 9911", email: "team@lumen.co", employees: 55, revenue: "$4.2M", manager: "Marcus Chen", tone: 1 },
  { id: "halcyon", name: "Halcyon Systems", industry: "Cloud Infra", website: "halcyon.dev", phone: "+91 98765 12345", email: "sales@halcyon.dev", employees: 480, revenue: "$62M", manager: "Priya Natarajan", tone: 2 },
  { id: "meridian", name: "Meridian & Co", industry: "Finance", website: "meridian.com", phone: "+34 611 22 33 44", email: "info@meridian.com", employees: 1200, revenue: "$210M", manager: "Diego Alvarez", tone: 3 },
  { id: "aster", name: "Aster Health", industry: "Healthcare", website: "aster.health", phone: "+44 20 7946 0011", email: "care@aster.health", employees: 340, revenue: "$28M", manager: "Sofia Petrov", tone: 4 },
  { id: "arcadia", name: "Arcadia Media", industry: "Media", website: "arcadia.tv", phone: "+1 312 555 6688", email: "press@arcadia.tv", employees: 88, revenue: "$9.1M", manager: "Jamal Turner", tone: 0 },
];

function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");

  const industries = useMemo(
    () => ["All", ...Array.from(new Set(COMPANIES.map((c) => c.industry)))],
    [],
  );

  const filtered = COMPANIES.filter((c) => {
    const q = query.toLowerCase();
    return (
      (industry === "All" || c.industry === industry) &&
      (!q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Every organization you're working with, in one place."
        actions={
          <>
            <button className="glass hidden items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5 sm:inline-flex">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm">
              <Plus className="h-4 w-4" /> Add Company
            </button>
          </>
        }
      />

      <GlassCard className="mb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search companies…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {industries.map((i) => (
              <button
                key={i}
                onClick={() => setIndustry(i)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  industry === i
                    ? "border-transparent text-white [background:var(--gradient-brand)] glow-shadow-sm"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {i}
              </button>
            ))}
            <button className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs">
              <Filter className="h-3.5 w-3.5" /> More
            </button>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((c) => (
          <Link
            key={c.id}
            to="/companies/$companyId"
            params={{ companyId: c.id }}
            className="glass group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:glow-shadow-sm"
          >
            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-30 blur-3xl [background:var(--gradient-brand)]" />
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="gradient-brand-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white glow-shadow-sm">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.industry}</div>
                </div>
              </div>
              <Badge tone="brand">{c.revenue}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate"><Globe className="h-3.5 w-3.5" />{c.website}</div>
              <div className="flex items-center gap-1.5 truncate"><Phone className="h-3.5 w-3.5" />{c.phone}</div>
              <div className="flex items-center gap-1.5 truncate col-span-2"><Mail className="h-3.5 w-3.5" />{c.email}</div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {c.employees} employees
              </div>
              <div className="flex items-center gap-2">
                <Avatar name={c.manager} tone={c.tone} />
                <span className="text-xs text-muted-foreground">{c.manager}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
