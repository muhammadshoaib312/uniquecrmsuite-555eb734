import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Search, UserPlus, Users, Building2, Target, CheckSquare, CalendarDays,
  FileSpreadsheet, LifeBuoy, LayoutDashboard, Settings, Package, FileText,
  Megaphone, CalendarRange, Command, X, Sparkles, CornerDownLeft,
} from "lucide-react";
import { useGlobalIndex, type IndexedRecord } from "@/lib/global-index";

/** Global command palette + search, opened via Ctrl/Cmd+K or the header search field. */
export function CommandPalette({
  open,
  onClose,
  initialQuery = "",
}: {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}) {
  const navigate = useNavigate();
  const idx = useGlobalIndex();
  const [q, setQ] = useState(initialQuery);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ(initialQuery);
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open, initialQuery]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const actions = useMemo<QuickAction[]>(() => [
    { label: "Create Lead", icon: UserPlus, hint: "leads", to: "/leads", event: "leads" },
    { label: "Create Contact", icon: Users, hint: "contacts", to: "/contacts", event: "contacts" },
    { label: "Create Company", icon: Building2, hint: "companies", to: "/companies", event: "companies" },
    { label: "Create Deal", icon: Target, hint: "deals pipeline", to: "/deals", event: "deals" },
    { label: "Create Task", icon: CheckSquare, hint: "tasks todo", to: "/tasks", event: "tasks" },
    { label: "Schedule Meeting", icon: CalendarDays, hint: "meetings", to: "/meetings", event: "meetings" },
    { label: "Create Quote", icon: FileSpreadsheet, hint: "quotes sales", to: "/quotes", event: "quotes" },
    { label: "Create Support Ticket", icon: LifeBuoy, hint: "support help", to: "/support", event: "tickets" },
    { label: "Open Dashboard", icon: LayoutDashboard, hint: "home", to: "/" },
    { label: "Open Calendar", icon: CalendarRange, hint: "schedule", to: "/calendar" },
    { label: "Open Products", icon: Package, hint: "catalog", to: "/products" },
    { label: "Open Documents", icon: FileText, hint: "files", to: "/documents" },
    { label: "Open Campaigns", icon: Megaphone, hint: "marketing", to: "/campaigns" },
    { label: "Open Settings", icon: Settings, hint: "workspace preferences", to: "/settings" },
  ], []);

  const query = q.trim().toLowerCase();

  const filteredActions = useMemo(
    () => (query ? actions.filter((a) => (a.label + " " + a.hint).toLowerCase().includes(query)) : actions.slice(0, 6)),
    [actions, query],
  );

  const filteredRecords = useMemo(() => {
    if (!query) return [] as IndexedRecord[];
    return idx.filter((r) => r.keywords.includes(query)).slice(0, 40);
  }, [idx, query]);

  const grouped = useMemo(() => {
    const groups: Record<string, IndexedRecord[]> = {};
    for (const r of filteredRecords) {
      const key = MODULE_LABEL[r.module];
      (groups[key] ??= []).push(r);
    }
    return groups;
  }, [filteredRecords]);

  // Flat list for keyboard navigation.
  const flat = useMemo(() => {
    type Row = { kind: "action"; a: QuickAction } | { kind: "record"; r: IndexedRecord };
    const rows: Row[] = [];
    filteredActions.forEach((a) => rows.push({ kind: "action", a }));
    filteredRecords.forEach((r) => rows.push({ kind: "record", r }));
    return rows;
  }, [filteredActions, filteredRecords]);

  useEffect(() => setActive(0), [q, idx.length]);

  const activate = (i: number) => {
    const row = flat[i];
    if (!row) return;
    onClose();
    if (row.kind === "action") {
      navigate({ to: row.a.to });
      if (row.a.event) {
        setTimeout(() => window.dispatchEvent(new CustomEvent("uniquecrm:open-create", { detail: row.a.event })), 60);
      }
    } else {
      navigate({ to: row.r.href });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] grid place-items-start p-4 pt-[8vh]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-label="Command palette"
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((v) => Math.min(flat.length - 1, v + 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((v) => Math.max(0, v - 1)); }
          else if (e.key === "Enter") { e.preventDefault(); activate(active); }
        }}
        className="glass-strong relative z-10 mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-[var(--shadow-glow)]"
      >
        <div className="flex items-center gap-3 border-b border-white/5 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search leads, contacts, deals, or run a command…"
            className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline-block">ESC</kbd>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-14 text-center">
              <div className="gradient-brand-bg grid h-12 w-12 place-items-center rounded-2xl text-white glow-shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">
                {query ? "No matches found" : "Start typing to search"}
              </p>
              <p className="text-xs text-muted-foreground">
                {query
                  ? `Nothing in leads, contacts, deals, tasks, meetings, quotes, or support matches "${q}".`
                  : "Search across every module or jump to a quick action."}
              </p>
            </div>
          ) : (
            <>
              {filteredActions.length > 0 && (
                <Section title={query ? "Actions" : "Quick actions"}>
                  {filteredActions.map((a, i) => {
                    const flatIdx = i;
                    const Icon = a.icon;
                    return (
                      <Row
                        key={a.label}
                        active={active === flatIdx}
                        onMouseEnter={() => setActive(flatIdx)}
                        onClick={() => activate(flatIdx)}
                        icon={<Icon className="h-4 w-4" />}
                        title={a.label}
                        subtitle={a.hint}
                        chip="Action"
                      />
                    );
                  })}
                </Section>
              )}

              {Object.entries(grouped).map(([label, rows]) => (
                <Section key={label} title={label}>
                  {rows.map((r) => {
                    const flatIdx = filteredActions.length + filteredRecords.indexOf(r);
                    const Icon = MODULE_ICON[r.module];
                    return (
                      <Row
                        key={r.id}
                        active={active === flatIdx}
                        onMouseEnter={() => setActive(flatIdx)}
                        onClick={() => activate(flatIdx)}
                        icon={<Icon className="h-4 w-4" />}
                        title={r.title}
                        subtitle={r.subtitle}
                        chip={r.meta}
                      />
                    );
                  })}
                </Section>
              ))}
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/5 px-4 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Command className="h-3 w-3" /> Command palette
          </span>
          <span className="flex items-center gap-3">
            <span className="flex items-center gap-1"><CornerDownLeft className="h-3 w-3" /> select</span>
            <span>↑↓ navigate</span>
          </span>
        </div>
      </div>
    </div>
  );
}

