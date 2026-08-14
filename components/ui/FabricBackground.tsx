"use client";

import { useEffect, useRef } from "react";

/**
 * "Space fabric" — a woven grid suspended behind the page that undulates like
 * cloth on water, with a small connector node at every intersection.
 *
 * WHY RAW WEBGL AND NOT THREE.JS
 * ------------------------------
 * The whole effect is one grid of points drawn twice: `LINES` for the weave and
 * `POINTS` for the connectors, with all displacement done in the vertex shader.
 * Three.js would add ~150 KB gzip to draw two primitives. This file is the
 * entire renderer and adds nothing to the bundle but itself.
 *
 * HOW THE CLOTH MOVES
 * -------------------
 * Displacement is a sum of four sines (band-limited, analytic, free) plus a
 * gaussian bump under the pointer — pressing a finger into fabric. The sheet is
 * then tilted about X and divided by a depth-derived `w`, which is what gives
 * the weave its vanishing-point spread and makes it read as a surface in space
 * rather than a flat pattern. Depth also drives per-vertex alpha and node size,
 * so far parts of the cloth recede instead of shimmering.
 *
 * COST CONTROL
 * ------------
 * Vertex count is the only thing that scales, so the grid is sized to the
 * viewport and hard-capped. DPR is capped at 1.5 — this is a background, and
 * nobody has ever noticed a slightly soft background. Work stops entirely when
 * the tab is hidden, and `prefers-reduced-motion` renders one static frame and
 * never starts the loop.
 */

const MAX_POINTS = 7000; // keeps index buffers inside Uint16 and the GPU bored
const TARGET_SPACING = 34; // css px between weave lines at 1x

/* Phones pay for this background in fill rate and battery, and it is ambient
   decoration behind content — nobody is studying it. Below this width the grid
   is coarser, the buffer is 1x, and the sim runs at ~30fps. The undulation is
   slow enough that half rate is imperceptible, and it halves the GPU work. */
const SMALL_SCREEN = 640;
const SMALL_SPACING = 52;
const SMALL_MAX_POINTS = 2400;
const SMALL_FRAME_MS = 33; // ~30fps

const VERT = `#version 300 es
precision highp float;

in vec2 aGrid;                 // 0..1 across the sheet

uniform float uTime;
uniform float uAspect;
uniform vec2  uPointer;        // aspect-corrected, roughly -1..1
uniform float uPointerAmp;
uniform float uScroll;
uniform float uTilt;
uniform float uPointScale;

out float vDepth;
out float vRipple;

// Band-limited height field. Four sines beat real noise here: smooth, cheap,
// and it never produces the high-frequency fizz that makes a grid look buzzy.
float cloth(vec2 p, float t) {
  float z = 0.0;
  z += sin(p.x * 2.10 + t * 0.55) * 0.42;
  z += sin(p.y * 1.70 - t * 0.42) * 0.36;
  z += sin((p.x + p.y) * 1.35 + t * 0.31) * 0.28;
  z += sin((p.x - p.y) * 2.60 - t * 0.24) * 0.15;
  return z;
}

void main() {
  // Oversize past NDC so the perspective divide never exposes an edge.
  vec2 g = (aGrid * 2.0 - 1.0) * 1.42;
  vec2 p = vec2(g.x * uAspect, g.y);

  // Scroll drags the weave through the field, so the cloth feels anchored in
  // space while the page moves over it.
  float z = cloth(p + vec2(0.0, uScroll), uTime);

  // Pointer presses into the sheet.
  float d = distance(p, uPointer);
  float ripple = exp(-d * d * 3.0);
  z += ripple * uPointerAmp;

  // Tilt about X, then a depth-derived w for the perspective divide.
  float ct = cos(uTilt);
  float st = sin(uTilt);
  float y  = g.y * ct - z * st * 0.42;
  float zc = g.y * st + z * ct;

  float w = 1.0 + zc * 0.16;

  vDepth = clamp(zc * 0.5 + 0.5, 0.0, 1.0);
  vRipple = ripple;

  gl_PointSize = uPointScale * mix(0.75, 1.7, vDepth) * (1.0 + ripple * 1.6);
  gl_Position = vec4(g.x, y, 0.0, max(w, 0.05));
}`;

const FRAG = `#version 300 es
precision highp float;

in float vDepth;
in float vRipple;

uniform vec4  uColor;
uniform float uIsPoint;
uniform vec3  uHot;

out vec4 outColor;

void main() {
  // Round off the connector nodes; GL points are squares by default.
  if (uIsPoint > 0.5) {
    vec2 c = gl_PointCoord - 0.5;
    float r = dot(c, c);
    if (r > 0.25) discard;
  }

  // Depth shading: far cloth recedes instead of flickering at full strength.
  float a = uColor.a * mix(0.28, 1.0, vDepth);

  // The pressed area lights up toward the accent — the only colour in the field.
  vec3 rgb = mix(uColor.rgb, uHot, clamp(vRipple * 1.35, 0.0, 1.0) * 0.85);
  a *= 1.0 + vRipple * 0.9;

  outColor = vec4(rgb, clamp(a, 0.0, 1.0));
}`;

