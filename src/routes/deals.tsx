import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, MoreHorizontal, Calendar, DollarSign, Building2, User, Flag, GripVertical } from "lucide-react";
import { PageHeader, Avatar } from "@/components/crm-ui";

export const Route = createFileRoute("/deals")({
  head: () => ({
    meta: [
      { title: "Deals — UniqueCRM" },
      { name: "description", content: "Drag-and-drop pipeline for every opportunity." },
    ],
  }),
  component: DealsPage,
});

type Priority = "High" | "Medium" | "Low";

type Deal = {
  id: string;
  company: string;
  contact: string;
  value: number;
  priority: Priority;
  due: string;
};

const stages = [
  "New Lead",
  "Qualified",
  "Meeting Scheduled",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
] as const;
type Stage = (typeof stages)[number];

const stageAccent: Record<Stage, string> = {
  "New Lead": "from-sky-500/60 to-sky-500/10",
  Qualified: "from-violet-500/60 to-violet-500/10",
  "Meeting Scheduled": "from-fuchsia-500/60 to-fuchsia-500/10",
  "Proposal Sent": "from-pink-500/60 to-pink-500/10",
  Negotiation: "from-amber-500/60 to-amber-500/10",
  Won: "from-emerald-500/60 to-emerald-500/10",
  Lost: "from-rose-500/60 to-rose-500/10",
};

const priorityTone: Record<Priority, string> = {
  High: "bg-rose-500/10 text-rose-300 ring-rose-500/30",
  Medium: "bg-amber-500/10 text-amber-300 ring-amber-500/30",
  Low: "bg-white/5 text-muted-foreground ring-white/10",
};

const initial: Record<Stage, Deal[]> = {
  "New Lead": [
    { id: "d1", company: "Wayne Enterprises", contact: "Aiko Tanaka", value: 8400, priority: "Low", due: "Aug 12" },
    { id: "d2", company: "Hooli", contact: "Lucas Meyer", value: 14000, priority: "Medium", due: "Aug 14" },
    { id: "d3", company: "Vandelay", contact: "Rahul Desai", value: 22600, priority: "Low", due: "Aug 18" },
  ],
  Qualified: [
    { id: "d4", company: "Northwind", contact: "Priya Nair", value: 18500, priority: "High", due: "Aug 20" },
    { id: "d5", company: "Pied Piper", contact: "Oliver Grant", value: 42000, priority: "Medium", due: "Aug 22" },
  ],
  "Meeting Scheduled": [
    { id: "d6", company: "Umbrella Co.", contact: "Emma Wilson", value: 56000, priority: "Medium", due: "Aug 24" },
    { id: "d7", company: "Cyberdyne", contact: "Chen Wei", value: 31000, priority: "High", due: "Aug 25" },
  ],
  "Proposal Sent": [
    { id: "d8", company: "Acme Corp", contact: "Sarah Johnson", value: 42000, priority: "High", due: "Aug 24" },
    { id: "d9", company: "Stark Industries", contact: "James O'Brien", value: 120000, priority: "High", due: "Aug 28" },
  ],
  Negotiation: [
    { id: "d10", company: "Globex", contact: "Michael Chen", value: 67200, priority: "High", due: "Aug 30" },
    { id: "d11", company: "Massive Dynamic", contact: "Yara Haddad", value: 88000, priority: "Medium", due: "Sep 4" },
  ],
  Won: [
    { id: "d12", company: "Initech", contact: "Diego Alvarez", value: 9800, priority: "Medium", due: "Aug 8" },
    { id: "d13", company: "Soylent", contact: "Marta Silva", value: 46000, priority: "Medium", due: "Aug 10" },
  ],
  Lost: [
    { id: "d14", company: "Duff Beer", contact: "Homer S.", value: 5200, priority: "Low", due: "Aug 2" },
  ],
};

