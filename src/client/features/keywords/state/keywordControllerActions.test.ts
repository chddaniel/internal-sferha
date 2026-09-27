import { describe, expect, it } from "vitest";
import type { KeywordResearchRow } from "@/types/keywords";
import { selectedKeywordResearchExportRows } from "./keywordControllerActions";

const rows: KeywordResearchRow[] = [
  {
    keyword: "running shoes",
    searchVolume: 1200,
    trend: [],
    keywordDifficulty: 35,
    cpc: 1.25,
    competition: 0.4,
    intent: "commercial",
  },
  {
    keyword: "trail shoes",
    searchVolume: 500,
    trend: [],
    keywordDifficulty: 20,
    cpc: 0.8,
    competition: 0.2,
    intent: "transactional",
  },
];

describe("selectedKeywordResearchExportRows", () => {
  it("exports all selected rows even when some are hidden by table filters", () => {
    expect(
      selectedKeywordResearchExportRows(rows, new Set(["running shoes"])),
    ).toEqual([["running shoes", 1200, 1.25, 0.4, 35, "commercial"]]);
  });

  it("returns selected rows in result order", () => {
    expect(
      selectedKeywordResearchExportRows(
        rows,
        new Set(["trail shoes", "running shoes"]),
      ).map((row) => row[0]),
    ).toEqual(["running shoes", "trail shoes"]);
  });
});