/** Parse a computed CSS colour to normalised RGBA via canvas (handles any syntax). */
function readColor(probe: CanvasRenderingContext2D, css: string, fallback: number[]): number[] {
  if (!css) return fallback;
  try {
    probe.clearRect(0, 0, 1, 1);
    probe.fillStyle = "#000";
    probe.fillStyle = css;
    probe.fillRect(0, 0, 1, 1);
    const d = probe.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255];
  } catch {
    return fallback;
  }
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`shader compile failed: ${log}`);
  }
  return sh;
}

export default function FabricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      depth: false,
      premultipliedAlpha: false,
      powerPreference: "low-power",
    });
    // No WebGL2 (very old browser / blocked): leave the canvas blank. The page
    // is fully legible without it — this is decoration, never content.
    if (!gl) return;

    const probeCanvas = document.createElement("canvas");
    probeCanvas.width = probeCanvas.height = 1;
    const probe = probeCanvas.getContext("2d", { willReadFrequently: true });

    let program: WebGLProgram | null = null;
    let vao: WebGLVertexArrayObject | null = null;
    let gridBuf: WebGLBuffer | null = null;
    let lineIdx: WebGLBuffer | null = null;
    let pointIdx: WebGLBuffer | null = null;
    let lineCount = 0;
    let pointCount = 0;
    let raf = 0;
    let disposed = false;

    try {
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      program = gl.createProgram()!;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "link failed");
      }
    } catch {
      return; // shader unsupported — silently skip the decoration
    }

    const u = {
      time: gl.getUniformLocation(program, "uTime"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      pointerAmp: gl.getUniformLocation(program, "uPointerAmp"),
      scroll: gl.getUniformLocation(program, "uScroll"),
      tilt: gl.getUniformLocation(program, "uTilt"),
      pointScale: gl.getUniformLocation(program, "uPointScale"),
      color: gl.getUniformLocation(program, "uColor"),
      isPoint: gl.getUniformLocation(program, "uIsPoint"),
      hot: gl.getUniformLocation(program, "uHot"),
    };

    let lineColor = [0, 0, 0, 0.16];
    let nodeColor = [0.3, 0.36, 0.04, 0.5];
    let hot = [0.78, 0.94, 0.2];
    let aspect = 1;
    let dpr = 1;
    let pointScale = 2;
    let frameBudgetMs = 0; // 0 = draw every frame; set on small screens

    const readTheme = () => {
      if (!probe) return;
      const cs = getComputedStyle(canvas);
      lineColor = readColor(probe, cs.getPropertyValue("--fabric-line").trim(), lineColor);
      nodeColor = readColor(probe, cs.getPropertyValue("--fabric-node").trim(), nodeColor);
      const h = readColor(probe, cs.getPropertyValue("--accent-fill").trim(), [...hot, 1]);
      hot = [h[0], h[1], h[2]];
    };

    const buildGrid = (w: number, h: number) => {
      const small = w < SMALL_SCREEN;
      const spacing = small ? SMALL_SPACING : TARGET_SPACING;
      const budget = small ? SMALL_MAX_POINTS : MAX_POINTS;
      let cols = Math.ceil(w / spacing) + 1;
      let rows = Math.ceil(h / spacing) + 1;
      // Thin the grid until it fits the budget rather than refusing to draw.
      while (cols * rows > budget) {
        cols = Math.max(8, Math.floor(cols * 0.9));
        rows = Math.max(8, Math.floor(rows * 0.9));
      }

      const verts = new Float32Array(cols * rows * 2);
      let v = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          verts[v++] = c / (cols - 1);
          verts[v++] = r / (rows - 1);
        }
      }

      const lines: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          if (c < cols - 1) lines.push(i, i + 1);
          if (r < rows - 1) lines.push(i, i + cols);
        }
      }
      const points: number[] = [];
      for (let i = 0; i < cols * rows; i++) points.push(i);

      lineCount = lines.length;
      pointCount = points.length;

      if (vao) gl.deleteVertexArray(vao);
      if (gridBuf) gl.deleteBuffer(gridBuf);
      if (lineIdx) gl.deleteBuffer(lineIdx);
      if (pointIdx) gl.deleteBuffer(pointIdx);

      vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      gridBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, gridBuf);
      gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(program!, "aGrid");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

      lineIdx = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineIdx);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(lines), gl.STATIC_DRAW);

      pointIdx = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointIdx);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(points), gl.STATIC_DRAW);

      gl.bindVertexArray(null);
    };

    const resize = () => {
      // clientWidth, NOT innerWidth: innerWidth includes the classic scrollbar,
      // so sizing to it makes the canvas wider than the content box and creates
      // the very horizontal overflow this background sits behind.
      const w = document.documentElement.clientWidth;
      const h = document.documentElement.clientHeight || window.innerHeight;
      // 1x on phones: a full-viewport blended canvas at 2-3x DPR is pure fill
      // rate, and this is a texture behind content, not an image being read.
      dpr = w < SMALL_SCREEN ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      aspect = w / Math.max(h, 1);
      pointScale = Math.max(1.6, 2.1 * dpr);
      frameBudgetMs = w < SMALL_SCREEN ? SMALL_FRAME_MS : 0;
      buildGrid(w, h);
      readTheme();
    };

    // Pointer + scroll are lerped so the cloth trails the input like real fabric.
    const target = { x: 0, y: 0, amp: 0 };
    const cur = { x: 0, y: 0, amp: 0 };
    let scrollTarget = 0;
    let scrollCur = 0;

    const onPointer = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      target.x = nx * aspect;
      target.y = ny;
      target.amp = 0.55;
    };
    const onLeave = () => {
      target.amp = 0;
    };
    const onScroll = () => {
      scrollTarget = window.scrollY * 0.0016;
    };

    const draw = (tSec: number) => {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform1f(u.time, tSec);
      gl.uniform1f(u.aspect, aspect);
      gl.uniform2f(u.pointer, cur.x, cur.y);
      gl.uniform1f(u.pointerAmp, cur.amp);
      gl.uniform1f(u.scroll, scrollCur);
      gl.uniform1f(u.tilt, 0.62);
      gl.uniform1f(u.pointScale, pointScale);
      gl.uniform3f(u.hot, hot[0], hot[1], hot[2]);

      // Weave
      gl.uniform1f(u.isPoint, 0);
      gl.uniform4f(u.color, lineColor[0], lineColor[1], lineColor[2], lineColor[3]);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, lineIdx);
      gl.drawElements(gl.LINES, lineCount, gl.UNSIGNED_SHORT, 0);

      // Connector nodes at every intersection
      gl.uniform1f(u.isPoint, 1);
      gl.uniform4f(u.color, nodeColor[0], nodeColor[1], nodeColor[2], nodeColor[3]);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pointIdx);
      gl.drawElements(gl.POINTS, pointCount, gl.UNSIGNED_SHORT, 0);

      gl.bindVertexArray(null);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let start = 0;

    let lastDraw = 0;
    const frame = (ts: number) => {
      if (disposed) return;
      raf = requestAnimationFrame(frame);
      if (!start) start = ts;

      // Half-rate on phones. The rAF loop still ticks so input stays responsive,
      // but the GPU only redraws every other frame.
      if (frameBudgetMs && ts - lastDraw < frameBudgetMs) return;
      lastDraw = ts;

      const t = (ts - start) / 1000;

      cur.x += (target.x - cur.x) * 0.06;
      cur.y += (target.y - cur.y) * 0.06;
      cur.amp += (target.amp - cur.amp) * 0.05;
      scrollCur += (scrollTarget - scrollCur) * 0.08;

      draw(t);
    };

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const play = () => {
      if (raf || disposed || document.hidden || reduced.matches) return;
      raf = requestAnimationFrame(frame);
    };

    resize();

    if (reduced.matches) {
      // One representative frame, mid-undulation. No loop, no pointer coupling.
      scrollCur = 0;
      draw(6);
    } else {
      play();
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("pointerleave", onLeave, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    }

    const onVis = () => (document.hidden ? stop() : play());
    document.addEventListener("visibilitychange", onVis);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        if (reduced.matches) draw(6);
      }, 140);
    };
    window.addEventListener("resize", onResize);

    const themeObserver = new MutationObserver(() => {
      readTheme();
      if (reduced.matches) draw(6);
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onMotionPref = () => {
      stop();
      if (reduced.matches) draw(6);
      else play();
    };
    reduced.addEventListener("change", onMotionPref);

    const onLost = (e: Event) => {
      e.preventDefault();
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      disposed = true;
      stop();
      clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      reduced.removeEventListener("change", onMotionPref);
      canvas.removeEventListener("webglcontextlost", onLost);
      themeObserver.disconnect();
      if (vao) gl.deleteVertexArray(vao);
      if (gridBuf) gl.deleteBuffer(gridBuf);
      if (lineIdx) gl.deleteBuffer(lineIdx);
      if (pointIdx) gl.deleteBuffer(pointIdx);
      if (program) gl.deleteProgram(program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-no-spark
      /* inset-0 already fills the viewport. `w-screen h-screen` (100vw/100vh)
         would overshoot by the scrollbar width and reintroduce overflow. */
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
