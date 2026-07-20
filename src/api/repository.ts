// Generic Promise-based CRUD repository.
// Services build on top of this; UI never touches storage directly.
//
// Public methods intentionally mirror what a REST/FastAPI endpoint would
// expose (list/get/create/update/delete) so callers can be reused
// unchanged once the storage adapter is replaced with HTTP calls.

import { storage } from "./storage-adapter";
import { emitChange } from "./event-bus";
import type { ListParams } from "./types";

export interface HasId {
  id: string;
}

export interface RepositoryOptions {
  /** Fallback key format for legacy leads storage compatibility. */
  legacyKey?: string;
}

export class Repository<T extends HasId> {
  constructor(
    public readonly resource: string,
    private readonly options: RepositoryOptions = {},
  ) {}

  private get key(): string {
    return this.options.legacyKey ?? `uniquecrm:${this.resource}`;
  }

  async list(params?: ListParams): Promise<T[]> {
    const raw = (await storage.read<T[]>(this.key)) ?? [];
    let items = Array.isArray(raw) ? raw : [];

    if (params?.query) {
      const q = params.query.toLowerCase();
      items = items.filter((it) =>
        Object.values(it as Record<string, unknown>).some(
          (v) => typeof v === "string" && v.toLowerCase().includes(q),
        ),
      );
    }
    if (params?.filters) {
      items = items.filter((it) =>
        Object.entries(params.filters ?? {}).every(([k, v]) => {
          if (v === undefined || v === null || v === "" || v === "All") return true;
          return (it as Record<string, unknown>)[k] === v;
        }),
      );
    }
    return items;
  }

  async get(id: string): Promise<T | null> {
    const all = await this.list();
    return all.find((it) => it.id === id) ?? null;
  }

  async create(input: Omit<T, "id"> & { id?: string }): Promise<T> {
    const id = input.id ?? this.generateId();
    const record = { ...input, id } as T;
    const all = await this.list();
    await storage.write(this.key, [record, ...all]);
    emitChange(this.resource);
    return record;
  }

  async update(id: string, patch: Partial<T>): Promise<T | null> {
    const all = await this.list();
    let updated: T | null = null;
    const next = all.map((it) => {
      if (it.id !== id) return it;
      updated = { ...it, ...patch };
      return updated;
    });
    await storage.write(this.key, next);
    emitChange(this.resource);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const all = await this.list();
    const next = all.filter((it) => it.id !== id);
    await storage.write(this.key, next);
    emitChange(this.resource);
  }

  async removeMany(ids: string[]): Promise<void> {
    const set = new Set(ids);
    const all = await this.list();
    await storage.write(this.key, all.filter((it) => !set.has(it.id)));
    emitChange(this.resource);
  }

  async replaceAll(items: T[]): Promise<void> {
    await storage.write(this.key, items);
    emitChange(this.resource);
  }

  private generateId(): string {
    return `${this.resource}-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
  }
}
