import { useEffect, useState } from "react";

/**
 * Aggregates records across every module's localStorage store (plus the
 * built-in demo data) so global search, the command palette, and the
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

/* ------------------------------ demo seeds ------------------------------ */
// Kept in-sync with each route's SEED constants; safe to duplicate because
// we only need a search-friendly projection here.

const LEADS_SEED = [
  { id: "L-1042", name: "Priya Nair", company: "Northwind", email: "priya@northwind.co", status: "Qualified", source: "Referral" },
  { id: "L-1041", name: "Michael Chen", company: "Globex", email: "m.chen@globex.io", status: "Proposal", source: "LinkedIn" },
  { id: "L-1040", name: "James O'Brien", company: "Stark Industries", email: "james@stark.io", status: "Contacted", source: "Event" },
  { id: "L-1039", name: "Aiko Tanaka", company: "Wayne Enterprises", email: "aiko@wayneenterprises.jp", status: "New", source: "Website" },
  { id: "L-1038", name: "Lucas Meyer", company: "Hooli", email: "l.meyer@hooli.com", status: "Contacted", source: "Cold call" },
  { id: "L-1037", name: "Emma Wilson", company: "Umbrella Co.", email: "emma@umbrella.co", status: "Qualified", source: "Website" },
  { id: "L-1036", name: "Diego Alvarez", company: "Initech", email: "diego@initech.dev", status: "Won", source: "Referral" },
  { id: "L-1035", name: "Sarah Johnson", company: "Acme Corp", email: "sarah@acmecorp.com", status: "Proposal", source: "LinkedIn" },
];

const CONTACTS_SEED = [
  { id: "c1", name: "Ava Reynolds", company: "Northwind Labs", email: "ava@northwind.io", status: "VIP" },
  { id: "c2", name: "Marcus Chen", company: "Lumen Studios", email: "marcus@lumen.co", status: "Active" },
  { id: "c3", name: "Priya Natarajan", company: "Halcyon Systems", email: "priya@halcyon.dev", status: "Lead" },
  { id: "c4", name: "Diego Alvarez", company: "Meridian & Co", email: "diego@meridian.com", status: "Active" },
  { id: "c5", name: "Sofia Petrov", company: "Aster Health", email: "sofia@aster.health", status: "Inactive" },
  { id: "c6", name: "Jamal Turner", company: "Arcadia Media", email: "jamal@arcadia.tv", status: "VIP" },
];

const COMPANIES_SEED = [
  { id: "northwind", name: "Northwind Labs", industry: "SaaS", revenue: "$18.4M" },
  { id: "lumen", name: "Lumen Studios", industry: "Design", revenue: "$4.2M" },
  { id: "halcyon", name: "Halcyon Systems", industry: "Cloud Infra", revenue: "$62M" },
  { id: "meridian", name: "Meridian & Co", industry: "Finance", revenue: "$210M" },
  { id: "aster", name: "Aster Health", industry: "Healthcare", revenue: "$28M" },
  { id: "arcadia", name: "Arcadia Media", industry: "Media", revenue: "$9.1M" },
];

const PRODUCTS_SEED = [
  { id: "p1", name: "CRM Growth", sku: "CRM-GRW", price: 49, stock: 999 },
  { id: "p2", name: "CRM Scale", sku: "CRM-SCL", price: 129, stock: 999 },
  { id: "p3", name: "Analytics Add-on", sku: "AN-ADD", price: 29, stock: 500 },
  { id: "p4", name: "AI Assist Pack", sku: "AI-PCK", price: 79, stock: 200 },
];

const QUOTES_SEED = [
  { id: "q1", number: "Q-2088", client: "Northwind Labs", amount: 24500, status: "Sent" },
  { id: "q2", number: "Q-2087", client: "Halcyon Systems", amount: 68200, status: "Accepted" },
  { id: "q3", number: "Q-2086", client: "Meridian & Co", amount: 12800, status: "Draft" },
];

