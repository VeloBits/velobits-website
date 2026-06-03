"use client";

import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const blob = document.getElementById("cursor-glow");
    const inner = document.getElementById("cursor-ring-inner");
    const outer = document.getElementById("cursor-ring-outer");
    const grid = document.getElementById("cursor-grid-highlight");
    if (!blob || !inner || !outer || !grid) return;

    let x = 0,
      y = 0;
    let rafId: number;

    const CONTENT_SELECTOR =
      ".container, .card, nav, footer, header, .pill, .btn, button, a, input, " +
      "textarea, select, h1, h2, h3, h4, p, li, label, .eyebrow, [data-no-spark]";

    let dirty = false;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dirty = true;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!dirty) return;
      dirty = false;

      // Rings snap exactly to the real cursor — no lag
      const ringPos = `left:${x}px;top:${y}px;`;
      inner.setAttribute("style", ringPos);
      outer.setAttribute("style", ringPos);

      // Blob snaps to real cursor — no lag
      blob.setAttribute("style", `left:${x}px;top:${y}px;`);

      // Grid highlight: hide entirely when cursor is over any card or content.
      const under = document.elementFromPoint(x, y);
      const overContent = under && under.closest(CONTENT_SELECTOR);
      if (overContent) {
        grid.style.maskImage =
          "radial-gradient(circle 0px at -999px -999px, black 0%, transparent 0%)";
        grid.style.webkitMaskImage =
          "radial-gradient(circle 0px at -999px -999px, black 0%, transparent 0%)";
      } else {
        grid.style.maskImage = `radial-gradient(circle 220px at ${x}px ${y}px, black 30%, transparent 100%)`;
        grid.style.webkitMaskImage = `radial-gradient(circle 220px at ${x}px ${y}px, black 30%, transparent 100%)`;
      }
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Main ambient glow blob */}
      <div id="cursor-glow" aria-hidden="true" />
      {/* Inner sharp ring */}
      <div id="cursor-ring-inner" aria-hidden="true" />
      {/* Outer slow-pulse ring */}
      <div id="cursor-ring-outer" aria-hidden="true" />
      {/* Brighter grid layer masked to cursor radius */}
      <div id="cursor-grid-highlight" aria-hidden="true" />
    </>
  );
}
