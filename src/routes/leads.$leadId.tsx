import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MessageCircle, Target, Building2, ChevronLeft, Paperclip, Plus } from "lucide-react";
import { GlassCard, Badge, Avatar } from "@/components/crm-ui";
import { useLeadStore } from "@/lib/lead-store";
import { useRecordStore } from "@/lib/record-store";

export const Route = createFileRoute("/leads/$leadId")({
  head: ({ params }) => ({ meta: [
    { title: `Lead ${params.leadId} — UniqueCRM` },
    { name: "description", content: "Lead details, activity, and next steps." },
    { property: "og:title", content: `Lead ${params.leadId} — UniqueCRM` },
    { property: "og:description", content: "Lead details, activity, and next steps." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: LeadDetails,
});

type RelatedTask = { id: string; title: string; due: string; leadId?: string; status: string };
type RelatedMeeting = { id: string; title: string; time: string; with?: string; leadId?: string };
type RelatedDocument = { id: string; name: string; related?: string; size?: string };

function LeadDetails() {
  const { leadId } = Route.useParams();
  const { added } = useLeadStore();
  const { items: tasks } = useRecordStore<RelatedTask>("tasks");
  const { items: meetings } = useRecordStore<RelatedMeeting>("meetings");
  const { items: documents } = useRecordStore<RelatedDocument>("documents");
  const lead = added.find((item) => item.id === leadId);
  if (!lead) return <div className="mx-auto max-w-7xl"><Link to="/leads" className="text-xs text-muted-foreground">← Back to leads</Link><GlassCard className="mt-4 text-center">Lead not found.</GlassCard></div>;
  const relatedTasks = tasks.filter((task) => task.leadId === lead.id);
  const relatedMeetings = meetings.filter((meeting) => meeting.leadId === lead.id);
  const relatedDocs = documents.filter((doc) => doc.related === lead.name || doc.related === lead.company);
  const empty = <p className="mt-4 text-sm text-muted-foreground">No records yet.</p>;
  return (
    <div className="mx-auto max-w-7xl">
      <Link to="/leads" className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ChevronLeft className="h-3 w-3" />Back to leads</Link>
      <div className="mb-6 flex items-center gap-4">
        <Avatar name={lead.name} />
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h1 className="truncate text-2xl font-bold sm:text-3xl">{lead.name}</h1><Badge tone="brand">{lead.status}</Badge><Badge tone="warning">{lead.priority} priority</Badge></div><p className="mt-1 text-sm text-muted-foreground">{lead.company || "No company"} · Lead {lead.id}</p></div>
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <a href={lead.phone ? `tel:${lead.phone}` : undefined} className="glass flex items-center gap-3 rounded-xl p-4 text-sm"><Phone className="h-4 w-4" />Call</a>
        <a href={lead.email ? `mailto:${lead.email}` : undefined} className="glass flex items-center gap-3 rounded-xl p-4 text-sm"><Mail className="h-4 w-4" />Email</a>
        <a href={lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}` : undefined} className="glass flex items-center gap-3 rounded-xl p-4 text-sm"><MessageCircle className="h-4 w-4" />WhatsApp</a>
        <Link to="/deals" className="gradient-brand-bg flex items-center gap-3 rounded-xl p-4 text-sm text-white"><Target className="h-4 w-4" />Deals</Link>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <GlassCard><h2 className="mb-4 text-sm font-semibold uppercase text-muted-foreground">Lead Information</h2><dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">{[["Full name",lead.name],["Email",lead.email],["Phone",lead.phone],["Source",lead.source],["Owner",lead.owner],["Created",lead.created]].map(([label,value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-medium">{value || "—"}</dd></div>)}</dl></GlassCard>
          <GlassCard><h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><Building2 className="h-4 w-4" />Company Information</h2><p className="text-sm">{lead.company || "No company linked"}</p></GlassCard>
          <GlassCard><h2 className="text-sm font-semibold uppercase text-muted-foreground">Activity Timeline</h2>{empty}</GlassCard>
          <GlassCard><h2 className="text-sm font-semibold uppercase text-muted-foreground">Notes</h2>{empty}<textarea placeholder="Write a note…" rows={2} className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm outline-none" /></GlassCard>
        </div>
        <div className="space-y-6">
          <GlassCard><h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><Plus className="h-4 w-4" />Tasks</h2>{relatedTasks.length ? relatedTasks.map((task) => <p key={task.id} className="mt-3 text-sm">{task.title} · {task.due || "No due date"}</p>) : empty}</GlassCard>
          <GlassCard><h2 className="text-sm font-semibold uppercase text-muted-foreground">Meetings</h2>{relatedMeetings.length ? relatedMeetings.map((meeting) => <p key={meeting.id} className="mt-3 text-sm">{meeting.title} · {meeting.time}</p>) : empty}</GlassCard>
          <GlassCard><h2 className="flex items-center gap-2 text-sm font-semibold uppercase text-muted-foreground"><Paperclip className="h-4 w-4" />Files</h2>{relatedDocs.length ? relatedDocs.map((doc) => <p key={doc.id} className="mt-3 text-sm">{doc.name}</p>) : empty}</GlassCard>
        </div>
      </div>
    </div>
  );
}
