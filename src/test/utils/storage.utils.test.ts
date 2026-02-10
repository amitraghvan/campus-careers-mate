import { describe, it, expect } from "vitest";
import { storage } from "@/utils";

describe("storage.utils", () => {
  it("should return fallback when key does not exist", () => {
    const result = storage.get("nonexistent-key", "fallback");
    expect(result).toBe("fallback");
  });

  it("should save and retrieve data", () => {
    storage.set("test-key", { name: "test" });
    const result = storage.get("test-key", null);
    expect(result).toEqual({ name: "test" });
    storage.remove("test-key");
  });
});

