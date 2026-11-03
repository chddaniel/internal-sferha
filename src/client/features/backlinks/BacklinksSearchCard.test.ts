import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { BacklinksSearchCard } from "./BacklinksSearchCard";

describe("BacklinksSearchCard accessible controls", () => {
  it("labels the target field and announces the selected scope", () => {
    const markup = renderToStaticMarkup(
      createElement(BacklinksSearchCard, {
        errorMessage: null,
        initialValues: { target: "example.com", scope: "domain" },
        onSubmit: vi.fn(),
      }),
    );

    expect(markup).toContain('aria-label="Domain or URL to analyze"');
    expect(markup).toContain('role="group" aria-label="Backlink search scope"');
    expect(markup).toMatch(/aria-pressed="true"[^>]*>.*?Site-wide/s);
    expect(markup).toMatch(/aria-pressed="false"[^>]*>.*?Exact page/s);
  });
});
