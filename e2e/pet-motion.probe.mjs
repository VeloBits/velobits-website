/**
 * Motion probe for ScrollPet. Not a spec — a measuring instrument.
 *
 * It samples the pet's transform every animation frame in a real browser and
 * reports the numbers the bug is actually about:
 *   - does the pet move WHILE the page is scrolling? (it must not)
 *   - how many hops does a long scroll cost? (one, not one per component)
 *   - is any on-screen move continuous, or is it a teleport?
 *   - does the pet end up visible?
 *   - does a click animate it without moving it?
 *
 * Two things this file has to get right to be worth trusting:
 *   1. Every case starts from a VERIFIED stationary state, not a hoped-for
 *      timeout. Otherwise one case's unfinished hop is measured as the next
 *      case's result.
 *   2. Scrolling is driven with `behavior: instant`. The page sets
 *      `html { scroll-behavior: smooth }`, so an ordinary scrollBy animates and
 *      re-issuing it per frame restarts the animation — 110 calls of 12px moved
 *      the page 172px. Real wheel/trackpad input ignores scroll-behavior.
 *
 * Run against a production build (`npm run build && npm start`):
 *   node e2e/pet-motion.probe.mjs
 */
import { chromium } from "@playwright/test";

const URL = process.env.PET_URL ?? "http://localhost:3000/";
const VIEWPORT = { width: 1280, height: 800 };

const PET_SEL = '[aria-hidden="true"].origin-top-left';

/** Read the pet's translate3d out of its inline style, in the page. */
const READ_POS = (sel) => {
  const el = document.querySelector(sel);
  const m = /translate3d\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px/.exec(el?.style.transform || "");
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : null;
};

/**
 * Install a per-frame recorder.
 *
 * Parses the INLINE style rather than calling getComputedStyle, which would
 * force a style recalculation every frame and make the probe the slowest thing
 * on the page — measuring the instrument instead of the app.
 */
const RECORDER = (sel) => {
  const el = document.querySelector(sel);
  if (!el) throw new Error("pet element not found");
  // Stop any previous recorder: each owns a self-perpetuating rAF chain, so
  // without this every case leaves another loop running for the whole session.
  window.__petProbe?.stop();
  const samples = [];
  let stop = false;
  const tick = () => {
    if (stop) return;
    const m = /translate3d\(\s*(-?[\d.]+)px,\s*(-?[\d.]+)px/.exec(el.style.transform || "");
    if (m)
      samples.push({
        t: performance.now(),
        x: parseFloat(m[1]),
        y: parseFloat(m[2]),
        sy: window.scrollY,
      });
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
  window.__petProbe = {
    stop: () => {
      stop = true;
      return samples;
    },
  };
};

const analyse = (samples, viewportH) => {
  let maxJump = 0; // page-space, including moves made off screen
  let maxVisibleJump = 0; // page-space, but only where the user could SEE it
  let worst = null;
  let movedDuringScroll = 0;
  let scrollFrames = 0;
  const dts = [];
  // The pet box is 52 tall; treat it as visible only if some of it is in view.
  const onScreen = (s) => s.y > -52 && s.y < viewportH;

  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1];
    const b = samples[i];
    const dx = b.x - a.x;
    // Undo the scroll: while the pet rides a component its viewport position
    // changes every frame but its PAGE position does not. Only real motion
    // survives this subtraction, so a hop cannot hide inside a fast scroll.
    const dy = b.y - a.y + (b.sy - a.sy);
    const d = Math.hypot(dx, dy);
    const dt = b.t - a.t;
    const scrolled = Math.abs(b.sy - a.sy);
    dts.push(dt);
    if (scrolled > 4) {
      scrollFrames++;
      movedDuringScroll = Math.max(movedDuringScroll, d);
    }
    if (d > maxJump) maxJump = d;
    // The distinction that matters: repositioning the pet while it is off screen
    // is invisible and deliberate (it is how it leaps back in from the edge).
    // Repositioning it while on screen is the teleport bug.
    if (onScreen(a) && onScreen(b) && d > maxVisibleJump) {
      maxVisibleJump = d;
      // A big delta over a long frame is ordinary motion sampled coarsely; a big
      // delta over a SHORT frame is a teleport. Only the implied speed tells
      // them apart, so keep it.
      worst = { px: +d.toFixed(1), overMs: +dt.toFixed(1), pxPerSec: Math.round(d / (dt / 1000)) };
    }
  }
  /* Count hops by SPEED, not by per-frame distance, and allow a gap before
     calling a hop finished.
     A per-frame threshold is frame-rate dependent — at 128fps the same hop moves
     a quarter as far per frame as at 32fps — and the easing is smoothstep, which
     starts and ends at zero velocity. So a single hop dipped under any fixed
     per-frame threshold at both ends and got counted as several. The same run
     reported 1, 4 and 6 hops on three passes purely from frame-rate drift. */
  let hops = 0;
  let movingSince = -1;
  let idleFor = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1];
    const b = samples[i];
    const dt = Math.max(1, b.t - a.t);
    const speed = (Math.hypot(b.x - a.x, b.y - a.y + (b.sy - a.sy)) / dt) * 1000;
    if (speed > 40) {
      if (movingSince < 0) hops++;
      movingSince = b.t;
      idleFor = 0;
    } else if (movingSince >= 0) {
      idleFor += dt;
      if (idleFor > 180) movingSince = -1; // hop over
    }
  }
  dts.sort((x, y) => x - y);
  const last = samples[samples.length - 1] ?? {};
  const first = samples[0] ?? {};
  return {
    frames: samples.length,
    // How long the recorder actually covered. A window that closes before the
    // pet has had time to decide reports "it never moved" for a pet that was
    // about to move, so this number has to be checked against the behaviour
    // being measured (settle delay + hop can take ~1.2s).
    spanMs: +((last.t ?? 0) - (first.t ?? 0)).toFixed(0),
    scrollFrames,
    medianFrameMs: +(dts[Math.floor(dts.length / 2)] ?? 0).toFixed(1),
    p95FrameMs: +(dts[Math.floor(dts.length * 0.95)] ?? 0).toFixed(1),
    hops,
    movedDuringScroll: +movedDuringScroll.toFixed(2),
    maxVisibleJump: +maxVisibleJump.toFixed(1),
    worstVisible: worst,
    endedOnScreen: last.y !== undefined ? last.y > -52 && last.y < viewportH : null,
    endY: last.y,
  };
};

