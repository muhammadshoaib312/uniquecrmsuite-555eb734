import { useEffect, useState } from "react";

/**
 * Aggregates records across every module's locally saved records so global search, the command palette, and the
 * notification center can operate over a single normalized index without
 * touching individual page components.
 */

export type IndexedRecord = {
  id: string;
  module:
    | "leads"
    | "contacts"
    | "companies"
    | "deals"
    | "tasks"
    | "meetings"
    | "products"
    | "quotes"
    | "documents"
    | "tickets";
  title: string;
  subtitle?: string;
  meta?: string;
  href: string;
  keywords: string;
  raw: Record<string, unknown>;
};

/* ------------------------------ helpers ------------------------------ */

function safeRead<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? (v as T[]) : [];
  } catch {
    return [];
  }
}

function kw(...parts: (string | number | undefined | null | unknown)[]) {
  return parts.filter(Boolean).map((p) => String(p)).join(" ").toLowerCase();
}

function readAll(): IndexedRecord[] {
  const out: IndexedRecord[] = [];

  const leads = [
    ...safeRead<Record<string, any>>("uniquecrm-leads-added"),
    ];
  for (const l of leads) {
    out.push({
      id: `leads:${l.id}`,
      module: "leads",
      title: l.name as string,
      subtitle: `${l.company ?? ""} · ${l.email ?? ""}`,
      meta: (l.status as string) ?? "",
      href: `/leads/${l.id}`,
      keywords: kw(l.name, l.company, l.email, l.status, l.source, l.id),
      raw: l,
    });
  }

  const contacts = [...safeRead<Record<string, any>>("uniquecrm:contacts"), ];
  for (const c of contacts) {
    out.push({
      id: `contacts:${c.id}`,
      module: "contacts",
      title: c.name as string,
      subtitle: `${c.company ?? ""} · ${c.email ?? ""}`,
      meta: (c.status as string) ?? "",
      href: "/contacts",
      keywords: kw(c.name, c.company, c.email, c.status),
      raw: c,
    });
  }

  const companies = [...safeRead<Record<string, any>>("uniquecrm:companies"), ];
  for (const co of companies) {
    out.push({
      id: `companies:${co.id}`,
      module: "companies",
      title: co.name as string,
      subtitle: `${co.industry ?? ""}${co.revenue ? " · " + co.revenue : ""}`,
      meta: (co.industry as string) ?? "",
      href: `/companies/${co.id}`,
      keywords: kw((co as any).name, (co as any).industry, (co as any).website, (co as any).revenue),
      raw: co,
    });
  }

  // Deals live inside a stage-keyed board, not a flat array.
  const board = (() => {
    try {
      const raw = window.localStorage.getItem("uniquecrm:deals-board");
      return raw ? (JSON.parse(raw) as Record<string, Array<Record<string, unknown>>>) : null;
    } catch {
      return null;
    }
  })();
  if (board) {
    for (const [stage, deals] of Object.entries(board)) {
      for (const d of deals) {
        const value = Number(d.value ?? 0);
        out.push({
          id: `deals:${d.id}`,
          module: "deals",
          title: `${d.company ?? "Deal"} — $${value.toLocaleString()}`,
          subtitle: `${d.contact ?? ""} · ${stage}`,
          meta: stage,
          href: "/deals",
          keywords: kw(d.company, d.contact, stage, String(value), d.priority),
          raw: { ...d, stage },
        });
      }
    }
  }

  const tasks = [...safeRead<Record<string, any>>("uniquecrm:tasks"), ];
  for (const t of tasks) {
    out.push({
      id: `tasks:${t.id}`,
      module: "tasks",
      title: t.title as string,
      subtitle: `${t.assignee ?? ""}${t.due ? " · due " + t.due : ""}`,
      meta: (t.status as string) ?? "",
      href: "/tasks",
      keywords: kw(t.title, t.assignee, t.status, t.priority, t.due),
      raw: t,
    });
  }

  const meetings = [...safeRead<Record<string, any>>("uniquecrm:meetings"), ];
  for (const m of meetings) {
    out.push({
      id: `meetings:${m.id}`,
      module: "meetings",
      title: m.title as string,
      subtitle: `${m.time ?? ""}${m.with ? " · with " + m.with : ""}`,
      meta: (m.type as string) ?? "",
      href: "/meetings",
      keywords: kw(m.title, m.time, m.with, m.type),
      raw: m,
    });
  }

  const products = [...safeRead<Record<string, any>>("uniquecrm:products"), ];
  for (const p of products) {
    out.push({
      id: `products:${p.id}`,
      module: "products",
      title: p.name as string,
      subtitle: `${p.sku ?? ""} · $${p.price ?? 0}`,
      meta: "Product",
      href: "/products",
      keywords: kw(p.name, p.sku, String(p.price)),
      raw: p,
    });
  }

  const quotes = [...safeRead<Record<string, any>>("uniquecrm:quotes"), ];
  for (const q of quotes) {
    out.push({
      id: `quotes:${q.id}`,
      module: "quotes",
      title: `${q.number ?? "Quote"} — ${q.client ?? ""}`,
      subtitle: `$${Number(q.amount ?? 0).toLocaleString()}`,
      meta: (q.status as string) ?? "",
      href: "/quotes",
      keywords: kw(q.number, q.client, q.status, String(q.amount)),
      raw: q,
    });
  }

  const docs = [...safeRead<Record<string, any>>("uniquecrm:documents"), ];
  for (const d of docs) {
    out.push({
      id: `documents:${d.id}`,
      module: "documents",
      title: d.name as string,
      subtitle: `${d.type ?? ""}${d.related ? " · " + d.related : ""}`,
      meta: (d.type as string) ?? "",
      href: "/documents",
      keywords: kw((d as any).name, (d as any).type, (d as any).related, (d as any).owner),
      raw: d,
    });
  }

  const tickets = [...safeRead<Record<string, any>>("uniquecrm:tickets"), ];
  for (const t of tickets) {
    out.push({
      id: `tickets:${t.id}`,
      module: "tickets",
      title: t.subject as string,
      subtitle: `${t.requester ?? ""} · ${t.status ?? ""}`,
      meta: (t.priority as string) ?? "",
      href: "/support",
      keywords: kw(t.subject, t.requester, t.status, t.priority),
      raw: t,
    });
  }

  return out;
}

