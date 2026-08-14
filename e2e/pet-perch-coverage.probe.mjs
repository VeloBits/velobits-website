/**
 * Diagnostic: at every scroll offset, is there anything for the pet to stand on?
 *
 * `edgeIsUsable` only accepts a perch whose TOP EDGE currently sits in a band
 * below the navbar and above the fold. If the page has a stretch taller than
 * that band with no card or section starting in it, there is no legal perch and
 * the pet is stuck riding an off-screen component — invisible.
 *
 * Run: node e2e/pet-perch-coverage.probe.mjs
 */
import { chromium } from "@playwright/test";

const URL = process.env.PET_URL ?? "http://localhost:3000/";

const browser = await chromium.launch({ args: ["--use-angle=swiftshader"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.goto(URL, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);

const out = await page.evaluate(() => {
  // Mirrors the component's own constants and offset-chain measurement.
  const NAV_SAFE_Y = 96;
  const PET_SOLE_Y = 49.6;
  const box = (el) => {
    let top = 0;
    let n = el;
    while (n) {
      top += n.offsetTop;
      n = n.offsetParent;
    }
    return { top, width: el.offsetWidth };
  };
  const perches = Array.from(document.querySelectorAll("[data-pet-perch], .card"))
    .filter((el) => el.offsetParent !== null)
    // className is an SVGAnimatedString on SVG elements, not a string.
    .map((el) => ({ ...box(el), tag: el.tagName + "." + String(el.classList).slice(0, 30) }))
    .sort((a, b) => a.top - b.top);

  const vh = window.innerHeight;
  const lo = NAV_SAFE_Y + PET_SOLE_Y; // 145.6
  const hi = vh - 24;
  const maxScroll = document.documentElement.scrollHeight - vh;

  const gaps = [];
  let run = null;
  for (let sy = 0; sy <= maxScroll; sy += 20) {
    const any = perches.some((p) => {
      const top = p.top - sy;
      return top >= lo && top <= hi && p.width >= 90;
    });
    if (!any) {
      if (!run) run = { from: sy, to: sy };
      else run.to = sy;
    } else if (run) {
      gaps.push(run);
      run = null;
    }
  }
  if (run) gaps.push(run);

  return {
    viewportH: vh,
    maxScroll,
    band: [lo, hi],
    perchCount: perches.length,
    // Anything whose offset chain does not produce a number is a perch the pet
    // can never evaluate — worth naming rather than counting.
    degenerate: perches
      .filter((p) => !Number.isFinite(p.top) || !Number.isFinite(p.width))
      .map((p) => ({ tag: p.tag, top: String(p.top), width: String(p.width) })),
    perchTops: perches.map((p) => p.top),
    deadZones: gaps.map((g) => ({ ...g, height: g.to - g.from })),
  };
});

console.log(JSON.stringify(out, null, 2));
await browser.close();
