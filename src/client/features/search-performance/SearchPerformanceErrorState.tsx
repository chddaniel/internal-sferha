import { Loader2 } from "lucide-react";

export function SearchPerformanceErrorState({
  message,
  isFetching,
  onRetry,
}: {
  message: string;
  isFetching: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-error/30 bg-error/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <p role="alert" className="text-sm text-error">
        {message}
      </p>
      <button
        type="button"
        className="btn btn-outline btn-error btn-sm shrink-0"
        onClick={onRetry}
        disabled={isFetching}
      >
        {isFetching ? <Loader2 className="size-4 animate-spin" /> : null}
        {isFetching ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
