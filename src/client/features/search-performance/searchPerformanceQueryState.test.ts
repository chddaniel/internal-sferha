import { describe, expect, it } from "vitest";
import { canKeepSearchPerformancePlaceholder } from "./searchPerformanceQueryState";

describe("canKeepSearchPerformancePlaceholder", () => {
  it("keeps report data only for the same project", () => {
    expect(
      canKeepSearchPerformancePlaceholder(
        ["searchPerformance", "project-a", "last_28_days", "ALL", "ALL"],
        "project-a",
      ),
    ).toBe(true);
    expect(
      canKeepSearchPerformancePlaceholder(
        ["searchPerformance", "project-a", "last_28_days", "ALL", "ALL"],
        "project-b",
      ),
    ).toBe(false);
  });

  it("keeps table data only for the same project and dimension", () => {
    const queriesKey = [
      "searchPerformanceTable",
      "project-a",
      "query",
      1,
      50,
      {},
    ];

    expect(
      canKeepSearchPerformancePlaceholder(queriesKey, "project-a", "query"),
    ).toBe(true);
    expect(
      canKeepSearchPerformancePlaceholder(queriesKey, "project-b", "query"),
    ).toBe(false);
    expect(
      canKeepSearchPerformancePlaceholder(queriesKey, "project-a", "page"),
    ).toBe(false);
  });
});
