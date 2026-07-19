// Demo/reset utilities for the localStorage-backed stores.
// Kept in a single file so the Settings page can offer a one-click reset
// and load a rich seed dataset for demos.

const STORAGE_KEYS = [
  "uniquecrm-leads-added",
  "uniquecrm:contacts",
  "uniquecrm:companies",
  "uniquecrm:tasks",
  "uniquecrm:meetings",
  "uniquecrm:products",
  "uniquecrm:quotes",
  "uniquecrm:documents",
  "uniquecrm:tickets",
  "uniquecrm:deals-board",
  "uniquecrm:notif-read",
  "uniquecrm:notif-cleared",
] as const;

const CHANGE_EVENTS = [
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
  "uniquecrm:notif-changed",
] as const;

function bumpAll() {
  CHANGE_EVENTS.forEach((e) => window.dispatchEvent(new CustomEvent(e)));
}

export function resetDemoData() {
  STORAGE_KEYS.forEach((k) => window.localStorage.removeItem(k));
  bumpAll();
}

export function loadDemoData() {
  const today = new Date();
  const iso = (offset: number) => new Date(today.getTime() + offset * 86400000).toISOString().slice(0, 10);

  window.localStorage.setItem("uniquecrm-leads-added", JSON.stringify([
    { id: "L-2201", name: "Zara Ahmed", company: "Beacon Analytics", email: "zara@beacon.io", phone: "+1 555-201-4488", status: "Qualified", priority: "High", source: "Website", owner: "Ava Chen", created: "Today" },
    { id: "L-2202", name: "Tom Rivera", company: "Kelvin Labs", email: "tom@kelvin.co", phone: "+1 555-311-9012", status: "New", priority: "Medium", source: "LinkedIn", owner: "Noah Kim", created: "Today" },
    { id: "L-2203", name: "Mei Watanabe", company: "Origami Cloud", email: "mei@origami.io", phone: "+81 3 5555 2013", status: "Contacted", priority: "High", source: "Referral", owner: "Sofia Reyes", created: "Yesterday" },
  ]));

  window.localStorage.setItem("uniquecrm:contacts", JSON.stringify([
    { id: "cd1", name: "Rita Osei", company: "Beacon Analytics", email: "rita@beacon.io", phone: "+1 555-778-4402", jobTitle: "COO", status: "Active", tags: ["Priority"], lastActivity: "just now", tone: 0 },
    { id: "cd2", name: "Isla Fernandes", company: "Kelvin Labs", email: "isla@kelvin.co", phone: "+1 555-411-3390", jobTitle: "Product Manager", status: "Lead", tags: ["Trial"], lastActivity: "1h ago", tone: 1 },
  ]));

  window.localStorage.setItem("uniquecrm:companies", JSON.stringify([
    { id: "beacon", name: "Beacon Analytics", industry: "Analytics", website: "beacon.io", phone: "+1 555 778 4400", email: "hello@beacon.io", employees: 140, revenue: "$22M", manager: "Rita Osei", tone: 0 },
    { id: "kelvin", name: "Kelvin Labs", industry: "SaaS", website: "kelvin.co", phone: "+1 555 411 3300", email: "team@kelvin.co", employees: 62, revenue: "$6.4M", manager: "Isla Fernandes", tone: 1 },
  ]));

  window.localStorage.setItem("uniquecrm:tasks", JSON.stringify([
    { id: "td1", title: "Confirm demo agenda with Beacon", assignee: "Ava", tone: 0, priority: "High", status: "Pending", due: iso(0) },
    { id: "td2", title: "Send SOC2 report to Kelvin", assignee: "Sofia", tone: 1, priority: "Medium", status: "In Progress", due: iso(1) },
    { id: "td3", title: "Chase overdue invoice INV-2130", assignee: "Diego", tone: 2, priority: "High", status: "Overdue", due: iso(-3) },
  ]));

  window.localStorage.setItem("uniquecrm:meetings", JSON.stringify([
    { id: "md1", title: "Kickoff — Beacon Analytics", time: "Today, 3:00 PM", duration: "45m", type: "Video", with: "Rita Osei" },
    { id: "md2", title: "Discovery — Kelvin Labs", time: "Tomorrow, 11:00 AM", duration: "30m", type: "Call", with: "Isla Fernandes" },
  ]));

  window.localStorage.setItem("uniquecrm:quotes", JSON.stringify([
    { id: "qd1", number: "Q-2201", client: "Beacon Analytics", amount: 32000, status: "Sent", expires: iso(14) },
    { id: "qd2", number: "Q-2202", client: "Kelvin Labs", amount: 14500, status: "Draft", expires: iso(21) },
  ]));

  window.localStorage.setItem("uniquecrm:tickets", JSON.stringify([
    { id: "sd1", subject: "Rate limit questions", requester: "Isla Fernandes", priority: "Medium", status: "Open", description: "Needs the API quotas doc." },
  ]));

  window.localStorage.setItem("uniquecrm:deals-board", JSON.stringify({
    "New Lead": [
      { id: "dd1", company: "Beacon Analytics", contact: "Rita Osei", value: 32000, priority: "High", due: "Sep 1" },
    ],
    Qualified: [
      { id: "dd2", company: "Kelvin Labs", contact: "Isla Fernandes", value: 14500, priority: "Medium", due: "Sep 4" },
    ],
    "Meeting Scheduled": [],
    "Proposal Sent": [
      { id: "dd3", company: "Origami Cloud", contact: "Mei Watanabe", value: 48000, priority: "High", due: "Sep 8" },
    ],
    Negotiation: [],
    Won: [
      { id: "dd4", company: "Aster Health", contact: "Sofia Petrov", value: 24000, priority: "Medium", due: "Aug 20" },
    ],
    Lost: [],
  }));

  bumpAll();
}
