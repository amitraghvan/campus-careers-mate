export type OpportunityStatus = "wishlist" | "applied" | "interview" | "selected" | "rejected";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Opportunity {
  id: string;
  company: string;
  role: string;
  status: OpportunityStatus;
  deadline: string; // ISO date
  package?: string;
  notes: string;
  checklist: ChecklistItem[];
  createdAt: string;
}

export const STATUS_CONFIG: Record<OpportunityStatus, { label: string; color: string; bg: string }> = {
  wishlist: { label: "Wishlist", color: "text-info", bg: "bg-info/10" },
  applied: { label: "Applied", color: "text-warning", bg: "bg-warning/10" },
  interview: { label: "Interview", color: "text-primary", bg: "bg-primary/10" },
  selected: { label: "Selected", color: "text-success", bg: "bg-success/10" },
  rejected: { label: "Rejected", color: "text-destructive", bg: "bg-destructive/10" },
};
