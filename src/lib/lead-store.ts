// Backwards-compatible facade over the new lead service.
// Existing pages import { useLeadStore, StoredLead, Source } from here.

import { useMemo } from "react";
import { services } from "@/services";
import { useResource } from "@/hooks/useResource";
import type { Lead, LeadSource } from "@/types/models";

export type Source = LeadSource;
export type StoredLead = Lead;

export function useLeadStore(): {
  added: StoredLead[];
  add: (l: Omit<StoredLead, "id" | "created">) => StoredLead;
  update: (id: string, patch: Partial<StoredLead>) => void;
  remove: (id: string) => void;
} {
  const service = useMemo(() => services.leads, []);
  const { items, add: rawAdd, update, remove } = useResource(service);

  const add: (l: Omit<StoredLead, "id" | "created">) => StoredLead = (l) => {
    const created = new Date().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const id = "L-" + Math.floor(1100 + Math.random() * 8000);
    return rawAdd({ ...l, id, created } as Omit<StoredLead, "id"> & { id?: string });
  };

  return { added: items, add, update, remove };
}
