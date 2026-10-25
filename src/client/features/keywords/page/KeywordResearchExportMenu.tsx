import { ChevronDown, Download, FileDown, Sheet } from "lucide-react";

export function KeywordResearchExportMenu({
  canExport,
  compact = false,
  onExportToSheets,
  onExportCsv,
}: {
  canExport: boolean;
  compact?: boolean;
  onExportToSheets: () => void;
  onExportCsv: () => void;
}) {
  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        aria-label="Export keyword research"
        aria-haspopup="menu"
        disabled={!canExport}
        className={`btn btn-ghost ${compact ? "btn-xs" : "btn-sm"} gap-1 disabled:opacity-50`}
      >
        <Download className="size-3.5" />
        {compact ? null : <span className="hidden lg:inline">Export</span>}
        <ChevronDown className="size-3 opacity-60" />
      </button>
      <ul
        tabIndex={0}
        role="menu"
        className="dropdown-content z-10 menu p-2 shadow-lg bg-base-100 border border-base-300 rounded-box w-56"
      >
        <li>
          <button
            type="button"
            role="menuitem"
            onClick={onExportToSheets}
            disabled={!canExport}
          >
            <Sheet className="size-4" />
            Export to Sheets
          </button>
        </li>
        <li>
          <button
            type="button"
            role="menuitem"
            onClick={onExportCsv}
            disabled={!canExport}
          >
            <FileDown className="size-4" />
            Export CSV
          </button>
        </li>
      </ul>
    </div>
  );
}
