import { useEffect, useState, useCallback } from "react";

// Generic localStorage-backed record store for demo CRUD.
// Each stored item requires an `id` field.

export function useRecordStore<T extends { id: string }>(key: string) {
  const storageKey = `uniquecrm:${key}`;
  const eventName = `uniquecrm:${key}-changed`;

  const read = useCallback((): T[] => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return [];
      const v = JSON.parse(raw);
      return Array.isArray(v) ? (v as T[]) : [];
    } catch {
      return [];
    }
  }, [storageKey]);

  const write = useCallback(
    (list: T[]) => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(list));
        window.dispatchEvent(new CustomEvent(eventName));
      } catch {}
    },
    [storageKey, eventName],
  );

  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    setItems(read());
    const onChange = () => setItems(read());
    window.addEventListener(eventName, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(eventName, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [read, eventName]);

  const add = useCallback(
    (item: Omit<T, "id"> & { id?: string }): T => {
      const id = item.id ?? `${key}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
      const record = { ...item, id } as T;
      const next = [record, ...read()];
      write(next);
      setItems(next);
      return record;
    },
    [key, read, write],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>): void => {
      const next = read().map((it) => (it.id === id ? { ...it, ...patch } : it));
      write(next);
      setItems(next);
    },
    [read, write],
  );

  const remove = useCallback(
    (id: string): void => {
      const next = read().filter((it) => it.id !== id);
      write(next);
      setItems(next);
    },
    [read, write],
  );

  return { items, add, update, remove };
}
