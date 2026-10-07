import { services } from "@/services";
import { storage } from "@/api/storage-adapter";
import type { IndexedRecord } from "@/lib/global-index";

/** Read-only report snapshot; the Kanban board retains its existing storage format. */
export async function readReportRecords(): Promise<IndexedRecord[]> {
  const [leads, tasks, board] = await Promise.all([
    services.leads.list(), services.tasks.list(),
    storage.read<Record<string, unknown[]>>("uniquecrm:deals-board"),
  ]);
  const records: IndexedRecord[] = [];
  const append = (module: IndexedRecord["module"], item: unknown, stage?: string) => {
    if (!item || typeof item !== "object" || !("id" in item)) throw new Error("A saved record is invalid.");
    const raw = { ...item, ...(stage ? { stage } : {}) } as Record<string, unknown>;
    if (module === "deals" && !Number.isFinite(Number(raw.value ?? 0))) throw new Error("A deal has an invalid value.");
    records.push({ id: `${module}:${raw.id}`, module, title: String(raw.name ?? raw.title ?? ""), href: `/${module}`, keywords: "", raw });
  };
  leads.forEach((record) => append("leads", record));
  tasks.forEach((record) => append("tasks", record));
  if (board) {
    if (typeof board !== "object" || Array.isArray(board)) throw new Error("The saved deal pipeline is invalid.");
    Object.entries(board).forEach(([stage, deals]) => {
      if (!Array.isArray(deals)) throw new Error("A saved pipeline stage is invalid.");
      deals.forEach((deal) => append("deals", deal, stage));
    });
  }
  return records;
}