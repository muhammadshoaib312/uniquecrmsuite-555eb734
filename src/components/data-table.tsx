// Reusable table primitives. Existing tables keep working; new tables and
// gradual refactors should compose these instead of hand-rolling markup.
//
// Everything here is design-system aware (purple/glass), theme-agnostic,
// and stateless — pass values in, get callbacks back.

import { type ReactNode, type ChangeEvent } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, MoreHorizontal, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/crm-ui";

/* ---------- Search input ---------- */
export function TableSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex-1", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

/* ---------- Filter chips ---------- */
export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  moreLabel = "More",
  onMore,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  moreLabel?: string;
  onMore?: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-xs font-medium transition",
            value === o
              ? "border-transparent text-white [background:var(--gradient-brand)] glow-shadow-sm"
              : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground",
          )}
        >
          {o}
        </button>
      ))}
      {onMore && (
        <button onClick={onMore} className="glass inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs">
          <Filter className="h-3.5 w-3.5" /> {moreLabel}
        </button>
      )}
    </div>
  );
}

/* ---------- Pagination ---------- */
export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-white/5 pt-3 text-sm">
      <span className="text-muted-foreground">
        Page {page} of {pageCount}
      </span>
      <div className="flex items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground disabled:opacity-40"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground disabled:opacity-40"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Bulk-selection bar ---------- */
export function BulkBar({
  count,
  onClear,
  onDelete,
  extra,
}: {
  count: number;
  onClear: () => void;
  onDelete: () => void;
  extra?: ReactNode;
}) {
  if (count === 0) return null;
  return (
    <div className="glass mb-3 flex items-center justify-between rounded-xl px-3 py-2 text-sm">
      <div className="flex items-center gap-3">
        <span className="font-medium">{count} selected</span>
        <button onClick={onClear} className="text-xs text-muted-foreground hover:text-foreground">
          Clear
        </button>
      </div>
      <div className="flex items-center gap-2">
        {extra}
        <button
          onClick={onDelete}
          className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/25"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------- Status badge (thin alias so pages can standardize) ---------- */
export const StatusBadge = Badge;

/* ---------- Actions menu (placeholder trigger; render a Modal/Menu around it) ---------- */
export function ActionsMenu({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="glass grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground"
      aria-label="Actions"
    >
      <MoreHorizontal className="h-3.5 w-3.5" />
    </button>
  );
}

/* ---------- Empty / Loading states ---------- */
export function EmptyState({
  title = "Nothing here yet",
  description,
  action,
  icon,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="glass mt-6 flex flex-col items-center justify-center rounded-2xl px-6 py-14 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-muted-foreground">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <div className="text-sm font-semibold">{title}</div>
      {description && <div className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="glass mt-6 flex items-center justify-center gap-2 rounded-2xl px-6 py-10 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      {label}
    </div>
  );
}
