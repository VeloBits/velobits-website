"use client";

import { useEffect, useRef } from "react";

const products = [
  {
    id: "fixmytext",
    status: "Launching Soon",
    statusColor: "#c8f135",
    icon: "✏️",
    name: "FixMyText",
    description:
      "Your AI-powered writing companion. Fix grammar, rephrase sentences, improve tone, and more — right in your browser.",
    tags: ["AI", "Writing", "Productivity"],
    metric: "98%",
    metricLabel: "Grammar accuracy",
    cta: "Explore FixMyText",
    ctaHref: "https://app.velobits.dev",
    featured: true,
  },
  {
    id: "mystery",
    status: "In the Lab",
    statusColor: "#666",
    icon: "?",
    name: "Coming Soon",
    description:
      "Something new is brewing. Vote on what you'd like us to build next — the community decides.",
    tags: [],
    metric: null,
    metricLabel: null,
    cta: "Vote in Community →",
    ctaHref: "#community",
    featured: false,
  },
  {
    id: "suite",
    status: "2027",
    statusColor: "#444",
    icon: "🌌",
    name: "Velobits Suite",
    description:
      "A full ecosystem of everyday tools — built product by product, driven by this community.",
    tags: [],
    metric: null,
    metricLabel: null,
    cta: null,
    ctaHref: null,
    featured: false,
  },
];

export default function Products() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal, .reveal-scale, .reveal-left").forEach((el, i) => {
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

        {/* Header */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-4">
          <div className="reveal">
            <span className="eyebrow">Our Products</span>
            <h2 className="display display-lg mt-[0.65rem]">
              Tools that{" "}
              <span className="text-accent">actually</span> work.
            </h2>
          </div>
          <p className="reveal reveal-delay-2 max-w-[36ch] text-[0.9rem] leading-[1.75] text-muted">
            Every Velobits product starts with a real problem. No bloat. No vaporware.
            Just bits that matter.
          </p>
        </div>

        {/* Card grid */}
        <div className="products-grid grid grid-cols-[1.6fr_1fr_1fr] items-start gap-5">
          {products.map((p, idx) => (
            <ProductCard key={p.id} product={p} idx={idx} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 960px)  { .products-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 640px)  { .products-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}

function ProductCard({ product: p, idx }: { product: (typeof products)[0]; idx: number }) {
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
    card.setAttribute(
      "style",
      `transform: perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px);`
    );
  };
  const resetTilt = () => {
    if (cardRef.current) cardRef.current.setAttribute("style", "");
  };

  const delayClass = `reveal-delay-${idx + 1}`;

  return (
    <div
      ref={cardRef}
      onMouseMove={tilt}
      onMouseLeave={resetTilt}
      className={`card card-glow reveal ${delayClass} ${!p.featured && p.id === "mystery" ? "dashed-card" : ""} relative flex flex-col gap-[1.2rem] overflow-hidden transition-[transform,border-color,box-shadow] duration-[350ms] ease-in-out ${p.featured ? "p-8" : "p-7"} ${p.id === "suite" ? "opacity-60" : "opacity-100"}`}
    >
      {/* Accent left stripe on featured */}
      {p.featured && (
        <div className="absolute top-0 left-0 h-full w-[3px] rounded-l-[24px] bg-[linear-gradient(180deg,var(--accent),rgba(200,241,53,0.2))]" />
      )}

      {/* Inner shimmer on hover — for featured */}
      {p.featured && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(200,241,53,0.05)_0%,transparent_60%)]" />
      )}

      {/* Top row */}
      <div className="flex items-center justify-between">
        <span className={`pill ${statusClass}`}>
          {p.id !== "suite" && <span className="pill-dot" />}&nbsp;{p.status}
        </span>
        <div
          className={`flex items-center justify-center rounded-xl border border-border-subtle ${p.featured ? "h-[46px] w-[46px] bg-[var(--accent-dim)] text-[1.35rem]" : "h-10 w-10 bg-card-alt text-[1.15rem]"} ${p.id === "mystery" ? "animate-[glow-pulse_2.5s_ease-in-out_infinite]" : ""}`}
        >
          {p.icon}
        </div>
      </div>

      {/* Name + description */}
      <div>
        <h3 className={`mb-[0.55rem] font-display text-foreground uppercase tracking-[-0.01em] ${p.featured ? "text-[1.55rem]" : "text-[1.15rem]"}`}>{p.name}</h3>
        <p className="text-[0.83rem] leading-[1.72] text-muted">{p.description}</p>
      </div>

      {/* Tags */}
      {p.tags.length > 0 && (
        <div className="flex flex-wrap gap-[0.35rem]">
          {p.tags.map((t) => (
            <span key={t} className="pill text-[0.66rem]">#{t}</span>
          ))}
        </div>
      )}

      {/* Metric bar */}
      {p.metric && (
        <div>
          <div className="mb-[0.4rem] flex justify-between">
            <span className="text-[0.68rem] text-muted">{p.metricLabel}</span>
            <span className="font-display text-[0.78rem] font-extrabold text-accent">{p.metric}</span>
          </div>
          <div className="poll-bar-track h-[5px]">
            <div className="poll-bar-fill w-[98%] bg-[linear-gradient(90deg,var(--accent),rgba(200,241,53,0.6))]" />
          </div>
        </div>
      )}

      {/* CTA */}
      {p.cta && (
        <a
          href={p.ctaHref ?? "#"}
          className={`${p.featured ? "btn btn-primary" : "btn btn-ghost"} self-start text-[0.82rem]`}
        >
          {p.cta}
          {p.featured && (
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </a>
      )}
    </div>
  );
}
