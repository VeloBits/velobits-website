"use client";

import { useEffect, useMemo, useRef } from "react";

/* Content scattered across the background. An item is either an icon badge
   (a short glyph) or a keyword pill (a text label). Drawn from the FixMyText
   tool catalog — 254 tools across 12 categories. */
type SparkItem = { glyph: string } | { text: string };

/* Icon glyphs — compact symbols rendered in a circular badge. */
const SPARK_ICONS: SparkItem[] = [
  { glyph: "✦" },
  { glyph: "Aa" },
  { glyph: "{}" },
  { glyph: "64" },
  { glyph: "∑" },
  { glyph: "↻" },
  { glyph: "☺" },
  { glyph: "#" },
  { glyph: "M↓" },
  { glyph: "⟲" },
  { glyph: "⚿" },
  { glyph: "♪" },
  { glyph: "⚡" },
  { glyph: "↗" },
  { glyph: "🛡" },
  { glyph: "✨" },
  { glyph: "</>" },
  { glyph: "⌘" },
  { glyph: "λ" },
  { glyph: "⇄" },
  { glyph: "≡" },
  { glyph: "★" },
  { glyph: "✓" },
  { glyph: "◷" },
];

/* Keyword pills — short on-brand words rendered as text. */
const SPARK_KEYWORDS: SparkItem[] = [
  { text: "Encode" },
  { text: "Decode" },
  { text: "Cipher" },
  { text: "Hash" },
  { text: "Format" },
  { text: "Transform" },
  { text: "Rewrite" },
  { text: "Analyze" },
  { text: "Summarize" },
  { text: "Paraphrase" },
  { text: "Sentiment" },
  { text: "Markdown" },
  { text: "Base64" },
  { text: "JSON" },
  { text: "Real-time" },
  { text: "Shareable" },
  { text: "Privacy First" },
  { text: "AI-Powered" },
  { text: "254 Tools" },
];

/* Interleave icons and keywords so the scatter mixes both kinds evenly. */
const SPARK_ITEMS: SparkItem[] = (() => {
  const out: SparkItem[] = [];
  const max = Math.max(SPARK_ICONS.length, SPARK_KEYWORDS.length);
  for (let i = 0; i < max; i++) {
    if (i < SPARK_ICONS.length) out.push(SPARK_ICONS[i]);
    if (i < SPARK_KEYWORDS.length) out.push(SPARK_KEYWORDS[i]);
  }
  return out;
})();

const REVEAL_RADIUS = 150; // px — matches the cursor-glow visible radius
const COLUMNS = 8; // scatter grid columns across the viewport width
const ROWS = 6; // scatter grid rows down the viewport height
const JITTER = 0.42; // 0..0.5 — random offset within each grid cell

/* Reveal a chip only over empty background. If the element beneath it (the chip
   layer is pointer-events-none) is real content, keep it hidden. */
const CONTENT_SELECTOR =
  ".card, a, button, input, textarea, select, [role='button'], h1, h2, h3, h4, p, label, .pill, .btn, nav, footer, img, [data-no-spark]";

type Placed = {
  /* fractional viewport position 0..1, so it stays responsive on resize */
  fx: number;
  fy: number;
  item: SparkItem;
  rotation: number;
};

/* Deterministic-ish scatter: a grid with per-cell jitter so chips never overlap
   yet feel organic. Computed once on mount. */
function buildScatter(): Placed[] {
  const placed: Placed[] = [];
  let n = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const item = SPARK_ITEMS[n % SPARK_ITEMS.length];
      const jx = (Math.random() - 0.5) * 2 * JITTER;
      const jy = (Math.random() - 0.5) * 2 * JITTER;
      placed.push({
        fx: (c + 0.5 + jx) / COLUMNS,
        fy: (r + 0.5 + jy) / ROWS,
        item,
        rotation: Math.random() * 12 - 6,
      });
      n++;
    }
  }
  return placed;
}

export default function BackgroundSpark() {
  const scatter = useMemo(() => buildScatter(), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const noHover = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noHover || reduced) return;

    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;
    let dirty = false;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dirty = true;
    };

    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      dirty = true;
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!dirty) return;
      dirty = false;

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      chipRefs.current.forEach((el, i) => {
        if (!el) return;
        const p = scatter[i];
        const cx = p.fx * vw;
        const cy = p.fy * vh;
        const dx = cx - mouseX;
        const dy = cy - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // 1 at the cursor, 0 at/beyond REVEAL_RADIUS.
        const t = Math.max(0, 1 - dist / REVEAL_RADIUS);
        let eased = t * t * (3 - 2 * t); // smoothstep

        // Empty-space gate: only for chips actually near the cursor, hide the
        // chip if it sits over real content (card, heading, button, etc.).
        if (eased > 0) {
          const under = document.elementFromPoint(cx, cy);
          if (under && under.closest(CONTENT_SELECTOR)) eased = 0;
        }

        el.style.opacity = String(eased);
        el.style.transform = `translate(-50%, -50%) scale(${0.7 + eased * 0.35}) rotate(${p.rotation}deg)`;
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [scatter]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    >
      {scatter.map((p, i) => {
        const isIcon = "glyph" in p.item;
        return (
          <div
            key={i}
            ref={(el) => {
              chipRefs.current[i] = el;
            }}
            className={
              isIcon
                ? "absolute flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.06)] text-[0.8rem] text-accent backdrop-blur-sm"
                : "absolute flex items-center whitespace-nowrap rounded-full border border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.06)] px-2.5 py-1 text-[0.62rem] font-semibold tracking-tight text-accent backdrop-blur-sm"
            }
            style={{
              left: `${p.fx * 100}%`,
              top: `${p.fy * 100}%`,
              opacity: 0,
              transform: `translate(-50%, -50%) scale(0.7) rotate(${p.rotation}deg)`,
              willChange: "transform, opacity",
            }}
          >
            <span className="leading-none">{"glyph" in p.item ? p.item.glyph : p.item.text}</span>
          </div>
        );
      })}
    </div>
  );
}
