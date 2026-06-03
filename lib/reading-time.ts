/**
 * Estimate reading time in whole minutes from a Markdown string.
 *
 * Pure + dependency-free so it is trivially unit-testable and reused by both
 * the blog data layer (lib/blog.ts) and any presentational component. Strips
 * the most common Markdown syntax so code fences and link/image URLs don't
 * inflate the word count, then divides by an average adult reading pace.
 */
const WORDS_PER_MINUTE = 200;

export function readingTimeMinutes(markdown: string): number {
  const text = (markdown ?? "")
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!?\[[^\]]*\]\([^)]*\)/g, " ") // images & links → drop URL noise
    .replace(/[#>*_~`-]/g, " "); // residual markdown punctuation

  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
