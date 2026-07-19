import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Megaphone, Trash2, Pencil } from "lucide-react";
import { PageHeader, GlassCard, Badge, StatCard } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";

export const Route = createFileRoute("/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — UniqueCRM" },
      { name: "description", content: "Multi-channel campaigns, sequences, and outreach." },
    ],
  }),
  component: CampaignsPage,
});

type Status = "Draft" | "Scheduled" | "Active" | "Completed";
type Channel = "Email" | "SMS" | "LinkedIn" | "Ads";
type Campaign = {
  id: string;
  name: string;
  channel: Channel;
  status: Status;
  audience: number;
  sent: number;
  opened: number;
  clicked: number;
};

const SEED: Campaign[] = [
  { id: "s1", name: "Q3 Product Launch", channel: "Email", status: "Active", audience: 4820, sent: 4820, opened: 2314, clicked: 612 },
  { id: "s2", name: "Renewal reminders", channel: "Email", status: "Scheduled", audience: 312, sent: 0, opened: 0, clicked: 0 },
  { id: "s3", name: "SDR outbound — Fintech", channel: "LinkedIn", status: "Active", audience: 180, sent: 142, opened: 96, clicked: 24 },
  { id: "s4", name: "Summer promo", channel: "Ads", status: "Completed", audience: 12400, sent: 12400, opened: 3120, clicked: 892 },
];

const tone: Record<Status, "brand" | "info" | "success" | "default"> = {
  Draft: "default", Scheduled: "info", Active: "brand", Completed: "success",
};

type Form = Omit<Campaign, "id">;
const EMPTY: Form = { name: "", channel: "Email", status: "Draft", audience: 0, sent: 0, opened: 0, clicked: 0 };

function CampaignsPage() {
  const { items: added, add, update, remove } = useRecordStore<Campaign>("campaigns");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);

  const combined = [...added, ...SEED];
  const addedIds = new Set(added.map((c) => c.id));

  const totalAudience = combined.reduce((a, c) => a + c.audience, 0);
  const totalSent = combined.reduce((a, c) => a + c.sent, 0);
  const totalClicks = combined.reduce((a, c) => a + c.clicked, 0);

  function openNew() { setEditing(null); setForm(EMPTY); setOpen(true); }
  function openEdit(c: Campaign) { setEditing(c); const { id, ...rest } = c; void id; setForm(rest); setOpen(true); }
  function save() {
    if (!form.name) return;
    if (editing) update(editing.id, form as Partial<Campaign>);
    else add(form);
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Campaigns"
        subtitle="Multi-channel outreach and nurture"
        actions={
          <button
            onClick={openNew}
            className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            New campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Total audience" value={totalAudience.toLocaleString()} delta="+12.4%" />
        <StatCard label="Messages sent" value={totalSent.toLocaleString()} delta="+18.2%" />
        <StatCard label="Total clicks" value={totalClicks.toLocaleString()} delta="+6.8%" />
      </div>

      <GlassCard className="mt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 pr-4 font-medium">Campaign</th>
                <th className="pb-3 pr-4 font-medium">Channel</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">Audience</th>
                <th className="pb-3 pr-4 font-medium">Sent</th>
                <th className="pb-3 pr-4 font-medium">Opened</th>
                <th className="pb-3 pr-4 font-medium">Clicked</th>
                <th className="pb-3" />
              </tr>
            </thead>
            <tbody>
              {combined.map((c) => (
                <tr key={c.id} className="border-t border-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-[color:var(--brand-pink)]" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">{c.channel}</td>
                  <td className="py-3 pr-4"><Badge tone={tone[c.status]}>{c.status}</Badge></td>
                  <td className="py-3 pr-4">{c.audience.toLocaleString()}</td>
                  <td className="py-3 pr-4">{c.sent.toLocaleString()}</td>
                  <td className="py-3 pr-4">{c.opened.toLocaleString()}</td>
                  <td className="py-3 pr-4 font-semibold gradient-text">{c.clicked.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    {addedIds.has(c.id) ? (
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => confirm("Delete this campaign?") && remove(c.id)} className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Edit campaign" : "New campaign"}
        footer={<><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>{editing ? "Save" : "Create"}</Button></>}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField label="Name"><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Q3 launch" /></FormField>
          <FormField label="Channel">
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as Channel })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">
              {(["Email", "SMS", "LinkedIn", "Ads"] as Channel[]).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </FormField>
          <FormField label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Status })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">
              {(["Draft", "Scheduled", "Active", "Completed"] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>
          <FormField label="Audience"><Input type="number" value={form.audience} onChange={(e) => setForm({ ...form, audience: Number(e.target.value) })} /></FormField>
          <FormField label="Sent"><Input type="number" value={form.sent} onChange={(e) => setForm({ ...form, sent: Number(e.target.value) })} /></FormField>
          <FormField label="Opened"><Input type="number" value={form.opened} onChange={(e) => setForm({ ...form, opened: Number(e.target.value) })} /></FormField>
          <FormField label="Clicked"><Input type="number" value={form.clicked} onChange={(e) => setForm({ ...form, clicked: Number(e.target.value) })} /></FormField>
        </div>
      </Modal>
    </div>
  );
}
