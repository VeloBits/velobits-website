"use client";

import { useEffect } from "react";

/**
 * One IntersectionObserver for the entire page.
 *
 * Every section used to construct its own observer and drive reveals with
 * `setTimeout(i * 110)`. That meant five observers, five slightly different
 * thresholds, and stagger that drifted whenever the main thread was busy —
 * timers are not frame-aligned.
 *
 * Here a single observer marks elements `is-in`, and the stagger is expressed
 * as a CSS `transition-delay` derived from the element's index within its
 * group. The delay is therefore compositor-driven and exact.
 *
 * Usage:
 *   <div data-reveal>…</div>                     one element
 *   <div data-reveal-group>                      children stagger in order
 *     <p data-reveal>…</p>
 *     <p data-reveal>…</p>
 *   </div>
 *
 * Elements are unobserved once revealed — this never re-hides on scroll-up,
 * which is the behaviour that makes long pages feel unstable.
 */
export default function ScrollReveal() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const revealAll = () => {
      document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
    };

    // Reduced motion: show everything immediately, never observe.
    if (reduced.matches) {
      revealAll();
      return;
    }

    const assignIndex = (el: Element) => {
      const group = el.closest("[data-reveal-group]");
      if (!group) return 0;
      const sibs = Array.from(group.querySelectorAll("[data-reveal]"));
      return Math.min(sibs.indexOf(el), 8); // cap so late items don't crawl in
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.style.setProperty("--reveal-i", String(assignIndex(el)));
          el.classList.add("is-in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    const observe = () => {
      document
        .querySelectorAll("[data-reveal]:not(.is-in)")
        .forEach((el) => io.observe(el));
    };
    observe();

    // Sections can arrive later (Suspense boundaries, client fetches).
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    const onPrefChange = () => {
      if (reduced.matches) {
        io.disconnect();
        mo.disconnect();
        revealAll();
      }
    };
    reduced.addEventListener("change", onPrefChange);

    return () => {
      io.disconnect();
      mo.disconnect();
      reduced.removeEventListener("change", onPrefChange);
    };
  }, []);

  return null;
}
