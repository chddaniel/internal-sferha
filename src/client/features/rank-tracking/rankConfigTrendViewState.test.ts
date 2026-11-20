import { describe, expect, it } from "vitest";
import { getRankConfigTrendViewState } from "./rankConfigTrendViewState";

describe("getRankConfigTrendViewState", () => {
  it("shows loading or an error instead of an empty-history message", () => {
    expect(
      getRankConfigTrendViewState({
        isLoading: true,
        isError: false,
        hasData: false,
        pointCount: 0,
      }),
    ).toBe("loading");
    expect(
      getRankConfigTrendViewState({
        isLoading: false,
        isError: true,
        hasData: false,
        pointCount: 0,
      }),
    ).toBe("error");
  });

  it("keeps stale chart data visible after a refresh error", () => {
    expect(
      getRankConfigTrendViewState({
        isLoading: false,
        isError: true,
        hasData: true,
        pointCount: 3,
      }),
    ).toBe("chart");
  });

  it("uses the empty state only when loaded history has at most one point", () => {
    expect(
      getRankConfigTrendViewState({
        isLoading: false,
        isError: false,
        hasData: true,
        pointCount: 1,
      }),
    ).toBe("empty");
    expect(
      getRankConfigTrendViewState({
        isLoading: false,
        isError: false,
        hasData: true,
        pointCount: 2,
      }),
    ).toBe("chart");
  });
});
