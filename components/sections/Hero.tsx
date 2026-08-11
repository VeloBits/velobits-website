"use client";

import { useEffect, useRef } from "react";
import { getFeaturedProduct } from "@/lib/site-content";
import { CONTAINER } from "@/lib/ui-classes";


export default function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedProduct();
  const preview = featured.preview!;

  useEffect(() => {
    const onScroll = () => {
      if (glowRef.current)
        glowRef.current.setAttribute("style", `transform: translateY(${window.scrollY * 0.18}px);`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden pt-[7rem] pb-16 max-[960px]:pt-[5.5rem]"
    >
      {/* One ambient element, not eight.
          Previously: three coloured radial glows (lime + purple + blue) and five
          floating particles. The purple/blue were off-brand and went muddy on a
          light ground, and eight competing movements meant none of them read.
          The reference studios all commit to a single ambient gesture. */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-[-14%] left-[-8%] h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle,var(--accent-a08)_0%,transparent_62%)] blur-[90px]" />
      </div>

      <div
        className={`container ${CONTAINER} relative z-[1] w-full flex-1 flex flex-col justify-center`}
      >
        <div className="grid items-center gap-16 [grid-template-columns:1.15fr_1fr] max-[960px]:grid-cols-1 max-[960px]:gap-10">
          {/* Left: copy */}
          <div className="flex flex-col gap-[1.5rem] max-[960px]:items-center max-[960px]:text-center">
            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 animate-[pop-in_0.5s_ease_0.1s_both]"
              aria-hidden="true"
            >
              <span className="relative flex h-[7px] w-[7px] shrink-0">
                <span className="absolute inset-0 rounded-full bg-accent opacity-50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="inline-block h-[7px] w-[7px] rounded-full bg-accent" />
              </span>
              <span className="label-mono text-accent">FixMyText is launching soon</span>
            </div>

            {/* H1.
                Was two equal-weight lines with the second in accent — which made
                two-thirds of the headline an accent colour, so nothing read as
                emphasis. Now the product name carries the scale and the
                attribution steps down in size, weight and tone. The accent is
                spent on the CTA instead, where it converts. */}
            <h1 className="animate-[pop-in_0.6s_ease_0.2s_both] font-[var(--font-display)] leading-[0.9] font-extrabold tracking-[-0.035em] text-foreground uppercase">
              {/* The clamp MINIMUM has to fit the narrowest supported viewport.
                  At 2.9rem, "FIXMYTEXT" measured 451px wide inside a 390px
                  phone — the floor, not the vw term, was the overflow. */}
              <span className="block text-[clamp(2rem,6.2vw,5.6rem)]">FixMyText</span>
              <span className="mt-[0.55rem] block text-[clamp(0.95rem,1.35vw,1.25rem)] font-semibold tracking-[0.16em] text-muted">
                by Velobits
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-[42ch] animate-[pop-in_0.6s_ease_0.32s_both] text-[0.97rem] leading-[1.8] text-muted">
              254 text tools in one editor — case conversion, encoding, formatting, and 50+ AI tools
              for rewriting, summarizing, and analysis. Built by{" "}
              <span className="font-semibold text-foreground">Velobits</span>, runs right in your
              browser.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-[pop-in_0.6s_ease_0.42s_both] max-[960px]:justify-center">
              <a href="#waitlist" className="btn btn-primary">
                Join FixMyText Waitlist
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="#products" className="btn btn-ghost">
                See Product Preview
              </a>
            </div>

            {/* Feature list.
                Was four accent-bordered pills with a pulsing dot, wrapping to two
                rows directly under the CTA — four objects competing with the one
                thing that should win. Now a quiet hairline-ruled list: same
                information, no colour, no motion, reads as spec rather than
                decoration. */}
            <ul className="mt-2 flex flex-col gap-0 animate-[pop-in_0.6s_ease_0.52s_both] max-[960px]:mx-auto max-[960px]:max-w-[34ch]">
              {featured.features.map((tag) => (
                <li
                  key={tag}
                  className="flex items-baseline gap-3 border-t border-border-subtle py-[0.6rem] last:border-b"
                >
                  <span className="label-mono shrink-0 text-accent" aria-hidden="true">
                    +
                  </span>
                  <span className="text-[0.82rem] leading-[1.5] text-muted">{tag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: product preview */}
          <div
            className="relative animate-[pop-in_0.75s_ease_0.4s_both] [transform:perspective(1200px)_rotateY(-4deg)_rotateX(2deg)] [transition:transform_0.4s_ease] max-[960px]:mx-auto max-[960px]:w-full max-[960px]:max-w-[480px] max-[960px]:[transform:none] max-[480px]:max-w-full"
            aria-label="FixMyText product preview"
          >
            {/* Browser frame */}
            <div className="card relative mt-8 flex flex-col gap-3 px-5 pt-4 pb-5 bg-gradient-to-br from-accent/3 to-transparent transition-all duration-300 hover:-translate-y-2">
              {/* Browser chrome */}
              <div className="flex items-center gap-[0.35rem] border-b border-border-subtle pb-3">
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#ff5f57]"
                  aria-hidden="true"
                />
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#febc2e]"
                  aria-hidden="true"
                />
                <span
                  className="inline-block h-2 w-2 rounded-full bg-[#28c840]"
                  aria-hidden="true"
                />
                <span className="ml-2 flex-1 rounded-[5px] bg-card-alt px-[0.65rem] py-[0.2rem] text-[0.67rem] tracking-[0.02em] text-subtle">
                  {preview.url}
                </span>
              </div>

              {/* Original text */}
              <div className="flex flex-col gap-[0.3rem]">
                <div className="text-[0.6rem] font-bold tracking-[0.14em] text-muted uppercase">
                  Original
                </div>
                <div className="rounded-[8px] border border-border-subtle bg-card-alt px-4 py-[0.65rem]">
                  <p className="text-[0.78rem] leading-relaxed text-muted">
                    {preview.originalText}
                  </p>
                </div>
              </div>

              {/* Action chips */}
              <div className="flex flex-wrap gap-[0.35rem] max-[960px]:justify-center">
                {preview.actions.map((action, i) => (
                  <span
                    key={action}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-[0.67rem] font-semibold ${
                      i === 0
                        ? "border-accent/30 bg-[var(--accent-dim)] text-accent"
                        : "border-border-subtle bg-card-alt text-muted"
                    }`}
                  >
                    {action}
                  </span>
                ))}
              </div>

              {/* Fixed text */}
              <div className="flex flex-col gap-[0.3rem]">
                <div className="text-[0.6rem] font-bold tracking-[0.14em] text-accent uppercase">
                  ✓ Fixed
                </div>
                <div className="relative overflow-hidden rounded-[8px] border border-accent/16 bg-accent/5 px-4 py-[0.65rem]">
                  <div
                    className="pointer-events-none absolute inset-0 animate-[shimmer-sweep_3.5s_ease-in-out_infinite] bg-[linear-gradient(110deg,transparent_20%,rgb(from_var(--accent-ink)_r_g_b/0.06)_50%,transparent_80%)]"
                    aria-hidden="true"
                  />
                  <p className="relative text-[0.78rem] leading-relaxed text-foreground">
                    {preview.fixedText}
                  </p>
                </div>
              </div>

              {/* Accuracy stat */}
              <div className="flex items-center justify-between pt-[0.3rem]">
                <div className="text-[0.6rem] font-bold tracking-[0.14em] text-muted uppercase">
                  {preview.accuracyLabel}
                </div>
                <div className="text-[0.9rem] font-bold text-accent">{preview.accuracy}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="relative z-[1] mt-12 flex flex-col items-center gap-[1.5rem] opacity-40 animate-[pop-in_1s_ease_1.2s_both]"
        aria-hidden="true"
      >
        <span className="text-[0.58rem] tracking-[0.2em] text-muted uppercase">
          Scroll to explore
        </span>
        <svg
          width="14"
          height="22"
          viewBox="0 0 14 22"
          fill="none"
          className="animate-[float-a_2.4s_ease-in-out_infinite]"
        >
          <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.4" />
          <circle cx="7" cy="6" r="2" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
