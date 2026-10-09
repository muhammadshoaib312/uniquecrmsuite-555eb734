// Lead timeline + follow-up helpers. All writes go through the service layer.
import { services } from "@/services";
import type { Lead, LeadActivity, LeadActivityType } from "@/types/models";

export function logLeadActivity(
  leadId: string,
  type: LeadActivityType,
  title: string,
  body?: string,
  actor?: string,
): Promise<LeadActivity> {
  return services.leadActivities.create({
    leadId,
    type,
    title,
    body: body?.trim() || undefined,
    actor: actor?.trim() || undefined,
    createdAt: new Date().toISOString(),
  });
}

export type FollowUpState = "none" | "done" | "overdue" | "today" | "upcoming";

export function followUpAt(lead: Pick<Lead, "followUpDate" | "followUpTime">): Date | null {
  if (!lead.followUpDate) return null;
  const d = new Date(`${lead.followUpDate}T${lead.followUpTime || "23:59"}`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function followUpState(lead: Lead, now = new Date()): FollowUpState {
  const at = followUpAt(lead);
  if (!at) return "none";
  if (lead.followUpDone) return "done";
  if (at.getTime() < now.getTime()) return "overdue";
  if (at.toDateString() === now.toDateString()) return "today";
  return "upcoming";
}

export function formatFollowUp(lead: Lead): string {
  const at = followUpAt(lead);
  if (!at) return "";
  return at.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(lead.followUpTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}

export const followUpTone: Record<FollowUpState, "danger" | "warning" | "info" | "success" | "default"> = {
  overdue: "danger",
  today: "warning",
  upcoming: "info",
  done: "success",
  none: "default",
};

export const followUpLabel: Record<FollowUpState, string> = {
  overdue: "Overdue",
  today: "Due today",
  upcoming: "Upcoming",
  done: "Completed",
  none: "No follow-up",
};
