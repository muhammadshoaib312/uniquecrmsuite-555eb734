import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Phone, Mail, MessageCircle, Target, Building2, ChevronLeft, Paperclip, Plus,
  Pencil, Trash2, StickyNote, Users, RefreshCw, CalendarClock, CheckCircle2, History,
} from "lucide-react";
import { GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { Button, Input } from "@/components/ui-kit";
import { LeadModal } from "@/components/lead-modal";
import { useLeadStore } from "@/lib/lead-store";
import { useRecordStore } from "@/lib/record-store";
import { useResource } from "@/hooks/useResource";
import { services } from "@/services";
import {
  logLeadActivity, followUpState, followUpTone, followUpLabel, formatFollowUp,
} from "@/lib/lead-activity";
import type { LeadActivity, LeadActivityType } from "@/types/models";

export const Route = createFileRoute("/leads/$leadId")({
  head: ({ params }) => ({ meta: [
    { title: `Lead ${params.leadId} — UniqueCRM` },
    { name: "description", content: "Lead details, activity timeline, and follow-ups." },
    { property: "og:title", content: `Lead ${params.leadId} — UniqueCRM` },
    { property: "og:description", content: "Lead details, activity timeline, and follow-ups." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: LeadDetails,
});

type RelatedTask = { id: string; title: string; due: string; leadId?: string; status: string };
type RelatedMeeting = { id: string; title: string; time: string; with?: string; leadId?: string };
type RelatedDocument = { id: string; name: string; related?: string; size?: string };

const activityIcon: Record<LeadActivityType, typeof StickyNote> = {
  note: StickyNote, call: Phone, email: Mail, meeting: Users, status: RefreshCw, "follow-up": CalendarClock,
};
const LOGGABLE: { type: LeadActivityType; label: string }[] = [
  { type: "note", label: "Note" },
  { type: "call", label: "Completed call" },
  { type: "email", label: "Email sent" },
  { type: "meeting", label: "Completed meeting" },
];
const titles: Record<LeadActivityType, string> = {
  note: "Note added", call: "Call completed", email: "Email sent", meeting: "Meeting completed", status: "Status change", "follow-up": "Follow-up",
};

function LeadDetails() {
  const { leadId } = Route.useParams();
  const navigate = useNavigate();
  const { added, update, remove } = useLeadStore();
  const activitySvc = useMemo(() => services.leadActivities, []);
  const { items: activities, loading: activitiesLoading } = useResource(activitySvc);
  const { items: tasks } = useRecordStore<RelatedTask>("tasks");
  const { items: meetings } = useRecordStore<RelatedMeeting>("meetings");
  const { items: documents } = useRecordStore<RelatedDocument>("documents");
  const [editOpen, setEditOpen] = useState(false);
  const [logType, setLogType] = useState<LeadActivityType>("note");
  const [logBody, setLogBody] = useState("");
  const [logActor, setLogActor] = useState("");
  const [logError, setLogError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fuDate, setFuDate] = useState("");
  const [fuTime, setFuTime] = useState("");
  const [fuNote, setFuNote] = useState("");
  const [fuError, setFuError] = useState("");

  const lead = added.find((item) => item.id === leadId);
  const timeline = useMemo(
    () => activities.filter((a) => a.leadId === leadId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [activities, leadId],
  );

  if (!lead) return <div className="mx-auto max-w-7xl"><Link to="/leads" className="text-xs text-muted-foreground">← Back to leads</Link><GlassCard className="mt-4 text-center">Lead not found.</GlassCard></div>;

  const relatedTasks = tasks.filter((task) => task.leadId === lead.id);
  const relatedMeetings = meetings.filter((meeting) => meeting.leadId === lead.id);
  const relatedDocs = documents.filter((doc) => doc.related === lead.name || doc.related === lead.company);
  const empty = <p className="mt-4 text-sm text-muted-foreground">No records yet.</p>;
  const fu = followUpState(lead);

  async function submitLog() {
    const body = logBody.trim();
    if (logType === "note" && !body) { setLogError("Write a note before saving."); return; }
    if (body.length > 2000) { setLogError("Keep it under 2000 characters."); return; }
    setLogError(""); setSaving(true);
    try {
      await logLeadActivity(lead!.id, logType, titles[logType], body, logActor || lead!.owner);
      setLogBody("");
    } catch {
      setLogError("Could not save this activity. Please try again.");
    } finally { setSaving(false); }
  }

  async function scheduleFollowUp() {
    if (!fuDate || Number.isNaN(Date.parse(fuDate))) { setFuError("Pick a follow-up date."); return; }
    if (fuNote.length > 500) { setFuError("Keep the note under 500 characters."); return; }
    setFuError("");
    update(lead!.id, { followUpDate: fuDate, followUpTime: fuTime, followUpNote: fuNote.trim(), followUpDone: false });
    const when = new Date(`${fuDate}T${fuTime || "23:59"}`).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", ...(fuTime ? { hour: "numeric", minute: "2-digit" } : {}) });
    await logLeadActivity(lead!.id, "follow-up", `Follow-up scheduled for ${when}`, fuNote, lead!.owner);
    setFuDate(""); setFuTime(""); setFuNote("");
  }

  async function completeFollowUp() {
    update(lead!.id, { followUpDone: true });
    await logLeadActivity(lead!.id, "follow-up", "Follow-up completed", lead!.followUpNote, lead!.owner);
  }

  function deleteLead() {
    if (!confirm(`Delete lead "${lead!.name}"? This also removes its activity timeline.`)) return;
    remove(lead!.id);
    const ids = timeline.map((a) => a.id);
    if (ids.length) void services.leadActivities.removeMany(ids);
    void navigate({ to: "/leads" });
  }

  return (
    <div className="mx-auto max-w-7xl">
      <Link to="/leads" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ChevronLeft className="h-3 w-3" />Back to leads</Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar name={lead.name} />
        <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-2xl font-bold sm:text-3xl">{lead.name}</h1><Badge tone="brand">{lead.status}</Badge><Badge tone="warning">{lead.priority} priority</Badge>{fu !== "none" && <Badge tone={followUpTone[fu]}>Follow-up: {followUpLabel[fu]}</Badge>}</div><p className="mt-1 text-sm text-muted-foreground">{lead.company || "No company"} · Lead {lead.id}</p></div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => setEditOpen(true)}><Pencil className="h-4 w-4" />Edit</Button>
          <Button variant="ghost" onClick={deleteLead}><Trash2 className="h-4 w-4" />Delete</Button>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <a href={lead.phone ? `tel:${lead.phone}` : undefined} className="glass flex items-center gap-3 rounded-xl p-4 text-sm"><Phone className="h-4 w-4" />Call</a>
        <a href={lead.email ? `mailto:${lead.email}` : undefined} className="glass flex items-center gap-3 rounded-xl p-4 text-sm"><Mail className="h-4 w-4" />Email</a>
        <a href={lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}` : undefined} className="glass flex items-center gap-3 rounded-xl p-4 text-sm"><MessageCircle className="h-4 w-4" />WhatsApp</a>
        <Link to="/deals" className="gradient-brand-bg flex items-center gap-3 rounded-xl p-4 text-sm text-white"><Target className="h-4 w-4" />Deals</Link>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <GlassCard><h2 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Lead Information</h2><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">{[["Full name",lead.name],["Email",lead.email],["Phone",lead.phone],["Source",lead.source],["Owner",lead.owner],["Created",lead.created]].map(([label,value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-sm font-medium">{value || "—"}</dd></div>)}</dl>{lead.notes && <div className="mt-4 border-t border-white/5 pt-4"><dt className="text-xs text-muted-foreground">Notes</dt><dd className="mt-1 whitespace-pre-wrap text-sm">{lead.notes}</dd></div>}</GlassCard>
          <GlassCard><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><Building2 className="h-4 w-4" />Company Information</h2><p className="text-sm">{lead.company || "No company linked"}</p></GlassCard>
          <GlassCard>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><History className="h-4 w-4" />Activity Timeline</h2>
            <div className="mt-4 space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex flex-wrap gap-2">
                {LOGGABLE.map((o) => (
                  <button key={o.type} onClick={() => { setLogType(o.type); setLogError(""); }} className={`rounded-full border px-3 py-1 text-xs font-medium transition ${logType === o.type ? "gradient-brand-bg glow-shadow-sm border-transparent text-white" : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"}`}>{o.label}</button>
                ))}
              </div>
              <textarea value={logBody} onChange={(e) => setLogBody(e.target.value)} placeholder={logType === "note" ? "Write a note…" : "Add details (optional)…"} rows={2} className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--ring)]" />
              <div className="flex flex-wrap items-center gap-2">
                <Input value={logActor} onChange={(e) => setLogActor(e.target.value)} placeholder={`Logged by (default: ${lead.owner || "unassigned"})`} className="min-w-0 flex-1" />
                <Button onClick={submitLog} disabled={saving}>{saving ? "Saving…" : "Add to timeline"}</Button>
              </div>
              {logError && <p className="text-xs text-rose-400">{logError}</p>}
            </div>
            {activitiesLoading ? (
              <div className="mt-4 space-y-2">{[0, 1].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-white/5" />)}</div>
            ) : timeline.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No activity yet. Notes, calls, meetings, status changes and follow-ups will appear here.</p>
            ) : (
              <ol className="mt-4 space-y-4 border-l border-white/10 pl-5">
                {timeline.map((a: LeadActivity) => {
                  const Icon = activityIcon[a.type] ?? StickyNote;
                  return (
                    <li key={a.id} className="relative">
                      <span className="glass absolute -left-[31px] top-0 grid h-6 w-6 place-items-center rounded-full"><Icon className="h-3 w-3" /></span>
                      <p className="text-sm font-medium">{a.title}</p>
                      {a.body && <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{a.body}</p>}
                      <p className="mt-1 text-[11px] text-muted-foreground">{new Date(a.createdAt).toLocaleString()}{a.actor ? ` · ${a.actor}` : ""}</p>
                    </li>
                  );
                })}
              </ol>
            )}
          </GlassCard>
        </div>
        <div className="space-y-6">
          <GlassCard>
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><CalendarClock className="h-4 w-4" />Follow-up</h2>
            {fu !== "none" ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between gap-2"><Badge tone={followUpTone[fu]}>{followUpLabel[fu]}</Badge><span className="text-xs text-muted-foreground">{formatFollowUp(lead)}</span></div>
                {lead.followUpNote && <p className="mt-2 text-sm">{lead.followUpNote}</p>}
                {fu !== "done" && <Button size="sm" className="mt-3" onClick={completeFollowUp}><CheckCircle2 className="h-4 w-4" />Mark completed</Button>}
              </div>
            ) : <p className="mt-4 text-sm text-muted-foreground">No follow-up scheduled.</p>}
            <div className="mt-4 space-y-2">
              <p className="text-xs text-muted-foreground">{fu === "none" || fu === "done" ? "Schedule a follow-up" : "Reschedule"}</p>
              <div className="grid grid-cols-2 gap-2">
                <Input type="date" value={fuDate} onChange={(e) => setFuDate(e.target.value)} aria-label="Follow-up date" />
                <Input type="time" value={fuTime} onChange={(e) => setFuTime(e.target.value)} aria-label="Follow-up time" />
              </div>
              <Input value={fuNote} onChange={(e) => setFuNote(e.target.value)} placeholder="Follow-up note" />
              {fuError && <p className="text-xs text-rose-400">{fuError}</p>}
              <Button size="sm" variant="ghost" onClick={scheduleFollowUp}><Plus className="h-4 w-4" />Save follow-up</Button>
            </div>
          </GlassCard>
          <GlassCard><h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><Plus className="h-4 w-4" />Tasks</h2>{relatedTasks.length ? relatedTasks.map((task) => <p key={task.id} className="mt-3 text-sm">{task.title} · {task.due || "No due date"}</p>) : empty}</GlassCard>
          <GlassCard><h2 className="text-sm font-semibold uppercase text-muted-foreground">Meetings</h2>{relatedMeetings.length ? relatedMeetings.map((meeting) => <p key={meeting.id} className="mt-3 text-sm">{meeting.title} · {meeting.time}</p>) : empty}</GlassCard>
          <GlassCard><h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><Paperclip className="h-4 w-4" />Files</h2>{relatedDocs.length ? relatedDocs.map((doc) => <p key={doc.id} className="mt-3 text-sm">{doc.name}</p>) : empty}</GlassCard>
        </div>
      </div>
      <LeadModal
        open={editOpen}
        editing={lead}
        onClose={() => setEditOpen(false)}
        onSave={(l) => {
          update(lead.id, l);
          if (l.status !== lead.status) void logLeadActivity(lead.id, "status", `Status changed from ${lead.status} to ${l.status}`, undefined, l.owner);
          setEditOpen(false);
        }}
      />
    </div>
  );
}
