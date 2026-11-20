export type RankConfigTrendViewState = "loading" | "error" | "empty" | "chart";

export function getRankConfigTrendViewState(input: {
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  pointCount: number;
}): RankConfigTrendViewState {
  if (!input.hasData) {
    if (input.isLoading) return "loading";
    if (input.isError) return "error";
    return "empty";
  }

  return input.pointCount <= 1 ? "empty" : "chart";
}
