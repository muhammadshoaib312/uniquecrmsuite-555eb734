import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Building2, Globe, Phone, Mail, Users, Filter, Download, Trash2, Pencil,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";
import { useOpenCreate } from "@/lib/use-open-create";

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

type FormState = Omit<Company, "id" | "tone">;
const EMPTY: FormState = { name: "", industry: "", website: "", phone: "", email: "", employees: 0, revenue: "", manager: "" };

function CompaniesPage() {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("All");
  const { items: added, add, update, remove } = useRecordStore<Company>("companies");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  useOpenCreate("companies", () => { setEditing(null); setModalOpen(true); });

  const combined = useMemo(() => [...added, ...COMPANIES], [added]);
  const addedIds = new Set(added.map((c) => c.id));

  const industries = useMemo(
    () => ["All", ...Array.from(new Set(combined.map((c) => c.industry).filter(Boolean)))],
    [combined],
  );

  const filtered = combined.filter((c) => {
    const q = query.toLowerCase();
    return (
      (industry === "All" || c.industry === industry) &&
      (!q || c.name.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q))
    );
  });

  function handleSave(form: FormState) {
    if (editing) update(editing.id, form);
    else add({ ...form, tone: Math.floor(Math.random() * 5) } as Omit<Company, "id">);
    setModalOpen(false);
    setEditing(null);
  }
  function handleDelete(id: string) {
    if (confirm("Delete this company?")) remove(id);
  }

  function exportCsv() {
    const rows = ["name,industry,website,phone,email,employees,revenue,manager"]
      .concat(combined.map((c) => [c.name, c.industry, c.website, c.phone, c.email, c.employees, c.revenue, c.manager].join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "companies.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle="Every organization you're working with, in one place."
        actions={
          <>
            <button onClick={exportCsv} className="glass hidden items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5 sm:inline-flex">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm"
            >
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
          <div key={c.id} className="glass group relative overflow-hidden rounded-2xl p-5 transition hover:-translate-y-0.5 hover:glow-shadow-sm">
            <div className="pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-30 blur-3xl [background:var(--gradient-brand)]" />
            <div className="flex items-start justify-between gap-3">
              <Link to="/companies/$companyId" params={{ companyId: c.id }} className="flex min-w-0 items-center gap-3">
                <div className="gradient-brand-bg grid h-11 w-11 shrink-0 place-items-center rounded-xl text-white glow-shadow-sm">
                  <Building2 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="truncate font-semibold hover:underline">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.industry || "—"}</div>
                </div>
              </Link>
              <Badge tone="brand">{c.revenue || "—"}</Badge>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5 truncate"><Globe className="h-3.5 w-3.5" />{c.website || "—"}</div>
              <div className="flex items-center gap-1.5 truncate"><Phone className="h-3.5 w-3.5" />{c.phone || "—"}</div>
              <div className="flex items-center gap-1.5 truncate col-span-2"><Mail className="h-3.5 w-3.5" />{c.email || "—"}</div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" /> {c.employees} employees
              </div>
              <div className="flex items-center gap-2">
                <Avatar name={c.manager || "Unassigned"} tone={c.tone} />
                <span className="text-xs text-muted-foreground">{c.manager || "Unassigned"}</span>
                {addedIds.has(c.id) && (
                  <>
                    <button onClick={() => { setEditing(c); setModalOpen(true); }} title="Edit" className="glass grid h-7 w-7 place-items-center rounded-lg hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => handleDelete(c.id)} title="Delete" className="glass grid h-7 w-7 place-items-center rounded-lg hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="glass mt-6 rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No companies match your filters.
        </div>
      )}

      <CompanyModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        initial={editing ? { name: editing.name, industry: editing.industry, website: editing.website, phone: editing.phone, email: editing.email, employees: editing.employees, revenue: editing.revenue, manager: editing.manager } : EMPTY}
        editing={!!editing}
        onSave={handleSave}
      />
    </div>
  );
}

function CompanyModal({ open, onClose, initial, editing, onSave }: {
  open: boolean;
  onClose: () => void;
  initial: FormState;
  editing: boolean;
  onSave: (v: FormState) => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  useEffect(() => { setForm(initial); }, [initial]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? "Edit company" : "Add company"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!form.name) return; onSave(form); }}>
            {editing ? "Save changes" : "Create company"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
        <FormField label="Industry"><Input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} /></FormField>
        <FormField label="Website"><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="acme.io" /></FormField>
        <FormField label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></FormField>
        <FormField label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></FormField>
        <FormField label="Employees"><Input type="number" value={form.employees} onChange={(e) => setForm({ ...form, employees: Number(e.target.value) })} /></FormField>
        <FormField label="Revenue"><Input value={form.revenue} onChange={(e) => setForm({ ...form, revenue: e.target.value })} placeholder="$1.2M" /></FormField>
        <FormField label="Account manager"><Input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} /></FormField>
      </div>
    </Modal>
  );
}
