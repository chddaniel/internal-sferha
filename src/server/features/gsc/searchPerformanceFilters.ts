import type { GscPerformanceFilter } from "./searchAnalytics";

/** Country stays out of deviceFilters so the country breakdown keeps all
 *  options. Dimension text is added only to a matching table/export request. */
export function buildSearchPerformanceFilters(data: {
  device?: string;
  country?: string;
  dimension?: "query" | "page";
  q?: string;
}): {
  deviceFilters: GscPerformanceFilter[];
  filters: GscPerformanceFilter[];
} {
  const deviceFilters: GscPerformanceFilter[] = data.device
    ? [{ dimension: "device", operator: "equals", expression: data.device }]
    : [];
  const filters: GscPerformanceFilter[] = data.country
    ? [
        ...deviceFilters,
        { dimension: "country", operator: "equals", expression: data.country },
      ]
    : deviceFilters;
  const query = data.q?.trim();
  const searchFilters: GscPerformanceFilter[] =
    data.dimension && query
      ? [
          {
            dimension: data.dimension,
            operator: "contains",
            expression: query,
          },
        ]
      : [];

  return { deviceFilters, filters: [...filters, ...searchFilters] };
}
