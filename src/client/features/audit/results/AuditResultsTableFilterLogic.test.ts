import { describe, expect, it } from "vitest";
import { averageResponseTimeMs } from "./AuditResultsTableFilterLogic";

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
