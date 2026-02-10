/**
 * Date utility functions — centralized date logic.
 * Keeps all date formatting/calculation out of components.
 */

import { APP_CONFIG } from "@/config";

/** Format a date string to "10 Jan" style */
export function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

/** Format a date string to "10 January 2026" style */
export function formatDateLong(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Get days remaining until a deadline */
export function getDaysUntilDeadline(deadline: string): number {
  const now = new Date();
  return Math.ceil(
    (new Date(deadline).getTime() - now.getTime()) / 86400000
  );
}

/** Human-readable "days left" label */
export function getDaysLeftLabel(deadline: string): string {
  const diff = getDaysUntilDeadline(deadline);
  if (diff < 0) return "Overdue";
  if (diff === 0) return "Today!";
  if (diff === 1) return "Tomorrow";
  return `${diff} days`;
}

/** Check if a deadline has passed */
export function isOverdue(deadline: string): boolean {
  return new Date(deadline) < new Date();
}

/** Urgency tier based on days remaining */
export type UrgencyLevel = "critical" | "warning" | "normal";

export function getUrgencyLevel(deadline: string): UrgencyLevel {
  const days = getDaysUntilDeadline(deadline);
  if (days <= APP_CONFIG.deadlines.urgentThresholdDays) return "critical";
  if (days <= APP_CONFIG.deadlines.warningThresholdDays) return "warning";
  return "normal";
}

/** Urgency-based Tailwind styles */
export function getUrgencyStyles(deadline: string) {
  const level = getUrgencyLevel(deadline);
  const map = {
    critical: { text: "text-destructive", bg: "bg-destructive/10", dot: "bg-destructive" },
    warning: { text: "text-warning", bg: "bg-warning/10", dot: "bg-warning" },
    normal: { text: "text-muted-foreground", bg: "bg-muted", dot: "bg-muted-foreground" },
  };
  return map[level];
}

