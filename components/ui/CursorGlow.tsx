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

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      // Rings snap exactly to the real cursor — no lag
      const ringPos = `left:${x}px;top:${y}px;`;
      inner.setAttribute("style", ringPos);
      outer.setAttribute("style", ringPos);

      // Blob snaps to real cursor — no lag
      blob.setAttribute("style", `left:${x}px;top:${y}px;`);

      // Grid highlight also snaps to real cursor
      grid.style.maskImage = `radial-gradient(circle 220px at ${x}px ${y}px, black 30%, transparent 100%)`;
      grid.style.webkitMaskImage = `radial-gradient(circle 220px at ${x}px ${y}px, black 30%, transparent 100%)`;

      rafId = requestAnimationFrame(animate);
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
