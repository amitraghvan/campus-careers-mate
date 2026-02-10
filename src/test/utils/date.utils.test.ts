import { describe, it, expect } from "vitest";
import { getDaysUntilDeadline, isOverdue, formatDateShort } from "@/utils";

describe("date.utils", () => {
  it("should detect overdue deadlines", () => {
    const pastDate = new Date(Date.now() - 86400000 * 2).toISOString().split("T")[0];
    expect(isOverdue(pastDate)).toBe(true);
  });

  it("should not mark future dates as overdue", () => {
    const futureDate = new Date(Date.now() + 86400000 * 5).toISOString().split("T")[0];
    expect(isOverdue(futureDate)).toBe(false);
  });

  it("should calculate days until deadline", () => {
    const futureDate = new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0];
    const days = getDaysUntilDeadline(futureDate);
    expect(days).toBeGreaterThanOrEqual(2);
    expect(days).toBeLessThanOrEqual(4);
  });

  it("should format date in short form", () => {
    const result = formatDateShort("2026-02-10");
    expect(result).toBeTruthy();
  });
});
