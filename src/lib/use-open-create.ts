import { useEffect } from "react";

/**
 * Subscribe to the global quick-create event and open a module's create modal
 * when the requested module id matches. Used by the header quick-create menu
 * and the command palette.
 */
export function useOpenCreate(moduleKey: string, open: () => void) {
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === moduleKey) open();
    };
    window.addEventListener("uniquecrm:open-create", onOpen);
    return () => window.removeEventListener("uniquecrm:open-create", onOpen);
  }, [moduleKey, open]);
}
