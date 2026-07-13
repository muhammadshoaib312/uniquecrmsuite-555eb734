import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Building2, Users, ShieldCheck, Mail, Bell, Palette, Lock, ChevronRight, Check,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — UniqueCRM" },
      { name: "description", content: "Workspace, users, roles, and security." },
    ],
  }),
  component: SettingsPage,
});

const SECTIONS = [
  { id: "company", label: "Company Profile", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "email", label: "Email Settings", icon: Mail },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "theme", label: "Theme", icon: Palette },
  { id: "security", label: "Security", icon: Lock },
] as const;
type SectionId = (typeof SECTIONS)[number]["id"];

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("company");

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure your workspace." />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        <GlassCard className="!p-2 lg:sticky lg:top-4 lg:self-start">
          <nav className="flex flex-col">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                    isActive
                      ? "text-white [background:var(--gradient-brand)] glow-shadow-sm"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" /> {s.label}
                  </span>
                  <ChevronRight className={`h-3.5 w-3.5 transition ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`} />
                </button>
              );
            })}
          </nav>
        </GlassCard>

        <div>
          {active === "company" && <CompanySection />}
          {active === "users" && <UsersSection />}
          {active === "roles" && <RolesSection />}
          {active === "email" && <EmailSection />}
          {active === "notifications" && <NotificationsSection />}
          {active === "theme" && <ThemeSection />}
          {active === "security" && <SecuritySection />}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
    />
  );
}
function SaveRow() {
  return (
    <div className="mt-6 flex justify-end gap-2">
      <button className="glass rounded-xl px-4 py-2 text-sm">Cancel</button>
      <button className="gradient-brand-bg rounded-xl px-4 py-2 text-sm font-medium text-white glow-shadow-sm">Save Changes</button>
    </div>
  );
}

function CompanySection() {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Company Profile</h2>
      <p className="mt-1 text-sm text-muted-foreground">Public information about your workspace.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Company Name"><Input defaultValue="UniqueCRM Inc." /></Field>
        <Field label="Website"><Input defaultValue="uniquecrm.io" /></Field>
        <Field label="Industry"><Input defaultValue="SaaS" /></Field>
        <Field label="Employees"><Input defaultValue="120" /></Field>
        <Field label="Contact Email"><Input defaultValue="hello@uniquecrm.io" /></Field>
        <Field label="Phone"><Input defaultValue="+1 (415) 555-0100" /></Field>
      </div>
      <SaveRow />
    </GlassCard>
  );
}

