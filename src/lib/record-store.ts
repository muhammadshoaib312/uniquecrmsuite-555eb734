// Backwards-compatible facade over the new service layer.
//
// Public API (`useRecordStore(key)`) is unchanged: existing pages continue
// to work without edits. Under the hood every CRUD op now flows through:
//   Component → useResource → BaseService → Repository → StorageAdapter
//
// New code should prefer `useResource(services.<name>)` directly.

import { useMemo } from "react";
import { BaseService } from "@/services/base.service";
import { Repository, type HasId } from "@/api/repository";
import { services } from "@/services";
import { useResource } from "@/hooks/useResource";

type KnownKey = keyof typeof services;

function getService<T extends HasId>(key: string): BaseService<T> {
  if (key in services) {
    return services[key as KnownKey] as unknown as BaseService<T>;
  }
  // Ad-hoc resources (e.g. "deals-board", "campaigns") — build on the fly.
  return new BaseService<T>(new Repository<T>(key));
}

export function useRecordStore<T extends { id: string }>(key: string): {
  items: T[];
  add: (item: Omit<T, "id"> & { id?: string }) => T;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
} {
  const service = useMemo(() => getService<T>(key), [key]);
  const { items, add, update, remove } = useResource<T>(service);
  return { items, add, update, remove };
}
