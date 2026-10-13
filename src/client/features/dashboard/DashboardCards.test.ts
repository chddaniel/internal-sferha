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
