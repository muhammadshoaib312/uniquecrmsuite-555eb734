// React binding for a service. Subscribes to the resource change bus and
// exposes an optimistic, sync-feeling CRUD API on top of the async service.
//
// This is the ONLY approved way for UI code to touch domain data.

import { useCallback, useEffect, useState } from "react";
import { onChange } from "@/api/event-bus";
import type { BaseService } from "@/services/base.service";
import type { HasId } from "@/api/repository";

export interface UseResourceResult<T extends HasId> {
  items: T[];
  loading: boolean;
  add: (input: Omit<T, "id"> & { id?: string }) => T;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  refresh: () => Promise<void>;
}

export function useResource<T extends HasId>(service: BaseService<T>): UseResourceResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const list = await service.list();
    setItems(list);
    setLoading(false);
  }, [service]);

  useEffect(() => {
    void refresh();
    const off = onChange(service.resource, () => void refresh());
    return off;
  }, [service, refresh]);

  const add = useCallback(
    (input: Omit<T, "id"> & { id?: string }): T => {
      const id =
        input.id ?? `${service.resource}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
      const optimistic = { ...input, id } as T;
      setItems((prev) => [optimistic, ...prev]);
      void service.create({ ...input, id });
      return optimistic;
    },
    [service],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>) => {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
      void service.update(id, patch);
    },
    [service],
  );

  const remove = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((it) => it.id !== id));
      void service.remove(id);
    },
    [service],
  );

  const removeMany = useCallback(
    (ids: string[]) => {
      const set = new Set(ids);
      setItems((prev) => prev.filter((it) => !set.has(it.id)));
      void service.removeMany(ids);
    },
    [service],
  );

  return { items, loading, add, update, remove, removeMany, refresh };
}
