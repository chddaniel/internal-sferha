import { describe, expect, it } from "vitest";
import {
  getAuditRerunSearch,
  getAuditReviewSearch,
} from "./dashboardAuditActions";

describe("dashboard audit actions", () => {
  const audit = { id: "audit-123", startUrl: "https://example.com" };

  it("opens the latest audit on its issues tab", () => {
    expect(getAuditReviewSearch(audit)).toEqual({
      auditId: "audit-123",
      tab: "issues",
    });
  });

  it("carries the original URL into a rerun", () => {
    expect(getAuditRerunSearch(audit)).toEqual({
      url: "https://example.com",
    });
  });
});
