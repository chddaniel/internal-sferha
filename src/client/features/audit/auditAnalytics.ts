export const AUDIT_EVENTS = {
  started: "audit:started",
  rerunStarted: "audit:rerun_started",
  resultTabViewed: "audit:result_tab_viewed",
  resultExported: "audit:result_exported",
  issueSeverityFiltered: "audit:issue_severity_filtered",
} as const;

export function auditResultTab(
  tab: string,
): "issues" | "pages" | "performance" {
  if (tab === "pages" || tab === "performance") return tab;
  return "issues";
}
