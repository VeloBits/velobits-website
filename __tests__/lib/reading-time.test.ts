import { describe, it, expect } from "vitest";
import { readingTimeMinutes } from "@/lib/reading-time";

describe("readingTimeMinutes", () => {
  it("returns at least 1 minute for short or empty content", () => {
    expect(readingTimeMinutes("")).toBe(1);
    expect(readingTimeMinutes("Just a few words here.")).toBe(1);
  });

  it("rounds words / 200 to the nearest minute", () => {
    const sixHundred = Array.from({ length: 600 }, () => "word").join(" ");
    expect(readingTimeMinutes(sixHundred)).toBe(3);
  });

  it("ignores fenced code blocks and inline code when counting", () => {
    const prose = Array.from({ length: 400 }, () => "word").join(" ");
    const noisy = `${prose}\n\n\`\`\`js\n${Array.from({ length: 5000 }, () => "x()").join("\n")}\n\`\`\`\n\nand \`inline\` too`;
    // ~400 prose words → 2 min, unaffected by the 5000-line code block.
    expect(readingTimeMinutes(noisy)).toBe(2);
  });

  it("does not count link/image URLs toward the word count", () => {
    const md = "See [the docs](https://example.com/a/very/long/path/that/is/many/segments).";
    expect(readingTimeMinutes(md)).toBe(1);
  });
});
