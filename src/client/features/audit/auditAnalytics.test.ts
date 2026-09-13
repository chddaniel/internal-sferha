import { describe, expect, it } from "vitest";
import { AUDIT_EVENTS, auditResultTab } from "./auditAnalytics";

describe("audit analytics contract", () => {
  it("keeps funnel event names stable", () => {
    expect(AUDIT_EVENTS).toEqual({
      started: "audit:started",
      rerunStarted: "audit:rerun_started",
      resultTabViewed: "audit:result_tab_viewed",
      resultExported: "audit:result_exported",
      issueSeverityFiltered: "audit:issue_severity_filtered",
    });
  });

  it("normalizes unknown result tabs to issues", () => {
    expect(auditResultTab("unknown")).toBe("issues");
    expect(auditResultTab("performance")).toBe("performance");
  });
});
