import type { ReactNode } from "react";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", async () => {
  const react = await import("react");
  return {
    Link: ({
      children,
      to,
      params,
      className,
    }: {
      children: ReactNode;
      to: string;
      params: { projectId: string };
      className?: string;
    }) =>
      react.createElement(
        "a",
        { href: to.replace("$projectId", params.projectId), className },
        children,
      ),
  };
});

import { SavedKeywordsEmptyState } from "./SavedKeywordsEmptyState";

describe("SavedKeywordsEmptyState", () => {
  it("links new users to keyword research", () => {
    const markup = renderToStaticMarkup(
      createElement(SavedKeywordsEmptyState, {
        hasActiveFilters: false,
        onClearFilters: () => {},
        projectId: "project-123",
      }),
    );

    expect(markup).toContain("Find keywords to start building your list.");
    expect(markup).toContain('href="/p/project-123/keywords"');
    expect(markup).toContain(">Find keywords</a>");
  });

  it("offers to clear active filters when they hide every row", () => {
    const markup = renderToStaticMarkup(
      createElement(SavedKeywordsEmptyState, {
        hasActiveFilters: true,
        onClearFilters: () => {},
        projectId: "project-123",
      }),
    );

    expect(markup).toContain("No saved keywords match the current filters.");
    expect(markup).toContain('type="button"');
    expect(markup).toContain(">Clear filters</button>");
    expect(markup).not.toContain("Find keywords</a>");
  });
});
