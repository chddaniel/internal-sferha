import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

export function SavedKeywordsEmptyState({
  hasActiveFilters,
  onClearFilters,
  projectId,
}: {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  projectId: string;
}) {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 py-12 text-center text-sm text-base-content/55"
    >
      <Search className="size-8 opacity-40" />
      <p>
        {hasActiveFilters
          ? "No saved keywords match the current filters."
          : "No saved keywords yet. Find keywords to start building your list."}
      </p>
      {hasActiveFilters ? (
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      ) : (
        <Link
          to="/p/$projectId/keywords"
          params={{ projectId }}
          className="btn btn-primary btn-sm"
        >
          Find keywords
        </Link>
      )}
    </div>
  );
}
