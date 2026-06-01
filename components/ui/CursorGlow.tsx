"use client";

import { useEffect } from "react";

export default function CursorGlow() {
  useEffect(() => {
    const el = document.getElementById("cursor-glow");
    if (!el) return;
    let x = 0,
      y = 0,
      cx = 0,
      cy = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const animate = () => {
      // Smooth lerp
      cx += (x - cx) * 0.09;
      cy += (y - cy) * 0.09;
      el.setAttribute("style", `left:${cx}px;top:${cy}px;`);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div id="cursor-glow" aria-hidden="true" />;
}
