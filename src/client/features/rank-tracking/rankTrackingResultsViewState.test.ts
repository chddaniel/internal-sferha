import { describe, expect, it } from "vitest";
import { getRankTrackingResultsViewState } from "./rankTrackingResultsViewState";

describe("getRankTrackingResultsViewState", () => {
  it("distinguishes an initial load failure from an empty result", () => {
    expect(
      getRankTrackingResultsViewState({
        isLoading: true,
        isError: false,
        hasData: false,
        rowCount: 0,
      }),
    ).toBe("loading");
    expect(
      getRankTrackingResultsViewState({
        isLoading: false,
        isError: true,
        hasData: false,
        rowCount: 0,
      }),
    ).toBe("error");
  });

  it("keeps cached rows available when a refresh fails", () => {
    expect(
      getRankTrackingResultsViewState({
        isLoading: false,
        isError: true,
        hasData: true,
        rowCount: 4,
      }),
    ).toBe("table");
  });

  it("shows the empty state only when there are no rows", () => {
    expect(
      getRankTrackingResultsViewState({
        isLoading: false,
        isError: false,
        hasData: true,
        rowCount: 0,
      }),
    ).toBe("empty");
  });
});
