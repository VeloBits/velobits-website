"use client";

import { useEffect, useRef } from "react";
import { getFeaturedProduct } from "@/lib/site-content";

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
      className="relative flex flex-col items-center justify-center overflow-hidden pt-[7rem] pb-16"
      style={{ minHeight: "100svh" }}
    >
      {/* Background glows */}
      <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.09)_0%,transparent_60%)] blur-[80px]" />
        <div className="absolute top-[15%] right-[-6%] h-[460px] w-[460px] rounded-full bg-[radial-gradient(circle,rgba(90,50,210,0.07)_0%,transparent_65%)] blur-[70px]" />
        <div className="absolute bottom-[-5%] left-[30%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(60,120,255,0.045)_0%,transparent_65%)] blur-[70px]" />
        {/* Floating particles */}
        <div className="absolute top-[8%] left-[15%] h-[3px] w-[3px] rounded-full bg-[rgba(200,241,53,0.25)] animate-[float-a_4s_ease-in-out_infinite]" />
        <div className="absolute top-[25%] right-[20%] h-[2px] w-[2px] rounded-full bg-[rgba(200,241,53,0.18)] animate-[float-b_5s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] left-[8%] h-[2px] w-[2px] rounded-full bg-[rgba(140,100,255,0.18)] animate-[float-c_6s_ease-in-out_infinite]" />
        <div className="absolute top-[45%] right-[12%] h-[3px] w-[3px] rounded-full bg-[rgba(200,241,53,0.12)] animate-[float-a_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] left-[25%] h-[2px] w-[2px] rounded-full bg-[rgba(140,100,255,0.12)] animate-[float-b_4.5s_ease-in-out_infinite]" />
      </div>

      <div className="container relative z-[1] w-full flex-1 flex flex-col justify-center">
        <div className="hero-grid grid items-center gap-16 [grid-template-columns:1.15fr_1fr]">
          {/* Left: copy */}
          <div className="flex flex-col gap-[1.5rem]">
            {/* Eyebrow */}
            <div
              className="flex items-center gap-3 animate-[pop-in_0.5s_ease_0.1s_both]"
              aria-hidden="true"
            >
              <span className="relative flex h-[7px] w-[7px] shrink-0">
                <span className="absolute inset-0 rounded-full bg-accent opacity-50 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="inline-block h-[7px] w-[7px] rounded-full bg-accent" />
              </span>
              <span className="font-[var(--font-display)] text-[0.7rem] font-bold tracking-[0.2em] text-accent uppercase">
                FixMyText is launching soon
              </span>
            </div>

            {/* H1 */}
            <h1 className="animate-[pop-in_0.6s_ease_0.2s_both] font-[var(--font-display)] text-[clamp(2.8rem,5vw,5rem)] leading-[0.93] font-extrabold tracking-[-0.03em] text-foreground uppercase">
              FixMyText
              <br />
              <span
                className="text-accent"
                style={{ textShadow: "0 0 60px rgba(200,241,53,0.12)" }}
              >
                by Velobits
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-[42ch] animate-[pop-in_0.6s_ease_0.32s_both] text-[0.97rem] leading-[1.8] text-muted">
              An AI writing assistant that fixes grammar, rewrites sentences, and improves tone in
              seconds — built by <span className="font-semibold text-foreground">Velobits</span> for
              everyday writing.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-[pop-in_0.6s_ease_0.42s_both]">
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

            {/* Trust tags */}
            <div className="hero-pills flex flex-wrap gap-[0.4rem] animate-[pop-in_0.6s_ease_0.52s_both]">
              {featured.features.map((tag, i) => (
                <span key={tag} className={`pill text-[0.68rem] ${i === 0 ? "pill-accent" : ""}`}>
                  {i === 0 && <span className="pill-dot" />}
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: product preview */}
          <div
            className="hero-visual relative animate-[pop-in_0.75s_ease_0.4s_both]"
            aria-label="FixMyText product preview"
            style={{
              transform: "perspective(1200px) rotateY(-4deg) rotateX(2deg)",
              transition: "transform 0.4s ease",
            }}
          >
            {/* Browser frame */}
            <div
              className="card relative mt-8 px-5 pt-4 pb-5 border-2 border-[rgba(200,241,53,0.2)] bg-gradient-to-br from-[rgba(200,241,53,0.03)] to-transparent shadow-[0_24px_80px_rgba(200,241,53,0.2),0_0_40px_rgba(200,241,53,0.1)] transition-all duration-300 hover:-translate-y-2 hover:border-[rgba(200,241,53,0.35)] hover:shadow-[0_32px_100px_rgba(200,241,53,0.25),0_0_60px_rgba(200,241,53,0.15)]"
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              {/* Browser chrome */}
              <div
                className="border-b border-border-subtle pb-3"
                style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}
              >
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
                <span className="ml-2 flex-1 rounded-[5px] bg-card-alt px-[0.65rem] py-[0.2rem] text-[0.67rem] tracking-[0.02em] text-faint">
                  {preview.url}
                </span>
              </div>

              {/* Original text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {preview.actions.map((action, i) => (
                  <span
                    key={action}
                    className={`whitespace-nowrap rounded-full border px-3 py-1 text-[0.67rem] font-semibold ${
                      i === 0
                        ? "border-[rgba(200,241,53,0.3)] bg-[var(--accent-dim)] text-accent"
                        : "border-border-subtle bg-card-alt text-muted"
                    }`}
                  >
                    {action}
                  </span>
                ))}
              </div>

              {/* Fixed text */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                <div className="text-[0.6rem] font-bold tracking-[0.14em] text-accent uppercase">
                  ✓ Fixed
                </div>
                <div className="relative overflow-hidden rounded-[8px] border border-[rgba(200,241,53,0.16)] bg-[rgba(200,241,53,0.05)] px-4 py-[0.65rem]">
                  <div
                    className="pointer-events-none absolute inset-0 animate-[shimmer-sweep_3.5s_ease-in-out_infinite]"
                    style={{
                      background:
                        "linear-gradient(110deg, transparent 20%, rgba(200,241,53,0.06) 50%, transparent 80%)",
                    }}
                    aria-hidden="true"
                  />
                  <p className="relative text-[0.78rem] leading-relaxed text-foreground">
                    {preview.fixedText}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className="relative z-[1] flex flex-col items-center gap-[1.5rem] opacity-40 animate-[pop-in_1s_ease_1.2s_both]"
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

      <style>{`
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-grid > div:first-child {
            align-items: center;
            text-align: center;
          }
          .hero-pills,
          .hero-grid .flex-wrap {
            justify-content: center;
          }
          .hero-visual {
            max-width: 480px;
            margin: 0 auto;
            width: 100%;
            transform: none !important;
          }
          .hero-chip {
            display: none !important;
          }
          .hero-mobile-badge {
            display: flex !important;
          }
          #hero {
            padding-top: 5.5rem;
          }
        }
        @media (max-width: 480px) {
          .hero-visual {
            max-width: 100%;
          }
        }
      `}</style>
    </section>
  );
}
