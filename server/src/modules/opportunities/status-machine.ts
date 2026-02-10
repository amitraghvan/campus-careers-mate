/**
 * Status Machine — enforces legal status transitions.
 *
 * Transition rules:
 *   WISHLIST  → APPLIED
 *   APPLIED   → INTERVIEW, REJECTED
 *   INTERVIEW → SELECTED, REJECTED
 *   SELECTED  → (terminal)
 *   REJECTED  → WISHLIST (re-apply)
 */

import { BadRequestException } from "@nestjs/common";
import { OpportunityStatus } from "@prisma/client";

const VALID_TRANSITIONS: Record<OpportunityStatus, OpportunityStatus[]> = {
  WISHLIST: [OpportunityStatus.APPLIED],
  APPLIED: [OpportunityStatus.INTERVIEW, OpportunityStatus.REJECTED],
  INTERVIEW: [OpportunityStatus.SELECTED, OpportunityStatus.REJECTED],
  SELECTED: [], // terminal
  REJECTED: [OpportunityStatus.WISHLIST], // re-apply
};

export function validateStatusTransition(
  from: OpportunityStatus,
  to: OpportunityStatus,
): void {
  if (from === to) return; // no-op

  const allowed = VALID_TRANSITIONS[from];
  if (!allowed.includes(to)) {
    throw new BadRequestException(
      `Invalid status transition: ${from} → ${to}. ` +
        `Allowed transitions from ${from}: ${allowed.length > 0 ? allowed.join(", ") : "none (terminal state)"}`,
    );
  }
}
