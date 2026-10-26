import { describe, expect, it } from "vitest";
import { getSavedKeywordsSchema } from "./keywords";

describe("getSavedKeywordsSchema intent filters", () => {
  it("accepts the supported keyword intents", () => {
    const result = getSavedKeywordsSchema.safeParse({
      projectId: "project-1",
      intents: ["informational", "unknown"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects unsupported keyword intents", () => {
    const result = getSavedKeywordsSchema.safeParse({
      projectId: "project-1",
      intents: ["local"],
    });

    expect(result.success).toBe(false);
  });
});
