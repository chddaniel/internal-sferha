import { describe, expect, it } from "vitest";
import type { AuditResultsData } from "@/client/features/audit/results/types";
import { filterIssueRows, resolveIssueSeverity } from "./IssueFilterLogic";

type AuditIssueRow = AuditResultsData["issues"][number];

const issue = (issueType: string, severity = "info") => ({
  id: `${issueType}-${severity}`,
  issueType,
  severity,
  pageUrl: `https://example.com/${issueType}`,
  detailsJson: null,
}) as AuditIssueRow;

describe("audit issue severity helpers", () => {
  it("uses the registered descriptor severity for filtering", () => {
    const rows = [issue("missing-title", "info"), issue("title-too-long")];

    expect(resolveIssueSeverity(rows[0])).toBe("critical");
    expect(filterIssueRows(rows, "critical")).toEqual([rows[0]]);
  });

  it("keeps all rows for the all filter", () => {
    const rows = [issue("missing-title"), issue("title-too-long")];

    expect(filterIssueRows(rows, "all")).toEqual(rows);
  });
});
