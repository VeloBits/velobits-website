"use client";

import { useCallback, useEffect, useRef } from "react";

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
  borderWidth?: number;
  blur?: number;
}

export function GlowingEffect({
  spread = 40,
  glow = false,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.01,
  borderWidth = 1,
  blur = 0,
}: GlowingEffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const update = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!ref.current) return;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;

        const { left, top, width, height } = el.getBoundingClientRect();
        const x = e?.x ?? lastPos.current.x;
        const y = e?.y ?? lastPos.current.y;
        if (e) lastPos.current = { x, y };

        const cx = left + width / 2;
        const cy = top + height / 2;

        const inactiveR = 0.5 * Math.min(width, height) * inactiveZone;
        if (Math.hypot(x - cx, y - cy) < inactiveR) {
          el.style.setProperty("--active", "0");
          return;
        }

        const inRange =
          x > left - proximity && x < left + width + proximity &&
          y > top - proximity && y < top + height + proximity;

        el.style.setProperty("--active", inRange ? "1" : "0");
        if (!inRange) return;

        const angle = ((Math.atan2(y - cy, x - cx) * 180) / Math.PI + 360) % 360;
        const prev = parseFloat(el.style.getPropertyValue("--start") || "0");
        const delta = ((angle - prev + 540) % 360) - 180;
        el.style.setProperty("--start", (prev + delta).toFixed(2));
      });
    },
    [inactiveZone, proximity]
  );

  useEffect(() => {
    if (disabled) return;
    const onMove = (e: MouseEvent) => update(e);
    const onScroll = () => update();
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [disabled, update]);

  return (
    <div
      ref={ref}
      style={{ "--start": "0", "--active": "0", "--spread": spread } as React.CSSProperties}
      className={`pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500 ${
        glow ? "opacity-100" : "opacity-[var(--active)]"
      }`}
    >
      <div
        style={{
          position: "absolute",
          inset: `-${borderWidth}px`,
          borderRadius: "inherit",
          padding: `${borderWidth}px`,
          background: `conic-gradient(
            from calc((var(--start) - var(--spread)) * 1deg) at 50% 50%,
            transparent 0deg,
            rgba(200,241,53,0.9) 1deg,
            rgba(200,241,53,0.9) calc(var(--spread) * 2deg),
            transparent calc(var(--spread) * 2deg + 1deg)
          )`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          ...(blur ? { filter: `blur(${blur}px)` } : {}),
        }}
      />
    </div>
  );
}
