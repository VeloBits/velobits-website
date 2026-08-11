"use client";

import { useEffect, useRef } from "react";

/**
 * A small creature that lives on the page: it hops between components as you
 * scroll, watches the cursor, reacts to what you hover, and startles when you
 * click.
 *
 * WHERE IT LANDS
 * --------------
 * Perches are real components — section wrappers (`[data-pet-perch]`) AND every
 * `.card`. It never tracks scroll position directly, because continuous
 * following reads as sliding rather than hopping. It picks the perch nearest a
 * reading line and launches a single parabolic hop only when that choice
 * changes, so fast scrolling gives a sequence of discrete jumps.
 *
 * WHAT IT REACTS TO
 * -----------------
 *   cursor moves    pupils track it, body leans toward it
 *   cursor near     looks up and waves
 *   hovering a
 *   link/button/card points at it with the near arm, mouth opens, bounces
 *   click           startles (squash + wide eyes + open mouth); clicking a
 *                   card or button makes it hop there
 *
 * All state is a handful of scalars lerped in ONE rAF loop, so adding reactions
 * costs no extra frames. Everything writes to `transform`/`opacity`/`d` only —
 * no layout is read inside the loop except a throttled perch measure.
 *
 * ON TOUCH
 * --------
 * It runs on phones too, scaled down and biased toward card corners so it
 * perches rather than covers. With no cursor to follow its eyes wander on their
 * own, and `attention` times out because a tap fires pointerover with no
 * matching pointerout.
 *
 * Decorative throughout: aria-hidden, pointer-events:none, and under
 * prefers-reduced-motion it sits still instead of hopping.
 */

const HOP_MS = 620;
const PERCH_SELECTOR = "[data-pet-perch], .card";
const INTERACTIVE_SELECTOR = "a, button, [role='button'], .card, input, textarea";
const NEAR_DIST = 150; // px from pet before it notices you

/* Pet geometry, in the same units as the SVG viewBox (which is also CSS px
   because width/height match). These exist so the pet stands ON a surface
   rather than near it: the soles are at y=49.6 in a 52-tall box, so placing the
   box at `surfaceTop - 49.6` puts the feet exactly on the edge. */
const PET_CENTER_X = 24;
const PET_SOLE_Y = 49.6;
const NAV_SAFE_Y = 96; // don't perch behind the floating navbar

/* Landing spots are a FRACTION of each perch's width, not a fixed inset from
   its left edge. Every card and section shares the container's left padding, so
   an inset put the pet in the same column every time — which is why it only
   ever appeared on the left. Fractions cycle per perch, so the pet walks across
   the page, and because they are relative they adapt to any column count or
   viewport width for free. */
const LANDING_FRACTIONS = [0.16, 0.52, 0.84, 0.34, 0.68];

/* On a phone, cards are full-width and the column is narrow, so a mid-width
   landing spot would sit on top of the card's own text. Small screens bias the
   pet toward the corners instead, where it reads as perched on the card rather
   than covering it. */
const LANDING_FRACTIONS_SM = [0.12, 0.88, 0.18, 0.82];

/* Scaled down on small screens: at full size the pet occupies a meaningful
   share of a 390px column. */
const SMALL_SCREEN = 640;
const SCALE_SM = 0.74;

const MOUTH = {
  smile: "M20.2 34.5 q3.8 3.8 7.6 0",
  grin: "M19.4 33.8 q4.6 5.6 9.2 0",
  flat: "M20.6 35.2 h6.8",
};

