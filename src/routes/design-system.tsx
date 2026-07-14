import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Zap, Heart, Star, Rocket, Bell } from "lucide-react";
import {
  PageHeaderX,
  Button,
  Input,
  Textarea,
  FormField,
  Card,
  Stat,
  BadgeX,
  Modal,
  Drawer,
  DataTable,
  Pagination,
  Skeleton,
  EmptyState,
  ChartPlaceholder,
  SearchBar,
} from "@/components/ui-kit";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System — UniqueCRM" },
      {
        name: "description",
        content:
          "The UniqueCRM design system: typography, colors, components, and interactive previews for consistent UI across the app.",
      },
    ],
  }),
  component: DesignSystemPage,
});

function Section({ id, title, description, children }: { id: string; title: string; description?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="glass rounded-2xl p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Swatch({ label, varName, value }: { label: string; varName: string; value: string }) {
  return (
    <div className="glass rounded-xl p-3">
      <div className="h-16 w-full rounded-lg" style={{ background: value }} />
      <p className="mt-2 text-xs font-semibold">{label}</p>
      <p className="text-[10px] text-muted-foreground">{varName}</p>
    </div>
  );
}

function DesignSystemPage() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [page, setPage] = useState(1);

  const sections = [
    { id: "typography", label: "Typography" },
    { id: "colors", label: "Colors" },
    { id: "buttons", label: "Buttons" },
    { id: "inputs", label: "Inputs" },
    { id: "cards", label: "Cards" },
    { id: "tables", label: "Tables" },
    { id: "badges", label: "Badges" },
    { id: "icons", label: "Icons" },
    { id: "spacing", label: "Spacing" },
    { id: "radius", label: "Border Radius" },
    { id: "shadows", label: "Shadows" },
    { id: "overlays", label: "Overlays" },
    { id: "feedback", label: "Feedback" },
  ];

  return (
    <div>
      <PageHeaderX
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Design System" }]}
        title="Design System"
        description="Foundations and reusable components powering every module of UniqueCRM."
        actions={<BadgeX tone="brand">v1.0</BadgeX>}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        {/* TOC */}
        <aside className="glass sticky top-20 hidden h-fit rounded-2xl p-3 lg:block">
          <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">On this page</p>
          <nav className="flex flex-col">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition hover:bg-white/5 hover:text-foreground">
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-8">
          <Section id="typography" title="Typography" description="Space Grotesk for display, Inter for body.">
            <div className="space-y-3">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Display / H1 · Space Grotesk 700</p>
                <h1 className="text-4xl font-bold tracking-tight">The quick brown fox</h1>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Heading / H2</p>
                <h2 className="text-2xl font-bold tracking-tight">Ship faster with UniqueCRM</h2>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Heading / H3</p>
                <h3 className="text-lg font-semibold">Section title</h3>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Body / Inter 400</p>
                <p className="text-sm">Manage contacts, deals, pipelines, and revenue with a beautiful modern workspace.</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Caption / muted</p>
                <p className="text-xs text-muted-foreground">Updated 2 minutes ago</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Gradient text</p>
                <p className="gradient-text text-3xl font-bold">Unique brand voice</p>
              </div>
            </div>
          </Section>

          <Section id="colors" title="Colors" description="Semantic tokens defined in oklch. Use CSS variables, never hex.">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Swatch label="Background" varName="--background" value="oklch(0.16 0.03 285)" />
              <Swatch label="Card" varName="--card" value="oklch(0.20 0.035 285)" />
              <Swatch label="Primary" varName="--primary" value="oklch(0.68 0.24 310)" />
              <Swatch label="Accent" varName="--accent" value="oklch(0.72 0.25 340)" />
              <Swatch label="Muted" varName="--muted" value="oklch(0.24 0.03 285)" />
              <Swatch label="Success" varName="emerald-500" value="oklch(0.7 0.17 160)" />
              <Swatch label="Warning" varName="amber-500" value="oklch(0.78 0.16 75)" />
              <Swatch label="Destructive" varName="--destructive" value="oklch(0.65 0.24 15)" />
            </div>
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Brand gradient</p>
              <div className="h-20 w-full rounded-xl gradient-brand-bg glow-shadow-sm" />
            </div>
          </Section>

          <Section id="buttons" title="Buttons" description="Sizes: sm, md, lg. Variants: primary, secondary, outline, ghost, danger.">
            <div className="flex flex-wrap gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Sparkles className="h-4 w-4" /> With icon
              </Button>
            </div>
          </Section>

          <Section id="inputs" title="Inputs & Forms" description="Glassmorphic inputs with focus ring.">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full name">
                <Input placeholder="Jane Doe" />
              </FormField>
              <FormField label="Email" hint="We never share this.">
                <Input type="email" placeholder="jane@company.com" />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Notes">
                  <Textarea rows={3} placeholder="Add a note about this contact…" />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <SearchBar placeholder="Search contacts, deals, tasks…" />
              </div>
            </div>
          </Section>

          <Section id="cards" title="Cards & Stats">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Revenue" value="$128k" delta="+12.4%" icon={<Rocket className="h-4 w-4" />} />
              <Stat label="Leads" value="1,204" delta="+3.2%" icon={<Zap className="h-4 w-4" />} />
              <Stat label="Deals" value="87" delta="-1.1%" icon={<Star className="h-4 w-4" />} />
              <Stat label="Tasks" value="24" delta="+8.0%" icon={<Heart className="h-4 w-4" />} />
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card title="Basic card" description="With title and description">
                <p className="text-sm text-muted-foreground">Card content lives here. Use for grouping related information.</p>
              </Card>
              <Card title="With actions" actions={<Button size="sm" variant="secondary">Manage</Button>}>
                <p className="text-sm text-muted-foreground">Cards can render actions in the header.</p>
              </Card>
            </div>
            <div className="mt-4">
              <ChartPlaceholder label="Revenue" />
            </div>
          </Section>

          <Section id="tables" title="Tables & Pagination">
            <DataTable
              columns={[
                { key: "name", header: "Name" },
                { key: "role", header: "Role" },
                { key: "status", header: "Status", render: (r: { status: string }) => <BadgeX tone="success">{r.status}</BadgeX> },
              ]}
              rows={[
                { name: "Elena Ruiz", role: "Sales Lead", status: "Active" },
                { name: "Marcus Chen", role: "AE", status: "Active" },
                { name: "Priya Patel", role: "SDR", status: "Active" },
              ]}
            />
            <div className="mt-4">
              <Pagination page={page} totalPages={5} onChange={setPage} />
            </div>
          </Section>

          <Section id="badges" title="Badges">
            <div className="flex flex-wrap gap-2">
              <BadgeX>Default</BadgeX>
              <BadgeX tone="brand">Brand</BadgeX>
              <BadgeX tone="success">Success</BadgeX>
              <BadgeX tone="warning">Warning</BadgeX>
              <BadgeX tone="info">Info</BadgeX>
              <BadgeX tone="danger">Danger</BadgeX>
            </div>
          </Section>

          <Section id="icons" title="Icons" description="Lucide, 16–20px, stroke 2.">
            <div className="flex flex-wrap gap-3">
              {[Sparkles, Zap, Heart, Star, Rocket, Bell].map((Icon, i) => (
                <div key={i} className="glass grid h-12 w-12 place-items-center rounded-xl">
                  <Icon className="h-5 w-5" />
                </div>
              ))}
            </div>
          </Section>

          <Section id="spacing" title="Spacing" description="4px base scale.">
            <div className="space-y-2">
              {[4, 8, 12, 16, 24, 32].map((n) => (
                <div key={n} className="flex items-center gap-3">
                  <div className="w-14 text-xs text-muted-foreground">{n}px</div>
                  <div className="h-3 gradient-brand-bg rounded" style={{ width: `${n * 4}px` }} />
                </div>
              ))}
            </div>
          </Section>

          <Section id="radius" title="Border Radius">
            <div className="flex flex-wrap gap-3">
              {[
                { l: "sm", c: "rounded-sm" },
                { l: "md", c: "rounded-md" },
                { l: "lg", c: "rounded-lg" },
                { l: "xl", c: "rounded-xl" },
                { l: "2xl", c: "rounded-2xl" },
                { l: "full", c: "rounded-full" },
              ].map((r) => (
                <div key={r.l} className="text-center">
                  <div className={`h-16 w-16 gradient-brand-bg ${r.c}`} />
                  <p className="mt-1 text-[10px] text-muted-foreground">{r.l}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="shadows" title="Shadows & Glow">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass grid h-24 place-items-center rounded-xl text-xs text-muted-foreground">glass</div>
              <div className="glass grid h-24 place-items-center rounded-xl glow-shadow-sm text-xs text-muted-foreground">glow-sm</div>
              <div className="glass grid h-24 place-items-center rounded-xl glow-shadow text-xs text-muted-foreground">glow</div>
            </div>
          </Section>

          <Section id="overlays" title="Modals & Drawers">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setModal(true)}>Open Modal</Button>
              <Button variant="secondary" onClick={() => setDrawer(true)}>Open Drawer</Button>
            </div>
            <Modal
              open={modal}
              onClose={() => setModal(false)}
              title="Create new lead"
              footer={
                <>
                  <Button variant="ghost" onClick={() => setModal(false)}>Cancel</Button>
                  <Button onClick={() => setModal(false)}>Save lead</Button>
                </>
              }
            >
              <div className="space-y-3">
                <FormField label="Name"><Input placeholder="Jane Doe" /></FormField>
                <FormField label="Company"><Input placeholder="Acme Inc." /></FormField>
              </div>
            </Modal>
            <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters">
              <div className="space-y-3">
                <FormField label="Status"><Input placeholder="Any" /></FormField>
                <FormField label="Owner"><Input placeholder="Anyone" /></FormField>
              </div>
            </Drawer>
          </Section>

          <Section id="feedback" title="Loading & Empty">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="glass rounded-2xl p-5">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
              <div className="glass rounded-2xl">
                <EmptyState
                  title="No contacts yet"
                  description="Import a CSV or add your first contact to get started."
                  action={<Button>Add contact</Button>}
                />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
