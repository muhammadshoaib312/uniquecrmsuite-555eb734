import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, LifeBuoy, Trash2 } from "lucide-react";
import { PageHeader, GlassCard, Badge, StatCard } from "@/components/crm-ui";
import { Modal, Button, FormField, Input, Textarea } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";

export const Route = createFileRoute("/support")({
  head: () => ({ meta: [{ title: "Support — UniqueCRM" }, { name: "description", content: "Customer support tickets and SLA tracking." }] }),
  component: SupportPage,
});

type Priority = "Low" | "Medium" | "High" | "Urgent";
type Status = "Open" | "In Progress" | "Waiting" | "Resolved";
type Ticket = { id: string; subject: string; requester: string; priority: Priority; status: Status; description: string };

const SEED: Ticket[] = [
  { id: "s1", subject: "Cannot export contacts CSV", requester: "Emma Wilson", priority: "High", status: "In Progress", description: "Export returns empty file." },
  { id: "s2", subject: "Billing question — INV-2038", requester: "Diego Alvarez", priority: "Medium", status: "Waiting", description: "Needs a copy of the invoice." },
  { id: "s3", subject: "Add SSO for Okta", requester: "James O'Brien", priority: "Low", status: "Open", description: "Requesting SAML SSO." },
  { id: "s4", subject: "Sync stopped — HubSpot", requester: "Sarah Johnson", priority: "Urgent", status: "Open", description: "Two-way sync paused overnight." },
];
const pTone: Record<Priority, "warning" | "info" | "default" | "brand"> = { Urgent: "warning", High: "warning", Medium: "info", Low: "default" };
const sTone: Record<Status, "brand" | "info" | "success" | "default"> = { Open: "brand", "In Progress": "info", Waiting: "default", Resolved: "success" };
type Form = Omit<Ticket, "id">;
const EMPTY: Form = { subject: "", requester: "", priority: "Medium", status: "Open", description: "" };

function SupportPage() {
  const { items: added, add, update, remove } = useRecordStore<Ticket>("tickets");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const combined = [...added, ...SEED];
  const addedIds = new Set(added.map((t) => t.id));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Support" subtitle={`${combined.length} tickets across your queue`} actions={
        <button onClick={() => { setForm(EMPTY); setOpen(true); }} className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"><Plus className="h-4 w-4" /> New ticket</button>
      } />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard label="Open" value={String(combined.filter((t) => t.status === "Open").length)} />
        <StatCard label="In progress" value={String(combined.filter((t) => t.status === "In Progress").length)} />
        <StatCard label="Waiting" value={String(combined.filter((t) => t.status === "Waiting").length)} />
        <StatCard label="Resolved" value={String(combined.filter((t) => t.status === "Resolved").length)} />
      </div>
      <GlassCard className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase tracking-wider text-muted-foreground"><th className="pb-3 pr-4 font-medium">Subject</th><th className="pb-3 pr-4 font-medium">Requester</th><th className="pb-3 pr-4 font-medium">Priority</th><th className="pb-3 pr-4 font-medium">Status</th><th className="pb-3" /></tr></thead>
            <tbody>{combined.map((t) => (
              <tr key={t.id} className="border-t border-white/5">
                <td className="py-3 pr-4"><div className="flex items-center gap-2"><LifeBuoy className="h-4 w-4 text-[color:var(--brand-pink)]" /><span className="font-medium">{t.subject}</span></div></td>
                <td className="py-3 pr-4 text-muted-foreground">{t.requester}</td>
                <td className="py-3 pr-4"><Badge tone={pTone[t.priority]}>{t.priority}</Badge></td>
                <td className="py-3 pr-4">
                  {addedIds.has(t.id) ? (
                    <select value={t.status} onChange={(e) => update(t.id, { status: e.target.value as Status })} className="glass h-8 rounded-lg border-0 px-2 text-xs outline-none focus:ring-2 focus:ring-[color:var(--ring)]">
                      {(["Open", "In Progress", "Waiting", "Resolved"] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  ) : <Badge tone={sTone[t.status]}>{t.status}</Badge>}
                </td>
                <td className="py-3 text-right">{addedIds.has(t.id) && (
                  <button onClick={() => confirm("Delete this ticket?") && remove(t.id)} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                )}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </GlassCard>
      <Modal open={open} onClose={() => setOpen(false)} title="New ticket" footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={() => { if (!form.subject) return; add(form); setOpen(false); }}>Create</Button></>}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Subject"><Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></FormField>
          <FormField label="Requester"><Input value={form.requester} onChange={(e) => setForm({ ...form, requester: e.target.value })} /></FormField>
          <FormField label="Priority">
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">{(["Low", "Medium", "High", "Urgent"] as Priority[]).map((p) => <option key={p} value={p}>{p}</option>)}</select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">{(["Open", "In Progress", "Waiting", "Resolved"] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}</select>
          </FormField>
          <div className="sm:col-span-2"><FormField label="Description"><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField></div>
        </div>
      </Modal>
    </div>
  );
}
