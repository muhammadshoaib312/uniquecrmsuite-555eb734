import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Plus, List, KanbanSquare, Calendar as CalIcon, Flag, Clock,
  CheckCircle2, Circle, AlertCircle, Timer, ChevronLeft, ChevronRight,
} from "lucide-react";
import { PageHeader, GlassCard, Badge, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — UniqueCRM" },
      { name: "description", content: "Track work across list, board, and calendar views." },
    ],
  }),
  component: TasksPage,
});

type Priority = "High" | "Medium" | "Low";
type Status = "Pending" | "In Progress" | "Completed" | "Overdue";
type Task = {
  id: string;
  title: string;
  assignee: string;
  tone: number;
  priority: Priority;
  status: Status;
  due: string; // YYYY-MM-DD
};

const TASKS: Task[] = [
  { id: "1", title: "Send Northwind renewal proposal", assignee: "Ava", tone: 0, priority: "High", status: "In Progress", due: "2026-07-14" },
  { id: "2", title: "Prep Q3 pipeline review deck", assignee: "Marcus", tone: 1, priority: "High", status: "Pending", due: "2026-07-15" },
  { id: "3", title: "Follow up with Halcyon on SOC2", assignee: "Priya", tone: 2, priority: "Medium", status: "Overdue", due: "2026-07-10" },
  { id: "4", title: "Onboard Meridian success team", assignee: "Diego", tone: 3, priority: "Medium", status: "In Progress", due: "2026-07-16" },
  { id: "5", title: "Update pricing calculator", assignee: "Sofia", tone: 4, priority: "Low", status: "Completed", due: "2026-07-09" },
  { id: "6", title: "Reply to Aster support thread", assignee: "Jamal", tone: 0, priority: "Low", status: "Pending", due: "2026-07-17" },
  { id: "7", title: "Draft July newsletter", assignee: "Elena", tone: 1, priority: "Medium", status: "Pending", due: "2026-07-18" },
  { id: "8", title: "Close Volta Motors negotiation", assignee: "Kenji", tone: 2, priority: "High", status: "In Progress", due: "2026-07-15" },
];

const priorityTone: Record<Priority, "warning" | "info" | "default"> = {
  High: "warning", Medium: "info", Low: "default",
};
const statusIcon: Record<Status, { icon: typeof Circle; className: string }> = {
  Pending: { icon: Circle, className: "text-muted-foreground" },
  "In Progress": { icon: Timer, className: "text-sky-400" },
  Completed: { icon: CheckCircle2, className: "text-emerald-400" },
  Overdue: { icon: AlertCircle, className: "text-rose-400" },
};

function TasksPage() {
  const [view, setView] = useState<"list" | "board" | "calendar">("list");

  return (
    <div>
      <PageHeader
        title="Tasks"
        subtitle="Plan work, track progress, hit deadlines."
        actions={
          <button className="gradient-brand-bg inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white glow-shadow-sm">
            <Plus className="h-4 w-4" /> New Task
          </button>
        }
      />

      <div className="glass mb-5 inline-flex rounded-xl p-1">
        {([
          ["list", List, "List"],
          ["board", KanbanSquare, "Board"],
          ["calendar", CalIcon, "Calendar"],
        ] as const).map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setView(key)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm ${
              view === key ? "gradient-brand-bg text-white glow-shadow-sm" : "text-muted-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {label}
          </button>
        ))}
      </div>

      {view === "list" && <ListView />}
      {view === "board" && <BoardView />}
      {view === "calendar" && <CalendarView />}
    </div>
  );
}

function ListView() {
  return (
    <GlassCard className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Task</th>
              <th className="px-5 py-3 font-medium">Assignee</th>
              <th className="px-5 py-3 font-medium">Priority</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Due</th>
            </tr>
          </thead>
          <tbody>
            {TASKS.map((t) => {
              const S = statusIcon[t.status];
              return (
                <tr key={t.id} className="border-t border-white/5 transition hover:bg-white/[0.03]">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <S.icon className={`h-4 w-4 shrink-0 ${S.className}`} />
                      <span className={t.status === "Completed" ? "line-through text-muted-foreground" : ""}>{t.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Avatar name={t.assignee} tone={t.tone} />
                      <span className="text-muted-foreground">{t.assignee}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge tone={priorityTone[t.priority]}>
                      <Flag className="mr-1 inline h-3 w-3" />{t.priority}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5"><Badge tone={t.status === "Completed" ? "success" : t.status === "Overdue" ? "warning" : t.status === "In Progress" ? "info" : "default"}>{t.status}</Badge></td>
                  <td className="px-5 py-3.5 text-muted-foreground"><Clock className="mr-1 inline h-3.5 w-3.5" />{t.due}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
}

function BoardView() {
  const cols: Status[] = ["Pending", "In Progress", "Completed", "Overdue"];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cols.map((col) => {
        const items = TASKS.filter((t) => t.status === col);
        const S = statusIcon[col];
        return (
          <div key={col} className="glass rounded-2xl p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <S.icon className={`h-4 w-4 ${S.className}`} />
                <h3 className="text-sm font-semibold">{col}</h3>
              </div>
              <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-muted-foreground">{items.length}</span>
            </div>
            <div className="space-y-2">
              {items.map((t) => (
                <div key={t.id} className="glass rounded-xl p-3 transition hover:-translate-y-0.5 hover:glow-shadow-sm">
                  <div className="mb-2 text-sm font-medium">{t.title}</div>
                  <div className="flex items-center justify-between">
                    <Badge tone={priorityTone[t.priority]}><Flag className="mr-1 inline h-3 w-3" />{t.priority}</Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />{t.due.slice(5)}
                      <Avatar name={t.assignee} tone={t.tone} />
                    </div>
                  </div>
                </div>
              ))}
              {items.length === 0 && <div className="rounded-xl border border-dashed border-white/10 p-4 text-center text-xs text-muted-foreground">No tasks</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarView() {
  // July 2026 (starts Wed)
  const days = 31;
  const startOffset = 3; // Wed
  const cells = useMemo(() => {
    const arr: (number | null)[] = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= days; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, []);

  return (
    <GlassCard>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">July 2026</h3>
        <div className="flex gap-1">
          <button className="glass rounded-lg p-1.5"><ChevronLeft className="h-4 w-4" /></button>
          <button className="glass rounded-lg p-1.5"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="py-2 font-medium">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const dateStr = d != null ? `2026-07-${String(d).padStart(2, "0")}` : null;
          const dayTasks = dateStr ? TASKS.filter((t) => t.due === dateStr) : [];
          return (
            <div
              key={i}
              className={`min-h-[92px] rounded-xl border p-2 text-left text-xs ${
                d == null ? "border-transparent" : "border-white/5 bg-white/[0.02]"
              }`}
            >
              {d != null && (
                <>
                  <div className="mb-1 text-muted-foreground">{d}</div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((t) => (
                      <div key={t.id} className="gradient-brand-bg truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium text-white">
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && <div className="text-[10px] text-muted-foreground">+{dayTasks.length - 2} more</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
