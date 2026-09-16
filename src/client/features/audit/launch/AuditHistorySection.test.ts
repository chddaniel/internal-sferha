import { describe, expect, it } from "vitest";
import { buildAuditReviewUrl } from "./AuditHistorySection";

describe("audit history links", () => {
  it("replaces transient search state with the selected audit", () => {
    expect(
      buildAuditReviewUrl(
        "https://app.example.com/p/project-1/audit?url=https%3A%2F%2Fexample.com#history",
        "audit-123",
      ),
    ).toBe(
      "https://app.example.com/p/project-1/audit?auditId=audit-123&tab=pages",
    );
  });

  it("preserves the requested results tab", () => {
    expect(
      buildAuditReviewUrl(
        "https://app.example.com/p/project-1/audit",
        "audit-123",
        "performance",
      ),
    ).toBe(
      "https://app.example.com/p/project-1/audit?auditId=audit-123&tab=performance",
    );
  });
});
