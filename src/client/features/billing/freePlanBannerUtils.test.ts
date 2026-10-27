import { describe, expect, it } from "vitest";
import { getRemainingCreditUsd } from "./freePlanBannerUtils";

describe("getRemainingCreditUsd", () => {
  it("does not infer an empty balance when both balances are missing", () => {
    expect(getRemainingCreditUsd(undefined, null)).toBeNull();
  });

  it("preserves a known zero balance", () => {
    expect(getRemainingCreditUsd(0, undefined)).toBe(0);
  });

  it("adds whichever monthly and top-up balances are available", () => {
    expect(getRemainingCreditUsd(250, 750)).toBe(1);
    expect(getRemainingCreditUsd(undefined, 500)).toBe(0.5);
  });
});
