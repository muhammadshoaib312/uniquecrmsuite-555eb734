import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Bell, CheckCheck, X, AlarmClock, CalendarClock, Target, LifeBuoy, CheckCircle2, TrendingUp } from "lucide-react";
import { useDashboardMetrics, useGlobalIndex } from "@/lib/global-index";

type Notification = {
  id: string;
  title: string;
  desc: string;
  icon: typeof Bell;
  tone: "warning" | "info" | "success" | "brand";
  to: string;
  time: string;
};

const READ_KEY = "uniquecrm:notif-read";
const CLEAR_KEY = "uniquecrm:notif-cleared";

function readSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try { const raw = window.localStorage.getItem(key); return raw ? new Set(JSON.parse(raw) as string[]) : new Set(); } catch { return new Set(); }
}
function writeSet(key: string, s: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify([...s]));
    window.dispatchEvent(new CustomEvent("uniquecrm:notif-changed"));
  } catch { /* ignore */ }
}

/** Derives notifications from live store data — no fake real-time server behavior. */
function buildNotifications(metrics: ReturnType<typeof useDashboardMetrics>, idx: ReturnType<typeof useGlobalIndex>): Notification[] {
  const out: Notification[] = [];
  const today = new Date().toISOString().slice(0, 10);

  metrics.tasks
    .filter((t) => {
      const due = String(t.raw.due ?? "");
      return due && due < today && String(t.raw.status) !== "Completed";
    })
    .slice(0, 4)
    .forEach((t) =>
      out.push({
        id: `overdue:${t.id}`, title: "Task overdue",
        desc: `${t.title} was due ${String(t.raw.due)}`,
        icon: AlarmClock, tone: "warning", to: "/tasks", time: String(t.raw.due),
      }),
    );

  metrics.tasks
    .filter((t) => String(t.raw.due ?? "") === today && String(t.raw.status) !== "Completed")
    .slice(0, 3)
    .forEach((t) =>
      out.push({
        id: `duetoday:${t.id}`, title: "Task due today",
        desc: t.title, icon: CheckCircle2, tone: "info", to: "/tasks", time: "Today",
      }),
    );

  metrics.upcomingMeetings.slice(0, 3).forEach((m) =>
    out.push({
      id: `meeting:${m.id}`, title: "Upcoming meeting",
      desc: `${m.title} · ${String(m.raw.time ?? "")}`,
      icon: CalendarClock, tone: "brand", to: "/meetings", time: String(m.raw.time ?? ""),
    }),
  );

  idx
    .filter((i) => i.module === "tickets" && !/resolved/i.test(String(i.raw.status ?? "")))
    .slice(0, 3)
    .forEach((t) =>
      out.push({
        id: `ticket:${t.id}`, title: `Support ticket · ${String(t.raw.priority ?? "")}`,
        desc: t.title, icon: LifeBuoy, tone: "warning", to: "/support", time: String(t.raw.status ?? ""),
      }),
    );

  idx
    .filter((i) => i.module === "deals" && /won/i.test(String(i.raw.stage ?? "")))
    .slice(0, 2)
    .forEach((d) =>
      out.push({
        id: `won:${d.id}`, title: "Deal won", desc: d.title, icon: TrendingUp, tone: "success", to: "/deals", time: "Recent",
      }),
    );

  idx
    .filter((i) => i.module === "deals" && /proposal|negotiation/i.test(String(i.raw.stage ?? "")))
    .slice(0, 2)
    .forEach((d) =>
      out.push({
        id: `deal:${d.id}`, title: `Deal in ${String(d.raw.stage)}`, desc: d.title, icon: Target, tone: "info", to: "/deals", time: "Pipeline",
      }),
    );

  return out;
}

