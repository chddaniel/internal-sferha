import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { EmptyTableState } from "./BacklinksPageEmptyTableState";

describe("Backlinks empty table state", () => {
  it("explains when an unfiltered target returns no rows", () => {
    const markup = renderToStaticMarkup(
      createElement(EmptyTableState, {
        entity: "backlinks",
        activeFilterCount: 0,
      }),
    );

    expect(markup).toContain("No backlinks were returned for this target.");
    expect(markup).toContain('role="status"');
  });

  it("suggests adjusting filters when they hide all rows", () => {
    const markup = renderToStaticMarkup(
      createElement(EmptyTableState, {
        entity: "referring domains",
        activeFilterCount: 2,
      }),
    );

    expect(markup).toContain("No referring domains match the current filters.");
    expect(markup).toContain("Adjust or clear filters to see more results.");
  });
});
