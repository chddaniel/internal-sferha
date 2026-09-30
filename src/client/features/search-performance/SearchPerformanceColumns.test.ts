import { describe, expect, it } from "vitest";
import { isSafePageUrl } from "./SearchPerformanceColumns";

describe("isSafePageUrl", () => {
  it("accepts absolute HTTP and HTTPS URLs", () => {
    expect(isSafePageUrl("https://example.com/page")).toBe(true);
    expect(isSafePageUrl("http://example.com/page")).toBe(true);
  });

  it("rejects non-web and relative URLs", () => {
    expect(isSafePageUrl("javascript:alert(1)")).toBe(false);
    expect(isSafePageUrl("/page")).toBe(false);
    expect(isSafePageUrl("not a URL")).toBe(false);
  });
});