export function NotificationCenter({ open, onClose, onUnreadChange }: {
  open: boolean; onClose: () => void; onUnreadChange?: (n: number) => void;
}) {
  const metrics = useDashboardMetrics();
  const idx = useGlobalIndex();
  const navigate = useNavigate();
  const [read, setRead] = useState<Set<string>>(new Set());
  const [cleared, setCleared] = useState<Set<string>>(new Set());

  useEffect(() => {
    const load = () => { setRead(readSet(READ_KEY)); setCleared(readSet(CLEAR_KEY)); };
    load();
    window.addEventListener("uniquecrm:notif-changed", load);
    return () => window.removeEventListener("uniquecrm:notif-changed", load);
  }, []);

  const all = useMemo(() => buildNotifications(metrics, idx).filter((n) => !cleared.has(n.id)), [metrics, idx, cleared]);
  const unread = all.filter((n) => !read.has(n.id)).length;

  useEffect(() => { onUnreadChange?.(unread); }, [unread, onUnreadChange]);

  const markRead = (id: string) => { const s = new Set(read); s.add(id); writeSet(READ_KEY, s); };
  const markAllRead = () => { const s = new Set(read); all.forEach((n) => s.add(n.id)); writeSet(READ_KEY, s); };
  const clear = (id: string) => { const s = new Set(cleared); s.add(id); writeSet(CLEAR_KEY, s); };

  if (!open) return null;
  return (
    <>
      <button aria-label="Close" onClick={onClose} className="fixed inset-0 z-40" />
      <div className="glass-strong absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-1.5rem)] rounded-2xl p-3 shadow-[var(--shadow-glow)]">
        <div className="mb-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <h4 className="text-sm font-semibold">Notifications</h4>
            {unread > 0 && (
              <span className="rounded-full border border-transparent bg-[image:var(--gradient-brand)] px-2 py-0.5 text-[10px] font-semibold text-white">
                {unread} new
              </span>
            )}
          </div>
          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
          >
            <CheckCheck className="h-3 w-3" /> Mark all read
          </button>
        </div>

        <div className="max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">
          {all.length === 0 && (
            <div className="px-4 py-10 text-center text-xs text-muted-foreground">
              You're all caught up.
            </div>
          )}
          {all.map((n) => {
            const Icon = n.icon;
            const isRead = read.has(n.id);
            return (
              <div
                key={n.id}
                className={`group relative rounded-xl p-3 transition ${isRead ? "bg-white/[0.02]" : "bg-white/[0.05]"} hover:bg-white/10`}
              >
                <button
                  onClick={() => { markRead(n.id); onClose(); navigate({ to: n.to }); }}
                  className="flex w-full items-start gap-3 text-left"
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    n.tone === "success" ? "bg-emerald-500/15 text-emerald-300"
                    : n.tone === "warning" ? "bg-amber-500/15 text-amber-300"
                    : n.tone === "info" ? "bg-sky-500/15 text-sky-300"
                    : "gradient-brand-bg text-white"
                  }`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">{n.title}</span>
                      {!isRead && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-pink)] shadow-[0_0_6px_var(--brand-pink)]" />}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{n.desc}</span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-wider text-muted-foreground">{n.time}</span>
                  </span>
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); clear(n.id); }}
                  aria-label="Clear notification"
                  className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition hover:bg-white/10 hover:text-foreground group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/** Small hook so the shell can badge the bell icon. */
export function useNotificationCount() {
  const metrics = useDashboardMetrics();
  const idx = useGlobalIndex();
  const [read, setRead] = useState<Set<string>>(new Set());
  const [cleared, setCleared] = useState<Set<string>>(new Set());
  useEffect(() => {
    const load = () => { setRead(readSet(READ_KEY)); setCleared(readSet(CLEAR_KEY)); };
    load();
    window.addEventListener("uniquecrm:notif-changed", load);
    return () => window.removeEventListener("uniquecrm:notif-changed", load);
  }, []);
  const all = buildNotifications(metrics, idx).filter((n) => !cleared.has(n.id));
  return all.filter((n) => !read.has(n.id)).length;
}
