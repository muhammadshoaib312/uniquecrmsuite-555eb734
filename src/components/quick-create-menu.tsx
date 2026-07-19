import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Plus, ChevronDown, UserPlus, Users, Building2, Target, CheckSquare,
  CalendarDays, FileSpreadsheet, LifeBuoy,
} from "lucide-react";

const items = [
  { label: "New Lead", icon: UserPlus, to: "/leads", event: "leads" },
  { label: "New Contact", icon: Users, to: "/contacts", event: "contacts" },
  { label: "New Company", icon: Building2, to: "/companies", event: "companies" },
  { label: "New Deal", icon: Target, to: "/deals", event: "deals" },
  { label: "New Task", icon: CheckSquare, to: "/tasks", event: "tasks" },
  { label: "Schedule Meeting", icon: CalendarDays, to: "/meetings", event: "meetings" },
  { label: "New Quote", icon: FileSpreadsheet, to: "/quotes", event: "quotes" },
  { label: "New Support Ticket", icon: LifeBuoy, to: "/support", event: "tickets" },
];

/** Header quick-create menu — navigates to a module and asks it to open its create modal. */
export function QuickCreateMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="gradient-brand-bg glow-shadow-sm hidden items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02] sm:inline-flex"
      >
        <Plus className="h-4 w-4" />
        Create
        <ChevronDown className="h-3.5 w-3.5 opacity-80" />
      </button>
      {open && (
        <>
          <button aria-label="Close" onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
          <div className="glass-strong absolute right-0 top-12 z-50 w-64 rounded-2xl p-2 shadow-[var(--shadow-glow)]">
            {items.map((it) => {
              const Icon = it.icon;
              return (
                <button
                  key={it.label}
                  onClick={() => {
                    setOpen(false);
                    navigate({ to: it.to });
                    setTimeout(
                      () => window.dispatchEvent(new CustomEvent("uniquecrm:open-create", { detail: it.event })),
                      80,
                    );
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/5">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span>{it.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
