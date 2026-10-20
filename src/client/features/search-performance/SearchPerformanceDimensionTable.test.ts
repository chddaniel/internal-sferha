import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockUseMutation, mockUseQueryClient } = vi.hoisted(() => ({
  mockUseMutation: vi.fn(),
  mockUseQueryClient: vi.fn(),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: mockUseMutation,
  useQueryClient: mockUseQueryClient,
}));
vi.mock("@/serverFunctions/keywords", () => ({ saveKeywords: vi.fn() }));
vi.mock("@/client/lib/posthog", () => ({ captureClientEvent: vi.fn() }));

import { DimensionTable } from "./SearchPerformanceDimensionTable";
import type { SearchPerformanceTableRow } from "./SearchPerformanceColumns";

const rows: SearchPerformanceTableRow[] = [
  { key: "organic seo", clicks: 5, impressions: 100, ctr: 0.05, position: 7 },
];

describe("DimensionTable keyword selection", () => {
  beforeEach(() => {
    mockUseMutation.mockReturnValue({ mutate: vi.fn(), isPending: false });
    mockUseQueryClient.mockReturnValue({ invalidateQueries: vi.fn() });
  });

  it("makes query rows selectable for bulk saving", () => {
    const markup = renderToStaticMarkup(
      createElement(DimensionTable, {
        rows,
        keyLabel: "Query",
        projectId: "project-123",
        allowKeywordSave: true,
      }),
    );

    expect(markup).toContain('aria-label="Select all rows"');
    expect(markup).toContain('aria-label="Select row"');
  });

  it("keeps page rows non-selectable", () => {
    const markup = renderToStaticMarkup(
      createElement(DimensionTable, {
        rows,
        keyLabel: "Page",
        projectId: "project-123",
      }),
    );

    expect(markup).not.toContain('aria-label="Select all rows"');
  });
});