const run = async () => {
  // Headless Chromium paces rAF off a virtual display and lands near 15fps,
  // which inflates every per-frame delta ~4x and makes "teleport vs. coarse
  // sample" undecidable. These flags let it run unthrottled.
  const browser = await chromium.launch({
    args: [
      "--disable-frame-rate-limit",
      "--disable-gpu-vsync",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  });
  const page = await browser.newPage({ viewport: VIEWPORT });
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.evaluate((src) => {
    window.__read = new Function("sel", `return (${src})(sel)`);
  }, READ_POS.toString());

  /**
   * Block until the pet has actually stopped moving.
   *
   * `minMs` is not padding — it is required for correctness. After an INSTANT
   * scroll the pet is already stationary (it rides its component, and the page
   * is no longer moving), so a pure quiet-detector returns immediately and the
   * measurement window closes before the pet has decided anything. The minimum
   * has to cover the settle delay plus a full-length hop.
   */
  const waitStill = async (quietMs = 500, minMs = 1800, timeoutMs = 9000) => {
    const t0 = Date.now();
    let last = null;
    let stillSince = Date.now();
    while (Date.now() - t0 < timeoutMs) {
      const p = await page.evaluate(READ_POS, PET_SEL);
      if (!p) return false;
      if (last && Math.hypot(p.x - last.x, p.y - last.y) < 0.5) {
        if (Date.now() - stillSince >= quietMs && Date.now() - t0 >= minMs) return true;
      } else {
        stillSince = Date.now();
      }
      last = p;
      await page.waitForTimeout(60);
    }
    return false;
  };

  /** Put the page at a known offset and wait for the pet to settle there. */
  const resetTo = async (y) => {
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await waitStill();
  };

  const results = {};

  // Control: how fast does rAF tick here at all? Without it, frame timings
  // below are unattributable — app cost and environment cost look identical.
  const control = await browser.newPage();
  await control.goto("about:blank");
  results.controlFrameMs = await control.evaluate(
    () =>
      new Promise((res) => {
        const ts = [];
        const tick = (t) => {
          ts.push(t);
          if (ts.length < 40) requestAnimationFrame(tick);
          else {
            const d = ts
              .slice(1)
              .map((v, i) => v - ts[i])
              .sort((a, b) => a - b);
            res(+d[Math.floor(d.length / 2)].toFixed(1));
          }
        };
        requestAnimationFrame(tick);
      })
  );
  await control.close();

  /**
   * Scroll continuously for `ms`, moving `pxPerFrame` each frame, then stop.
   * This is the shape of a real drag / held Page Down: no gap that could be
   * mistaken for a stop.
   */
  const continuousCase = async (pxPerSec, ms) => {
    await resetTo(0);
    await page.evaluate(RECORDER, PET_SEL);
    await page.evaluate(
      ([speed, dur]) =>
        new Promise((res) => {
          // Time-based, NOT per-frame. With the frame-rate cap lifted this
          // browser ran at 130fps in one run and 50fps in another, so a
          // per-frame step made the "slow" case scroll twice as fast as the
          // "fast" case was meant to and the results were not comparable.
          const t0 = performance.now();
          const y0 = window.scrollY;
          const tick = () => {
            const el = performance.now() - t0;
            window.scrollTo({ top: y0 + (speed * el) / 1000, behavior: "instant" });
            if (el < dur) requestAnimationFrame(tick);
            else res();
          };
          requestAnimationFrame(tick);
        }),
      [pxPerSec, ms]
    );
    const still = await waitStill(); // let it commit its one hop
    const r = analyse(await page.evaluate(() => window.__petProbe.stop()), VIEWPORT.height);
    // Read the resting position directly rather than trusting the last sample:
    // the recorder can stop just before a hop begins, which would report the
    // pet as stranded when it was one frame from recovering.
    const fin = await page.evaluate(READ_POS, PET_SEL);
    r.settled = still;
    r.finalY = fin?.y;
    r.finalOnScreen = fin ? fin.y > -52 && fin.y < VIEWPORT.height : null;
    return r;
  };

  results.continuousSlow = await continuousCase(750, 1600); // reading pace
  results.continuousFast = await continuousCase(3600, 1600); // a real fling

  // Jump straight to the very bottom — the scroll destination most likely to
  // strand the pet, because the foot of the page has no standable component.
  await resetTo(0);
  await page.evaluate(RECORDER, PET_SEL);
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" })
  );
  await waitStill();
  results.jumpToBottom = analyse(
    await page.evaluate(() => window.__petProbe.stop()),
    VIEWPORT.height
  );
  {
    const fin = await page.evaluate(READ_POS, PET_SEL);
    results.jumpToBottom.finalY = fin?.y;
    results.jumpToBottom.finalOnScreen = fin ? fin.y > -52 && fin.y < VIEWPORT.height : null;
  }

  // Click must animate the pet without relocating it.
  await resetTo(0);
  const before = await page.evaluate(
    (sel) => ({ ...window.__read(sel), sy: window.scrollY }),
    PET_SEL
  );
  await page.evaluate(RECORDER, PET_SEL);
  await page.mouse.click(640, 400);
  await page.waitForTimeout(1500);
  const clickSamples = await page.evaluate(() => window.__petProbe.stop());
  const after = await page.evaluate(
    (sel) => ({ ...window.__read(sel), sy: window.scrollY }),
    PET_SEL
  );
  // Measure in PAGE space. The click can land on an in-page anchor, which
  // scrolls the document; the pet then rides its component and looks like it
  // moved 400px when it has not left the thing it is standing on.
  const ys = clickSamples.map((s) => s.y + s.sy);
  const xs = clickSamples.map((s) => s.x);
  results.click = {
    // Must end where it started: a click is a reaction, not a move.
    displacement: +Math.hypot(
      after.x - before.x,
      after.y + after.sy - (before.y + before.sy)
    ).toFixed(2),
    scrolledBy: after.sy - before.sy,
    // …but it must still ANIMATE. A bounce is vertical range with no horizontal
    // range; a hop would show both.
    verticalRange: +(Math.max(...ys) - Math.min(...ys)).toFixed(1),
    horizontalRange: +(Math.max(...xs) - Math.min(...xs)).toFixed(1),
  };

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
