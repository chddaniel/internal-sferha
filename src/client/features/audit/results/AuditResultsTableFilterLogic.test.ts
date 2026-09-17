import { describe, expect, it } from "vitest";
import {
  averageResponseTimeMs,
  filterPages,
  filterPerformanceRows,
} from "./AuditResultsTableFilterLogic";

describe("average response time", () => {
  it("averages only pages with measured response times", () => {
    expect(
      averageResponseTimeMs([
        { responseTimeMs: 100 },
        { responseTimeMs: null },
        { responseTimeMs: 300 },
      ]),
    ).toBe(200);
  });

  it("returns null when no response times were measured", () => {
    expect(averageResponseTimeMs([{ responseTimeMs: null }])).toBeNull();
  });
});

describe("audit result filters", () => {
  it("keeps page exports aligned with the visible status filter", () => {
    const rows = [
      {
        url: "https://example.com/live",
        title: "Live",
        metaDescription: null,
        statusCode: 200,
        wordCount: 100,
        responseTimeMs: 100,
        imagesTotal: 0,
        imagesMissingAlt: 0,
      },
      {
        url: "https://example.com/missing",
        title: null,
        metaDescription: null,
        statusCode: 404,
        wordCount: 0,
        responseTimeMs: 100,
        imagesTotal: 0,
        imagesMissingAlt: 0,
      },
    ] as Parameters<typeof filterPages>[0];

    expect(
      filterPages(rows, {
        query: "",
        status: "error",
        minWords: "",
        maxWords: "",
        minResponseMs: "",
        maxResponseMs: "",
        missingAlt: "all",
      }),
    ).toEqual([rows[1]]);
  });

  it("keeps performance exports aligned with the visible filters", () => {
    const rows = [
      {
        id: "fast",
        pageId: null,
        strategy: "desktop",
        performanceScore: 90,
        accessibilityScore: 90,
        bestPracticesScore: 90,
        seoScore: 90,
        lcpMs: 1200,
        cls: 0.01,
        inpMs: 50,
        ttfbMs: 100,
        errorMessage: null,
        pageUrl: "https://example.com/fast",
        pagePath: "/fast",
      },
      {
        id: "slow",
        pageId: null,
        strategy: "mobile",
        performanceScore: 50,
        accessibilityScore: 70,
        bestPracticesScore: 70,
        seoScore: 70,
        lcpMs: 3200,
        cls: 0.2,
        inpMs: 200,
        ttfbMs: 500,
        errorMessage: null,
        pageUrl: "https://example.com/slow",
        pagePath: "/slow",
      },
    ] as unknown as Parameters<typeof filterPerformanceRows>[0];

    expect(
      filterPerformanceRows(rows, {
        query: "",
        device: "mobile",
        status: "all",
        minPerf: "",
        maxPerf: "",
        minSeo: "",
        maxSeo: "",
        maxLcpSeconds: "2.5",
      }),
    ).toEqual([]);
  });
});
