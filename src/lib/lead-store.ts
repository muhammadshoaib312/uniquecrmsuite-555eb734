import { useEffect, useState } from "react";

const KEY = "uniquecrm-leads-added";

export type Source = "Website" | "Referral" | "LinkedIn" | "Cold call" | "Event" | "Other";

export type StoredLead = {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: "New" | "Contacted" | "Qualified" | "Proposal" | "Won" | "Lost";
  priority: "High" | "Medium" | "Low";
  source: Source;
  owner: string;
  created: string;
};

function read(): StoredLead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function write(list: StoredLead[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("uniquecrm:leads-changed"));
  } catch {}
}

export function useLeadStore(): {
  added: StoredLead[];
  add: (l: Omit<StoredLead, "id" | "created">) => StoredLead;
  remove: (id: string) => void;
} {
  const [added, setAdded] = useState<StoredLead[]>([]);

  useEffect(() => {
    setAdded(read());
    const onChange = () => setAdded(read());
    window.addEventListener("uniquecrm:leads-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("uniquecrm:leads-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const add: ReturnType<typeof useLeadStore>["add"] = (l) => {
    const now = new Date();
    const id = "L-" + Math.floor(1100 + Math.random() * 8000);
    const created = now.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    const lead: StoredLead = { ...l, id, created };
    const next = [lead, ...read()];
    write(next);
    setAdded(next);
    return lead;
  };
  const remove = (id: string) => {
    const next = read().filter((l) => l.id !== id);
    write(next);
    setAdded(next);
  };
  return { added, add, remove };
}
