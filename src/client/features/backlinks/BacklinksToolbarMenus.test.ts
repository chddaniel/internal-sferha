import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  BacklinksActionsMenu,
  BacklinksExportMenu,
} from "./BacklinksToolbarMenus";

describe("backlinks dropdown triggers", () => {
  it("renders the export trigger as a native menu button", () => {
    const markup = renderToStaticMarkup(
      createElement(BacklinksExportMenu, {
        activeTab: "backlinks",
        exportTarget: "example.com",
        headers: [],
        rows: [],
      }),
    );

    expect(markup).toContain(
      '<button type="button" class="btn btn-sm btn-ghost gap-1 btn-disabled" aria-label="Export backlinks table" aria-haspopup="menu">',
    );
  });

  it("renders the actions trigger as a native menu button", () => {
    const markup = renderToStaticMarkup(
      createElement(BacklinksActionsMenu, {
        isLoadingRatings: false,
        loadRatings: () => undefined,
        ratableDomains: [],
      }),
    );

    expect(markup).toContain(
      '<button type="button" class="btn btn-sm btn-ghost btn-square" aria-label="Backlinks table actions" aria-haspopup="menu" title="Backlinks table actions">',
    );
  });
});
