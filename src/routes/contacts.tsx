import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import {
  Search, Filter, Plus, LayoutGrid, Table as TableIcon,
  Mail, Phone, MoreHorizontal, Star, Download, Trash2, Pencil,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";
import { useOpenCreate } from "@/lib/use-open-create";

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
  jobTitle?: string;
  status: Status;
  tags: string[];
  lastActivity?: string;
  tone: number;
};

const STATIC_CONTACTS: Contact[] = [
  { id: "c1", name: "Ava Reynolds", company: "Northwind Labs", email: "ava@northwind.io", phone: "+1 (415) 555-2201", jobTitle: "VP Sales", status: "VIP", tags: ["Enterprise", "Priority"], lastActivity: "2h ago", tone: 0 },
  { id: "c2", name: "Marcus Chen", company: "Lumen Studios", email: "marcus@lumen.co", phone: "+1 (628) 555-9911", jobTitle: "Creative Director", status: "Active", tags: ["Design", "Retainer"], lastActivity: "Yesterday", tone: 1 },
  { id: "c3", name: "Priya Natarajan", company: "Halcyon Systems", email: "priya@halcyon.dev", phone: "+91 98765 12345", jobTitle: "CTO", status: "Lead", tags: ["Warm", "SaaS"], lastActivity: "3d ago", tone: 2 },
  { id: "c4", name: "Diego Alvarez", company: "Meridian & Co", email: "diego@meridian.com", phone: "+34 611 22 33 44", jobTitle: "Finance Lead", status: "Active", tags: ["Finance"], lastActivity: "1w ago", tone: 3 },
  { id: "c5", name: "Sofia Petrov", company: "Aster Health", email: "sofia@aster.health", phone: "+44 20 7946 0011", jobTitle: "Ops Manager", status: "Inactive", tags: ["Healthcare"], lastActivity: "3w ago", tone: 4 },
  { id: "c6", name: "Jamal Turner", company: "Arcadia Media", email: "jamal@arcadia.tv", phone: "+1 (312) 555-6688", jobTitle: "Head of Growth", status: "VIP", tags: ["Media", "Priority"], lastActivity: "5h ago", tone: 0 },
  { id: "c7", name: "Elena Rossi", company: "Volta Motors", email: "elena@volta.eu", phone: "+39 02 1234 5678", jobTitle: "Product Lead", status: "Active", tags: ["Automotive"], lastActivity: "2d ago", tone: 1 },
  { id: "c8", name: "Kenji Watanabe", company: "Origami Cloud", email: "kenji@origami.io", phone: "+81 3 5678 9012", jobTitle: "Founder", status: "Lead", tags: ["Cloud", "Trial"], lastActivity: "6d ago", tone: 2 },
];

const statusTone: Record<Status, "success" | "warning" | "info" | "brand"> = {
  Active: "success",
  Inactive: "warning",
  Lead: "info",
  VIP: "brand",
};

type FormState = Omit<Contact, "id" | "tone">;
const EMPTY: FormState = { name: "", company: "", email: "", phone: "", jobTitle: "", status: "Lead", tags: [], lastActivity: "just now" };

function ContactsPage() {
  const [view, setView] = useState<"table" | "card">("table");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const { items: added, add, update, remove } = useRecordStore<Contact>("contacts");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  useOpenCreate("contacts", () => { setEditing(null); setModalOpen(true); });

  const combined: Contact[] = useMemo(() => [...added, ...STATIC_CONTACTS], [added]);
  const addedIds = new Set(added.map((c) => c.id));

  const filtered = useMemo(() => {
    return combined.filter((c) => {
      const q = query.trim().toLowerCase();
      const matchQ =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      const matchS = status === "All" || c.status === status;
      return matchQ && matchS;
    });
  }, [query, status, combined]);

  function handleSave(form: FormState) {
    if (editing) {
      update(editing.id, form);
    } else {
      add({ ...form, tone: Math.floor(Math.random() * 5) } as Omit<Contact, "id">);
    }
    setModalOpen(false);
    setEditing(null);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this contact?")) remove(id);
  }

  function exportCsv() {
    const rows = ["name,company,email,phone,jobTitle,status,tags"]
      .concat(combined.map((c) => [c.name, c.company, c.email, c.phone, c.jobTitle ?? "", c.status, c.tags.join(";")].join(",")));
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "contacts.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle={`${filtered.length} contacts · tagged and searchable`}
        actions={
          <>
            <button onClick={exportCsv} className="glass hidden items-center gap-2 rounded-xl px-3 py-2 text-sm hover:bg-white/5 sm:inline-flex">
              <Download className="h-4 w-4" /> Export
            </button>
            <button
              onClick={() => { setEditing(null); setModalOpen(true); }}
              className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm"
            >
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
                  <th className="px-5 py-3 font-medium">Last activity</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
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
                          <div className="truncate text-xs text-muted-foreground">{c.jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.company}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.email}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.phone}</td>
                    <td className="px-5 py-3.5"><Badge tone={statusTone[c.status]}>{c.status}</Badge></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.lastActivity ?? "—"}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex justify-end gap-1">
                        <a href={`mailto:${c.email}`} title="Email" className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                        {addedIds.has(c.id) ? (
                          <>
                            <button
                              onClick={() => { setEditing(c); setModalOpen(true); }}
                              title="Edit"
                              className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              title="Delete"
                              className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        ) : (
                          <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        )}
                      </div>
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
                  {addedIds.has(c.id) && (
                    <>
                      <button onClick={() => { setEditing(c); setModalOpen(true); }} className="glass rounded-lg p-1.5 hover:glow-shadow-sm"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => handleDelete(c.id)} className="glass rounded-lg p-1.5 hover:glow-shadow-sm"><Trash2 className="h-3.5 w-3.5" /></button>
                    </>
                  )}
                  <a href={`mailto:${c.email}`} className="glass rounded-lg p-1.5 hover:glow-shadow-sm"><Mail className="h-3.5 w-3.5" /></a>
                  <a href={`tel:${c.phone}`} className="glass rounded-lg p-1.5 hover:glow-shadow-sm"><Phone className="h-3.5 w-3.5" /></a>
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

      <ContactModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        initial={editing ? { name: editing.name, company: editing.company, email: editing.email, phone: editing.phone, jobTitle: editing.jobTitle ?? "", status: editing.status, tags: editing.tags, lastActivity: editing.lastActivity } : EMPTY}
        editing={!!editing}
        onSave={handleSave}
      />
    </div>
  );
}

function ContactModal({ open, onClose, initial, editing, onSave }: {
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
      title={editing ? "Edit contact" : "Add contact"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!form.name || !form.email) return;
              onSave(form);
            }}
          >
            {editing ? "Save changes" : "Create contact"}
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" /></FormField>
        <FormField label="Company"><Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" /></FormField>
        <FormField label="Email"><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@acme.co" /></FormField>
        <FormField label="Phone"><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 555…" /></FormField>
        <FormField label="Job title"><Input value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} placeholder="Head of Sales" /></FormField>
        <FormField label="Status">
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
            className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
          >
            {(["Active", "Lead", "VIP", "Inactive"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </FormField>
      </div>
    </Modal>
  );
}
