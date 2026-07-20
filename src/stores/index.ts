// Client-side UI stores (theme, notifications) that are NOT domain data.
// Domain data lives in services/. This barrel exists so future stores
// (Zustand, Jotai) have a canonical home.

export { useTheme } from "@/lib/theme";
export { useOpenCreate } from "@/lib/use-open-create";
