import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Search } from "lucide-react";
import { describe, expect, it } from "vitest";
import { SearchHistorySection } from "./SearchHistorySection";

describe("SearchHistorySection remove action", () => {
  it("is labeled and visible for keyboard focus and touch", () => {
    const markup = renderToStaticMarkup(
      createElement(
        SearchHistorySection<{ timestamp: number; query: string }>,
        {
          history: [{ timestamp: 1, query: "coffee shops" }],
          historyLoaded: true,
          onRemoveHistoryItem: () => {},
          renderItemLink: (_item, content) =>
            createElement("a", { href: "/search" }, content),
          emptyIcon: Search,
          emptyMessage: "No searches yet",
          noun: "search",
          renderItem: (item) => item.query,
        },
      ),
    );

    expect(markup).toContain('aria-label="Remove from history"');
    expect(markup).toContain("opacity-100 md:opacity-0");
    expect(markup).toContain("md:group-focus-within:opacity-100");
  });
});
