// Lightweight pub/sub used to notify hooks when a repository mutates.
// Kept resource-scoped so future FastAPI push (SSE/websocket) can hook the
// same channels without changing consumers.

export function resourceChangeEvent(resource: string): string {
  return `uniquecrm:${resource}-changed`;
}

export function emitChange(resource: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(resourceChangeEvent(resource)));
}

export function onChange(resource: string, handler: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const evt = resourceChangeEvent(resource);
  const wrapped = () => handler();
  window.addEventListener(evt, wrapped);
  window.addEventListener("storage", wrapped);
  return () => {
    window.removeEventListener(evt, wrapped);
    window.removeEventListener("storage", wrapped);
  };
}
