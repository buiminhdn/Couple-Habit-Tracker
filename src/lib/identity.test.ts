import { beforeEach, describe, expect, it } from "vitest";
import { clearStoredIdentity, getStoredIdentity, setStoredIdentity } from "./identity";

describe("identity storage", () => {
  beforeEach(() => localStorage.clear());

  it("returns null before identity is selected", () => {
    expect(getStoredIdentity()).toBeNull();
  });

  it("stores and clears a valid identity", () => {
    setStoredIdentity("me");
    expect(getStoredIdentity()).toBe("me");
    clearStoredIdentity();
    expect(getStoredIdentity()).toBeNull();
  });

  it("ignores invalid stored values", () => {
    localStorage.setItem("couple-habit.identity", "someone-else");
    expect(getStoredIdentity()).toBeNull();
  });
});