function UsersSection() {
  const users = [
    { name: "Ava Reynolds", email: "ava@uniquecrm.io", role: "Admin", tone: 0 },
    { name: "Marcus Chen", email: "marcus@uniquecrm.io", role: "Manager", tone: 1 },
    { name: "Priya Natarajan", email: "priya@uniquecrm.io", role: "Sales", tone: 2 },
    { name: "Diego Alvarez", email: "diego@uniquecrm.io", role: "Sales", tone: 3 },
    { name: "Sofia Petrov", email: "sofia@uniquecrm.io", role: "Viewer", tone: 4 },
  ];
  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Users</h2>
          <p className="text-sm text-muted-foreground">Invite and manage your team.</p>
        </div>
        <button className="gradient-brand-bg rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm">Invite User</button>
      </div>
      <div className="divide-y divide-white/5">
        {users.map((u) => (
          <div key={u.email} className="flex items-center gap-3 py-3">
            <Avatar name={u.name} tone={u.tone} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium">{u.name}</div>
              <div className="truncate text-xs text-muted-foreground">{u.email}</div>
            </div>
            <Badge tone={u.role === "Admin" ? "brand" : u.role === "Manager" ? "info" : "default"}>{u.role}</Badge>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function RolesSection() {
  const roles = [
    { name: "Admin", desc: "Full access to everything", perms: 12 },
    { name: "Manager", desc: "Manage team, deals, and reports", perms: 9 },
    { name: "Sales", desc: "Own leads, contacts, and deals", perms: 6 },
    { name: "Viewer", desc: "Read-only across the workspace", perms: 3 },
  ];
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Roles & Permissions</h2>
      <p className="mt-1 text-sm text-muted-foreground">Control what each role can do.</p>
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {roles.map((r) => (
          <div key={r.name} className="glass rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{r.name}</div>
              <Badge tone="brand">{r.perms} permissions</Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{r.desc}</p>
            <button className="mt-3 text-xs font-medium text-primary hover:underline">Edit permissions →</button>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function EmailSection() {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Email Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">Configure outbound email and signatures.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="From Name"><Input defaultValue="UniqueCRM Team" /></Field>
        <Field label="From Address"><Input defaultValue="notifications@uniquecrm.io" /></Field>
        <Field label="Reply-To"><Input defaultValue="support@uniquecrm.io" /></Field>
        <Field label="SMTP Host"><Input defaultValue="smtp.uniquecrm.io" /></Field>
      </div>
      <Field label="Default Signature">
        <textarea
          rows={4}
          defaultValue="— The UniqueCRM Team"
          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
        />
      </Field>
      <SaveRow />
    </GlassCard>
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition ${on ? "[background:var(--gradient-brand)] glow-shadow-sm" : "bg-white/10"}`}
    >
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${on ? "left-[22px]" : "left-0.5"}`} />
    </button>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    newLead: true, dealWon: true, dealLost: false, taskDue: true, weekly: true, mentions: true,
  });
  const items: { key: keyof typeof prefs; label: string; desc: string }[] = [
    { key: "newLead", label: "New leads", desc: "When a lead lands in your inbox" },
    { key: "dealWon", label: "Deals won", desc: "Celebrate every closed deal" },
    { key: "dealLost", label: "Deals lost", desc: "Learn from every miss" },
    { key: "taskDue", label: "Task reminders", desc: "One hour before tasks are due" },
    { key: "weekly", label: "Weekly digest", desc: "Every Monday at 9:00 AM" },
    { key: "mentions", label: "@mentions", desc: "Someone tags you in a note" },
  ];
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Notification Settings</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose what pings you and when.</p>
      <div className="mt-5 divide-y divide-white/5">
        {items.map((i) => (
          <div key={i.key} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium">{i.label}</div>
              <div className="text-xs text-muted-foreground">{i.desc}</div>
            </div>
            <Toggle on={prefs[i.key]} onChange={(v) => setPrefs({ ...prefs, [i.key]: v })} />
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

function ThemeSection() {
  const [accent, setAccent] = useState("purple-pink");
  const accents = [
    { id: "purple-pink", label: "Purple × Pink", from: "oklch(0.68 0.24 310)", to: "oklch(0.72 0.25 340)" },
    { id: "purple-blue", label: "Purple × Blue", from: "oklch(0.65 0.22 280)", to: "oklch(0.72 0.25 240)" },
    { id: "pink-orange", label: "Pink × Orange", from: "oklch(0.72 0.25 340)", to: "oklch(0.78 0.18 40)" },
    { id: "violet-mint", label: "Violet × Mint", from: "oklch(0.65 0.22 300)", to: "oklch(0.78 0.16 175)" },
  ];
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Theme</h2>
      <p className="mt-1 text-sm text-muted-foreground">Pick a look that fits your brand.</p>

      <h3 className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">Mode</h3>
      <div className="mt-2 grid grid-cols-3 gap-3">
        {["Light", "Dark", "Auto"].map((m) => (
          <button key={m} className={`glass rounded-xl px-4 py-3 text-sm ${m === "Dark" ? "ring-2 ring-primary/50 glow-shadow-sm" : ""}`}>
            {m}
          </button>
        ))}
      </div>

      <h3 className="mt-6 text-xs font-medium uppercase tracking-wider text-muted-foreground">Accent</h3>
      <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {accents.map((a) => (
          <button
            key={a.id}
            onClick={() => setAccent(a.id)}
            className={`relative rounded-xl border p-3 text-left transition ${
              accent === a.id ? "border-primary/60 ring-2 ring-primary/30" : "border-white/10 hover:border-white/20"
            }`}
          >
            <div
              className="h-16 w-full rounded-lg glow-shadow-sm"
              style={{ background: `linear-gradient(135deg, ${a.from}, ${a.to})` }}
            />
            <div className="mt-2 flex items-center justify-between text-xs">
              <span>{a.label}</span>
              {accent === a.id && <Check className="h-3.5 w-3.5 text-primary" />}
            </div>
          </button>
        ))}
      </div>
    </GlassCard>
  );
}

function SecuritySection() {
  return (
    <GlassCard>
      <h2 className="text-lg font-semibold">Security</h2>
      <p className="mt-1 text-sm text-muted-foreground">Protect your account and data.</p>

      <div className="mt-6 space-y-3">
        <div className="glass flex items-center justify-between rounded-xl p-4">
          <div>
            <div className="text-sm font-medium">Two-Factor Authentication</div>
            <div className="text-xs text-muted-foreground">Require a second factor on sign-in</div>
          </div>
          <Badge tone="success">Enabled</Badge>
        </div>
        <div className="glass flex items-center justify-between rounded-xl p-4">
          <div>
            <div className="text-sm font-medium">Single Sign-On (SSO)</div>
            <div className="text-xs text-muted-foreground">SAML 2.0 with your identity provider</div>
          </div>
          <button className="gradient-brand-bg rounded-lg px-3 py-1.5 text-xs font-medium text-white">Configure</button>
        </div>
        <div className="glass flex items-center justify-between rounded-xl p-4">
          <div>
            <div className="text-sm font-medium">Session timeout</div>
            <div className="text-xs text-muted-foreground">Sign out inactive users after…</div>
          </div>
          <select className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm outline-none">
            <option>30 minutes</option><option>1 hour</option><option>4 hours</option><option>24 hours</option>
          </select>
        </div>
      </div>

      <h3 className="mt-8 text-xs font-medium uppercase tracking-wider text-muted-foreground">Change Password</h3>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Field label="Current"><Input type="password" defaultValue="••••••••" /></Field>
        <Field label="New"><Input type="password" /></Field>
        <Field label="Confirm"><Input type="password" /></Field>
      </div>
      <SaveRow />
    </GlassCard>
  );
}
