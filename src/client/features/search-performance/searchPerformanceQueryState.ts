import type { SearchPerformanceTableDimension } from "@/types/schemas/search-performance";

export function canKeepSearchPerformancePlaceholder(
  previousQueryKey: readonly unknown[] | undefined,
  projectId: string,
  dimension?: SearchPerformanceTableDimension,
): boolean {
  if (!previousQueryKey || previousQueryKey[1] !== projectId) return false;

  if (dimension === undefined) {
    return previousQueryKey[0] === "searchPerformance";
  }

  return (
    previousQueryKey[0] === "searchPerformanceTable" &&
    previousQueryKey[2] === dimension
  );
}
