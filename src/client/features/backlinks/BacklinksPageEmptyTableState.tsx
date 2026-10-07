type EmptyTableEntity = "backlinks" | "referring domains" | "top pages";

export function EmptyTableState({
  entity,
  activeFilterCount,
}: {
  entity: EmptyTableEntity;
  activeFilterCount: number;
}) {
  return (
    <div
      role="status"
      className="rounded-xl border border-dashed border-base-300 p-10 text-center text-sm text-base-content/55"
    >
      {activeFilterCount > 0
        ? `No ${entity} match the current filters. Adjust or clear filters to see more results.`
        : `No ${entity} were returned for this target.`}
    </div>
  );
}
