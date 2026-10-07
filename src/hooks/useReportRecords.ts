import { useCallback, useEffect, useRef, useState } from "react";
import { readReportRecords } from "@/services/reports.service";
import type { IndexedRecord } from "@/lib/global-index";

export function useReportRecords() {
  const [records, setRecords] = useState<IndexedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++request.current;
    setLoading(true);
    setError(null);
    try {
      const next = await readReportRecords();
      if (current === request.current) setRecords(next);
    } catch {
      if (current === request.current) setError("Saved CRM records could not be loaded. Please try again.");
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, []);
  useEffect(() => {
    void refresh();
    const events = ["storage", "uniquecrm:leads-changed", "uniquecrm:deals-changed", "uniquecrm:tasks-changed"];
    const update = () => { void refresh(); };
    events.forEach((event) => window.addEventListener(event, update));
    return () => { request.current++; events.forEach((event) => window.removeEventListener(event, update)); };
  }, [refresh]);
  return { records, loading, error, refresh };
}