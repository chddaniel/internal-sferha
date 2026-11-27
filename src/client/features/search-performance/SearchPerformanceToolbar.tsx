import { Download, Link2, Loader2, Sheet } from "lucide-react";
import { TableExportMenu } from "@/client/components/table/TableBulkActionBar";
import {
  GSC_DEVICES,
  SEARCH_PERFORMANCE_RANGES,
  type SearchPerformanceDateRange,
  type SearchPerformanceDevice,
} from "@/types/schemas/search-performance";
import type { Report } from "@/client/features/search-performance/SearchPerformanceColumns";
import {
  TabButton,
  type ExportTarget,
  type Tab,
} from "@/client/features/search-performance/SearchPerformanceParts";

const ALL = "ALL";
const RANGE_LABELS: Record<SearchPerformanceDateRange, string> = {
  last_7_days: "Last 7 days",
  last_28_days: "Last 28 days",
  last_3_months: "Last 3 months",
};
const DEVICE_LABELS: Record<SearchPerformanceDevice, string> = {
  DESKTOP: "Desktop",
  MOBILE: "Mobile",
  TABLET: "Tablet",
};

function isDateRange(value: string): value is SearchPerformanceDateRange {
  return SEARCH_PERFORMANCE_RANGES.some((option) => option === value);
}

function isDevice(value: string): value is SearchPerformanceDevice {
  return GSC_DEVICES.some((option) => option === value);
}

export function SearchPerformanceToolbar({
  report,
  tab,
  range,
  device,
  country,
  queryText,
  isFetching,
  onTabChange,
  onRangeChange,
  onDeviceChange,
  onCountryChange,
  onQueryChange,
  onExport,
  onShare,
}: {
  report: Report;
  tab: Tab;
  range: SearchPerformanceDateRange;
  device: SearchPerformanceDevice | typeof ALL;
  country: string;
  queryText: string;
  isFetching: boolean;
  onTabChange: (tab: Tab) => void;
  onRangeChange: (range: SearchPerformanceDateRange) => void;
  onDeviceChange: (device: SearchPerformanceDevice | undefined) => void;
  onCountryChange: (country: string | undefined) => void;
  onQueryChange: (query: string) => void;
  onExport: (target: ExportTarget) => void;
  onShare: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-base-300 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
      <div role="tablist" className="tabs tabs-border w-fit">
        <TabButton
          active={tab === "striking"}
          onClick={() => onTabChange("striking")}
          label={`Striking distance (${report.strikingDistance.length})`}
        />
        <TabButton
          active={tab === "queries"}
          onClick={() => onTabChange("queries")}
          label="Queries"
        />
        <TabButton
          active={tab === "pages"}
          onClick={() => onTabChange("pages")}
          label="Pages"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isFetching ? (
          <Loader2 className="size-4 animate-spin text-base-content/40" />
        ) : null}
        <select
          className="select select-bordered select-sm w-36"
          value={device}
          onChange={(event) =>
            onDeviceChange(
              isDevice(event.target.value) ? event.target.value : undefined,
            )
          }
          aria-label="Device filter"
        >
          <option value={ALL}>All devices</option>
          {GSC_DEVICES.map((value) => (
            <option key={value} value={value}>
              {DEVICE_LABELS[value]}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered select-sm w-36"
          value={country}
          onChange={(event) =>
            onCountryChange(
              event.target.value === ALL ? undefined : event.target.value,
            )
          }
          aria-label="Country filter"
        >
          <option value={ALL}>All countries</option>
          {report.countries.map((row) => (
            <option key={row.key} value={row.key}>
              {row.key.toUpperCase()}
            </option>
          ))}
        </select>
        <select
          className="select select-bordered select-sm w-36"
          value={range}
          onChange={(event) => {
            if (isDateRange(event.target.value)) {
              onRangeChange(event.target.value);
            }
          }}
          aria-label="Date range"
        >
          {SEARCH_PERFORMANCE_RANGES.map((value) => (
            <option key={value} value={value}>
              {RANGE_LABELS[value]}
            </option>
          ))}
        </select>
        {tab === "queries" || tab === "pages" ? (
          <input
            type="search"
            className="input input-bordered input-sm w-44"
            value={queryText}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder={
              tab === "queries" ? "Filter queries…" : "Filter pages…"
            }
            aria-label={tab === "queries" ? "Filter queries" : "Filter pages"}
            maxLength={200}
          />
        ) : null}
        <TableExportMenu
          buttonClassName="btn btn-ghost btn-sm gap-1"
          actions={[
            {
              label: "Export to Sheets",
              icon: <Sheet className="size-4" />,
              onClick: () => onExport("sheets"),
            },
            {
              label: "Download CSV",
              icon: <Download className="size-4" />,
              onClick: () => onExport("csv"),
            },
          ]}
        />
        <button
          type="button"
          className="btn btn-ghost btn-sm gap-1"
          onClick={onShare}
          aria-label="Copy shareable report link"
        >
          <Link2 className="size-4" />
          Share
        </button>
      </div>
    </div>
  );
}
