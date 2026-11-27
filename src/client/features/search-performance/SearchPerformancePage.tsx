import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { TablePagination } from "@/client/components/table/TablePagination";
import { SearchConsoleConnectionCard } from "@/client/features/gsc/SearchConsoleConnectionCard";
import { SearchPerformanceLoadingState } from "@/client/features/search-performance/SearchPerformanceLoadingState";
import { SearchPerformanceErrorState } from "@/client/features/search-performance/SearchPerformanceErrorState";
import { canKeepSearchPerformancePlaceholder } from "@/client/features/search-performance/searchPerformanceQueryState";
import {
  DimensionTable,
  exportDimensionRows,
  exportStriking,
  StrikingDistanceTable,
  TotalsCards,
  type ExportTarget,
  type Tab,
} from "@/client/features/search-performance/SearchPerformanceParts";
import { SearchPerformanceToolbar } from "@/client/features/search-performance/SearchPerformanceToolbar";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { copyTextToClipboard } from "@/client/lib/clipboard";
import {
  exportSearchPerformanceTable,
  getSearchPerformanceReport,
  getSearchPerformanceTable,
} from "@/serverFunctions/searchPerformance";
import {
  SEARCH_PERFORMANCE_DEFAULT_PAGE_SIZE,
  SEARCH_PERFORMANCE_PAGE_SIZES,
  type SearchPerformanceDateRange,
  type SearchPerformanceDevice,
  type SearchPerformanceSearch,
  type SearchPerformanceTableDimension,
} from "@/types/schemas/search-performance";

// Sentinel for "no filter" in the selects; never sent to the server.
const ALL = "ALL";

function tabDimension(tab: Tab): SearchPerformanceTableDimension {
  return tab === "pages" ? "page" : "query";
}

type FilterInput = {
  dateRange: SearchPerformanceDateRange;
  device?: SearchPerformanceDevice;
  country?: string;
};

// The server filter payload: drop device/country when set to the "ALL" sentinel.
function buildFilterInput(
  range: SearchPerformanceDateRange,
  device: SearchPerformanceDevice | typeof ALL,
  country: string,
): FilterInput {
  return {
    dateRange: range,
    ...(device === ALL ? {} : { device }),
    ...(country === ALL ? {} : { country }),
  };
}

// Single source for the paginated table query, shared by the live query and the
// warm-on-connect prefetch so their key + fn can never drift apart.
function tableQueryOptions({
  projectId,
  dimension,
  page,
  pageSize,
  filterInput,
  query,
}: {
  projectId: string;
  dimension: SearchPerformanceTableDimension;
  page: number;
  pageSize: number;
  filterInput: FilterInput;
  query: string | undefined;
}) {
  return queryOptions({
    queryKey: [
      "searchPerformanceTable",
      projectId,
      dimension,
      page,
      pageSize,
      filterInput,
      query,
    ],
    queryFn: () =>
      getSearchPerformanceTable({
        data: {
          projectId,
          dimension,
          page,
          pageSize,
          ...filterInput,
          ...(query ? { q: query } : {}),
        },
      }),
  });
}

