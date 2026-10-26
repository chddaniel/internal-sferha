import { describe, expect, it } from "vitest";
import {
  compileSavedKeywordsFilters,
  countActiveSavedKeywordsFilters,
  EMPTY_SAVED_KEYWORDS_FILTERS,
} from "./savedKeywordsFilterTypes";

describe("saved keyword intent filters", () => {
  it("compiles selected intents in canonical order and removes duplicates", () => {
    expect(
      compileSavedKeywordsFilters({
        ...EMPTY_SAVED_KEYWORDS_FILTERS,
        intents: "transactional,informational,transactional,invalid",
      }).intents,
    ).toEqual(["informational", "transactional"]);
  });

  it("counts and clears intent selection like other filters", () => {
    expect(
      countActiveSavedKeywordsFilters({
        ...EMPTY_SAVED_KEYWORDS_FILTERS,
        intents: "unknown",
      }),
    ).toBe(1);
    expect(EMPTY_SAVED_KEYWORDS_FILTERS.intents).toBe("");
  });
});
