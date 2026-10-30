import { describe, expect, it } from "vitest";
import { extractAnswerBody } from "./MarkdownAnswer";

describe("extractAnswerBody", () => {
  it("omits model thinking blocks and trims the copied answer", () => {
    expect(
      extractAnswerBody("<think>private reasoning</think>\n\n**Answer**"),
    ).toBe("**Answer**");
  });

  it("omits an unclosed final thinking block", () => {
    expect(extractAnswerBody("Answer\n<think>unfinished reasoning")).toBe(
      "Answer",
    );
  });
});
