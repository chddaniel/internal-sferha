export type RankTrackingResultsViewState =
  | "loading"
  | "error"
  | "empty"
  | "table";

export function getRankTrackingResultsViewState(input: {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  rowCount: number;
}): RankTrackingResultsViewState {
  if (!input.hasData) {
    if (input.isLoading) return "loading";
    if (input.isError) return "error";
  }

  return input.rowCount === 0 ? "empty" : "table";
}
