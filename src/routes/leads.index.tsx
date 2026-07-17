import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useLeadStore, type StoredLead } from "@/lib/lead-store";

export const Route = createFileRoute("/leads/")({
  head: () => ({
    meta: [
      { title: "Leads — UniqueCRM" },
      { name: "description", content: "Capture, score, and convert prospects." },
    ],
  }),
  component: LeadsPage,
});

type Status = "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
type Priority = "High" | "Medium" | "Low";

const statusTone: Record<Status, { bg: string; text: string; ring: string }> = {
  New: { bg: "bg-sky-500/10", text: "text-sky-300", ring: "ring-sky-500/30" },
  Contacted: { bg: "bg-violet-500/10", text: "text-violet-300", ring: "ring-violet-500/30" },
  Qualified: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-300", ring: "ring-fuchsia-500/30" },
  Proposal: { bg: "bg-amber-500/10", text: "text-amber-300", ring: "ring-amber-500/30" },
  Won: { bg: "bg-emerald-500/10", text: "text-emerald-300", ring: "ring-emerald-500/30" },
  Lost: { bg: "bg-rose-500/10", text: "text-rose-300", ring: "ring-rose-500/30" },
};

const priorityTone: Record<Priority, "warning" | "info" | "default"> = {
  High: "warning",
  Medium: "info",
  Low: "default",
};

type Source = "Website" | "Referral" | "LinkedIn" | "Cold call" | "Event" | "Other";
const SOURCES: Source[] = ["Website", "Referral", "LinkedIn", "Cold call", "Event", "Other"];

type Lead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: Status;
  priority: Priority;
  source: Source;
  owner: string;
  created: string;
};

const allLeads: Lead[] = [
  { id: "L-1042", name: "Priya Nair", company: "Northwind", email: "priya@northwind.co", phone: "+1 555-872-1109", status: "Qualified", priority: "High", source: "Referral", owner: "Ava Chen", created: "Aug 12, 2026" },
  { id: "L-1041", name: "Michael Chen", company: "Globex", email: "m.chen@globex.io", phone: "+1 555-019-4432", status: "Proposal", priority: "High", source: "LinkedIn", owner: "Sofia Reyes", created: "Aug 11, 2026" },
  { id: "L-1040", name: "James O'Brien", company: "Stark Industries", email: "james@stark.io", phone: "+1 555-442-9921", status: "Contacted", priority: "Medium", source: "Event", owner: "Ava Chen", created: "Aug 10, 2026" },
  { id: "L-1039", name: "Aiko Tanaka", company: "Wayne Enterprises", email: "aiko@wayneenterprises.jp", phone: "+81 3-5555-2211", status: "New", priority: "Medium", source: "Website", owner: "Noah Kim", created: "Aug 9, 2026" },
  { id: "L-1038", name: "Lucas Meyer", company: "Hooli", email: "l.meyer@hooli.com", phone: "+1 555-128-3390", status: "Contacted", priority: "Low", source: "Cold call", owner: "Liam Patel", created: "Aug 8, 2026" },
  { id: "L-1037", name: "Emma Wilson", company: "Umbrella Co.", email: "emma@umbrella.co", phone: "+1 555-331-8890", status: "Qualified", priority: "High", source: "Website", owner: "Sofia Reyes", created: "Aug 7, 2026" },
  { id: "L-1036", name: "Diego Alvarez", company: "Initech", email: "diego@initech.dev", phone: "+1 555-662-4477", status: "Won", priority: "Medium", source: "Referral", owner: "Noah Kim", created: "Aug 6, 2026" },
  { id: "L-1035", name: "Sarah Johnson", company: "Acme Corp", email: "sarah@acmecorp.com", phone: "+1 555-010-2842", status: "Proposal", priority: "High", source: "LinkedIn", owner: "Ava Chen", created: "Aug 5, 2026" },
  { id: "L-1034", name: "Rahul Desai", company: "Vandelay", email: "rahul@vandelay.co", phone: "+1 555-882-1104", status: "New", priority: "Low", source: "Website", owner: "Liam Patel", created: "Aug 4, 2026" },
  { id: "L-1033", name: "Yara Haddad", company: "Massive Dynamic", email: "yara@massivedynamic.com", phone: "+1 555-773-9084", status: "Lost", priority: "Low", source: "Event", owner: "Sofia Reyes", created: "Aug 3, 2026" },
  { id: "L-1032", name: "Oliver Grant", company: "Pied Piper", email: "oliver@piedpiper.io", phone: "+1 555-224-8811", status: "Qualified", priority: "Medium", source: "Referral", owner: "Noah Kim", created: "Aug 2, 2026" },
  { id: "L-1031", name: "Chen Wei", company: "Cyberdyne", email: "chen@cyberdyne.ai", phone: "+1 555-661-2038", status: "Contacted", priority: "High", source: "LinkedIn", owner: "Ava Chen", created: "Aug 1, 2026" },
];

const PAGE_SIZE = 8;

function LeadsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [source, setSource] = useState<Source | "All">("All");
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<StoredLead | null>(null);
  const { added, add, update, remove } = useLeadStore();

  const combined = useMemo<Lead[]>(() => [...added as Lead[], ...allLeads], [added]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return combined.filter(
      (l) =>
        (status === "All" || l.status === status) &&
        (source === "All" || l.source === source) &&
        (q === "" ||
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)),
    );
  }, [query, status, source, combined]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const rows = filtered.slice((pageSafe - 1) * PAGE_SIZE, pageSafe * PAGE_SIZE);
  const addedIds = new Set(added.map((l) => l.id));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Leads"
        subtitle={`${filtered.length} leads · ${combined.filter((l) => l.status === "New").length} new`}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const blob = new Blob(
                  ["name,company,email,phone,status,priority,owner,created\n" +
                    combined.map((l) => [l.name, l.company, l.email, l.phone, l.status, l.priority, l.owner, l.created].join(",")).join("\n")],
                  { type: "text/csv" },
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = "leads.csv"; a.click();
                URL.revokeObjectURL(url);
              }}
              className="glass inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => alert("Import CSV coming soon — connect Lovable Cloud to enable.")}
              className="glass inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button
              onClick={() => setAddOpen(true)}
              className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        }
      />

      <GlassCard className="!p-4">
        {/* Search + filters row */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, company, email…"
              className="glass h-10 w-full rounded-lg border-0 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--ring)]"
            />
          </div>
          <button className="glass inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Status chips */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {(["All", "New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const).map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? "gradient-brand-bg glow-shadow-sm border-transparent text-white"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-3 pb-3 font-medium">Name</th>
                <th className="px-3 pb-3 font-medium">Company</th>
                <th className="px-3 pb-3 font-medium">Email</th>
                <th className="px-3 pb-3 font-medium">Phone</th>
                <th className="px-3 pb-3 font-medium">Status</th>
                <th className="px-3 pb-3 font-medium">Priority</th>
                <th className="px-3 pb-3 font-medium">Owner</th>
                <th className="px-3 pb-3 font-medium">Created</th>
                <th className="px-3 pb-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((l, i) => {
                const tone = statusTone[l.status];
                return (
                  <tr key={l.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={l.name} tone={i} />
                        <Link
                          to="/leads/$leadId"
                          params={{ leadId: l.id }}
                          className="font-medium hover:underline"
                        >
                          {l.name}
                        </Link>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{l.company}</td>
                    <td className="px-3 py-3 text-muted-foreground">{l.email}</td>
                    <td className="px-3 py-3 text-muted-foreground">{l.phone}</td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full ${tone.bg} ${tone.text} px-2.5 py-0.5 text-[11px] font-medium ring-1 ${tone.ring}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {l.status}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <Badge tone={priorityTone[l.priority]}>{l.priority}</Badge>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar name={l.owner} tone={i + 2} />
                        <span className="text-muted-foreground">{l.owner}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{l.created}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-end gap-1">
                        <a href={`mailto:${l.email}`} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                          <Mail className="h-3.5 w-3.5" />
                        </a>
                        <a href={`tel:${l.phone}`} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                          <Phone className="h-3.5 w-3.5" />
                        </a>
                        {addedIds.has(l.id) ? (
                          <button
                            onClick={() => remove(l.id)}
                            title="Delete lead"
                            className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-16 text-center text-sm text-muted-foreground">
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4 text-xs">
          <p className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {(pageSafe - 1) * PAGE_SIZE + 1}–{Math.min(pageSafe * PAGE_SIZE, filtered.length)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={pageSafe === 1}
              className="glass grid h-8 w-8 place-items-center rounded-lg disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const n = i + 1;
              const active = n === pageSafe;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`grid h-8 min-w-8 place-items-center rounded-lg px-2 text-sm font-medium transition ${
                    active
                      ? "gradient-brand-bg glow-shadow-sm text-white"
                      : "glass text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={pageSafe === totalPages}
              className="glass grid h-8 w-8 place-items-center rounded-lg disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>

      <AddLeadModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={(l) => {
          add(l);
          setAddOpen(false);
          setPage(1);
        }}
      />
    </div>
  );
}

function AddLeadModal({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (l: Omit<StoredLead, "id" | "created">) => void;
}) {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<StoredLead["status"]>("New");
  const [priority, setPriority] = useState<StoredLead["priority"]>("Medium");
  const [owner, setOwner] = useState("Alex N.");

  const reset = () => {
    setName(""); setCompany(""); setEmail(""); setPhone("");
    setStatus("New"); setPriority("Medium"); setOwner("Alex N.");
  };

  return (
    <Modal
      open={open}
      onClose={() => { onClose(); reset(); }}
      title="Add lead"
      footer={
        <>
          <Button variant="ghost" onClick={() => { onClose(); reset(); }}>Cancel</Button>
          <Button
            onClick={() => {
              if (!name || !email) return;
              onCreate({ name, company, email, phone, status, priority, owner });
              reset();
            }}
          >
            Create lead
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Full name">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </FormField>
        <FormField label="Company">
          <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" />
        </FormField>
        <FormField label="Email">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@acme.co" />
        </FormField>
        <FormField label="Phone">
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555…" />
        </FormField>
        <FormField label="Status">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StoredLead["status"])}
            className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
          >
            {(["New", "Contacted", "Qualified", "Proposal", "Won", "Lost"] as const).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Priority">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as StoredLead["priority"])}
            className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]"
          >
            {(["High", "Medium", "Low"] as const).map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Owner">
          <Input value={owner} onChange={(e) => setOwner(e.target.value)} />
        </FormField>
      </div>
    </Modal>
  );
}
