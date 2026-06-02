"use client";

import { useEffect, useRef } from "react";

/* All 254 FixMyText tool icons from tools-registry/src/tools.ts.
   2-4 char monospace glyphs — one placed per every 3rd grid cell (144px spacing). */
const TOOL_ICONS: string[] = [
  "aLt",
  "AP",
  "cc",
  "Cw",
  "C-C",
  "C_C",
  "d.c",
  "fc",
  "iW",
  "k-c",
  "aa",
  "PP",
  "p/c",
  "Ss.",
  "sC",
  "s_c",
  "-S",
  "Sw",
  "Tt",
  "aA",
  "T-C",
  "Ud",
  "AA",
  "W d",
  "Ax",
  "Lb",
  "x_",
  "</>",
  "Qq",
  "_x",
  "0w",
  "Ex",
  "_=",
  "A~",
  "LF",
  "Mx",
  "Tl",
  "-_",
  "Ux",
  "@x",
  ".,",
  "#x",
  "Dd",
  "Fr",
  "1.",
  "Rv",
  "Rl",
  "AZ",
  "ZA",
  "Sh",
  "Sl",
  "19",
  "L#",
  "S|",
  "J|",
  "=|",
  "Wr",
  "?+",
  "?-",
  "Tc",
  "Nn",
  "6d",
  "6e",
  "x0",
  "0x",
  "01",
  "10",
  "8+",
  "8-",
  "D+",
  "D-",
  "%+",
  "%-",
  "M+",
  "M-",
  "BF",
  "bf",
  "He",
  "Hu",
  "Je",
  "Ju",
  "Ue",
  "Ud",
  "#5",
  "#1",
  "224",
  "#2",
  "384",
  "512",
  "52",
  "53",
  "32",
  "33",
  "34",
  "35",
  "Kc",
  "RM",
  "Bb",
  "Bs",
  "Wp",
  "C3",
  "A3",
  "Fn",
  "xx",
  "Mm",
  "R13",
  "Ab",
  "Cs",
  "Ve",
  "Vd",
  "Re",
  "Rd",
  "Pf",
  "Sb",
  "Ct",
  "3e",
  "3d",
  "8e",
  "8d",
  "f%",
  "C*",
  "Na",
  "Bc",
  "A+",
  "A-",
  "#:",
  "CJ",
  "<>",
  "JS",
  "JC",
  "{}",
  "JY",
  "JWT",
  ".*",
  "TS",
  "SQ",
  "XM",
  "Md",
  "Jm",
  "XJ",
  "JT",
  "cT",
  "Uu",
  "Tc",
  "#C",
  "Li",
  "Ul",
  "Cr",
  "c>",
  "Hd",
  "$.",
  "U/",
  "5",
  "Em",
  "G",
  "L+",
  "Pa",
  "Pr",
  "Sm",
  "Fm",
  "Tn",
  "Ac",
  "~C",
  "Tw",
  "Av",
  "Rr",
  "Sp",
  "Cn",
  "Rb",
  "Mn",
  "CL",
  "OD",
  "C>",
  "Rw",
  "Ta",
  "Bl",
  "H",
  "#",
  "Kw",
  "M:",
  "Rp",
  "SEO",
  "Se",
  "Xs",
  "in",
  "X/",
  "Ig",
  "Yt",
  "Bi",
  "Pd",
  "CT",
  "Ad",
  "H!",
  "Es",
  "!i",
  "Hk",
  "Ag",
  "?{",
  "/s",
  "A>",
  "Tr",
  "N/V",
  "?.!",
  "G?",
  "Sy",
  "An",
  "Df",
  "W!",
  "Rd",
  "Vc",
  "Js",
  "F?",
  "Cd",
  ":)",
  "<>",
  "c!",
  "w!",
  "%~",
  "J!",
  "L!",
  "Ov",
  "Pw",
  "Rx",
  "Fn",
  "@F",
  "Fa",
  "Fp",
  "Fd",
  "nI",
  "Tn",
  "{S}",
  "SQ+",
  "/./",
  "Wp",
  "Tm",
  "@U",
  "Im",
  "Ma",
  "W#",
  "Rt",
  "Cc",
  "Ts",
  "Dw",
  "Ow",
  "1A",
  "A1",
  "D/",
  "IV",
  "QR",
  "MH",
];