export default function ScrollPet() {
  const rootRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const shadow = shadowRef.current;
    if (!root) return;

    // Touch devices get the pet too, but it has to behave differently: there is
    // no persistent cursor to follow and no hover state, so eye-tracking falls
    // back to an idle wander and `attention` has to time out (a tap fires
    // pointerover with no matching pointerout).
    const isTouch = !window.matchMedia("(pointer: fine)").matches;

    const q = <T extends Element>(s: string) => root.querySelector<T>(s);
    const body = q<SVGGElement>("[data-pet-body]");
    const armL = q<SVGGElement>("[data-pet-arm-l]");
    const armR = q<SVGGElement>("[data-pet-arm-r]");
    const legL = q<SVGGElement>("[data-pet-leg-l]");
    const legR = q<SVGGElement>("[data-pet-leg-r]");
    const pupilL = q<SVGGElement>("[data-pet-pupil-l]");
    const pupilR = q<SVGGElement>("[data-pet-pupil-r]");
    const eyeL = q<SVGCircleElement>("[data-pet-eye-l]");
    const eyeR = q<SVGCircleElement>("[data-pet-eye-r]");
    const lids = root.querySelectorAll<SVGRectElement>("[data-pet-lid]");
    const mouth = q<SVGPathElement>("[data-pet-mouth]");
    const mouthOpen = q<SVGEllipseElement>("[data-pet-mouth-open]");
    const antenna = q<SVGCircleElement>("[data-pet-antenna]");
    if (!body || !mouth || !mouthOpen) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    // ── perches ──────────────────────────────────────────────────────────
    let perches: HTMLElement[] = [];
    const collect = () => {
      perches = Array.from(document.querySelectorAll<HTMLElement>(PERCH_SELECTOR)).filter(
        (el) => el.offsetParent !== null
      );
    };
    collect();
    if (!perches.length) return;

    /** Uniform scale for the whole pet, recomputed on resize. */
    let scale = 1;
    const syncScale = () => {
      scale = document.documentElement.clientWidth < SMALL_SCREEN ? SCALE_SM : 1;
    };
    syncScale();

    /**
     * The GROUND point the pet stands on: a spot along the top edge of a perch,
     * clamped horizontally so the body stays on screen at any viewport width.
     * Returned in ground coords (where the soles go), not box coords.
     */
    const groundOf = (el: HTMLElement, i: number) => {
      const r = el.getBoundingClientRect();
      const table =
        document.documentElement.clientWidth < SMALL_SCREEN
          ? LANDING_FRACTIONS_SM
          : LANDING_FRACTIONS;
      const frac = table[i % table.length];
      const gx = r.left + r.width * frac;
      const halfW = PET_CENTER_X * scale;
      return {
        // x is clamped so the body never leaves the viewport…
        gx: Math.max(halfW + 6, Math.min(gx, document.documentElement.clientWidth - halfW - 6)),
        // …but y is NOT clamped. Clamping y is what made the pet float in
        // mid-air: if the chosen edge had scrolled away, the clamp parked it at
        // an arbitrary height standing on nothing. Only edges that are actually
        // on screen are eligible (see chooseIndex), so no clamp is needed and
        // the soles are always genuinely on a surface.
        gy: r.top,
      };
    };

    /** Is this perch's TOP EDGE somewhere the pet could actually stand? */
    const edgeIsUsable = (r: DOMRect) =>
      r.top >= NAV_SAFE_Y + PET_SOLE_Y * scale && r.top <= window.innerHeight - 24 && r.width >= 90;

    /** Returns -1 when nothing is standable, meaning "stay where you are". */
    const chooseIndex = () => {
      const line = window.innerHeight * 0.4;
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < perches.length; i++) {
        const r = perches[i].getBoundingClientRect();
        if (!edgeIsUsable(r)) continue;
        const d = Math.abs(r.top - line);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    };

    // ── animation state ──────────────────────────────────────────────────
    let fromX = 0,
      fromY = 0,
      toX = 0,
      toY = 0;
    let hopStart = -1;
    let currentIndex = -1;
    let facing = 1;
    let landedAt = -Infinity;
    let raf = 0;
    let blinkUntil = 0;
    let nextBlink = 0;
    let scrollDirty = true;

    // Interaction state — each is a 0..1 scalar lerped toward a target.
    const px = { cur: 0, tgt: 0 }; // pointer x, normalised -1..1 around pet
    const py = { cur: 0, tgt: 0 };
    const attention = { cur: 0, tgt: 0 }; // hovering something interactive
    const nearness = { cur: 0, tgt: 0 }; // cursor is close to the pet
    let startleAt = -Infinity;
    let cheerAt = -Infinity;
    let pointDir = 0; // -1 target left, +1 target right

    let mouseX = -9999;
    let mouseY = -9999;
    let lastPointerAt = -Infinity;

    /**
     * Position the pet BOX from a ground point, so the soles land on it.
     *
     * transform-origin is 0 0 (see `origin-top-left` on the element), so a point
     * (px,py) in the box maps to (tx + scale*px, ty + scale*py). Solving for the
     * soles landing on `gy` and the centre sitting on `gx` gives the offsets
     * below — which is why they are multiplied by scale.
     */
    const place = (gx: number, gy: number, lift: number) => {
      const tx = gx - PET_CENTER_X * scale;
      const ty = gy - PET_SOLE_Y * scale - lift;
      root.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(1)}px, 0) scale(${scale})`;
    };

    /** The shadow stays on the surface: no lift, and it shrinks with altitude.
     *  Its transform-origin is the default centre, so the translate that centres
     *  it on (gx,gy) is independent of the scale applied afterwards. */
    const placeShadow = (gx: number, gy: number, airborne: number) => {
      if (!shadow) return;
      const k = scale * (1 - airborne * 0.55);
      shadow.style.transform = `translate3d(${(gx - 13).toFixed(1)}px, ${(gy - 3.5).toFixed(1)}px, 0) scaleX(${k.toFixed(3)}) scaleY(${(k * 0.85).toFixed(3)})`;
      shadow.style.opacity = (0.95 - airborne * 0.62).toFixed(3);
    };

    const launch = (gx: number, gy: number, now: number) => {
      if (Math.hypot(gx - toX, gy - toY) < 6) return;
      fromX = toX;
      fromY = toY;
      toX = gx;
      toY = gy;
      facing = toX >= fromX ? 1 : -1;
      hopStart = now;
    };

    const settleTo = (idx: number, instant: boolean, now: number) => {
      const { gx, gy } = groundOf(perches[idx], idx);
      if (instant) {
        fromX = toX = gx;
        fromY = toY = gy;
        place(gx, gy, 0);
        placeShadow(gx, gy, 0);
        return;
      }
      launch(gx, gy, now);
    };

    /** Hop to an arbitrary element (used when you click a card/button). */
    const hopToElement = (el: HTMLElement, now: number) => {
      const idx = perches.indexOf(el);
      const { gx, gy } = groundOf(el, idx >= 0 ? idx : 0);
      launch(gx, gy, now);
      currentIndex = -1; // let scroll re-decide afterwards
    };

    // ── input ────────────────────────────────────────────────────────────
    const onScroll = () => {
      scrollDirty = true;
    };

    const onMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      lastPointerAt = performance.now();
    };

    let attentionTimer: ReturnType<typeof setTimeout>;
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const hit = t?.closest?.(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!hit) {
        attention.tgt = 0;
        return;
      }
      attention.tgt = 1;
      const r = hit.getBoundingClientRect();
      pointDir = r.left + r.width / 2 >= toX ? 1 : -1;
      // Touch fires pointerover on tap with no matching pointerout, so the
      // excited state would latch on forever. Time it out instead.
      if (isTouch) {
        clearTimeout(attentionTimer);
        attentionTimer = setTimeout(() => {
          attention.tgt = 0;
        }, 1100);
      }
    };

    const onDown = (e: PointerEvent) => {
      startleAt = performance.now();
      const t = e.target as HTMLElement | null;
      const hit = t?.closest?.(".card, a, button, [role='button']") as HTMLElement | null;
      if (hit) {
        cheerAt = performance.now();
        // Only chase real components, not every stray link in a paragraph.
        if (hit.matches(".card, button, [role='button']") || hit.classList.contains("btn")) {
          hopToElement(hit, performance.now());
        }
      }
    };

    // ── frame ────────────────────────────────────────────────────────────
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      if (scrollDirty) {
        scrollDirty = false;
        const idx = chooseIndex();
        // -1 means nothing is standable right now: hold position rather than
        // hopping to somewhere the pet couldn't actually stand.
        if (idx !== -1 && idx !== currentIndex) {
          currentIndex = idx;
          settleTo(idx, false, now);
        }
      }

      // RIDE the perch: re-read the live edge every frame so the pet travels
      // with its component as the page scrolls, instead of standing at a stale
      // coordinate the component has already moved away from.
      if (currentIndex !== -1 && perches[currentIndex]) {
        const live = groundOf(perches[currentIndex], currentIndex);
        toX = live.gx;
        toY = live.gy;
        if (hopStart < 0) {
          fromX = toX;
          fromY = toY;
        }
      }

      // Ground position (where the soles are) and altitude above it, tracked
      // separately so the shadow can stay on the surface through the whole arc.
      let gx = toX;
      let gy = toY;
      let lift = 0;
      let squash = 1;
      let stretch = 1;
      let swing = 0;
      let airborne = 0;

      if (hopStart >= 0) {
        const t = Math.min(1, (now - hopStart) / HOP_MS);
        const e = 1 - Math.pow(1 - t, 3);
        gx = fromX + (toX - fromX) * e;
        gy = fromY + (toY - fromY) * e;
        const arc = Math.sin(Math.PI * t);
        const dist = Math.hypot(toX - fromX, toY - fromY);
        lift = arc * Math.min(120, 46 + dist * 0.12);
        airborne = arc;
        stretch = 1 + arc * 0.16;
        squash = 1 - arc * 0.1;
        swing = Math.sin(t * Math.PI * 2) * 26;
        if (t >= 1) {
          hopStart = -1;
          landedAt = now;
          gx = toX;
          gy = toY;
          lift = 0;
        }
      } else {
        const since = now - landedAt;
        if (since < 460) {
          const k = 1 - since / 460;
          const w = Math.sin((since / 460) * Math.PI * 3) * k;
          squash = 1 + w * 0.16;
          stretch = 1 - w * 0.12;
          swing = w * 14;
        } else {
          const breath = Math.sin(now / 900) * 0.02;
          squash = 1 + breath;
          stretch = 1 - breath;
          swing = Math.sin(now / 1100) * 4;
        }
      }

      // Click startle: a sharp squash that decays fast.
      const sinceClick = now - startleAt;
      if (sinceClick < 380) {
        const k = 1 - sinceClick / 380;
        const s = Math.sin((sinceClick / 380) * Math.PI * 2) * k;
        squash += s * 0.2;
        stretch -= s * 0.16;
      }

      // Pointer coupling — normalised around the pet's own position.
      const petCx = gx;
      const petCy = gy - PET_SOLE_Y - lift + 26;
      const dx = mouseX - petCx;
      const dy = mouseY - petCy;
      // With no live pointer — touch, or a mouse that has been still — the pet
      // looks around on its own rather than staring at a stale coordinate
      // (which, at mouseX = -9999, pegged its eyes hard left forever).
      const pointerStale = now - lastPointerAt > 2600;
      if (pointerStale) {
        px.tgt = Math.sin(now / 1900) * 0.55;
        py.tgt = Math.sin(now / 2400) * 0.35;
        nearness.tgt = 0;
      } else {
        px.tgt = Math.max(-1, Math.min(1, dx / 260));
        py.tgt = Math.max(-1, Math.min(1, dy / 220));
        nearness.tgt = Math.hypot(dx, dy) < NEAR_DIST ? 1 : 0;
      }

      px.cur += (px.tgt - px.cur) * 0.12;
      py.cur += (py.tgt - py.cur) * 0.12;
      attention.cur += (attention.tgt - attention.cur) * 0.1;
      nearness.cur += (nearness.tgt - nearness.cur) * 0.09;

      const cheering = now - cheerAt < 700;
      const cheer = cheering ? Math.sin(((now - cheerAt) / 700) * Math.PI * 3) : 0;

      // Excited bob while hovering something or celebrating a click.
      const bob = attention.cur * Math.sin(now / 220) * 1.6 + cheer * 2.2;

      place(gx, gy, lift + bob);
      placeShadow(gx, gy, airborne);

      // Body leans toward the cursor; facing flips on hop direction.
      const lean = px.cur * 4 * (1 - airborne);
      body.setAttribute(
        "transform",
        `translate(24 30) rotate(${lean.toFixed(2)}) scale(${(squash * facing).toFixed(3)} ${stretch.toFixed(3)}) translate(-24 -30)`
      );

      // Arms: one points at whatever is hovered; both wave when you come close.
      const wave = nearness.cur * Math.sin(now / 90) * 34;
      const pointL = attention.cur * (pointDir < 0 ? -62 : 0);
      const pointR = attention.cur * (pointDir > 0 ? 62 : 0);
      armL?.setAttribute(
        "transform",
        `rotate(${(-swing - airborne * 34 + pointL - wave).toFixed(1)} 11 28)`
      );
      armR?.setAttribute(
        "transform",
        `rotate(${(swing + airborne * 34 + pointR + wave).toFixed(1)} 37 28)`
      );
      legL?.setAttribute("transform", `rotate(${(swing * 0.7 + airborne * 22).toFixed(1)} 18 41)`);
      legR?.setAttribute("transform", `rotate(${(-swing * 0.7 - airborne * 22).toFixed(1)} 30 41)`);

      // Pupils track the cursor inside the eye whites.
      const pxo = (px.cur * 1.7).toFixed(2);
      const pyo = (py.cur * 1.2 - airborne * 0.6).toFixed(2);
      pupilL?.setAttribute("transform", `translate(${pxo} ${pyo})`);
      pupilR?.setAttribute("transform", `translate(${pxo} ${pyo})`);

      // Eyes widen mid-hop, on click, and while paying attention.
      const wide = 4.1 + airborne * 0.5 + (sinceClick < 380 ? 0.7 : 0) + attention.cur * 0.35;
      eyeL?.setAttribute("r", wide.toFixed(2));
      eyeR?.setAttribute("r", wide.toFixed(2));

      // Mouth: open when airborne or startled, grin when excited, else smile.
      const open = airborne > 0.25 || sinceClick < 300;
      mouthOpen.setAttribute("opacity", open ? "1" : "0");
      mouth.setAttribute("opacity", open ? "0" : "1");
      if (!open)
        mouth.setAttribute("d", attention.cur > 0.5 || cheering ? MOUTH.grin : MOUTH.smile);

      // Antenna bulb pulses when the pet is engaged.
      antenna?.setAttribute("r", (2.6 + attention.cur * 0.9 + Math.max(0, cheer) * 0.6).toFixed(2));

      if (now > nextBlink) {
        blinkUntil = now + 120;
        nextBlink = now + 2200 + Math.random() * 3800;
      }
      const blinking = now < blinkUntil;
      lids.forEach((l) => l.setAttribute("opacity", blinking ? "1" : "0"));
    };

    /** Seat the pet immediately, tolerating "nothing standable yet". */
    const seat = () => {
      const idx = chooseIndex();
      currentIndex = idx;
      if (idx === -1) {
        // Nothing on screen to stand on (e.g. very short viewport): park it in
        // a sane visible spot and let the first usable edge pull it in.
        const gx = Math.min(120, window.innerWidth * 0.12);
        const gy = NAV_SAFE_Y + PET_SOLE_Y;
        fromX = toX = gx;
        fromY = toY = gy;
        place(gx, gy, 0);
        placeShadow(gx, gy, 0);
        return;
      }
      settleTo(idx, true, performance.now());
    };

    seat();
    root.style.opacity = "1";
    if (shadow) shadow.style.opacity = "0.95";

    if (reduced.matches) {
      // Static, friendly, no loop and no input coupling.
      mouth.setAttribute("d", MOUTH.smile);
      return () => {};
    }

    nextBlink = performance.now() + 1400;
    raf = requestAnimationFrame(frame);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    // Re-seat on resize AND on layout changes that don't fire resize (font
    // load, image reflow, a card grid changing column count at a breakpoint).
    let reseatTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(reseatTimer);
      reseatTimer = setTimeout(() => {
        syncScale();
        collect();
        seat();
      }, 90);
    };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    // Cards can mount later (Suspense, client fetches) — keep perches fresh.
    const mo = new MutationObserver(() => {
      collect();
      scrollDirty = true;
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      mo.disconnect();
      ro.disconnect();
      clearTimeout(reseatTimer);
      clearTimeout(attentionTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <>
      {/* Contact shadow — a separate fixed layer, NOT part of the SVG. It has to
          stay on the surface while the pet arcs above it; a shadow inside the
          pet would travel with the body and read as a sticker. */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-59 block h-1.75 w-6.5 rounded-[50%] bg-(--pet-shadow) blur-[2.5px] will-change-transform"
      />
      {/* origin-top-left is required by place(): the offsets are computed
          assuming a 0 0 transform origin so scale and translate compose. */}
      <div
        ref={rootRef}
        aria-hidden="true"
        style={{ opacity: 0 }}
        className="pointer-events-none fixed top-0 left-0 z-60 block origin-top-left will-change-transform"
      >
        <svg width="48" height="52" viewBox="0 0 48 52" fill="none">
          <g data-pet-body>
            <g data-pet-leg-l>
              <rect x="15.5" y="38" width="4" height="9" rx="2" className="fill-(--pet-limb)" />
              <ellipse cx="17.5" cy="47.4" rx="3.6" ry="2.2" className="fill-(--pet-limb)" />
            </g>
            <g data-pet-leg-r>
              <rect x="28.5" y="38" width="4" height="9" rx="2" className="fill-(--pet-limb)" />
              <ellipse cx="30.5" cy="47.4" rx="3.6" ry="2.2" className="fill-(--pet-limb)" />
            </g>

            <g data-pet-arm-l>
              <rect x="8.5" y="26" width="3.6" height="10" rx="1.8" className="fill-(--pet-limb)" />
              <circle cx="10.3" cy="36.4" r="2.6" className="fill-(--pet-limb)" />
            </g>
            <g data-pet-arm-r>
              <rect
                x="35.9"
                y="26"
                width="3.6"
                height="10"
                rx="1.8"
                className="fill-(--pet-limb)"
              />
              <circle cx="37.7" cy="36.4" r="2.6" className="fill-(--pet-limb)" />
            </g>

            <path
              d="M24 14 L24 8"
              className="stroke-(--pet-limb)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle data-pet-antenna cx="24" cy="6.4" r="2.6" className="fill-(--pet-accent)" />

            <rect
              x="9"
              y="13"
              width="30"
              height="27"
              rx="10"
              className="fill-(--pet-shell) stroke-(--pet-edge)"
              strokeWidth="1.6"
            />

            <g>
              <circle data-pet-eye-l cx="18.6" cy="26" r="4.1" className="fill-(--pet-eye-bg)" />
              <g data-pet-pupil-l>
                <circle cx="18.6" cy="26" r="2.1" className="fill-(--pet-pupil)" />
                <circle cx="19.5" cy="25.1" r="0.75" className="fill-(--pet-glint)" />
              </g>
              <rect
                data-pet-lid
                x="14.1"
                y="21.4"
                width="9"
                height="5"
                rx="2.4"
                opacity="0"
                className="fill-(--pet-shell)"
              />
            </g>
            <g>
              <circle data-pet-eye-r cx="29.4" cy="26" r="4.1" className="fill-(--pet-eye-bg)" />
              <g data-pet-pupil-r>
                <circle cx="29.4" cy="26" r="2.1" className="fill-(--pet-pupil)" />
                <circle cx="30.3" cy="25.1" r="0.75" className="fill-(--pet-glint)" />
              </g>
              <rect
                data-pet-lid
                x="24.9"
                y="21.4"
                width="9"
                height="5"
                rx="2.4"
                opacity="0"
                className="fill-(--pet-shell)"
              />
            </g>

            {/* Two mouths, toggled by opacity: a stroked curve and a filled "o".
              Swapping `d` between a stroke and a fill shape does not work. */}
            <path
              data-pet-mouth
              d={MOUTH.smile}
              className="stroke-(--pet-mouth)"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse
              data-pet-mouth-open
              cx="24"
              cy="35.4"
              rx="2.6"
              ry="3"
              opacity="0"
              className="fill-(--pet-mouth)"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
