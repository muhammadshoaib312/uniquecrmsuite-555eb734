// Base CRUD service every resource-specific service extends.
// Services are the single seam UI code calls; they always return Promises
// so swapping to FastAPI later is a body-only change.

import { Repository, type HasId } from "@/api/repository";
import type { ListParams } from "@/api/types";

export class BaseService<T extends HasId> {
  constructor(protected readonly repo: Repository<T>) {}

  list(params?: ListParams): Promise<T[]> {
    return this.repo.list(params);
  }
  get(id: string): Promise<T | null> {
    return this.repo.get(id);
  }
  create(input: Omit<T, "id"> & { id?: string }): Promise<T> {
    return this.repo.create(input);
  }
  update(id: string, patch: Partial<T>): Promise<T | null> {
    return this.repo.update(id, patch);
  }
  remove(id: string): Promise<void> {
    return this.repo.remove(id);
  }
  removeMany(ids: string[]): Promise<void> {
    return this.repo.removeMany(ids);
  }

  get resource(): string {
    return this.repo.resource;
  }
}