export function SearchPerformancePage({
  projectId,
  search,
  onSearchChange,
}: {
  projectId: string;
  search: SearchPerformanceSearch;
  onSearchChange: (updates: Partial<SearchPerformanceSearch>) => void;
}) {
  const queryClient = useQueryClient();
  const [range, setRange] = useState<SearchPerformanceDateRange>(
    search.dateRange ?? "last_28_days",
  );
  const [device, setDevice] = useState<SearchPerformanceDevice | typeof ALL>(
    search.device ?? ALL,
  );
  const [country, setCountry] = useState<string>(search.country ?? ALL);
  const [tab, setTab] = useState<Tab>(search.tab ?? "striking");
  const [queryText, setQueryText] = useState(search.q ?? "");
  const [page, setPage] = useState(search.page ?? 1);
  const [pageSize, setPageSize] = useState<number>(
    search.pageSize ?? SEARCH_PERFORMANCE_DEFAULT_PAGE_SIZE,
  );

  useEffect(() => {
    setRange(search.dateRange ?? "last_28_days");
    setDevice(search.device ?? ALL);
    setCountry(search.country ?? ALL);
    setTab(search.tab ?? "striking");
    setQueryText(search.q ?? "");
    setPage(search.page ?? 1);
    setPageSize(search.pageSize ?? SEARCH_PERFORMANCE_DEFAULT_PAGE_SIZE);
  }, [
    search.dateRange,
    search.device,
    search.country,
    search.tab,
    search.q,
    search.page,
    search.pageSize,
  ]);

  useEffect(() => {
    const query = queryText.trim();
    if (query === (search.q ?? "")) return;
    const timeout = window.setTimeout(() => {
      setPage(1);
      onSearchChange({ q: query || undefined, page: 1 });
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [queryText, search.q, onSearchChange]);

  const filterInput = buildFilterInput(range, device, country);

  const reportQuery = useQuery({
    queryKey: ["searchPerformance", projectId, range, device, country],
    queryFn: () =>
      getSearchPerformanceReport({ data: { projectId, ...filterInput } }),
    placeholderData: (previousData, previousQuery) =>
      canKeepSearchPerformancePlaceholder(previousQuery?.queryKey, projectId)
        ? previousData
        : undefined,
  });
  const report = reportQuery.data;

  const isTableTab = tab === "queries" || tab === "pages";
  const dimension = tabDimension(tab);
  const tableQuery = useQuery({
    ...tableQueryOptions({
      projectId,
      dimension,
      page,
      pageSize,
      filterInput,
      query: search.q,
    }),
    enabled: report?.connected === true && isTableTab,
    placeholderData: (previousData, previousQuery) =>
      canKeepSearchPerformancePlaceholder(
        previousQuery?.queryKey,
        projectId,
        dimension,
      )
        ? previousData
        : undefined,
  });
  const tableData = tableQuery.data;
  const tableRows = tableData?.connected ? tableData.rows : [];
  const hasNextPage = tableData?.connected ? tableData.hasNextPage : false;
  const hasDeviceOrCountryFilter = device !== ALL || country !== ALL;

  // Warm the Queries tab (first page) as soon as the report connects so the tab
  // opens instantly instead of showing a spinner. Free first-party GSC data.
  useEffect(() => {
    if (report?.connected !== true) return;
    void queryClient.prefetchQuery(
      tableQueryOptions({
        projectId,
        dimension: "query",
        page: 1,
        pageSize: SEARCH_PERFORMANCE_DEFAULT_PAGE_SIZE,
        filterInput: buildFilterInput(range, device, country),
        query: tab === "queries" ? search.q : undefined,
      }),
    );
  }, [
    report?.connected,
    projectId,
    range,
    device,
    country,
    tab,
    search.q,
    queryClient,
  ]);

  const handleExport = async (target: ExportTarget) => {
    if (!report?.connected) return;
    try {
      if (tab === "striking") {
        exportStriking(report, target);
        return;
      }
      const data = await exportSearchPerformanceTable({
        data: {
          projectId,
          dimension,
          ...filterInput,
          ...(search.q ? { q: search.q } : {}),
        },
      });
      exportDimensionRows(dimension, data.rows, report.range, target);
    } catch (error) {
      toast.error(getStandardErrorMessage(error, "Export failed"));
    }
  };

  const handleCopyReportLink = async () => {
    try {
      const url = new URL(window.location.href);
      const query = queryText.trim();
      if (query) url.searchParams.set("q", query);
      else url.searchParams.delete("q");
      if (query !== (search.q ?? "")) url.searchParams.set("page", "1");
      await copyTextToClipboard(url.href);
      toast.success("Report link copied");
    } catch (error) {
      toast.error(getStandardErrorMessage(error, "Could not copy report link"));
    }
  };

  return (
    <div className="px-4 py-4 pb-24 overflow-auto md:px-6 md:py-6 md:pb-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Search Performance</h1>
            <p className="text-sm text-base-content/70">
              See your site&apos;s clicks, impressions, CTR, and position from
              Google Search Console.
            </p>
          </div>
          {report?.connected ? (
            <Link
              to="/p/$projectId/settings"
              params={{ projectId }}
              hash="search-console"
              className="link link-hover shrink-0 self-start text-sm font-medium text-base-content/60 transition-colors hover:text-base-content sm:mt-1"
            >
              Change property
            </Link>
          ) : null}
        </div>

        {reportQuery.isPending ? (
          <SearchPerformanceLoadingState />
        ) : reportQuery.isError ? (
          <SearchPerformanceErrorState
            message={getStandardErrorMessage(reportQuery.error)}
            isFetching={reportQuery.isFetching}
            onRetry={() => void reportQuery.refetch()}
          />
        ) : !report?.connected ? (
          <div className="max-w-2xl">
            <SearchConsoleConnectionCard projectId={projectId} />
          </div>
        ) : (
          <>
            <TotalsCards report={report} />
            <p
              aria-label="Google Search Console data coverage"
              className="px-1 text-xs text-base-content/55"
            >
              Data covers {report.range.startDate} through{" "}
              {report.range.endDate}. Recent Search Console data may be delayed.
            </p>
            <div className="overflow-hidden rounded-xl border border-base-300 bg-base-100">
              <SearchPerformanceToolbar
                report={report}
                tab={tab}
                range={range}
                device={device}
                country={country}
                queryText={queryText}
                isFetching={reportQuery.isFetching && !reportQuery.isPending}
                onTabChange={(value) => {
                  setTab(value);
                  setQueryText("");
                  setPage(1);
                  onSearchChange({ tab: value, q: undefined, page: 1 });
                }}
                onRangeChange={(value) => {
                  setRange(value);
                  setPage(1);
                  onSearchChange({ dateRange: value, page: 1 });
                }}
                onDeviceChange={(value) => {
                  setDevice(value ?? ALL);
                  setPage(1);
                  onSearchChange({ device: value, page: 1 });
                }}
                onCountryChange={(value) => {
                  setCountry(value ?? ALL);
                  setPage(1);
                  onSearchChange({ country: value, page: 1 });
                }}
                onQueryChange={setQueryText}
                onExport={(target) => void handleExport(target)}
                onShare={() => void handleCopyReportLink()}
              />

              {tab === "striking" ? (
                <StrikingDistanceTable
                  projectId={projectId}
                  rows={report.strikingDistance}
                />
              ) : tableQuery.isPending ? (
                <div className="flex items-center gap-2 p-8 text-sm text-base-content/60">
                  <Loader2 className="size-4 animate-spin" /> Loading…
                </div>
              ) : tableQuery.isError ? (
                <div className="p-4">
                  <SearchPerformanceErrorState
                    message={getStandardErrorMessage(tableQuery.error)}
                    isFetching={tableQuery.isFetching}
                    onRetry={() => void tableQuery.refetch()}
                  />
                </div>
              ) : (
                <>
                  <div className="p-4">
                    {tableQuery.isPlaceholderData ? (
                      <p
                        role="status"
                        className="mb-3 text-xs text-base-content/60"
                      >
                        Updating results for the selected filters…
                      </p>
                    ) : null}
                    <DimensionTable
                      rows={tableRows}
                      keyLabel={tab === "queries" ? "Query" : "Page"}
                      projectId={projectId}
                      allowKeywordSave={
                        tab === "queries" && !tableQuery.isPlaceholderData
                      }
                      emptyMessage={
                        search.q
                          ? `No ${tab} contain “${search.q}”. Try a different search or clear the filters.`
                          : hasDeviceOrCountryFilter
                            ? `No ${tab} match the selected device and country. Try changing the filters or date range.`
                            : undefined
                      }
                      clearFiltersLabel="Clear search and filters"
                      onClearFilters={
                        hasDeviceOrCountryFilter || Boolean(search.q)
                          ? () => {
                              setDevice(ALL);
                              setCountry(ALL);
                              setQueryText("");
                              onSearchChange({
                                device: undefined,
                                country: undefined,
                                q: undefined,
                                page: 1,
                              });
                              setPage(1);
                            }
                          : undefined
                      }
                    />
                  </div>
                  <TablePagination
                    page={page}
                    pageSize={pageSize}
                    pageSizes={SEARCH_PERFORMANCE_PAGE_SIZES}
                    totalCount={null}
                    hasNextPage={hasNextPage}
                    isLoading={tableQuery.isFetching}
                    onPageChange={(value) => {
                      setPage(value);
                      onSearchChange({ page: value });
                    }}
                    onPageSizeChange={(value) => {
                      setPageSize(value);
                      setPage(1);
                      onSearchChange({ page: 1, pageSize: value });
                    }}
                  />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
