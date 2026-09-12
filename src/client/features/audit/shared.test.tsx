import { describe, expect, it } from "vitest";
import { shouldOfferAuditRetry } from "./shared";

describe("audit recovery actions", () => {
  it("offers a retry for failed audits", () => {
    expect(shouldOfferAuditRetry("failed")).toBe(true);
  });

  it("does not offer a retry for completed or running audits", () => {
    expect(shouldOfferAuditRetry("completed")).toBe(false);
    expect(shouldOfferAuditRetry("running")).toBe(false);
  });
});