function DealsPage() {
  const [board, setBoard] = useState(initial);
  const [dragging, setDragging] = useState<{ id: string; from: Stage } | null>(null);
  const [overStage, setOverStage] = useState<Stage | null>(null);

  const totalValue = (Object.values(board).flat().reduce((a, d) => a + d.value, 0) / 1000).toFixed(0);

  function onDragStart(id: string, from: Stage) {
    setDragging({ id, from });
  }
  function onDragOver(e: React.DragEvent, stage: Stage) {
    e.preventDefault();
    if (overStage !== stage) setOverStage(stage);
  }
  function onDrop(stage: Stage) {
    if (!dragging) return;
    if (dragging.from === stage) {
      setDragging(null);
      setOverStage(null);
      return;
    }
    setBoard((prev) => {
      const fromList = prev[dragging.from];
      const card = fromList.find((d) => d.id === dragging.id);
      if (!card) return prev;
      return {
        ...prev,
        [dragging.from]: fromList.filter((d) => d.id !== dragging.id),
        [stage]: [card, ...prev[stage]],
      };
    });
    setDragging(null);
    setOverStage(null);
  }

  return (
    <div className="mx-auto max-w-[1600px]">
      <PageHeader
        title="Deals"
        subtitle={`$${totalValue}K across ${stages.length} stages · drag cards to move`}
        actions={
          <button className="gradient-brand-bg glow-shadow-sm inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-[1.02]">
            <Plus className="h-4 w-4" />
            New deal
          </button>
        }
      />

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {stages.map((stage) => {
          const list = board[stage];
          const stageTotal = (list.reduce((a, d) => a + d.value, 0) / 1000).toFixed(1);
          const isOver = overStage === stage && dragging && dragging.from !== stage;
          return (
            <div
              key={stage}
              onDragOver={(e) => onDragOver(e, stage)}
              onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
              onDrop={() => onDrop(stage)}
              className={`glass flex w-72 shrink-0 flex-col rounded-2xl p-3 transition ${
                isOver ? "ring-2 ring-[color:var(--brand-pink)] glow-shadow-sm" : ""
              }`}
            >
              <div className={`mb-3 rounded-xl bg-gradient-to-b ${stageAccent[stage]} border border-white/10 px-3 py-2`}>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{stage}</h3>
                  <span className="rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium">
                    {list.length}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] font-medium text-foreground/80">${stageTotal}K</p>
              </div>

              <div className="flex flex-col gap-2">
                {list.map((d) => (
                  <DealCard
                    key={d.id}
                    deal={d}
                    stage={stage}
                    onDragStart={onDragStart}
                    isDragging={dragging?.id === d.id}
                  />
                ))}
                <button className="mt-1 flex items-center justify-center gap-1 rounded-xl border border-dashed border-white/10 py-2 text-xs text-muted-foreground transition hover:border-white/20 hover:text-foreground">
                  <Plus className="h-3 w-3" />
                  Add deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DealCard({
  deal,
  stage,
  onDragStart,
  isDragging,
}: {
  deal: Deal;
  stage: Stage;
  onDragStart: (id: string, from: Stage) => void;
  isDragging: boolean;
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(deal.id, stage)}
      className={`group cursor-grab rounded-xl border border-white/5 bg-white/[0.03] p-3 transition active:cursor-grabbing hover:border-white/15 hover:bg-white/[0.06] ${
        isDragging ? "opacity-40 scale-[0.98]" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Building2 className="h-3.5 w-3.5 shrink-0 text-[color:var(--brand-pink)]" />
          <p className="truncate text-sm font-semibold">{deal.company}</p>
        </div>
        <GripVertical className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
        <Avatar name={deal.contact} />
        <span className="truncate">{deal.contact}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="inline-flex items-center gap-1 font-semibold gradient-text">
          <DollarSign className="h-3 w-3" />
          {deal.value.toLocaleString()}
        </span>
        <span className="inline-flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-3 w-3" />
          {deal.due}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${priorityTone[deal.priority]}`}
        >
          <Flag className="h-2.5 w-2.5" />
          {deal.priority}
        </span>
        <button className="rounded p-0.5 text-muted-foreground opacity-0 transition group-hover:opacity-100">
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
