import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockUseQuery } = vi.hoisted(() => ({ mockUseQuery: vi.fn() }));

vi.mock("@tanstack/react-query", () => ({ useQuery: mockUseQuery }));
vi.mock("@tanstack/react-router", async () => {
  const react = await import("react");
  return {
    Link: ({
      children,
      to,
      className,
    }: {
      children: string;
      to: string;
      className?: string;
    }) => react.createElement("a", { href: to, className }, children),
  };
});
vi.mock("@/serverFunctions/searchPerformance", () => ({
  getSearchPerformanceReport: vi.fn(),
}));
vi.mock("@/client/features/gsc/SearchConsoleConnectionCard", () => ({
  SearchConsoleConnectionCard: () => null,
}));

import { GscCard } from "./DashboardCards";
import { AuditHealthCard } from "./DashboardCards";
import type { DashboardAuditSummary } from "@/server/features/dashboard/services/DashboardService";

function auditSummary(
  status: DashboardAuditSummary["status"],
): DashboardAuditSummary {
  return {
    id: "audit-123",
    startUrl: "https://example.com",
    status,
    pagesCrawled: 0,
    startedAt: "2026-10-16T07:00:00.000Z",
    topIssues: [],
    totalIssueTypes: 0,
  };
}

describe("GscCard report errors", () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

  it("offers an in-card retry after a report error", () => {
    const markup = renderToStaticMarkup(
      createElement(GscCard, { projectId: "project-123", connected: true }),
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Couldn’t load Search Console data. Try again.");
    expect(markup).toContain(">Retry</button>");
  });

  it("disables the retry action while a retry is in progress", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isPending: false,
      isError: true,
      isFetching: true,
      refetch: vi.fn(),
    });

    const markup = renderToStaticMarkup(
      createElement(GscCard, { projectId: "project-123", connected: true }),
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain(">Retrying…</button>");
  });
});

describe("AuditHealthCard empty results", () => {
  it("does not report a running crawl as healthy", () => {
    const markup = renderToStaticMarkup(
      createElement(AuditHealthCard, {
        projectId: "project-123",
        audit: auditSummary("running"),
      }),
    );

    expect(markup).toContain(
      "No issues found so far — the crawl is still checking your site.",
    );
    expect(markup).not.toContain("your site looks healthy");
  });

  it("does not report a failed crawl as healthy", () => {
    const markup = renderToStaticMarkup(
      createElement(AuditHealthCard, {
        projectId: "project-123",
        audit: auditSummary("failed"),
      }),
    );

    expect(markup).toContain(
      "The crawl failed, so it couldn’t confirm whether your site is healthy.",
    );
    expect(markup).not.toContain("your site looks healthy");
  });

  it("reports a completed crawl with no issues as healthy", () => {
    const markup = renderToStaticMarkup(
      createElement(AuditHealthCard, {
        projectId: "project-123",
        audit: auditSummary("completed"),
      }),
    );

    expect(markup).toContain("No issues found — your site looks healthy.");
  });
});
