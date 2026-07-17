import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Plus, Video, Phone, MapPin, Clock, CalendarDays, Trash2 } from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { Modal, Button, FormField, Input } from "@/components/ui-kit";
import { useRecordStore } from "@/lib/record-store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meetings — UniqueCRM" },
      { name: "description", content: "Every call, demo, and onsite in one place." },
    ],
  }),
  component: MeetingsPage,
});

type MeetingType = "Video" | "Call" | "Onsite";
type StoredMeeting = {
  id: string;
  title: string;
  time: string;
  duration: string;
  type: MeetingType;
  with: string;
};

const STATIC_MEETINGS: StoredMeeting[] = [
  { id: "m1", title: "Demo — Umbrella Co.", time: "Today, 2:00 PM", duration: "45m", type: "Video", with: "Emma Wilson" },
  { id: "m2", title: "Discovery call — Hooli", time: "Today, 4:30 PM", duration: "30m", type: "Call", with: "Lucas Meyer" },
  { id: "m3", title: "QBR — Acme Corp", time: "Tomorrow, 10:00 AM", duration: "60m", type: "Video", with: "Sarah Johnson" },
  { id: "m4", title: "Renewal — Soylent", time: "Aug 16, 1:00 PM", duration: "30m", type: "Video", with: "Diego Alvarez" },
  { id: "m5", title: "Onsite — Stark Industries", time: "Aug 18, 9:00 AM", duration: "3h", type: "Onsite", with: "James O'Brien" },
  { id: "m6", title: "Kickoff — Globex API", time: "Aug 20, 11:00 AM", duration: "45m", type: "Video", with: "Michael Chen" },
];

const typeMeta: Record<MeetingType, { icon: typeof Video; tone: "brand" | "info" | "warning" }> = {
  Video: { icon: Video, tone: "brand" },
  Call: { icon: Phone, tone: "info" },
  Onsite: { icon: MapPin, tone: "warning" },
};

type FormState = Omit<StoredMeeting, "id">;
const EMPTY: FormState = { title: "", time: "", duration: "30m", type: "Video", with: "" };

function MeetingsPage() {
  const { items: added, add, remove } = useRecordStore<StoredMeeting>("meetings");
  const [modalOpen, setModalOpen] = useState(false);
  const combined = useMemo(() => [...added, ...STATIC_MEETINGS], [added]);
  const addedIds = new Set(added.map((m) => m.id));

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Meetings"
        subtitle={`${combined.length} scheduled · calls, demos, and onsites`}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            Schedule
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <GlassCard>
          <ul className="space-y-3">
            {combined.map((m, i) => {
              const Icon = typeMeta[m.type].icon;
              return (
                <li
                  key={m.id}
                  className="group flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition hover:border-white/10 hover:bg-white/[0.05]"
                >
                  <div className="gradient-brand-bg glow-shadow-sm grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{m.title}</p>
                    <p className="mt-0.5 flex items-center gap-2 truncate text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {m.time} · {m.duration}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar name={m.with} tone={i} />
                      <span className="text-xs text-muted-foreground">with {m.with}</span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <Badge tone={typeMeta[m.type].tone}>{m.type}</Badge>
                    <div className="flex items-center gap-1">
                      {addedIds.has(m.id) && (
                        <button
                          onClick={() => confirm("Delete meeting?") && remove(m.id)}
                          className="glass grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:text-rose-300"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button className="text-xs text-muted-foreground hover:text-foreground">Join</button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[color:var(--brand-pink)]" />
            <h3 className="text-sm font-semibold">This week</h3>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1">
            {[3, 5, 2, 4, 1, 0, 0].map((n, i) => (
              <div
                key={i}
                className="relative aspect-square rounded-lg border border-white/5 bg-white/[0.03] p-1"
              >
                <span className="text-[10px] text-muted-foreground">{11 + i}</span>
                {n > 0 && (
                  <div
                    className="absolute bottom-1 left-1 right-1 rounded-md text-center text-[9px] font-semibold text-white"
                    style={{
                      background: "var(--gradient-brand)",
                      padding: "1px 0",
                      boxShadow: "0 0 8px oklch(0.72 0.25 340 / 0.5)",
                    }}
                  >
                    {n}
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {combined.length} meetings scheduled across your team.
          </p>
        </GlassCard>
      </div>

      <MeetingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(f) => { add(f as Omit<StoredMeeting, "id">); setModalOpen(false); }}
      />
    </div>
  );
}

function MeetingModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (f: FormState) => void }) {
  const [form, setForm] = useState<FormState>(EMPTY);
  useEffect(() => { if (open) setForm(EMPTY); }, [open]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Schedule meeting"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { if (!form.title || !form.time) return; onSave(form); }}>Schedule</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Demo — Acme" /></FormField>
        <FormField label="With"><Input value={form.with} onChange={(e) => setForm({ ...form, with: e.target.value })} placeholder="Jane Doe" /></FormField>
        <FormField label="Date & time"><Input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} placeholder="Aug 24, 10:00 AM" /></FormField>
        <FormField label="Duration"><Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="45m" /></FormField>
        <FormField label="Type">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as MeetingType })} className="glass h-10 w-full rounded-lg border-0 px-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]">
            {(["Video", "Call", "Onsite"] as const).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
      </div>
    </Modal>
  );
}
