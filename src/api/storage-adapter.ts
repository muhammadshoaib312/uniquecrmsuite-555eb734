// Storage adapter — Promise-based key/value abstraction.
// The current implementation is localStorage; swapping this file for a
// fetch-based FastAPI adapter is the only change required to move the app
// to a real backend.

export interface StorageAdapter {
  read<T>(key: string): Promise<T | null>;
  write<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

class LocalStorageAdapter implements StorageAdapter {
  async read<T>(key: string): Promise<T | null> {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async write<T>(key: string, value: T): Promise<void> {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* quota exceeded — swallowed in demo */
    }
  }

  async remove(key: string): Promise<void> {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(key);
  }
}

export const storage: StorageAdapter = new LocalStorageAdapter();
