import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SearchPerformanceErrorState } from "./SearchPerformanceErrorState";

describe("SearchPerformanceErrorState", () => {
  it("shows a retry action with the load error", () => {
    const markup = renderToStaticMarkup(
      createElement(SearchPerformanceErrorState, {
        message: "Search Console data could not be loaded.",
        isFetching: false,
        onRetry: vi.fn(),
      }),
    );

    expect(markup).toContain('role="alert"');
    expect(markup).toContain("Search Console data could not be loaded.");
    expect(markup).toMatch(/<button[^>]*>Retry<\/button>/);
  });

  it("disables retry and shows progress while fetching", () => {
    const markup = renderToStaticMarkup(
      createElement(SearchPerformanceErrorState, {
        message: "Search Console data could not be loaded.",
        isFetching: true,
        onRetry: vi.fn(),
      }),
    );

    expect(markup).toContain('disabled=""');
    expect(markup).toContain("Retrying…");
  });
});