type QuickAction = {
  label: string;
  icon: typeof UserPlus;
  hint: string;
  to: string;
  event?: string;
};

const MODULE_LABEL: Record<IndexedRecord["module"], string> = {
  leads: "Leads",
  contacts: "Contacts",
  companies: "Companies",
  deals: "Deals",
  tasks: "Tasks",
  meetings: "Meetings",
  products: "Products",
  quotes: "Quotes",
  documents: "Documents",
  tickets: "Support",
};

const MODULE_ICON: Record<IndexedRecord["module"], typeof UserPlus> = {
  leads: UserPlus,
  contacts: Users,
  companies: Building2,
  deals: Target,
  tasks: CheckSquare,
  meetings: CalendarDays,
  products: Package,
  quotes: FileSpreadsheet,
  documents: FileText,
  tickets: LifeBuoy,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-1">
      <div className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
      <div>{children}</div>
    </div>
  );
}

function Row({
  active, icon, title, subtitle, chip, onClick, onMouseEnter,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  chip?: string;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition ${
        active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${active ? "gradient-brand-bg text-white" : "bg-white/5"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-foreground">{title}</span>
        {subtitle && <span className="block truncate text-xs text-muted-foreground">{subtitle}</span>}
      </span>
      {chip && (
        <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{chip}</span>
      )}
    </button>
  );
}
