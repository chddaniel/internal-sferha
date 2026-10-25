import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { KeywordResearchExportMenu } from "./KeywordResearchExportMenu";

describe("KeywordResearchExportMenu", () => {
  it("renders a native menu button in the full-size layout", () => {
    const markup = renderToStaticMarkup(
      createElement(KeywordResearchExportMenu, {
        canExport: true,
        onExportToSheets: vi.fn(),
        onExportCsv: vi.fn(),
      }),
    );

    expect(markup).toMatch(
      /<button[^>]*aria-label="Export keyword research"[^>]*aria-haspopup="menu"/,
    );
    expect(markup).toContain(">Export</span>");
    expect(markup).toContain('role="menuitem"');
  });

  it("keeps the compact mobile trigger labeled and disables empty exports", () => {
    const markup = renderToStaticMarkup(
      createElement(KeywordResearchExportMenu, {
        canExport: false,
        compact: true,
        onExportToSheets: vi.fn(),
        onExportCsv: vi.fn(),
      }),
    );

    expect(markup).toMatch(
      /<button[^>]*aria-label="Export keyword research"[^>]*aria-haspopup="menu"[^>]*disabled=""/,
    );
    expect(markup).not.toContain(">Export</span>");
    expect(markup.match(/disabled=""/g)).toHaveLength(3);
  });
});
