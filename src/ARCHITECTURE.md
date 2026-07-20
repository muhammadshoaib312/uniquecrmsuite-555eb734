# Architecture

UniqueCRM is being staged for a real FastAPI backend. The frontend follows
a strict layered architecture:

```
component (routes/, components/)
        │
        ▼
useResource (src/hooks/)
        │
        ▼
services   (src/services/)     ← business layer, async CRUD
        │
        ▼
Repository (src/api/repository.ts)
        │
        ▼
StorageAdapter (src/api/storage-adapter.ts)  ← localStorage today, HTTP tomorrow
```

## Rules

- **UI never touches `localStorage`.** Use `useResource(services.X)` or the
  legacy `useRecordStore(key)` / `useLeadStore()` facades (both now delegate
  to the service layer).
- **All CRUD is Promise-based.** Services return `Promise<T>`; the
  `useResource` hook wraps them with optimistic updates so the UI stays sync.
- **Types live in `src/types/`.** No duplicated model shapes elsewhere.
- **Validation lives in `src/utils/validation.ts`.** Use `required`,
  `emailField`, `phoneField`, `dateField`, and `validate()`.
- **Reusable table primitives** are in `src/components/data-table.tsx`:
  `TableSearch`, `FilterChips`, `Pagination`, `BulkBar`, `StatusBadge`,
  `ActionsMenu`, `EmptyState`, `LoadingState`.
- **Reusable modal** is in `src/components/form-modal.tsx`: `FormModal` +
  `FieldError`.

## Swapping to FastAPI

Replace **one file** — `src/api/storage-adapter.ts` — with a fetch-based
implementation. Every service, hook, and component keeps working.
