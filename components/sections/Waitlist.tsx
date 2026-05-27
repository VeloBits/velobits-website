"use client";

import { useEffect, useRef, useState } from "react";

export default function Waitlist() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section
      id="waitlist"
      className="section"
      ref={sectionRef}
      style={{ position: "relative" }}
    >
      <div className="container">
        <div
          className="card reveal"
          style={{
            padding: "5rem 4rem",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
            background: "var(--bg-card)",
          }}
        >
          {/* Background glow inside card */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "60%",
              background: "radial-gradient(ellipse, rgba(200,241,53,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Grid texture inside card */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              borderRadius: "inherit",
              pointerEvents: "none",
            }}
          />

          {/* Floating sticker */}
          <div
            className="sticker"
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "2rem",
              width: 72,
              height: 72,
              fontSize: "0.6rem",
              transform: "rotate(-8deg)",
            }}
          >
            FREE
          </div>

          {/* Floating icon chips */}
          {[
            { icon: "⚡", top: "1.5rem", left: "2rem" },
            { icon: "🚀", bottom: "2rem", left: "3rem", animation: "float-b 4s ease-in-out infinite" },
            { icon: "✨", bottom: "1.5rem", right: "3rem", animation: "float-c 5s ease-in-out infinite" },
          ].map(({ icon, top, left, bottom, right, animation }) => (
            <div
              key={icon}
              style={{
                position: "absolute",
                top,
                left,
                bottom,
                right,
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--bg-card-alt)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.1rem",
                animation: animation ?? "float-a 5s ease-in-out infinite",
              }}
            >
              {icon}
            </div>
          ))}

          {/* Content */}
          <div style={{ position: "relative", zIndex: 1 }}>
            {submitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem", padding: "2rem 0" }}>
                <div style={{ fontSize: "3rem" }}>🎉</div>
                <h2 className="display display-md" style={{ color: "var(--accent)" }}>
                  You&apos;re in!
                </h2>
                <p style={{ color: "var(--text-muted)", maxWidth: "36ch", lineHeight: 1.7 }}>
                  We&apos;ll be in touch with first-access details before the launch.
                  Keep an eye on your inbox.
                </p>
              </div>
            ) : (
              <>
                <div className="reveal">
                  <span className="eyebrow" style={{ marginBottom: "0.75rem", display: "block" }}>
                    Early Access
                  </span>
                  <h2 className="display display-lg">
                    Don&apos;t miss
                    <br />
                    <span style={{ color: "var(--accent)" }}>what&apos;s next.</span>
                  </h2>
                  <p style={{ color: "var(--text-muted)", marginTop: "1rem", maxWidth: "46ch", margin: "1rem auto 0", lineHeight: 1.7 }}>
                    Join early believers. Get first access to every Velobits launch
                    before anyone else. No spam — ever.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="reveal reveal-delay-2"
                  style={{
                    display: "flex",
                    gap: "0",
                    maxWidth: 500,
                    margin: "2.5rem auto 0",
                    background: "var(--bg-card-alt)",
                    border: "1px solid var(--border)",
                    borderRadius: 9999,
                    padding: "0.3rem 0.3rem 0.3rem 1.5rem",
                    transition: "border-color 0.25s, box-shadow 0.25s",
                  }}
                  onFocusCapture={(e) => {
                    (e.currentTarget as HTMLFormElement).style.borderColor = "rgba(200,241,53,0.4)";
                    (e.currentTarget as HTMLFormElement).style.boxShadow = "0 0 0 4px rgba(200,241,53,0.08)";
                  }}
                  onBlurCapture={(e) => {
                    (e.currentTarget as HTMLFormElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLFormElement).style.boxShadow = "none";
                  }}
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: "var(--text)",
                      fontSize: "0.9rem",
                      fontFamily: "inherit",
                      minWidth: 0,
                    }}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ flexShrink: 0, padding: "0.65rem 1.5rem" }}
                  >
                    {loading ? (
                      <span style={{ display: "inline-flex", gap: 4 }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c0c0c", animation: "glow-pulse 0.8s ease-in-out infinite" }} />
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c0c0c", animation: "glow-pulse 0.8s ease-in-out infinite 0.2s" }} />
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#0c0c0c", animation: "glow-pulse 0.8s ease-in-out infinite 0.4s" }} />
                      </span>
                    ) : (
                      <>
                        Get Early Access
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                <p className="reveal reveal-delay-3" style={{ fontSize: "0.75rem", color: "var(--text-faint)", marginTop: "1rem" }}>
                  🔒 No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #waitlist .card { padding: 3rem 1.5rem !important; }
        }
      `}</style>
    </section>
  );
}
