"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (glowRef.current)
        glowRef.current.style.transform = `translateY(${window.scrollY * 0.22}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "7.5rem",
        paddingBottom: "3rem",
      }}
    >
      {/* Background glows */}
      <div ref={glowRef} style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "-12%", left: "-6%",
          width: 700, height: 700,
          background: "radial-gradient(circle, rgba(200,241,53,0.07) 0%, transparent 60%)",
          borderRadius: "50%", filter: "blur(70px)",
          animation: "glow-pulse 7s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "20%", right: "-8%",
          width: 560, height: 560,
          background: "radial-gradient(circle, rgba(90,50,210,0.08) 0%, transparent 65%)",
          borderRadius: "50%", filter: "blur(60px)",
          animation: "glow-pulse 9s ease-in-out infinite 3s",
        }} />
      </div>

      <div className="container" style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <div
          className="hero-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}
        >

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
            {/* Slogan */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", animation: "pop-in 0.5s ease 0.1s both" }}>
              <div style={{ width: 32, height: 1.5, background: "var(--accent)", opacity: 0.85 }} />
              <span style={{
                fontFamily: "var(--font-display)", fontSize: "0.68rem", fontWeight: 700,
                textTransform: "uppercase", letterSpacing: "0.22em", color: "var(--accent)",
              }}>Bits that matter.</span>
            </div>

            {/* Badge */}
            <div style={{ animation: "pop-in 0.55s ease 0.2s both" }}>
              <span className="pill pill-accent pill-dot">&nbsp;Launching Soon — FixMyText</span>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              textTransform: "uppercase", letterSpacing: "-0.025em",
              lineHeight: 0.93, color: "var(--text)",
              fontSize: "clamp(2.2rem, 3.2vw, 3.9rem)",
              animation: "pop-in 0.65s ease 0.3s both",
            }}>
              The smarter<br />
              <span style={{ color: "var(--accent)" }}>way</span> to build<br />
              software.
            </h1>

            {/* Sub */}
            <p style={{
              color: "var(--text-muted)", fontSize: "0.97rem", lineHeight: 1.82,
              maxWidth: "38ch", animation: "pop-in 0.65s ease 0.42s both",
            }}>
              Velobits crafts thoughtful, everyday tools that cut through the noise.
              One product at a time — each one a{" "}
              <span style={{ color: "var(--text)", fontWeight: 600 }}>bit that matters.</span>
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", animation: "pop-in 0.65s ease 0.52s both" }}>
              <a href="https://app.velobits.dev" className="btn btn-primary">
                Explore FixMyText
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#community" className="btn btn-ghost">Community Pulse</a>
            </div>

            {/* Trust chips */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", animation: "pop-in 0.65s ease 0.62s both" }}>
              {["AI-Powered", "Privacy-first", "Free to start", "Community-driven"].map((tag) => (
                <span key={tag} className="pill" style={{ fontSize: "0.68rem" }}>✦ {tag}</span>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — clean product visual ── */}
          <div
            className="hero-visual"
            style={{
              position: "relative",
              height: 500,
              animation: "pop-in 0.8s ease 0.45s both",
            }}
          >
            {/* ── Stat chip: 98% — top-left corner ── */}
            <div
              className="card"
              style={{
                position: "absolute", top: "3%", left: "0%",
                padding: "0.6rem 0.9rem",
                display: "flex", alignItems: "center", gap: "0.6rem",
                zIndex: 4, animation: "float-b 4.5s ease-in-out infinite",
                minWidth: 132,
                boxShadow: "0 8px 28px rgba(0,0,0,0.55)",
              }}
            >
              <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                background: "var(--accent-dim)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem",
              }}>✅</div>
              <div>
                <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--accent)", lineHeight: 1, fontFamily: "var(--font-display)" }}>98%</div>
                <div style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: 2 }}>Accuracy score</div>
              </div>
            </div>

            {/* ── Sticker — top-right corner ── */}
            <div
              className="sticker"
              style={{
                position: "absolute", top: "0%", right: "2%",
                width: 58, height: 58, zIndex: 4, fontSize: "0.54rem",
              }}
            >TRY<br />FREE</div>

            {/* ── Main product card — shifted left and up ── */}
            <div
              className="card"
              style={{
                position: "absolute",
                top: "40%", left: "44%",
                transform: "translate(-50%, -50%)",
                width: "84%",
                padding: "1.5rem 1.5rem 1.4rem",
                zIndex: 2,
                animation: "float-a 5.5s ease-in-out infinite",
                boxShadow: "0 28px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)",
              }}
            >
              {/* Browser chrome */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                marginBottom: "1.05rem", paddingBottom: "0.85rem",
                borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                <span style={{
                  marginLeft: "0.4rem", fontSize: "0.67rem", color: "var(--text-faint)",
                  background: "var(--bg-card-alt)", padding: "0.15rem 0.65rem",
                  borderRadius: 5, flex: 1, letterSpacing: "0.02em",
                }}>app.fixmytext.com</span>
              </div>

              {/* Original label + text */}
              <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--text-muted)", marginBottom: "0.4rem" }}>Original</div>
              <div style={{
                background: "var(--bg-card-alt)", borderRadius: 9,
                padding: "0.7rem 0.9rem", marginBottom: "0.75rem",
                border: "1px solid var(--border)",
              }}>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.62 }}>
                  I writed this email yesterday but i think it can be improved alot. Can you help me?
                </p>
              </div>

              {/* Action pills */}
              <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.75rem" }}>
                {["Fix Grammar", "Rephrase", "Improve Tone"].map((a, i) => (
                  <span key={a} style={{
                    fontSize: "0.67rem", fontWeight: 600,
                    padding: "0.25rem 0.6rem", borderRadius: 9999,
                    background: i === 0 ? "var(--accent-dim)" : "var(--bg-card-alt)",
                    color: i === 0 ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${i === 0 ? "rgba(200,241,53,0.3)" : "var(--border)"}`,
                    whiteSpace: "nowrap",
                  }}>{a}</span>
                ))}
              </div>

              {/* Fixed label + result */}
              <div style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--accent)", marginBottom: "0.4rem" }}>✦ Fixed</div>
              <div style={{
                background: "rgba(200,241,53,0.05)", borderRadius: 9,
                padding: "0.7rem 0.9rem",
                border: "1px solid rgba(200,241,53,0.16)",
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(110deg, transparent 20%, rgba(200,241,53,0.07) 50%, transparent 80%)",
                  animation: "shimmer-sweep 3.5s ease-in-out infinite",
                  pointerEvents: "none",
                }} />
                <p style={{ fontSize: "0.78rem", color: "var(--text)", lineHeight: 1.62, position: "relative" }}>
                  I wrote this email yesterday, but I believe it could be improved significantly. Could you help me refine it?
                </p>
              </div>
            </div>

            {/* ── Icon orbs — left and right outer edges ── */}
            <div style={{
              position: "absolute", top: "42%", left: "3%",
              width: 38, height: 38, borderRadius: "50%", zIndex: 3,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1rem", animation: "float-a 4.2s ease-in-out infinite",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}>✏️</div>

            <div style={{
              position: "absolute", bottom: "18%", right: "3%",
              width: 36, height: 36, borderRadius: "50%", zIndex: 3,
              background: "var(--bg-card)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem", animation: "float-b 3.8s ease-in-out 1s infinite",
              boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            }}>🧠</div>

            {/* ── Ping dot ── */}
            <div style={{ position: "absolute", bottom: "12%", left: "14%", zIndex: 1 }}>
              <span style={{ position: "relative", display: "flex", width: 9, height: 9 }}>
                <span style={{
                  position: "absolute", inset: 0, borderRadius: "50%",
                  background: "var(--accent)", opacity: 0.45,
                  animation: "ping 2.2s cubic-bezier(0,0,0.2,1) infinite",
                }} />
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--accent)", opacity: 0.9, display: "inline-block" }} />
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: "0.4rem", marginTop: "3rem", opacity: 0.3,
          animation: "pop-in 1s ease 1.2s both",
        }}>
          <span style={{ fontSize: "0.58rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)" }}>Scroll to explore</span>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none" style={{ animation: "float-a 2.2s ease-in-out infinite" }}>
            <rect x="1" y="1" width="12" height="20" rx="6" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="7" cy="6" r="2" fill="currentColor" />
          </svg>
        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-visual { display: none !important; }
        }
      `}</style>
    </section>
  );
}
