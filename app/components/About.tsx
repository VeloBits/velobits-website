"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 1,   suffix: "",   label: "Product Launching",          display: null },
  { value: 100, suffix: "%",  label: "Community-First Roadmap",     display: null },
  { value: 0,   suffix: "",   label: "Ideas Driven by Community",   display: "∞" },
];

function useCountUp(target: number, duration = 1200, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [statsActive, setStatsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 110);
            });
            setStatsActive(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stat0 = useCountUp(1,   800,  statsActive);
  const stat1 = useCountUp(100, 1200, statsActive);

  return (
    <section
      id="about"
      className="section"
      ref={sectionRef}
      style={{ position: "relative", paddingTop: "5rem", paddingBottom: "5rem" }}
    >
      {/* Subtle glow top-right */}
      <div style={{
        position: "absolute", top: "10%", right: "-5%",
        width: 480, height: 480,
        background: "radial-gradient(circle, rgba(200,241,53,0.05) 0%, transparent 68%)",
        borderRadius: "50%", filter: "blur(55px)", pointerEvents: "none",
      }} />

      <div className="container">

        {/* ── Section header ── */}
        <div className="reveal" style={{ marginBottom: "3rem" }}>
          <span className="eyebrow">Our Mission</span>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", marginTop: "0.6rem", flexWrap: "wrap" }}>
            <h2 className="display display-lg">
              Built with{" "}
              <span style={{ color: "var(--accent)" }}>purpose.</span>
            </h2>
            <div style={{
              width: 48, height: 2,
              background: "rgba(200,241,53,0.38)",
              borderRadius: 2, flexShrink: 0,
            }} />
          </div>
        </div>

        {/* ── Main grid: 60% text | 40% orbit ── */}
        <div
          className="about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "60% 40%",
            gap: "3rem",
            alignItems: "center",  /* vertically center text alongside orbit */
          }}
        >
          {/* ── LEFT — copy + stats ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>

            <p className="reveal" style={{
              color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.97rem",
              maxWidth: "54ch",
            }}>
              We started Velobits because we kept hitting the same wall —
              great ideas, terrible tools. So we decided to build them
              ourselves and give them to the world.
            </p>

            <p className="reveal reveal-delay-1" style={{
              color: "var(--text-muted)", lineHeight: 1.9, fontSize: "0.97rem",
              maxWidth: "54ch",
            }}>
              Every product starts with a real problem. We listen first, build second.
              No bloat. No vaporware.{" "}
              <span style={{ color: "var(--text)", fontWeight: 700 }}>Just bits that matter.</span>
            </p>

            {/* Accent quote block */}
            <div
              className="reveal reveal-delay-2"
              style={{
                display: "flex", alignItems: "center", gap: "1.1rem",
                padding: "1.1rem 1.4rem",
                background: "rgba(200,241,53,0.04)",
                border: "1px solid rgba(200,241,53,0.12)",
                borderRadius: 16,
                maxWidth: "54ch",
              }}
            >
              <div style={{
                width: 3, height: 34,
                background: "var(--accent)",
                borderRadius: 9999, flexShrink: 0,
              }} />
              <p style={{ fontSize: "0.88rem", color: "var(--text)", lineHeight: 1.65, fontStyle: "italic" }}>
                "We build tools that work for people, not the other way around."
              </p>
            </div>

            {/* Stat cards */}
            <div
              className="reveal reveal-delay-3"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "0.8rem",
                marginTop: "0.5rem",
                maxWidth: "54ch",
              }}
            >
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="card"
                  style={{ padding: "1.1rem", textAlign: "center" }}
                >
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 800,
                    fontSize: "1.6rem", lineHeight: 1, marginBottom: "0.35rem",
                    color: "var(--accent)",
                  }}>
                    {s.display
                      ? s.display
                      : i === 0
                      ? stat0 + s.suffix
                      : i === 1
                      ? stat1 + s.suffix
                      : s.value + s.suffix}
                  </div>
                  <div style={{ fontSize: "0.62rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT — orbit visual, flush to the right edge ── */}
          <div
            className="about-visual"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* Orbit container — 460 × 460 */}
            <div style={{ position: "relative", width: 460, height: 460 }}>

              {/* Outer dashed ring */}
              <div style={{
                position: "absolute", inset: 0,
                borderRadius: "50%",
                border: "1px dashed rgba(255,255,255,0.07)",
              }} />

              {/* Inner dashed ring */}
              <div style={{
                position: "absolute", inset: 70,
                borderRadius: "50%",
                border: "1px dashed rgba(200,241,53,0.14)",
              }} />

              {/* Glow behind center */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 160, height: 160,
                background: "radial-gradient(circle, rgba(200,241,53,0.16), transparent 70%)",
                borderRadius: "50%", filter: "blur(22px)",
                animation: "glow-pulse 3.5s ease-in-out infinite",
              }} />

              {/* Center ⚡ logo */}
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)",
                width: 90, height: 90, borderRadius: "50%", zIndex: 2,
                background: "var(--bg-card)",
                border: "1px solid rgba(200,241,53,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 36px rgba(200,241,53,0.14)",
              }}>
                <span style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800, fontSize: "1.5rem",
                  color: "var(--accent)",
                }}>⚡</span>
              </div>

              {/* Orbiting product icons — use orbit-lg (148px radius) */}
              {[
                { icon: "✏️", label: "FixMyText", dur: 13 },
                { icon: "🔮", label: "Soon",       dur: 17, delay: "-6s" },
                { icon: "🌌", label: "Suite",      dur: 22, delay: "-12s" },
              ].map(({ icon, label, dur, delay = "0s" }) => (
                <div
                  key={label}
                  style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: 58, height: 58,
                    marginTop: -29, marginLeft: -29,
                    animation: `orbit-lg ${dur}s linear ${delay} infinite`,
                  }}
                >
                  <div style={{
                    width: "100%", height: "100%", borderRadius: "50%",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.35rem",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                  }} title={label}>{icon}</div>
                </div>
              ))}

              {/* Small accent dots — use orbit-reverse-lg (108px radius) */}
              {[0, 120, 240].map((deg) => (
                <div
                  key={deg}
                  style={{
                    position: "absolute", top: "50%", left: "50%",
                    width: 9, height: 9, marginTop: -4.5, marginLeft: -4.5,
                    animation: `orbit-reverse-lg 8s linear ${(-deg / 360) * 8}s infinite`,
                  }}
                >
                  <div style={{
                    width: "100%", height: "100%",
                    borderRadius: "50%",
                    background: "var(--accent)", opacity: 0.55,
                  }} />
                </div>
              ))}

              {/* Decorative floating square — top-right */}
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 44, height: 44,
                background: "var(--accent-dim)",
                borderRadius: 10,
                border: "1px solid rgba(200,241,53,0.2)",
                transform: "rotate(12deg)",
                animation: "float-b 5s ease-in-out infinite",
              }} />

              {/* Decorative circle — bottom-left */}
              <div style={{
                position: "absolute", bottom: -14, left: -14,
                width: 28, height: 28,
                background: "rgba(255,255,255,0.025)",
                borderRadius: "50%",
                border: "1px solid var(--border)",
                animation: "float-a 6s ease-in-out 1s infinite",
              }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes orbit-lg {
          from { transform: rotate(0deg)    translateX(148px) rotate(0deg); }
          to   { transform: rotate(360deg)  translateX(148px) rotate(-360deg); }
        }
        @keyframes orbit-reverse-lg {
          from { transform: rotate(0deg)    translateX(108px) rotate(0deg); }
          to   { transform: rotate(-360deg) translateX(108px) rotate(360deg); }
        }
        @media (max-width: 1024px) {
          .about-grid { grid-template-columns: 55% 45% !important; }
        }
        @media (max-width: 860px) {
          .about-grid  { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .about-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}
