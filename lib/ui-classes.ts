/**
 * Shared Tailwind class strings — migrated from the former `@layer components`
 * classes in app/globals.css. The visual styling now lives in the utility layer;
 * a few class names (`container`, `pill`, `eyebrow`) are still present in markup
 * purely as runtime hooks for BackgroundSpark's hit-testing (CONTENT_SELECTOR).
 *
 * EYEBROW / DISPLAY are intentionally color-less: pair them with a `text-*` color
 * at each call site so a per-site color override is a single color utility (no
 * same-layer ordering ambiguity between two competing color utilities).
 *
 * Breakpoint note: the originals used `@media (max-width: 768px)` (inclusive of
 * 768, so iPad portrait = mobile). Tailwind's `max-[768px]` compiles to
 * `not (min-width:768px)` = strictly < 768, which would flip iPad to desktop.
 * So these use mobile-first `min-[769px]:` for the desktop value — keeping ≤768
 * (incl. iPad's 768) on the mobile value, matching the original exactly.
 */
export const CONTAINER = "mx-auto max-w-[1180px] px-5 min-[769px]:px-8";
/**
 * Section rhythm is viewport-relative, not a fixed padding. Every reference
 * site studied sizes its vertical rhythm in viewport units so sections read as
 * discrete full-height moments rather than stacked blocks — the clamp keeps it
 * sane on short laptops and very tall monitors.
 */
/**
 * `overflow-x-clip` is load-bearing, not cosmetic. Sections carry oversized
 * decorative glows (600–700px ellipses positioned with `left-1/2` or negative
 * offsets) which are wider than a phone viewport and would otherwise push the
 * document wide and produce horizontal scroll. Clipping on the section contains
 * them, and does it for any decoration added later too.
 */
export const SECTION = "relative z-[1] overflow-x-clip py-[clamp(2rem,11vh,1rem)]";
export const EYEBROW = "font-display text-[0.68rem] font-bold tracking-[0.2em] uppercase";
export const DISPLAY = "font-display font-extrabold tracking-[-0.02em] leading-[0.95] uppercase";
export const DISPLAY_LG = "text-[clamp(2rem,8vw,3rem)] min-[769px]:text-[clamp(2.5rem,4vw,5rem)]";
export const DISPLAY_MD = "text-[clamp(1.8rem,2.5vw,3rem)]";
// Arbitrary gradient (not bg-gradient-to-r) to keep the original sRGB interpolation —
// Tailwind's gradient utilities interpolate in oklab, which alters a transparent→color ramp.
export const DIVIDER =
  "h-0.5 opacity-50 bg-[linear-gradient(to_right,transparent,var(--accent-ink),transparent)]";

/**
 * Pill base: layout / shape / weight only. bg, border-color, text-color and
 * font-size are supplied per call site so each pill's overrides stay a single
 * utility per property (preserving the prior `@layer components` → utility win).
 * Keep the bare `pill` class alongside this for BackgroundSpark.
 */
export const PILL_BASE =
  "inline-flex items-center gap-[0.35rem] rounded-full border px-[0.85rem] py-[0.32rem] font-semibold";
