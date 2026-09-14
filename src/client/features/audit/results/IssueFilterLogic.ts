import { getIssueDescriptor } from "@/shared/audit-issues";
import type { AuditResultsData } from "@/client/features/audit/results/types";
import type { IssueSeverity } from "@/shared/audit-issues";

type AuditIssueRow = AuditResultsData["issues"][number];
export type IssueFilter = "all" | IssueSeverity;

export function resolveIssueSeverity(issue: {
  issueType: string;
  severity: string;
}): IssueSeverity {
  const descriptor = getIssueDescriptor(issue.issueType);
  if (descriptor) return descriptor.severity;
  return issue.severity === "critical" || issue.severity === "warning"
    ? issue.severity
    : "info";
}

export function filterIssueRows(
  issues: AuditIssueRow[],
  filter: IssueFilter,
): AuditIssueRow[] {
  return filter === "all"
    ? issues
    : issues.filter((issue) => resolveIssueSeverity(issue) === filter);
}