const DOCS_SEED = [
  { id: "doc1", name: "Master Services Agreement.pdf", type: "PDF", related: "Northwind Labs" },
  { id: "doc2", name: "Q3 Proposal — Halcyon.pdf", type: "PDF", related: "Halcyon Systems" },
  { id: "doc3", name: "Onboarding checklist.md", type: "MD", related: "Meridian & Co" },
];

const TICKETS_SEED = [
  { id: "s1", subject: "Cannot export contacts CSV", requester: "Emma Wilson", priority: "High", status: "In Progress" },
  { id: "s2", subject: "Billing question — INV-2038", requester: "Diego Alvarez", priority: "Medium", status: "Waiting" },
  { id: "s3", subject: "Add SSO for Okta", requester: "James O'Brien", priority: "Low", status: "Open" },
  { id: "s4", subject: "Sync stopped — HubSpot", requester: "Sarah Johnson", priority: "Urgent", status: "Open" },
];

const TASKS_SEED = [
  { id: "1", title: "Send Northwind renewal proposal", assignee: "Ava", priority: "High", status: "In Progress", due: "2026-07-14" },
  { id: "2", title: "Prep Q3 pipeline review deck", assignee: "Marcus", priority: "High", status: "Pending", due: "2026-07-15" },
  { id: "3", title: "Follow up with Halcyon on SOC2", assignee: "Priya", priority: "Medium", status: "Overdue", due: "2026-07-10" },
  { id: "4", title: "Onboard Meridian success team", assignee: "Diego", priority: "Medium", status: "In Progress", due: "2026-07-16" },
  { id: "5", title: "Update pricing calculator", assignee: "Sofia", priority: "Low", status: "Completed", due: "2026-07-09" },
];

const MEETINGS_SEED = [
  { id: "m1", title: "Demo — Umbrella Co.", time: "Today, 2:00 PM", type: "Video", with: "Emma Wilson" },
  { id: "m2", title: "Discovery call — Hooli", time: "Today, 4:30 PM", type: "Call", with: "Lucas Meyer" },
  { id: "m3", title: "QBR — Acme Corp", time: "Tomorrow, 10:00 AM", type: "Video", with: "Sarah Johnson" },
  { id: "m4", title: "Renewal — Soylent", time: "Aug 16, 1:00 PM", type: "Video", with: "Diego Alvarez" },
];

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
    ...LEADS_SEED,
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

  const contacts = [...safeRead<Record<string, any>>("uniquecrm:contacts"), ...CONTACTS_SEED];
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

  const companies = [...safeRead<Record<string, any>>("uniquecrm:companies"), ...COMPANIES_SEED];
  for (const co of companies) {
    out.push({
      id: `companies:${co.id}`,
      module: "companies",
      title: co.name as string,
      subtitle: `${co.industry ?? ""}${co.revenue ? " · " + co.revenue : ""}`,
      meta: (co.industry as string) ?? "",
      href: `/companies/${co.id}`,
      keywords: kw(co.name, co.industry, co.website, co.revenue),
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

  const tasks = [...safeRead<Record<string, any>>("uniquecrm:tasks"), ...TASKS_SEED];
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

  const meetings = [...safeRead<Record<string, any>>("uniquecrm:meetings"), ...MEETINGS_SEED];
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

  const products = [...safeRead<Record<string, any>>("uniquecrm:products"), ...PRODUCTS_SEED];
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

  const quotes = [...safeRead<Record<string, any>>("uniquecrm:quotes"), ...QUOTES_SEED];
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

  const docs = [...safeRead<Record<string, any>>("uniquecrm:documents"), ...DOCS_SEED];
  for (const d of docs) {
    out.push({
      id: `documents:${d.id}`,
      module: "documents",
      title: d.name as string,
      subtitle: `${d.type ?? ""}${d.related ? " · " + d.related : ""}`,
      meta: (d.type as string) ?? "",
      href: "/documents",
      keywords: kw(d.name, d.type, d.related, d.owner),
      raw: d,
    });
  }

  const tickets = [...safeRead<Record<string, any>>("uniquecrm:tickets"), ...TICKETS_SEED];
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
