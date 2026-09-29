import { useMemo } from "react";
import { sortBy } from "remeda";
import { parseTerms } from "@/client/features/keywords/utils";
import type { KeywordResearchRow } from "@/types/keywords";
import {
  parseIntentFilter,
  type KeywordFilterValues,
} from "@/client/features/keywords/keywordResearchTypes";
import type { SortDir, SortField } from "@/client/features/keywords/components";

function matchesNumericRange(
  value: number | null | undefined,
  min: string,
  max: string,
): boolean {
  if (min === "" && max === "") return true;
  if (value == null) return false;

  if (min !== "" && value < Number(min)) return false;
  if (max !== "" && value > Number(max)) return false;
  return true;
}

export function applyKeywordFiltersAndSort(params: {
  rows: KeywordResearchRow[];
  filters: KeywordFilterValues;
  sortField: SortField;
  sortDir: SortDir;
}): KeywordResearchRow[] {
  const includeTerms = parseTerms(params.filters.include);
  const excludeTerms = parseTerms(params.filters.exclude);
  const selectedIntents = parseIntentFilter(params.filters.intents);

  const filtered = params.rows.filter((row) => {
    const haystack = row.keyword.toLowerCase();
    if (
      includeTerms.length > 0 &&
      !includeTerms.every((term) => haystack.includes(term))
    ) {
      return false;
    }
    if (excludeTerms.some((term) => haystack.includes(term))) {
      return false;
    }

    if (selectedIntents.length > 0 && !selectedIntents.includes(row.intent)) {
      return false;
    }

    if (
      !matchesNumericRange(
        row.searchVolume,
        params.filters.minVol,
        params.filters.maxVol,
      ) ||
      !matchesNumericRange(
        row.cpc,
        params.filters.minCpc,
        params.filters.maxCpc,
      ) ||
      !matchesNumericRange(
        row.keywordDifficulty,
        params.filters.minKd,
        params.filters.maxKd,
      )
    ) {
      return false;
    }
    return true;
  });

  if (params.sortField === "keyword") {
    return sortBy(filtered, [(row) => row.keyword, params.sortDir]);
  }
  if (params.sortField === "searchVolume") {
    return sortBy(filtered, [(row) => row.searchVolume ?? -1, params.sortDir]);
  }
  if (params.sortField === "cpc") {
    return sortBy(filtered, [(row) => row.cpc ?? -1, params.sortDir]);
  }
  if (params.sortField === "competition") {
    return sortBy(filtered, [(row) => row.competition ?? -1, params.sortDir]);
  }

  return sortBy(filtered, [
    (row) => row.keywordDifficulty ?? -1,
    params.sortDir,
  ]);
}

export function useKeywordFiltering(params: {
  rows: KeywordResearchRow[];
  filters: KeywordFilterValues;
  sortField: SortField;
  sortDir: SortDir;
}) {
  const filteredRows = useMemo(
    () =>
      applyKeywordFiltersAndSort({
        rows: params.rows,
        filters: params.filters,
        sortField: params.sortField,
        sortDir: params.sortDir,
      }),
    [params.filters, params.rows, params.sortDir, params.sortField],
  );

  const activeFilterCount = useMemo(
    () =>
      Object.values(params.filters).filter((value) => value.trim() !== "")
        .length,
    [params.filters],
  );

  return {
    filteredRows,
    activeFilterCount,
  };
}
