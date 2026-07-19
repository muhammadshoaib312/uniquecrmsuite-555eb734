import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CheckSquare, CalendarDays } from "lucide-react";
import { PageHeader, GlassCard, Badge } from "@/components/crm-ui";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — UniqueCRM" },
      { name: "description", content: "Tasks and meetings across the month." },
    ],
  }),
  component: CalendarPage,
});

type Task = { id: string; title: string; due: string; status?: string };
type Meeting = { id: string; title: string; time: string; with?: string };

function read<T>(key: string): T[] {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch { return []; }
}

function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      setTasks(read<Task>("uniquecrm:tasks"));
      setMeetings(read<Meeting>("uniquecrm:meetings"));
    };
    load();
    const evts = ["uniquecrm:tasks-changed", "uniquecrm:meetings-changed", "storage"];
    evts.forEach((e) => window.addEventListener(e, load));
    return () => evts.forEach((e) => window.removeEventListener(e, load));
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [startDay, daysInMonth]);

  const tasksByDate = useMemo(() => {
    const m: Record<string, Task[]> = {};
    tasks.forEach((t) => {
      if (!t.due) return;
      (m[t.due] ??= []).push(t);
    });
    return m;
  }, [tasks]);

  const monthName = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const key = (d: number) => `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  const selectedTasks = selected ? tasksByDate[selected] ?? [] : [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Calendar"
        subtitle="Tasks and meetings across the month"
        actions={
          <div className="flex items-center gap-2">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="glass grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[160px] text-center text-sm font-semibold">{monthName}</span>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="glass grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <GlassCard className="p-3 sm:p-4">
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} className="h-20 rounded-lg" />;
              const k = key(d);
              const ts = tasksByDate[k] ?? [];
              const active = selected === k;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(k)}
                  className={`relative flex h-20 flex-col items-start rounded-lg border p-1.5 text-left text-xs transition ${
                    active
                      ? "border-transparent gradient-brand-bg text-white glow-shadow-sm"
                      : isToday(d)
                      ? "border-[color:var(--brand-pink)]/40 bg-white/[0.03]"
                      : "border-white/5 hover:bg-white/[0.04]"
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${active ? "" : isToday(d) ? "gradient-text" : ""}`}>{d}</span>
                  {ts.length > 0 && (
                    <div className="mt-auto flex w-full flex-col gap-0.5">
                      {ts.slice(0, 2).map((t) => (
                        <span key={t.id} className={`truncate rounded px-1 py-0.5 text-[9px] ${active ? "bg-white/20" : "bg-white/10"}`}>
                          {t.title}
                        </span>
                      ))}
                      {ts.length > 2 && <span className="text-[9px] opacity-70">+{ts.length - 2}</span>}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard>
            <h3 className="mb-3 text-sm font-semibold">
              {selected ? `Tasks · ${selected}` : "Select a date"}
            </h3>
            {selectedTasks.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                {selected ? "No tasks due this day." : "Click a day to see its tasks."}
              </p>
            ) : (
              <ul className="space-y-2">
                {selectedTasks.map((t) => (
                  <li key={t.id} className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.03] p-2">
                    <CheckSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-pink)]" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{t.title}</p>
                      {t.status && <Badge tone="info">{t.status}</Badge>}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>

          <GlassCard>
            <h3 className="mb-3 text-sm font-semibold">Upcoming meetings</h3>
            {meetings.length === 0 ? (
              <p className="text-xs text-muted-foreground">Schedule a meeting to see it here.</p>
            ) : (
              <ul className="space-y-2">
                {meetings.slice(0, 5).map((m) => (
                  <li key={m.id} className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.03] p-2">
                    <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[color:var(--brand-pink)]" />
                    <div className="min-w-0">
                      <p className="truncate text-xs font-medium">{m.title}</p>
                      <p className="truncate text-[10px] text-muted-foreground">{m.time}{m.with ? ` · ${m.with}` : ""}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
