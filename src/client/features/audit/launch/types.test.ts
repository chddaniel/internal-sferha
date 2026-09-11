import { describe, expect, it } from "vitest";
import {
  DEFAULT_LAUNCH_FORM_VALUES,
  getLaunchFormValues,
} from "./types";

describe("getLaunchFormValues", () => {
  it("prefills the saved project URL without changing launch defaults", () => {
    expect(getLaunchFormValues("https://example.com")).toEqual({
      ...DEFAULT_LAUNCH_FORM_VALUES,
      url: "https://example.com",
    });
  });

  it("keeps the URL empty when no project URL is supplied", () => {
    expect(getLaunchFormValues()).toEqual(DEFAULT_LAUNCH_FORM_VALUES);
  });
});
