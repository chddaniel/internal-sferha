import { autumnSeoDataCreditsToUsd } from "@/shared/billing";

export function getRemainingCreditUsd(
  monthlyCredits: number | null | undefined,
  topUpCredits: number | null | undefined,
): number | null {
  if (monthlyCredits == null && topUpCredits == null) return null;

  return (
    autumnSeoDataCreditsToUsd(monthlyCredits ?? 0) +
    autumnSeoDataCreditsToUsd(topUpCredits ?? 0)
  );
}
