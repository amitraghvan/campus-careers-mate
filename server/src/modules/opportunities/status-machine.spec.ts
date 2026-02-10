/**
 * Status Machine — Unit Tests
 */

import { BadRequestException } from "@nestjs/common";
import { validateStatusTransition } from "./status-machine";

// Note: these tests depend on @prisma/client types being generated.
// Use string literals as enum values for test isolation.

describe("Status Machine", () => {
  it("should allow WISHLIST → APPLIED", () => {
    expect(() =>
      validateStatusTransition("WISHLIST" as any, "APPLIED" as any),
    ).not.toThrow();
  });

  it("should allow APPLIED → INTERVIEW", () => {
    expect(() =>
      validateStatusTransition("APPLIED" as any, "INTERVIEW" as any),
    ).not.toThrow();
  });

  it("should allow APPLIED → REJECTED", () => {
    expect(() =>
      validateStatusTransition("APPLIED" as any, "REJECTED" as any),
    ).not.toThrow();
  });

  it("should allow INTERVIEW → SELECTED", () => {
    expect(() =>
      validateStatusTransition("INTERVIEW" as any, "SELECTED" as any),
    ).not.toThrow();
  });

  it("should allow REJECTED → WISHLIST (re-apply)", () => {
    expect(() =>
      validateStatusTransition("REJECTED" as any, "WISHLIST" as any),
    ).not.toThrow();
  });

  it("should block WISHLIST → SELECTED", () => {
    expect(() =>
      validateStatusTransition("WISHLIST" as any, "SELECTED" as any),
    ).toThrow(BadRequestException);
  });

  it("should block SELECTED → anything (terminal)", () => {
    expect(() =>
      validateStatusTransition("SELECTED" as any, "APPLIED" as any),
    ).toThrow(BadRequestException);
  });

  it("should allow same-status (no-op)", () => {
    expect(() =>
      validateStatusTransition("APPLIED" as any, "APPLIED" as any),
    ).not.toThrow();
  });
});
