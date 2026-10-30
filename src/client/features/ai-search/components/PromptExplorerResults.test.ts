import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { PromptExplorerResult } from "@/types/schemas/ai-search";
import { PromptExplorerResults } from "./PromptExplorerResults";

const result: PromptExplorerResult = {
  prompt: "Which tool should I use?",
  highlightBrand: "OpenSEO",
  fetchedAt: "2026-10-30T08:00:00.000Z",
  results: [
    {
      status: "success",
      model: "chat_gpt",
      modelName: "GPT",
      text: "A useful answer.",
      citations: [],
      fanOutQueries: [],
      brandMentioned: true,
      outputTokens: 12,
      webSearch: true,
    },
  ],
};

describe("PromptExplorerResults", () => {
  it("offers a labeled copy action for successful model responses", () => {
    const markup = renderToStaticMarkup(
      createElement(PromptExplorerResults, { result }),
    );

    expect(markup).toMatch(
      /<button[^>]*aria-label="Copy ChatGPT response"[^>]*>.*?Copy response/s,
    );
  });
});
