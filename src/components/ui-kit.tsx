import { Link } from "@tanstack/react-router";
import {
  useEffect,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";
import {
  ChevronRight,
  X,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  Inbox,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------- Button ---------- */
type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  const variants: Record<ButtonVariant, string> = {
    primary:
      "gradient-brand-bg text-white glow-shadow-sm hover:scale-[1.02]",
    secondary: "glass text-foreground hover:bg-white/10",
    ghost: "text-muted-foreground hover:bg-white/5 hover:text-foreground",
    outline:
      "border border-white/10 text-foreground hover:bg-white/5",
    danger:
      "bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25",
  };
  const sizes: Record<ButtonSize, string> = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------- Input / Textarea ---------- */
export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "glass h-10 w-full rounded-lg border-0 px-3.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "glass w-full rounded-lg border-0 px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--ring)]",
        className,
      )}
      {...props}
    />
  );
}
export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </label>
  );
}
export function FormField({
  label,
  children,
  hint,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

/* ---------- Breadcrumb ---------- */
export function Breadcrumb({
  items,
}: {
  items: { label: string; to?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3 w-3 opacity-50" />}
          {it.to ? (
            <Link to={it.to} className="transition-colors hover:text-foreground">
              {it.label}
            </Link>
          ) : (
            <span className="text-foreground">{it.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

/* ---------- Page Header w/ breadcrumb ---------- */
export function PageHeaderX({
  title,
  description,
  breadcrumb,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/* ---------- Card ---------- */
export function Card({
  children,
  className,
  title,
  description,
  actions,
}: {
  children?: ReactNode;
  className?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className={cn("glass rounded-2xl p-5 sm:p-6", className)}>
      {(title || actions) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold tracking-tight">{title}</h3>}
            {description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

/* ---------- Stat Card ---------- */
export function Stat({
  label,
  value,
  delta,
  icon,
}: {
  label: string;
  value: string;
  delta?: string;
  icon?: ReactNode;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-5 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{value}</p>
          {delta && (
            <p className={cn("mt-1 text-xs font-medium", positive ? "text-emerald-400" : "text-rose-400")}>
              {delta}
            </p>
          )}
        </div>
        {icon && (
          <div className="gradient-brand-bg grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Badge ---------- */
export function BadgeX({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "success" | "warning" | "info" | "brand" | "danger";
}) {
  const tones = {
    default: "bg-white/5 text-foreground border-white/10",
    success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    info: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    danger: "bg-rose-500/10 text-rose-300 border-rose-500/20",
    brand: "text-white border-transparent [background:var(--gradient-brand)]",
  } as const;
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium", tones[tone])}>
      {children}
    </span>
  );
}

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <div className="glass-strong relative z-10 w-full max-w-lg rounded-2xl p-6 shadow-[var(--shadow-glow)]">
        <div className="mb-4 flex items-start justify-between gap-3">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

/* ---------- Drawer ---------- */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "right" | "left";
}) {
  if (!open) return null;
  const sideCls = side === "right" ? "right-0" : "left-0";
  return (
    <div className="fixed inset-0 z-[100]">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className={cn("glass-strong absolute top-0 h-full w-full max-w-md p-6 shadow-[var(--shadow-glow)]", sideCls)}>
        <div className="mb-4 flex items-center justify-between">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Table ---------- */
export function DataTable<T>({
  columns,
  rows,
  empty,
}: {
  columns: { key: keyof T | string; header: string; render?: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  empty?: ReactNode;
}) {
  if (rows.length === 0) {
    return <div className="glass rounded-2xl p-10">{empty || <EmptyState title="No data" description="Nothing to show yet." />}</div>;
  }
  return (
    <div className="glass overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-muted-foreground">
              {columns.map((c) => (
                <th key={String(c.key)} className={cn("px-4 py-3 font-medium", c.className)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0 transition-colors hover:bg-white/5">
                {columns.map((c) => (
                  <td key={String(c.key)} className={cn("px-4 py-3", c.className)}>
                    {c.render ? c.render(row) : (row as Record<string, ReactNode>)[c.key as string]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Pagination ---------- */
export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="secondary" onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </Button>
        {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={cn(
              "h-8 w-8 rounded-lg text-xs font-medium transition",
              page === i + 1 ? "gradient-brand-bg text-white" : "glass text-muted-foreground hover:text-foreground",
            )}
          >
            {i + 1}
          </button>
        ))}
        <Button size="sm" variant="secondary" onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
          Next <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

/* ---------- Skeleton ---------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-white/5", className)} />;
}

/* ---------- Empty State ---------- */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="gradient-brand-bg glow-shadow-sm mb-4 grid h-14 w-14 place-items-center rounded-2xl text-white">
        {icon || <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Chart Placeholder ---------- */
export function ChartPlaceholder({ label = "Chart" }: { label?: string }) {
  return (
    <div className="glass grid h-64 place-items-center rounded-2xl border border-dashed border-white/10 text-sm text-muted-foreground">
      <div className="text-center">
        <div className="gradient-text text-2xl font-bold">{label}</div>
        <p className="mt-1 text-xs">Chart placeholder</p>
      </div>
    </div>
  );
}

/* ---------- Search Bar ---------- */
export function SearchBar({
  placeholder = "Search…",
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="glass h-10 w-full rounded-lg border-0 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-[color:var(--ring)]"
      />
    </div>
  );
}

/* ---------- Theme Toggle ---------- */
export function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const html = document.documentElement;
    if (dark) html.classList.add("dark");
    else html.classList.remove("dark");
  }, [dark]);
  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="glass grid h-10 w-10 place-items-center rounded-lg text-muted-foreground transition hover:text-foreground"
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

/* ---------- Notification Panel ---------- */
export function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const items = [
    { title: "New lead assigned", desc: "Elena Ruiz was assigned to you", time: "2m" },
    { title: "Deal won 🎉", desc: "Acme Corp closed at $48,000", time: "1h" },
    { title: "Meeting in 30 min", desc: "Discovery call with Nova Labs", time: "3h" },
  ];
  if (!open) return null;
  return (
    <>
      <button aria-label="Close notifications" onClick={onClose} className="fixed inset-0 z-40" />
      <div className="glass-strong absolute right-0 top-12 z-50 w-80 rounded-2xl p-4 shadow-[var(--shadow-glow)]">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h4 className="text-sm font-semibold">Notifications</h4>
          </div>
          <BadgeX tone="brand">3 new</BadgeX>
        </div>
        <div className="space-y-2">
          {items.map((n, i) => (
            <div key={i} className="glass rounded-lg p-3 transition hover:bg-white/5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{n.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------- User Menu ---------- */
export function UserMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="glass flex items-center gap-2 rounded-lg p-1.5 pr-2.5 transition hover:bg-white/5"
      >
        <div className="gradient-brand-bg glow-shadow-sm grid h-7 w-7 place-items-center rounded-full text-[11px] font-semibold text-white">
          AN
        </div>
        <span className="hidden text-xs font-medium sm:inline">Alex N.</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
      {open && (
        <>
          <button aria-label="Close" onClick={() => setOpen(false)} className="fixed inset-0 z-40" />
          <div className="glass-strong absolute right-0 top-12 z-50 w-56 rounded-2xl p-2 shadow-[var(--shadow-glow)]">
            {["Profile", "Preferences", "Billing", "Sign out"].map((l) => (
              <button
                key={l}
                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
              >
                {l}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
