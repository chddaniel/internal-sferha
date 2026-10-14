import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockUseMutation, mockUseQuery } = vi.hoisted(() => ({
  mockUseMutation: vi.fn(),
  mockUseQuery: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: mockUseMutation,
  useQuery: mockUseQuery,
}));
vi.mock("@/serverFunctions/lighthouse", () => ({
  exportAuditLighthouseIssues: vi.fn(),
  getAuditLighthouseIssues: vi.fn(),
}));

import { LighthouseIssuesScreen } from "./LighthouseIssuesScreen";

const renderScreen = () =>
  renderToStaticMarkup(
    createElement(LighthouseIssuesScreen, {
      projectId: "project-123",
      resultId: "result-123",
      category: "all",
      backLabel: "Audit",
      onBack: () => {},
      onCategoryChange: () => {},
    }),
  );

describe("LighthouseIssuesScreen load errors", () => {
  beforeEach(() => {
    mockUseMutation.mockReturnValue({
      isPending: false,
      mutateAsync: vi.fn(),
    });
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: new Error("temporary failure"),
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it("does not present an empty issue list when the report failed to load", () => {
    const markup = renderScreen();

    expect(markup).toContain("temporary failure");
    expect(markup).toContain("Report unavailable");
    expect(markup).toContain("Audit details unavailable.");
    expect(markup).not.toContain("Loading URL...");
    expect(markup).toContain(">Retry</button>");
    expect(markup).not.toContain("Critical 0");
    expect(markup).not.toContain("No actionable issues for this category.");
  });

  it("keeps showing cached issues when a background refresh fails", () => {
    mockUseQuery.mockReturnValue({
      data: { issues: [], hasIssueDetails: true },
      error: new Error("temporary failure"),
      isError: true,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });

    const markup = renderScreen();

    expect(markup).toContain("temporary failure");
    expect(markup).toContain("No actionable issues for this category.");
  });

  it("disables retry while the request is running", () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      error: new Error("temporary failure"),
      isError: true,
      isFetching: true,
      isLoading: false,
      refetch: vi.fn(),
    });

    const markup = renderScreen();

    expect(markup).toContain('disabled=""');
    expect(markup).toContain(">Retrying…</button>");
    expect(markup).not.toContain("No actionable issues for this category.");
  });
});
