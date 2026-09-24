import { describe, expect, it } from "vitest";
import {
  AUDIT_EVENTS,
  auditResultTab,
  resolveAvailableAuditTab,
} from "./auditAnalytics";

describe("audit analytics contract", () => {
  it("keeps funnel event names stable", () => {
    expect(AUDIT_EVENTS).toEqual({
      started: "audit:started",
      rerunStarted: "audit:rerun_started",
      resultTabViewed: "audit:result_tab_viewed",
      resultExported: "audit:result_exported",
      resultLinkCopied: "audit:result_link_copied",
      issueSeverityFiltered: "audit:issue_severity_filtered",
    });
  });

  it("normalizes unknown result tabs to issues", () => {
    expect(auditResultTab("unknown")).toBe("issues");
    expect(auditResultTab("performance")).toBe("performance");
  });

  it("routes unavailable performance deep links to issues", () => {
    expect(resolveAvailableAuditTab("performance", false)).toBe("issues");
    expect(resolveAvailableAuditTab("performance", true)).toBe("performance");
    expect(resolveAvailableAuditTab("pages", false)).toBe("pages");
  });
});
