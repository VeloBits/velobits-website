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
        <div style={{ marginBottom: "3.5rem", display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <div className="reveal">
            <span className="eyebrow">Our Products</span>
            <h2 className="display display-lg" style={{ marginTop: "0.65rem" }}>
              Tools that{" "}
              <span style={{ color: "var(--accent)" }}>actually</span> work.
            </h2>
          </div>
          <p className="reveal reveal-delay-2" style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: "36ch" }}>
            Every Velobits product starts with a real problem. No bloat. No vaporware.
            Just bits that matter.
          </p>
        </div>

        {/* Card grid */}
        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: "1.25rem", alignItems: "start" }}>
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

  const tilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    card.style.transform = `perspective(700px) rotateX(${-y * 7}deg) rotateY(${x * 7}deg) translateY(-4px)`;
  };
  const resetTilt = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
  };

  const delayClass = `reveal-delay-${idx + 1}`;

  return (
    <div
      ref={cardRef}
      className={`card card-glow reveal ${delayClass} ${!p.featured && p.id === "mystery" ? "dashed-card" : ""}`}
      onMouseMove={tilt}
      onMouseLeave={resetTilt}
      style={{
        padding: p.featured ? "2rem" : "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
        transition: "transform 0.35s ease, border-color 0.3s ease, box-shadow 0.35s ease",
        opacity: p.id === "suite" ? 0.6 : 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent left stripe on featured */}
      {p.featured && (
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 3, height: "100%",
          background: "linear-gradient(180deg, var(--accent), rgba(200,241,53,0.2))",
          borderRadius: "24px 0 0 24px",
        }} />
      )}

      {/* Inner shimmer on hover — for featured */}
      {p.featured && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(circle at 30% 20%, rgba(200,241,53,0.05) 0%, transparent 60%)",
        }} />
      )}

      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="pill" style={{
          background: `${p.statusColor}18`,
          borderColor: `${p.statusColor}40`,
          color: p.statusColor,
        }}>
          {p.id !== "suite" && <span className="pill-dot" />}&nbsp;{p.status}
        </span>
        <div style={{
          width: p.featured ? 46 : 40, height: p.featured ? 46 : 40,
          borderRadius: 12,
          background: p.featured ? "var(--accent-dim)" : "var(--bg-card-alt)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: p.featured ? "1.35rem" : "1.15rem",
          animation: p.id === "mystery" ? "glow-pulse 2.5s ease-in-out infinite" : "none",
        }}>
          {p.icon}
        </div>
      </div>

      {/* Name + description */}
      <div>
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          textTransform: "uppercase", letterSpacing: "-0.01em",
          fontSize: p.featured ? "1.55rem" : "1.15rem",
          color: "var(--text)", marginBottom: "0.55rem",
        }}>{p.name}</h3>
        <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", lineHeight: 1.72 }}>{p.description}</p>
      </div>

      {/* Tags */}
      {p.tags.length > 0 && (
        <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
          {p.tags.map((t) => (
            <span key={t} className="pill" style={{ fontSize: "0.66rem" }}>#{t}</span>
          ))}
        </div>
      )}

      {/* Metric bar */}
      {p.metric && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{p.metricLabel}</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-display)" }}>{p.metric}</span>
          </div>
          <div className="poll-bar-track" style={{ height: 5 }}>
            <div className="poll-bar-fill" style={{ width: "98%", background: "linear-gradient(90deg, var(--accent), rgba(200,241,53,0.6))" }} />
          </div>
        </div>
      )}

      {/* CTA */}
      {p.cta && (
        <a
          href={p.ctaHref ?? "#"}
          className={p.featured ? "btn btn-primary" : "btn btn-ghost"}
          style={{ alignSelf: "flex-start", fontSize: "0.82rem" }}
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
