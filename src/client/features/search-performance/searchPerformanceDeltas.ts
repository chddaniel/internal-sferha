export type SearchPerformanceDelta = {
  text: string;
  improved: boolean;
} | null;

export function percentDelta(
  current: number,
  previous: number,
): SearchPerformanceDelta {
  if (previous === 0) {
    return current > 0 ? { text: "New", improved: true } : null;
  }
  if (previous < 0) return null;

  const change = (current - previous) / previous;
  const pct = (change * 100).toFixed(1);
  return { text: `${change >= 0 ? "+" : ""}${pct}%`, improved: change >= 0 };
}

/** Position falls as rankings improve, so the delta is inverted. */
export function positionDelta(
  current: number,
  previous: number,
): SearchPerformanceDelta {
  if (previous <= 0) {
    return current > 0 ? { text: "New", improved: true } : null;
  }
  if (current <= 0) return null;

  const change = previous - current;
  return {
    text: `${change >= 0 ? "+" : ""}${change.toFixed(1)}`,
    improved: change >= 0,
  };
}
