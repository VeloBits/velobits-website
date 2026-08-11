"use client";

import { useEffect, useRef } from "react";

/**
 * Sparse ASCII isoline field — decorative backdrop.
 *
 * WHY ISOLINES RATHER THAN A FILLED FIELD
 * ---------------------------------------
 * Rendering a glyph for every cell produces ~0.93 fill, which reads as
 * patterned wallpaper. Drawing only the cells that sit near a contour of the
 * field drops fill to ~0.2 and reads as an instrument instead — and, because
 * cost is per drawn glyph, it is also several times cheaper. Sparsity is both
 * the aesthetic lever and the performance lever; they are the same lever.
 *
 * The band is divided by the local gradient so contours keep a constant width
 * on screen instead of ballooning where the field is flat.
 *
 * THEMING
 * -------
 * Colours are read from CSS custom properties, so the draw loop never branches
 * on theme. Swapping `--ascii-ink` is the whole light/dark implementation.
 *
 * COST
 * ----
 * Cell count is the only variable that matters, and the danger case is a large
 * desktop monitor rather than a phone. Cell size is therefore grown until the
 * grid fits under MAX_CELLS.
 */

const GLYPHS = [".", "-", "\\", "|", "/"] as const; // direction vocabulary, not a tone ramp
const MAX_CELLS = 9000; // comfortably under the ~20k 60fps ceiling
const BASE_CELL = 13; // px, before any upscale to satisfy MAX_CELLS

export default function AsciiField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let visible = false;
    let cols = 0;
    let rows = 0;
    let cell = BASE_CELL;
    let cw = 0;
    let ch = 0;
    let ink = "rgba(0,0,0,0.35)";
    let inkHot = "rgba(0,0,0,0.6)";

    const readTheme = () => {
      const cs = getComputedStyle(canvas);
      ink = cs.getPropertyValue("--ascii-ink").trim() || ink;
      inkHot = cs.getPropertyValue("--ascii-ink-hot").trim() || inkHot;
    };

    const layout = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Grow the cell until the grid fits the budget. A 2560×1440 hero would
      // otherwise be ~54k cells and drop to roughly 15fps.
      cell = BASE_CELL;
      while ((rect.width / cell) * (rect.height / cell) > MAX_CELLS) cell += 1;

      cols = Math.ceil(rect.width / cell);
      rows = Math.ceil(rect.height / cell);
      cw = rect.width;
      ch = rect.height;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      ctx.font = `${cell - 3}px var(--font-geist-mono), ui-monospace, monospace`;
      readTheme();
      return true;
    };

    // Cheap band-limited field. Sines beat real noise here: it is smooth, has
    // an analytic gradient, and costs nothing.
    const field = (x: number, y: number, t: number) =>
      Math.sin(x * 1.7 + t * 0.22) +
      Math.sin(y * 2.1 - t * 0.17) +
      Math.sin((x + y) * 1.15 + t * 0.13) +
      Math.sin((x - y) * 0.9 - t * 0.11);

    const draw = (tMs: number) => {
      const t = tMs / 1000;
      ctx.clearRect(0, 0, cw, ch);

      const aspect = cw / Math.max(ch, 1);
      // Batch by colour: switching fillStyle per cell is the expensive mistake.
      for (let pass = 0; pass < 2; pass++) {
        ctx.fillStyle = pass === 0 ? ink : inkHot;
        for (let r = 0; r < rows; r++) {
          const v = (r / rows) * 2 - 1;
          for (let c = 0; c < cols; c++) {
            const u = ((c / cols) * 2 - 1) * aspect;

            const f = field(u, v, t);
            // Distance to the nearest contour of f, normalised by local slope
            // so the band keeps constant screen width.
            const gx = field(u + 0.01, v, t) - f;
            const gy = field(u, v + 0.01, t) - f;
            const slope = Math.hypot(gx, gy) / 0.01 || 1e-4;
            const wrapped = f - Math.round(f);
            const d = Math.abs(wrapped) / slope;

            // BAND / HOT are tuned so roughly a fifth of cells carry a glyph.
            // Below ~0.1 fill the field disappears; above ~0.5 it stops reading
            // as contours and becomes texture. Measured, not guessed — see
            // .design-research/_ascii.
            const hot = d < 0.008;
            if (pass === 0 ? !(d < 0.04) || hot : !hot) continue;

            // Glyph encodes contour DIRECTION, which is what makes the field
            // read as a measurement rather than as texture.
            const ang = Math.atan2(gy, gx);
            const norm = (ang + Math.PI) / (Math.PI * 2);
            const gi = 1 + Math.min(3, Math.floor(norm * 4));
            ctx.fillText(hot ? GLYPHS[0] : GLYPHS[gi], c * cell + cell / 2, r * cell + cell / 2);
          }
        }
      }
    };

    let start = 0;
    const loop = (ts: number) => {
      if (!start) start = ts;
      draw(ts - start);
      raf = requestAnimationFrame(loop);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const play = () => {
      if (raf || !visible || document.hidden || reduced.matches) return;
      raf = requestAnimationFrame(loop);
    };

    if (!layout()) return;

    // Reduced motion: render a single representative frame and never start rAF.
    if (reduced.matches) {
      draw(2000);
    }

    // Three-way gate — offscreen, backgrounded, or motion-averse all stop work.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) play();
        else stop();
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    const onVis = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVis);

    const onMotion = () => {
      stop();
      if (reduced.matches) draw(2000);
      else play();
    };
    reduced.addEventListener("change", onMotion);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (layout() && reduced.matches) draw(2000);
      }, 120);
    });
    ro.observe(canvas);

    // The theme swap changes only the two ink custom properties.
    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduced.matches) draw(2000);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    const schemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => {
      readTheme();
      if (reduced.matches) draw(2000);
    };
    schemeMq.addEventListener("change", onScheme);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener("visibilitychange", onVis);
      reduced.removeEventListener("change", onMotion);
      schemeMq.removeEventListener("change", onScheme);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
