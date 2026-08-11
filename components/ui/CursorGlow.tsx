"use client";

import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const blob = document.getElementById("cursor-glow");
    const inner = document.getElementById("cursor-ring-inner");
    const outer = document.getElementById("cursor-ring-outer");
    if (!blob || !inner || !outer) return;

    // Only hide the native cursor once a replacement is actually mounted, and
    // only where the replacement is allowed to show (fine pointer + motion OK
    // — see the gating @media block in globals.css). Without this opt-in a
    // reduced-motion visitor got `cursor: none` with the ring display:none,
    // i.e. no visible pointer at all.
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const useCustomCursor = finePointer && motionOk;
    if (useCustomCursor) document.documentElement.classList.add("has-custom-cursor");
    if (!useCustomCursor) return;

    let x = 0,
      y = 0;
    let rafId: number;

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
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove("has-custom-cursor");
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
    </>
  );
}
