import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Phone,
  Mail,
  MessageCircle,
  Target,
  Building2,
  Globe,
  MapPin,
  Users,
  ChevronLeft,
  Paperclip,
  FileText,
  Download,
  Plus,
  Clock,
  CheckCircle2,
  Video,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/leads/$leadId")({
  head: ({ params }) => ({
    meta: [
      { title: `Lead ${params.leadId} — UniqueCRM` },
      { name: "description", content: "Lead details, activity, and next steps." },
    ],
  }),
  component: LeadDetails,
});

function LeadDetails() {
  const { leadId } = Route.useParams();

  return (
    <div className="mx-auto max-w-7xl">
      <Link
        to="/leads"
        className="mb-4 inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-3 w-3" />
        Back to leads
      </Link>

      <div className="mb-6 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="gradient-brand-bg glow-shadow grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-lg font-bold text-white">
            PN
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">Priya Nair</h1>
              <Badge tone="brand">Qualified</Badge>
              <Badge tone="warning">High priority</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Founder · Northwind · Lead {leadId} · Score{" "}
              <span className="gradient-text font-semibold">92</span>
            </p>
          </div>
        </div>
        <button className="gradient-brand-bg glow-shadow-sm hidden items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] sm:inline-flex">
          <Target className="h-4 w-4" />
          Convert to Deal
        </button>
      </div>

      {/* Quick actions */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <QuickAction icon={Phone} label="Call" />
        <QuickAction icon={Mail} label="Email" />
        <QuickAction icon={MessageCircle} label="WhatsApp" />
        <QuickAction icon={Target} label="Convert" primary />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left column */}
        <div className="min-w-0 space-y-6">
          {/* Lead information */}
          <GlassCard>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Lead Information
            </h2>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" value="Priya Nair" />
              <Field label="Title" value="Founder & CEO" />
              <Field label="Email" value="priya@northwind.co" />
              <Field label="Phone" value="+1 (555) 872-1109" />
              <Field label="Source" value="Website" />
              <Field label="Owner" value="Ava Chen" />
              <Field label="Created" value="Aug 12, 2026" />
              <Field label="Last contacted" value="2 days ago" />
            </dl>
          </GlassCard>

          {/* Company information */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Company Information
              </h2>
              <Badge tone="info">Startup · 42 employees</Badge>
            </div>
            <div className="flex items-start gap-4">
              <div className="gradient-brand-bg grid h-12 w-12 shrink-0 place-items-center rounded-xl text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-base font-semibold">Northwind</p>
                <p className="text-xs text-muted-foreground">E-commerce infrastructure</p>
                <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <InfoRow icon={Globe} label="northwind.co" />
                  <InfoRow icon={MapPin} label="Austin, TX" />
                  <InfoRow icon={Users} label="42 employees" />
                  <InfoRow icon={Target} label="4 open deals · $120K" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Activity timeline */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Activity Timeline
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">Filter</button>
            </div>
            <ol className="relative space-y-5 border-l border-white/10 pl-6">
              <TimelineItem tone="brand" title="Sent proposal" desc="Enterprise plan v2 — includes SSO and dedicated support." time="Today, 11:20 AM" />
              <TimelineItem tone="info" title="Logged a call" desc="Discussed integration timeline. Priya requested a follow-up demo." time="Yesterday, 3:00 PM" />
              <TimelineItem tone="warning" title="Meeting scheduled" desc="Discovery call for Aug 14 at 10 AM." time="Aug 10, 2026" />
              <TimelineItem tone="default" title="Lead created" desc="Sourced from website contact form." time="Aug 12, 2026" />
            </ol>
          </GlassCard>

          {/* Notes */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Notes
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">Add note</button>
            </div>
            <div className="space-y-3">
              <NoteCard
                author="Ava Chen"
                time="Today, 11:35 AM"
                text="Priya asked about our compliance roadmap — specifically SOC 2 timing. Send over the whitepaper before end of week."
              />
              <NoteCard
                author="Sofia Reyes"
                time="Aug 11, 2026"
                text="Warm intro from their investor Chen Wei at Cyberdyne. High intent."
              />
            </div>
            <textarea
              placeholder="Write a note…"
              rows={2}
              className="mt-4 w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--ring)]"
            />
          </GlassCard>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Tasks */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Tasks
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="space-y-2.5">
              <TaskRow label="Send SOC 2 whitepaper" due="Today, 5 PM" done={false} />
              <TaskRow label="Book follow-up demo" due="Aug 14" done={false} />
              <TaskRow label="Loop in solutions engineer" due="Aug 8" done={true} />
            </ul>
          </GlassCard>

          {/* Meetings */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Meetings
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">Schedule</button>
            </div>
            <ul className="space-y-3">
              <MeetingRow title="Discovery — Northwind" when="Today, 10 AM" />
              <MeetingRow title="Demo follow-up" when="Aug 16, 2 PM" />
            </ul>
          </GlassCard>

          {/* Files */}
          <GlassCard>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Files
              </h2>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                <Paperclip className="h-3.5 w-3.5" />
              </button>
            </div>
            <ul className="space-y-2">
              <FileRow name="Northwind_proposal_v2.pdf" size="1.2 MB" />
              <FileRow name="SOC2_whitepaper.pdf" size="820 KB" />
              <FileRow name="Discovery_notes.docx" size="42 KB" />
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  icon: Icon,
  label,
  primary,
}: {
  icon: typeof Phone;
  label: string;
  primary?: boolean;
}) {
  return (
    <button
      className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
        primary
          ? "gradient-brand-bg glow-shadow-sm border-transparent text-white"
          : "glass border-white/5"
      }`}
    >
      <div
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
          primary ? "bg-white/15" : "gradient-brand-bg glow-shadow-sm text-white"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 truncate text-sm font-medium">{value}</dd>
    </div>
  );
}

function InfoRow({ icon: Icon, label }: { icon: typeof Globe; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="h-3.5 w-3.5 shrink-0" />
      <span className="truncate">{label}</span>
    </div>
  );
}

function TimelineItem({
  tone,
  title,
  desc,
  time,
}: {
  tone: "brand" | "info" | "warning" | "default";
  title: string;
  desc: string;
  time: string;
}) {
  const toneCls = {
    brand: "bg-[color:var(--brand-pink)] shadow-[0_0_12px_var(--brand-pink)]",
    info: "bg-sky-400 shadow-[0_0_10px_theme(colors.sky.400)]",
    warning: "bg-amber-400 shadow-[0_0_10px_theme(colors.amber.400)]",
    default: "bg-white/40",
  }[tone];
  return (
    <li className="relative">
      <span className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full ${toneCls}`} />
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
        <Clock className="h-3 w-3" />
        {time}
      </p>
    </li>
  );
}

function NoteCard({ author, time, text }: { author: string; time: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <div className="flex items-center gap-2">
        <Avatar name={author} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{author}</p>
          <p className="text-[11px] text-muted-foreground">{time}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-foreground/90">{text}</p>
    </div>
  );
}

function TaskRow({ label, due, done }: { label: string; due: string; done: boolean }) {
  return (
    <li className="flex items-center gap-3">
      {done ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
      ) : (
        <span className="h-4 w-4 shrink-0 rounded-full border-2 border-white/20" />
      )}
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${done ? "text-muted-foreground line-through" : "font-medium"}`}>
          {label}
        </p>
        <p className="text-[11px] text-muted-foreground">{due}</p>
      </div>
    </li>
  );
}

function MeetingRow({ title, when }: { title: string; when: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
      <div className="gradient-brand-bg grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white">
        <Video className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{title}</p>
        <p className="text-[11px] text-muted-foreground">{when}</p>
      </div>
    </li>
  );
}

function FileRow({ name, size }: { name: string; size: string }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-2.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/5">
        <FileText className="h-4 w-4 text-[color:var(--brand-pink)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="text-[11px] text-muted-foreground">{size}</p>
      </div>
      <button className="glass grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
        <Download className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}
