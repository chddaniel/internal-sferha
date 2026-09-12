import type { DashboardAuditSummary } from "@/server/features/dashboard/services/DashboardService";

export function getAuditReviewSearch(
  audit: Pick<DashboardAuditSummary, "id">,
) {
  return { auditId: audit.id, tab: "issues" as const };
}

export function getAuditRerunSearch(
  audit: Pick<DashboardAuditSummary, "startUrl">,
) {
  return { url: audit.startUrl };
}
