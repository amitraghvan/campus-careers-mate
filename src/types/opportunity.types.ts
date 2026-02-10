/**
 * ╔══════════════════════════════════════════════════╗
 * ║        Opportunity Domain Types                  ║
 * ║  Core types for the Opportunity entity           ║
 * ╚══════════════════════════════════════════════════╝
 */

/** Possible status stages for a placement opportunity */
export type OpportunityStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "selected"
  | "rejected";

/** A single preparation task within an opportunity */
export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

/** Core Opportunity entity */
export interface Opportunity {
  id: string;
  company: string;
  role: string;
  status: OpportunityStatus;
  deadline: string; // ISO date string (YYYY-MM-DD)
  package?: string;
  notes: string;
  checklist: ChecklistItem[];
  createdAt: string; // ISO datetime string
}

/** DTO for creating a new opportunity (excludes auto-generated fields) */
export type CreateOpportunityDTO = Omit<Opportunity, "id" | "createdAt" | "checklist">;

/** DTO for updating an existing opportunity */
export type UpdateOpportunityDTO = Partial<Opportunity>;
