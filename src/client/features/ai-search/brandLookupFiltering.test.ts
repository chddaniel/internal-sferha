import { describe, expect, it } from "vitest";
import type { BrandLookupResult } from "@/types/schemas/ai-search";
import {
  EMPTY_QUERIES_FILTERS,
  EMPTY_TOP_PAGES_FILTERS,
} from "./brandLookupFilterTypes";
import { filterQueries, filterTopPages } from "./brandLookupFiltering";

const pages: BrandLookupResult["topPages"] = [
  {
    url: "https://example.com/pricing",
    domain: "example.com",
    platform: "google",
    mentions: 8,
    capturedVolume: 100,
    keywords: [],
  },
  {
    url: "https://example.com/about",
    domain: "example.com",
    platform: "chat_gpt",
    mentions: null,
    capturedVolume: null,
    keywords: [],
  },
];

const queries: BrandLookupResult["topQueries"] = [
  {
    question: "Best project software",
    platform: "google",
    aiSearchVolume: 500,
    firstSeenAt: null,
    lastSeenAt: null,
    citedSources: [],
    brandsMentioned: [],
  },
  {
    question: "Project software pricing",
    platform: "chat_gpt",
    aiSearchVolume: null,
    firstSeenAt: null,
    lastSeenAt: null,
    citedSources: [],
    brandsMentioned: [],
  },
];

describe("AI Brand Lookup numeric filters", () => {
  it("keeps pages with unknown mentions only when no bound is set", () => {
    expect(filterTopPages(pages, EMPTY_TOP_PAGES_FILTERS)).toHaveLength(2);
    expect(
      filterTopPages(pages, {
        ...EMPTY_TOP_PAGES_FILTERS,
        maxMentions: "10",
      }).map((row) => row.url),
    ).toEqual(["https://example.com/pricing"]);
  });

  it("keeps queries with unknown volume only when no bound is set", () => {
    expect(filterQueries(queries, EMPTY_QUERIES_FILTERS)).toHaveLength(2);
    expect(
      filterQueries(queries, {
        ...EMPTY_QUERIES_FILTERS,
        minVolume: "100",
      }).map((row) => row.question),
    ).toEqual(["Best project software"]);
  });
});
