import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, FileSpreadsheet, Trash2, Pencil } from "lucide-react";
import { PageHeader, GlassCard, Badge, StatCard } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";
import { useOpenCreate } from "@/lib/use-open-create";

export const Route = createFileRoute("/quotes")({
  head: () => ({
    meta: [
      { title: "Quotes — UniqueCRM" },
      { name: "description", content: "Sales quotes and proposals." },
    ],
  }),
  component: QuotesPage,
});

type Status = "Draft" | "Sent" | "Accepted" | "Rejected";
type Quote = { id: string; number: string; client: string; amount: number; status: Status; expires: string };
const SEED: Quote[] = [
  { id: "s1", number: "Q-1042", client: "Acme Corp", amount: 42000, status: "Sent", expires: "Aug 24, 2026" },
  { id: "s2", number: "Q-1041", client: "Northwind", amount: 18500, status: "Accepted", expires: "Aug 20, 2026" },
  { id: "s3", number: "Q-1040", client: "Globex", amount: 67200, status: "Draft", expires: "Aug 30, 2026" },
  { id: "s4", number: "Q-1039", client: "Initech", amount: 9800, status: "Rejected", expires: "Aug 10, 2026" },
];
const tone: Record<Status, "brand" | "info" | "success" | "warning"> = { Draft: "info", Sent: "brand", Accepted: "success", Rejected: "warning" };
type Form = Omit<Quote, "id">;
const EMPTY: Form = { number: "", client: "", amount: 0, status: "Draft", expires: "" };

function QuotesPage() {
  const { items: added, add, update, remove } = useRecordStore<Quote>("quotes");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Quote | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const combined = [...added, ...SEED];
  const addedIds = new Set(added.map((q) => q.id));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Quotes"
        subtitle={`${combined.length} quotes across your pipeline`}
        actions={
          <button onClick={() => { setEditing(null); setForm(EMPTY); setOpen(true); }} className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
            <Plus className="h-4 w-4" /> New quote
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Open value" value={`$${combined.filter((q) => q.status === "Sent" || q.status === "Draft").reduce((a, q) => a + q.amount, 0).toLocaleString()}`} />
        <StatCard label="Accepted" value={`$${combined.filter((q) => q.status === "Accepted").reduce((a, q) => a + q.amount, 0).toLocaleString()}`} />
        <StatCard label="Total quotes" value={String(combined.length)} />
      </div>
      <GlassCard className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="pb-3 pr-4 font-medium">Number</th><th className="pb-3 pr-4 font-medium">Client</th><th className="pb-3 pr-4 font-medium">Amount</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3 pr-4 font-medium">Expires</th><th className="pb-3" />
            </tr></thead>
            <tbody>{combined.map((q) => (
              <tr key={q.id} className="border-t border-white/5">
                <td className="py-3 pr-4"><div className="flex items-center gap-2"><FileSpreadsheet className="h-4 w-4 text-[color:var(--brand-pink)]" /><span className="font-mono text-xs font-medium">{q.number}</span></div></td>
                <td className="py-3 pr-4 font-medium">{q.client}</td>
                <td className="py-3 pr-4 font-semibold gradient-text">${q.amount.toLocaleString()}</td>
                <td className="py-3 pr-4"><Badge tone={tone[q.status]}>{q.status}</Badge></td>
                <td className="py-3 pr-4 text-muted-foreground">{q.expires}</td>
                <td className="py-3 text-right">{addedIds.has(q.id) ? (
                  <div className="flex justify-end gap-1">
                    <button onClick={() => { setEditing(q); const { id, ...rest } = q; void id; setForm(rest); setOpen(true); }} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => confirm("Delete this quote?") && remove(q.id)} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>) : <span className="text-xs text-muted-foreground">—</span>}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit quote" : "New quote"} footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { if (!form.client) return; editing ? update(editing.id, form as Partial<Quote>) : add(form); setOpen(false); }}>{editing ? "Save" : "Create"}</Button></>}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Number"><Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="Q-1050" /></FormField>
          <FormField label="Client"><Input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></FormField>
          <FormField label="Amount ($)"><Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></FormField>
          <FormField label="Expires"><Input value={form.expires} onChange={(e) => setForm({ ...form, expires: e.target.value })} placeholder="Aug 30, 2026" /></FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">
              {(["Draft", "Sent", "Accepted", "Rejected"] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
        </div>
      </Modal>
    </div>
  );
}