/* Grid cell size matches body background-size (48px).
   Checkerboard pattern — icons at alternating cells per row. */
const GRID_PX = 48;
const REVEAL_RADIUS = 160; // px — matches cursor-glow visible radius

const CONTENT_SELECTOR =
  ".card, a, button, input, textarea, select, [role='button'], h1, h2, h3, h4, p, label, .pill, .btn, nav, footer, img, [data-no-spark]";

type Cell = { x: number; y: number; icon: string };

function buildGrid(vw: number, vh: number): Cell[] {
  const cols = Math.ceil(vw / GRID_PX) + 1;
  const rows = Math.ceil(vh / GRID_PX) + 1;
  const cells: Cell[] = [];
  let n = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Checkerboard: even rows use even columns, odd rows use odd columns.
      if ((c % 2) !== (r % 2)) continue;
      cells.push({
        x: c * GRID_PX + GRID_PX / 2,
        y: r * GRID_PX + GRID_PX / 2,
        icon: TOOL_ICONS[n % TOOL_ICONS.length],
      });
      n++;
    }
  }
  return cells;
}

export default function BackgroundSpark() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const noHover = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noHover || reduced) return;

    const container = containerRef.current;
    if (!container) return;

    // Inject keyframe once into the document.
    const ANIM_ID = "spark-icon-pulse";
    if (!document.getElementById(ANIM_ID)) {
      const style = document.createElement("style");
      style.id = ANIM_ID;
      style.textContent = `
        @keyframes spark-icon-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1);   filter: none; }
          50%       { transform: translate(-50%, -50%) scale(1.18); filter: drop-shadow(0 0 3px rgba(200,241,53,0.6)); }
        }
      `;
      document.head.appendChild(style);
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const cells = buildGrid(vw, vh);

    // Build DOM nodes once — flat spans, no border/bg, pure monospace text.
    const nodes: HTMLSpanElement[] = cells.map((cell, i) => {
      const el = document.createElement("span");
      el.textContent = cell.icon;
      // Stagger animation delay by index so icons don't all pulse in sync.
      const delay = ((i * 0.37) % 3).toFixed(2);
      el.style.cssText = `
        position: absolute;
        left: ${cell.x}px;
        top: ${cell.y}px;
        transform: translate(-50%, -50%);
        font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        font-size: 0.6rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: #c8f135;
        opacity: 0;
        will-change: opacity, transform;
        pointer-events: none;
        user-select: none;
        line-height: 1;
        animation: spark-icon-pulse 3.2s ease-in-out ${delay}s infinite;
        animation-play-state: paused;
      `;
      container.appendChild(el);
      return el;
    });

    let mouseX = -9999;
    let mouseY = -9999;
    let dirty = false;
    let rafId = 0;

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

      nodes.forEach((el, i) => {
        const cell = cells[i];
        const dx = cell.x - mouseX;
        const dy = cell.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const t = Math.max(0, 1 - dist / REVEAL_RADIUS);
        let eased = t * t * (3 - 2 * t); // smoothstep

        if (eased > 0) {
          const under = document.elementFromPoint(cell.x, cell.y);
          if (under && under.closest(CONTENT_SELECTOR)) eased = 0;
        }

        el.style.opacity = eased > 0 ? String(eased) : "0";
        // Play animation only while in spotlight, pause when hidden.
        el.style.animationPlayState = eased > 0 ? "running" : "paused";
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafId);
      nodes.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
    />
  );
}
