import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { PromptExplorerResult } from "@/types/schemas/ai-search";
import {
  formatPromptExplorerComparison,
  PromptExplorerResults,
} from "./PromptExplorerResults";

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
    expect(markup).toMatch(
      /<button[^>]*aria-label="Copy Prompt Explorer comparison"[^>]*>.*?Copy comparison/s,
    );
  });

  it("formats all answers and citations while excluding hidden thinking", () => {
    const comparison = formatPromptExplorerComparison({
      ...result,
      results: [
        {
          status: "success",
          model: "chat_gpt",
          modelName: "GPT",
          text: "<think>private reasoning</think>Visible answer.",
          citations: [
            {
              title: "Helpful source",
              url: "https://example.com/source",
              domain: "example.com",
              matchedBrand: false,
            },
          ],
          fanOutQueries: [],
          brandMentioned: true,
          outputTokens: 12,
          webSearch: true,
        },
        {
          status: "error",
          model: "claude",
          errorCode: "UPSTREAM_ERROR",
          message: "Temporary model error.",
        },
      ],
    });

    expect(comparison).toContain("## Prompt");
    expect(comparison).toContain("Visible answer.");
    expect(comparison).not.toContain("private reasoning");
    expect(comparison).toContain("Helpful source: https://example.com/source");
    expect(comparison).toContain("## Claude (error)\n\nTemporary model error.");
  });
});
