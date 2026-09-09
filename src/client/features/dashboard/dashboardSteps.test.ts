import { describe, expect, it } from "vitest";
import type { DashboardActivation } from "@/server/features/dashboard/services/DashboardService";
import { computeNextStep, isStepDone, STEP_ORDER } from "./dashboardSteps";

function activation(
  overrides: Partial<DashboardActivation> = {},
): DashboardActivation {
  return {
    domain: null,
    audit: { started: false },
    gsc: { connected: false, siteUrl: null },
    mcp: {
      authorizedAt: null,
      firstToolCallAt: null,
      cardDismissedAt: null,
    },
    competitorClickedAt: null,
    ...overrides,
  };
}

describe("dashboard onboarding steps", () => {
  it("puts the first audit immediately after the domain step", () => {
    expect(STEP_ORDER).toEqual([
      "domain",
      "audit",
      "mcp",
      "gsc",
      "competitor",
    ]);
  });

  it("treats an existing audit as completed", () => {
    expect(
      isStepDone(activation({ audit: { started: true } }), "audit"),
    ).toBe(true);
  });

  it("coaches a user with a domain to run an audit next", () => {
    expect(computeNextStep(activation({ domain: "example.com" }))).toBe(
      "audit",
    );
  });
});
