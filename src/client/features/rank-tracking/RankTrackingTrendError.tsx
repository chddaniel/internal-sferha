import { AlertCircle } from "lucide-react";
import { getStandardErrorMessage } from "@/client/lib/error-messages";

export function HistoryLoadError({
  error,
  hasLoadedData,
  isRetrying,
  onRetry,
}: {
  error: unknown;
  hasLoadedData: boolean;
  isRetrying: boolean;
  onRetry: () => void;
}) {
  return (
    <div className="alert alert-error flex flex-wrap items-center gap-3">
      <AlertCircle className="size-4 shrink-0" />
      <span role="alert" className="flex-1">
        {getStandardErrorMessage(
          error,
          hasLoadedData
            ? "Couldn’t refresh ranking history. Showing the last loaded results."
            : "Couldn’t load ranking history. Retry to try again.",
        )}
      </span>
      <button
        type="button"
        className="btn btn-sm"
        onClick={onRetry}
        disabled={isRetrying}
      >
        {isRetrying ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
