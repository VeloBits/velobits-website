"use client";

import { useEffect, useRef } from "react";
import { brand, getFeaturedProduct } from "@/lib/site-content";
import { CONTAINER } from "@/lib/ui-classes";
import RevonPhone from "@/components/ui/RevonPhone";
import FeatureIcon from "@/components/ui/FeatureIcon";

export default function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);
  const featured = getFeaturedProduct();

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
      {/* One ambient element, not eight: a single soft accent glow behind the copy. */}
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
              <span className="label-mono text-accent">Coming soon to Android and iOS</span>
            </div>

            {/* The product name carries the scale; the attribution steps down in
                size, weight and tone. The clamp minimum has to fit the narrowest
                supported viewport. */}
            <h1 className="animate-[pop-in_0.6s_ease_0.2s_both] font-[var(--font-display)] leading-[0.9] font-extrabold tracking-[-0.035em] text-foreground uppercase">
              <span className="block text-[clamp(2.6rem,9vw,7rem)]">Revon</span>
              <span className="mt-[0.55rem] block text-[clamp(0.95rem,1.35vw,1.25rem)] font-semibold tracking-[0.16em] text-muted">
                Ride together · by Velobits
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-[44ch] animate-[pop-in_0.6s_ease_0.32s_both] text-[0.97rem] leading-[1.8] text-muted">
              One live map for your whole riding group. See who is ahead, who has stopped and who
              needs help, without pulling over to check a chat. Built for motorcyclists by{" "}
              <span className="font-semibold text-foreground">Velobits</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-[pop-in_0.6s_ease_0.42s_both] max-[960px]:justify-center">
              <a href="#waitlist" className="btn btn-primary" data-pet-perch>
                Join the Revon Waitlist
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
              <a href="#revon" className="btn btn-ghost">
                See How It Works
              </a>
            </div>

            {/* Feature list: a quiet hairline-ruled spec, no colour or motion, so
                the one CTA above stays the thing that wins. */}
            <ul className="mt-2 flex flex-col gap-0 animate-[pop-in_0.6s_ease_0.52s_both] max-[960px]:mx-auto max-[960px]:max-w-[38ch]">
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

            {/* The older product stays one click away. */}
            <p className="animate-[pop-in_0.6s_ease_0.6s_both] text-[0.8rem] text-subtle">
              Also from Velobits:{" "}
              <a
                href={brand.fixmytextUrl}
                className="inline-flex items-center gap-1 font-semibold text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
              >
                FixMyText is live
                <FeatureIcon name="external" size={12} />
              </a>
            </p>
          </div>

          {/* Right: the app */}
          <div className="relative animate-[pop-in_0.75s_ease_0.4s_both] max-[960px]:mx-auto">
            <div
              className="pointer-events-none absolute inset-[-8%] rounded-full bg-[radial-gradient(circle,var(--accent-a12)_0%,transparent_65%)] blur-[50px]"
              aria-hidden="true"
            />
            <RevonPhone className="relative mx-auto block h-auto w-[min(300px,72vw)] [transform:rotate(3deg)] drop-shadow-[0_30px_60px_var(--shadow-color-strong)] [transition:transform_0.4s_ease] hover:[transform:rotate(0deg)_translateY(-6px)] max-[960px]:[transform:none]" />
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
          data-pet-perch
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