/** Hook that returns a live, aggregated index across every module. */
export function useGlobalIndex(): IndexedRecord[] {
  const [items, setItems] = useState<IndexedRecord[]>([]);
  useEffect(() => {
    const refresh = () => setItems(readAll());
    refresh();
    const events = [
      "storage",
      "uniquecrm:leads-changed",
      "uniquecrm:contacts-changed",
      "uniquecrm:companies-changed",
      "uniquecrm:tasks-changed",
      "uniquecrm:meetings-changed",
      "uniquecrm:products-changed",
      "uniquecrm:quotes-changed",
      "uniquecrm:documents-changed",
      "uniquecrm:tickets-changed",
      "uniquecrm:deals-changed",
    ];
    events.forEach((e) => window.addEventListener(e, refresh));
    return () => events.forEach((e) => window.removeEventListener(e, refresh));
  }, []);
  return items;
}

/* ------------------------------ dashboard metrics ------------------------------ */

export function useDashboardMetrics() {
  const idx = useGlobalIndex();
  const today = new Date().toISOString().slice(0, 10);
  const leads = idx.filter((i) => i.module === "leads");
  const qualifiedLeads = leads.filter((l) => /qualified|proposal|won/i.test(String(l.raw.status ?? "")));
  const deals = idx.filter((i) => i.module === "deals");
  const openDeals = deals.filter((d) => !/won|lost/i.test(String(d.raw.stage ?? "")));
  const pipelineValue = openDeals.reduce((sum, d) => sum + Number(d.raw.value ?? 0), 0);
  const wonValue = deals.filter((d) => /won/i.test(String(d.raw.stage ?? ""))).reduce((s, d) => s + Number(d.raw.value ?? 0), 0);
  const tasks = idx.filter((i) => i.module === "tasks");
  const tasksDueToday = tasks.filter((t) => String(t.raw.due ?? "") === today && String(t.raw.status) !== "Completed");
  const overdueTasks = tasks.filter((t) => {
    const due = String(t.raw.due ?? "");
    return due && due < today && String(t.raw.status) !== "Completed";
  });
  const meetings = idx.filter((i) => i.module === "meetings");
  const upcomingMeetings = meetings.slice(0, 5);
  const openTickets = idx.filter((i) => i.module === "tickets" && !/resolved/i.test(String(i.raw.status ?? "")));

  return {
    totalLeads: leads.length,
    qualifiedLeads: qualifiedLeads.length,
    openDeals: openDeals.length,
    pipelineValue,
    wonValue,
    tasksDueToday: tasksDueToday.length,
    overdueTasks: overdueTasks.length,
    upcomingMeetings,
    openTickets: openTickets.length,
    tasks,
    meetings,
    deals,
  };
}
