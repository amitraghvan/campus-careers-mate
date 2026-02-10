/**
 * Status configuration — single source of truth for all status-related UI mapping.
 * Avoids scattering color/label logic across components.
 */

import type { OpportunityStatus } from "@/types";

export interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  dotColor: string;
}

export const STATUS_CONFIG: Record<OpportunityStatus, StatusConfig> = {
  wishlist: {
    label: "Wishlist",
    color: "text-info",
    bg: "bg-info/10",
    dotColor: "bg-info",
  },
  applied: {
    label: "Applied",
    color: "text-warning",
    bg: "bg-warning/10",
    dotColor: "bg-warning",
  },
  interview: {
    label: "Interview",
    color: "text-primary",
    bg: "bg-primary/10",
    dotColor: "bg-primary",
  },
  selected: {
    label: "Selected",
    color: "text-success",
    bg: "bg-success/10",
    dotColor: "bg-success",
  },
  rejected: {
    label: "Rejected",
    color: "text-destructive",
    bg: "bg-destructive/10",
    dotColor: "bg-destructive",
  },
} as const;

/** Ordered list of statuses for pipeline display */
export const STATUS_PIPELINE: OpportunityStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "selected",
  "rejected",
];

/** Statuses considered "active" (not terminal) */
export const ACTIVE_STATUSES: OpportunityStatus[] = [
  "wishlist",
  "applied",
  "interview",
];

/** Terminal statuses */
export const TERMINAL_STATUSES: OpportunityStatus[] = ["selected", "rejected"];

