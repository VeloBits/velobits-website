"use client";

import { useEffect, useRef } from "react";
import { products, type Product } from "@/lib/site-content";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export default function Products() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target
              .querySelectorAll(".reveal, .reveal-scale, .reveal-left")
              .forEach((el, i) => {
                setTimeout(() => el.classList.add("visible"), i * 110);
              });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="products" className="section" ref={sectionRef}>
      <div className="container">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div className="reveal">
            <span className="eyebrow">Our Products</span>
            <h2 className="display display-lg mt-[0.65rem]">
              Tools that <span className="text-accent">actually</span> work.
            </h2>
          </div>
          <p className="reveal reveal-delay-2 max-w-[36ch] text-[0.9rem] leading-[1.75] text-muted">
            Every Velobits product starts with a real problem. No bloat. No vaporware. Just bits
            that matter.
          </p>
        </div>

        <div className="products-grid grid grid-cols-1 md:grid-cols-2 items-stretch gap-5">
          {products.map((p, idx) => (
            <ProductCard key={p.id} product={p} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product: p, idx }: { product: Product; idx: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const statusClass =
    p.id === "fixmytext"
      ? "bg-[rgba(200,241,53,0.09)] border-[rgba(200,241,53,0.25)] text-accent"
      : p.id === "mystery"
        ? "bg-[rgba(102,102,102,0.09)] border-[rgba(102,102,102,0.25)] text-[#666]"
        : "bg-[rgba(68,68,68,0.09)] border-[rgba(68,68,68,0.25)] text-[#444]";

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
    card.style.zIndex = "10";
  };
  const resetTilt = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "";
      cardRef.current.style.zIndex = "";
    }
  };

  const delayClass = `reveal-delay-${idx + 1}`;

  /* ── Featured card ── */
  if (p.featured) {
    return (
      <div
        ref={cardRef}
        onMouseMove={tilt}
        onMouseLeave={resetTilt}
        style={{ willChange: "transform", borderColor: "rgba(200,241,53,0.3)" }}
        className={`card card-glow reveal ${delayClass} col-span-1 md:col-span-2 relative flex flex-col overflow-hidden p-8 md:p-10 border-2 transition-all duration-500 ease-out hover:border-[rgba(200,241,53,0.45)] hover:shadow-[0_16px_48px_rgba(200,241,53,0.15)]`}
      >
        <GlowingEffect spread={50} proximity={80} inactiveZone={0.01} />

        {/* Left accent bar */}
        <div
          className="absolute top-0 left-0 h-full w-[3px] rounded-l-[24px] bg-[linear-gradient(180deg,var(--accent),rgba(200,241,53,0.2))]"
          aria-hidden="true"
        />
        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,241,53,0.05)_0%,transparent_60%)]"
          aria-hidden="true"
        />

        {/* ── Shared header row: badge (left) + icon (right) ── */}
        <div className="relative flex items-center justify-between mb-[1.6rem]">
          <span className={`pill ${statusClass}`}>
            <span className="pill-dot" />
            &nbsp;{p.status}
          </span>
          <div
            className="flex items-center justify-center rounded-xl border-2 border-[rgba(200,241,53,0.25)] h-[42px] w-[42px] bg-gradient-to-br from-[rgba(200,241,53,0.15)] to-[rgba(200,241,53,0.05)] text-[1.35rem] transition-all duration-500 ease-in-out hover:scale-[1.1] hover:border-[rgba(200,241,53,0.4)] hover:shadow-[0_0_16px_rgba(200,241,53,0.2)]"
            aria-hidden="true"
          >
            {p.icon}
          </div>
        </div>

        {/* ── Body: two columns, both start at the same point ── */}
        <div className="relative flex flex-col md:flex-row gap-8 flex-1">
          {/* Left: title + description + tags */}
          <div className="flex flex-col gap-[1.2rem] md:w-[55%]">
            <div>
              <h3 className="mb-[0.55rem] font-[var(--font-display)] text-[1.85rem] text-foreground uppercase tracking-[-0.01em]">
                {p.name}
              </h3>
              <p className="text-[0.9rem] leading-[1.72] text-muted">{p.longDescription}</p>
            </div>
            {p.tags.length > 0 && (
              <div className="flex flex-wrap gap-[0.35rem]">
                {p.tags.map((t) => (
                  <span key={t} className="pill text-[0.66rem]">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Column divider */}
          <div className="hidden md:block w-[1px] shrink-0 bg-[rgba(255,255,255,0.05)]" />

          {/* Right: features + metric + CTA */}
          <div className="flex flex-1 flex-col gap-[1.2rem] md:pl-2">
            {p.features.length > 0 && (
              <div className="flex flex-col gap-[0.6rem]">
                {p.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-[0.65rem]">
                    <span
                      className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[var(--accent-dim)]"
                      aria-hidden="true"
                    >
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="var(--accent)"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[0.78rem] leading-[1.4] text-foreground/70">{feat}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-[1.2rem] mt-auto">
              {p.metric && (
                <div>
                  <div className="mb-[0.4rem] flex justify-between">
                    <span className="text-[0.68rem] text-muted">{p.metricLabel}</span>
                    <span className="font-[var(--font-display)] text-[0.78rem] font-extrabold text-accent">
                      {p.metric}
                    </span>
                  </div>
                  <div className="poll-bar-track h-[5px]">
                    <div className="poll-bar-fill w-[98%] bg-[linear-gradient(90deg,var(--accent),rgba(200,241,53,0.6))]" />
                  </div>
                </div>
              )}
              {p.ctaLabel && (
                <a href={p.ctaHref ?? "#"} className="btn btn-primary self-start text-[0.82rem]">
                  {p.ctaLabel}
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
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Non-featured card ── */
  return (
    <div
      ref={cardRef}
      onMouseMove={tilt}
      onMouseLeave={resetTilt}
      style={{ willChange: "transform" }}
      className={`card card-glow reveal ${delayClass} col-span-1 relative flex flex-col gap-[1.2rem] overflow-hidden p-7 border-2 border-[rgba(200,241,53,0.15)] transition-all duration-500 ease-out hover:border-[rgba(200,241,53,0.3)] hover:shadow-[0_8px_32px_rgba(200,241,53,0.1)] ${p.id === "suite" ? "opacity-85" : "opacity-100"}`}
    >
      <GlowingEffect spread={40} proximity={64} inactiveZone={0.01} />

      {/* Ambient radial gradient glow */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          p.id === "suite"
            ? "animate-[glow-pulse_6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_85%_15%,rgba(100,60,220,0.09)_0%,transparent_60%)]"
            : "animate-[glow-pulse_4s_ease-in-out_infinite] bg-[radial-gradient(circle_at_85%_15%,rgba(200,241,53,0.05)_0%,transparent_60%)]"
        }`}
        aria-hidden="true"
      />

      {/* Status + icon */}
      <div className="flex items-center justify-between">
        <span className={`pill ${statusClass}`}>
          {p.id !== "suite" && <span className="pill-dot" />}&nbsp;{p.status}
        </span>
        <div
          className={`flex items-center justify-center rounded-xl border-2 border-[rgba(200,241,53,0.2)] h-10 w-10 bg-gradient-to-br from-[rgba(200,241,53,0.08)] to-transparent text-[1.15rem] transition-all duration-500 ease-in-out hover:scale-[1.1] hover:border-[rgba(200,241,53,0.35)] hover:shadow-[0_0_12px_rgba(200,241,53,0.15)] ${p.id === "suite" ? "animate-[glow-pulse_5s_ease-in-out_infinite]" : "animate-[glow-pulse_2.5s_ease-in-out_infinite]"}`}
          aria-hidden="true"
        >
          {p.icon}
        </div>
      </div>

      {/* Name + description */}
      <div>
        <h3 className="mb-[0.55rem] font-[var(--font-display)] text-[1.15rem] text-[rgba(244,244,245,0.9)] uppercase tracking-[-0.01em]">
          {p.name}
        </h3>
        <p className="text-[0.83rem] leading-[1.72] text-[rgba(244,244,245,0.62)]">
          {p.longDescription}
        </p>
      </div>

      {/* Tags */}
      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-[0.35rem]">
          {p.tags.map((t) => (
            <span
              key={t}
              className="pill text-[0.66rem] text-[rgba(244,244,245,0.55)] border-[rgba(255,255,255,0.12)]"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {p.ctaLabel && (
        <div className="mt-auto">
          <a href={p.ctaHref ?? "#"} className="btn btn-ghost self-start text-[0.82rem]">
            {p.ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
