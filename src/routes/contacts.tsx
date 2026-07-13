import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search, Filter, Plus, LayoutGrid, Table as TableIcon,
  Mail, Phone, MoreHorizontal, Star, Download,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Contacts — UniqueCRM" },
      { name: "description", content: "Manage your customer relationships and contact directory." },
    ],
  }),
  component: ContactsPage,
});

type Status = "Active" | "Inactive" | "Lead" | "VIP";
type Contact = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  tags: string[];
  tone: number;
};

const CONTACTS: Contact[] = [
  { id: "1", name: "Ava Reynolds", company: "Northwind Labs", email: "ava@northwind.io", phone: "+1 (415) 555-2201", status: "VIP", tags: ["Enterprise", "Priority"], tone: 0 },
  { id: "2", name: "Marcus Chen", company: "Lumen Studios", email: "marcus@lumen.co", phone: "+1 (628) 555-9911", status: "Active", tags: ["Design", "Retainer"], tone: 1 },
  { id: "3", name: "Priya Natarajan", company: "Halcyon Systems", email: "priya@halcyon.dev", phone: "+91 98765 12345", status: "Lead", tags: ["Warm", "SaaS"], tone: 2 },
  { id: "4", name: "Diego Alvarez", company: "Meridian & Co", email: "diego@meridian.com", phone: "+34 611 22 33 44", status: "Active", tags: ["Finance"], tone: 3 },
  { id: "5", name: "Sofia Petrov", company: "Aster Health", email: "sofia@aster.health", phone: "+44 20 7946 0011", status: "Inactive", tags: ["Healthcare"], tone: 4 },
  { id: "6", name: "Jamal Turner", company: "Arcadia Media", email: "jamal@arcadia.tv", phone: "+1 (312) 555-6688", status: "VIP", tags: ["Media", "Priority"], tone: 0 },
  { id: "7", name: "Elena Rossi", company: "Volta Motors", email: "elena@volta.eu", phone: "+39 02 1234 5678", status: "Active", tags: ["Automotive"], tone: 1 },
  { id: "8", name: "Kenji Watanabe", company: "Origami Cloud", email: "kenji@origami.io", phone: "+81 3 5678 9012", status: "Lead", tags: ["Cloud", "Trial"], tone: 2 },
];

const statusTone: Record<Status, "success" | "warning" | "info" | "brand"> = {
  Active: "success",
  Inactive: "warning",
  Lead: "info",
  VIP: "brand",
};

function ContactsPage() {
  const [view, setView] = useState<"table" | "card">("table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");

  const filtered = useMemo(() => {
    return CONTACTS.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchS = status === "All" || c.status === status;
      return matchQ && matchS;
    });
  }, [query, status]);

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="All your people, tagged and searchable."
        actions={
          <>
            <button className="glass hidden items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5 sm:inline-flex">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm">
              <Plus className="h-4 w-4" /> Add Contact
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
              placeholder="Search by name, company, email…"
              className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["All", "Active", "Lead", "VIP", "Inactive"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s as Status | "All")}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  status === s
                    ? "border-transparent text-white [background:var(--gradient-brand)] glow-shadow-sm"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
            <button className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs">
              <Filter className="h-3.5 w-3.5" /> More
            </button>
            <div className="glass ml-auto inline-flex rounded-xl p-1">
              <button
                onClick={() => setView("table")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ${
                  view === "table" ? "gradient-brand-bg text-white" : "text-muted-foreground"
                }`}
              >
                <TableIcon className="h-3.5 w-3.5" /> Table
              </button>
              <button
                onClick={() => setView("card")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs ${
                  view === "card" ? "gradient-brand-bg text-white" : "text-muted-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Cards
              </button>
            </div>
          </div>
        </div>
      </GlassCard>

      {view === "table" ? (
        <GlassCard className="overflow-hidden !p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Company</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Tags</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} tone={c.tone} />
                        <div className="min-w-0">
                          <div className="truncate font-medium">{c.name}</div>
                          <div className="truncate text-xs text-muted-foreground sm:hidden">{c.company}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.company}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.phone}</td>
                    <td className="px-5 py-3.5"><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.map((t) => (
                          <Badge key={t}>{t}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
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
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="glass group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:glow-shadow-sm"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-40 blur-3xl [background:var(--gradient-brand)]" />
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="scale-125 origin-left"><Avatar name={c.name} tone={c.tone} /></div>
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.company}</div>
                  </div>
                </div>
                <Star className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span className="truncate">{c.phone}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  <Badge tone={statusTone[c.status]}>{c.status}</Badge>
                  {c.tags.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                </div>
                <div className="flex gap-1">
                  <button className="glass rounded-lg p-1.5 hover:glow-shadow-sm"><Mail className="h-3.5 w-3.5" /></button>
                  <button className="glass rounded-lg p-1.5 hover:glow-shadow-sm"><Phone className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="glass mt-6 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No contacts match your filters.
        </div>
      )}
    </div>
  );
}
