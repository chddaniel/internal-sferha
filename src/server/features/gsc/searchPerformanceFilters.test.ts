import { describe, expect, it } from "vitest";
import { buildSearchPerformanceFilters } from "./searchPerformanceFilters";

describe("buildSearchPerformanceFilters", () => {
  it("combines device, country, and dimension text filters", () => {
    expect(
      buildSearchPerformanceFilters({
        device: "MOBILE",
        country: "rou",
        dimension: "query",
        q: " pricing ",
      }),
    ).toEqual({
      deviceFilters: [
        { dimension: "device", operator: "equals", expression: "MOBILE" },
      ],
      filters: [
        { dimension: "device", operator: "equals", expression: "MOBILE" },
        { dimension: "country", operator: "equals", expression: "rou" },
        { dimension: "query", operator: "contains", expression: "pricing" },
      ],
    });
  });

  it("omits the text condition when the search is blank", () => {
    expect(
      buildSearchPerformanceFilters({ dimension: "page", q: "   " }).filters,
    ).toEqual([]);
  });
});
