import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import {
  AppDataTable,
  makeSelectionColumn,
  useAppTable,
  useSelectionAnchor,
} from "@/client/components/table/AppDataTable";
import {
  TableBulkActionBar,
  TableBulkActionButton,
} from "@/client/components/table/TableBulkActionBar";
import { buildDimensionColumns } from "@/client/features/search-performance/SearchPerformanceColumns";
import { getStandardErrorMessage } from "@/client/lib/error-messages";
import { captureClientEvent } from "@/client/lib/posthog";
import { saveKeywords } from "@/serverFunctions/keywords";
import type { SearchPerformanceTableRow } from "./SearchPerformanceColumns";

export function DimensionTable({
  rows,
  keyLabel,
  projectId,
  allowKeywordSave = false,
  emptyMessage = "No data for this period yet. Search Console data trails by a few days.",
  onClearFilters,
}: {
  rows: SearchPerformanceTableRow[];
  keyLabel: string;
  projectId: string;
  allowKeywordSave?: boolean;
  emptyMessage?: string;
  onClearFilters?: () => void;
}) {
  const queryClient = useQueryClient();
  const selectionAnchorRef = useSelectionAnchor();
  const [rowSelection, setRowSelection] = useState({});
  useEffect(() => {
    setRowSelection((current) =>
      Object.keys(current).length === 0 ? current : {},
    );
  }, [rows, allowKeywordSave]);

  const columns = useMemo(() => {
    const dimensionColumns = buildDimensionColumns(keyLabel);
    return allowKeywordSave
      ? [
          makeSelectionColumn<SearchPerformanceTableRow>(selectionAnchorRef),
          ...dimensionColumns,
        ]
      : dimensionColumns;
  }, [allowKeywordSave, keyLabel, selectionAnchorRef]);
  const table = useAppTable({
    data: rows,
    columns,
    withSorting: true,
    enableRowSelection: allowKeywordSave,
    state: allowKeywordSave ? { rowSelection } : undefined,
    onRowSelectionChange: allowKeywordSave ? setRowSelection : undefined,
    initialState: { sorting: [{ id: "clicks", desc: true }] },
  });
  const selectedKeywords = allowKeywordSave
    ? Array.from(
        new Set(
          table.getSelectedRowModel().rows.map((row) => row.original.key),
        ),
      )
    : [];

  const saveMutation = useMutation({
    mutationFn: (keywords: string[]) =>
      saveKeywords({ data: { projectId, keywords } }),
    onSuccess: (_result, keywords) => {
      captureClientEvent("keyword:save", {
        source_feature: "search_performance",
        keyword_count: keywords.length,
      });
      void queryClient.invalidateQueries({
        queryKey: ["savedKeywords", projectId],
      });
      toast.success(
        `Saved ${keywords.length} ${keywords.length === 1 ? "keyword" : "keywords"}`,
      );
      setRowSelection({});
    },
    onError: (error) =>
      toast.error(getStandardErrorMessage(error, "Could not save keywords")),
  });

  return (
    <>
      {allowKeywordSave && selectedKeywords.length > 0 ? (
        <div className="px-4 pb-3">
          <TableBulkActionBar
            selectedCount={selectedKeywords.length}
            selectedLabel="queries"
            onClear={() => table.resetRowSelection()}
            placement="inline"
            actions={
              <div className="flex items-center px-1.5">
                <TableBulkActionButton
                  icon={
                    saveMutation.isPending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Save className="size-3.5" />
                    )
                  }
                  onClick={() => saveMutation.mutate(selectedKeywords)}
                  disabled={saveMutation.isPending}
                >
                  {saveMutation.isPending ? "Saving…" : "Save keywords"}
                </TableBulkActionButton>
              </div>
            }
          />
        </div>
      ) : null}
      <AppDataTable
        table={table}
        className="table table-zebra table-sm"
        wrapperClassName="overflow-x-auto"
        empty={
          <div className="space-y-2 p-6 text-center text-sm text-base-content/60">
            <p>{emptyMessage}</p>
            {onClearFilters ? (
              <button
                type="button"
                className="btn btn-ghost btn-xs"
                onClick={onClearFilters}
              >
                Clear device and country
              </button>
            ) : null}
          </div>
        }
      />
    </>
  );
}
