import type { ReactNode } from "react";

/**
 * The editorial header shared by every section.
 *
 * Every section previously hand-rolled: eyebrow + two-line display heading whose
 * last word was accent-coloured + a paragraph. Identical rhythm seven times over,
 * with the accent on every heading so it marked nothing. This collapses that into
 * one component with a real hierarchy:
 *
 *   index   a mono ordinal, so the page reads as a numbered sequence
 *   eyebrow a mono micro-label
 *   title   large ink display type, revealed line-by-line from behind a mask
 *   lede    optional, set to a narrow measure and placed in the right column
 *
 * The title reveal uses `.line-mask`, so pass `title` as one string per line
 * via `titleLines` to get the staggered rise.
 */
export default function SectionHeader({
  index,
  eyebrow,
  titleLines,
  lede,
  align = "split",
  className = "",
}: {
  index?: string;
  eyebrow: string;
  titleLines: string[];
  lede?: ReactNode;
  align?: "split" | "center";
  className?: string;
}) {
  const centered = align === "center";

  return (
    /* The display type gets the FULL measure — a two-column header squeezed
       64px type into ~600px and forced ugly wraps. The lede instead sits in a
       right-hand column beneath the title, which is the editorial arrangement
       the reference sites use and gives the heading room to land. */
    <div
      data-reveal-group
      className={`mb-[var(--space-8)] ${centered ? "text-center" : ""} ${className}`}
    >
      <div
        data-reveal
        className={`mb-6 flex items-center gap-3 ${centered ? "justify-center" : ""}`}
      >
        {index && <span className="label-mono text-accent">{index}</span>}
        {index && <span className="h-px w-8 bg-border-strong" aria-hidden="true" />}
        <span data-pet-perch className="label-mono text-subtle">
          {eyebrow}
        </span>
      </div>

      <h2
        data-pet-perch
        className="font-display text-[length:var(--text-4xl)] leading-[0.9] font-extrabold tracking-[-0.04em] text-balance text-foreground uppercase"
      >
        {titleLines.map((line) => (
          <span key={line} className="line-mask" data-reveal="line">
            <span>{line}</span>
          </span>
        ))}
      </h2>

      {lede && (
        <p
          data-reveal
          className={`mt-7 max-w-[46ch] text-[0.95rem] leading-[1.8] text-muted ${
            centered ? "mx-auto" : "lg:ml-auto lg:text-right"
          }`}
        >
          {lede}
        </p>
      )}
    </div>
  );
}
