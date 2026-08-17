"use client";

import { useEffect, useRef } from "react";
import { products, type Product } from "@/lib/site-content";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import ProductIcon from "@/components/ui/ProductIcon";
import SectionHeader from "@/components/ui/SectionHeader";
import { CONTAINER, SECTION, PILL_BASE } from "@/lib/ui-classes";

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
    <section id="products" className={SECTION} ref={sectionRef}>
      <div className={`container ${CONTAINER}`}>
        <SectionHeader
          index="01"
          eyebrow="Our Products"
          titleLines={["Tools that", "actually work."]}
          lede="Every Velobits product starts with a real problem. No bloat. No vaporware. Just bits that matter."
        />

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

  const isAccent = p.statusTone === "accent";
  const statusClass = isAccent
    ? "bg-accent/9 border-accent/25 text-accent"
    : "bg-foreground/4 border-accent/25 text-muted";

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
        style={{ borderColor: "rgb(from var(--accent-ink) r g b / 0.3)" }}
        className={`card card-glow reveal ${delayClass} col-span-1 md:col-span-2 relative flex flex-col overflow-hidden p-8 md:p-10 border-2 [will-change:transform] transition-all duration-500 ease-out`}
      >
        <GlowingEffect spread={50} proximity={80} inactiveZone={0.01} />

        {/* Background glow */}
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(from_var(--accent-ink)_r_g_b/0.05)_0%,transparent_60%)]"
          aria-hidden="true"
        />

        {/* ── Shared header row: badge (left) + icon (right) ── */}
        <div className="relative flex items-center justify-between mb-[1.6rem]">
          <span className={`pill ${PILL_BASE} text-[0.73rem] ${statusClass}`}>
            <span className="pill-dot" />
            &nbsp;{p.status}
          </span>
          <div
            className="flex items-center justify-center rounded-xl h-[42px] w-[42px] bg-gradient-to-br from-accent/15 to-accent/5 text-[1.35rem] transition-all duration-500 ease-in-out hover:scale-[1.1] hover:shadow-[0_0_16px_rgb(from_var(--accent-ink)_r_g_b/0.2)]"
            aria-hidden="true"
          >
            <ProductIcon id={p.id} size={22} />
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
              <div className="flex flex-wrap gap-[0.35rem]" data-pet-perch>
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className={`pill ${PILL_BASE} bg-card text-[0.66rem] text-accent border-accent/25`}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Column divider */}
          <div className="hidden md:block w-[1px] shrink-0 bg-foreground/5" />

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
                    <div className="poll-bar-fill w-[98%] bg-[linear-gradient(90deg,var(--accent),rgb(from_var(--accent-ink)_r_g_b/0.6))]" />
                  </div>
                </div>
              )}
              {p.ctaLabel && (
                <a
                  href={p.ctaHref ?? "#"}
                  className="btn btn-primary self-start text-[0.82rem]"
                  data-pet-perch
                >
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
      className={`card card-glow reveal ${delayClass} col-span-1 relative flex flex-col gap-[1.2rem] overflow-hidden p-7 [will-change:transform] transition-all duration-500 ease-out ${p.id === "suite" ? "opacity-85" : "opacity-100"}`}
    >
      <GlowingEffect spread={40} proximity={64} inactiveZone={0.01} />

      {/* Ambient radial gradient glow */}
      <div
        className={`pointer-events-none absolute inset-0 ${
          p.id === "suite"
            ? "animate-[glow-pulse_6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_85%_15%,rgba(100,60,220,0.09)_0%,transparent_60%)]"
            : "animate-[glow-pulse_4s_ease-in-out_infinite] bg-[radial-gradient(circle_at_85%_15%,rgb(from_var(--accent-ink)_r_g_b/0.05)_0%,transparent_60%)]"
        }`}
        aria-hidden="true"
      />

      {/* Status + icon */}
      <div className="flex items-center justify-between">
        <span className={`pill ${PILL_BASE} text-[0.73rem] ${statusClass}`}>
          {isAccent && <span className="pill-dot" />}&nbsp;{p.status}
        </span>
        <div
          className={`flex items-center justify-center rounded-xl h-10 w-10 bg-gradient-to-br from-accent/8 to-transparent text-[1.15rem] transition-all duration-500 ease-in-out hover:scale-[1.1] hover:shadow-[0_0_12px_rgb(from_var(--accent-ink)_r_g_b/0.15)] ${p.id === "suite" ? "animate-[glow-pulse_5s_ease-in-out_infinite]" : "animate-[glow-pulse_2.5s_ease-in-out_infinite]"}`}
          aria-hidden="true"
        >
          <ProductIcon id={p.id} size={20} />
        </div>
      </div>

      {/* Name + description */}
      <div>
        <h3 className="mb-[0.55rem] font-[var(--font-display)] text-[1.15rem] text-foreground/90 uppercase tracking-[-0.01em]">
          {p.name}
        </h3>
        <p className="text-[0.83rem] leading-[1.72] text-foreground/62">{p.longDescription}</p>
      </div>

      {/* Tags */}
      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-[0.35rem]">
          {p.tags.map((t) => (
            <span
              key={t}
              className={`pill ${PILL_BASE} bg-card text-[0.66rem] text-accent border-accent/25`}
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* CTA */}
      {p.ctaLabel && (
        <div className="mt-auto">
          <a href={p.ctaHref ?? "#"} className="btn btn-primary self-start text-[0.82rem]">
            {p.ctaLabel}
          </a>
        </div>
      )}
    </div>
  );
}
