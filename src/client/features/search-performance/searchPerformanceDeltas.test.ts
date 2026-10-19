import { describe, expect, it } from "vitest";
import { percentDelta, positionDelta } from "./searchPerformanceDeltas";

describe("percentDelta", () => {
  it("marks activity as new when the previous period had none", () => {
    expect(percentDelta(12, 0)).toEqual({ text: "New", improved: true });
  });

  it("does not show a change when both periods have no activity", () => {
    expect(percentDelta(0, 0)).toBeNull();
  });

  it("keeps percentage comparisons for non-zero baselines", () => {
    expect(percentDelta(120, 100)).toEqual({
      text: "+20.0%",
      improved: true,
    });
    expect(percentDelta(80, 100)).toEqual({
      text: "-20.0%",
      improved: false,
    });
  });
});

describe("positionDelta", () => {
  it("marks a first observed position as new", () => {
    expect(positionDelta(18.4, 0)).toEqual({ text: "New", improved: true });
  });

  it("keeps lower positions marked as improvements", () => {
    expect(positionDelta(8, 10)).toEqual({ text: "+2.0", improved: true });
    expect(positionDelta(12, 10)).toEqual({ text: "-2.0", improved: false });
  });

  it("omits comparisons with no position in either period", () => {
    expect(positionDelta(0, 0)).toBeNull();
    expect(positionDelta(0, 10)).toBeNull();
  });
});
