"use client";

import { useEffect, useRef, useState } from "react";

const polls = [
  {
    id: "p1",
    question: "What should we build after FixMyText?",
    options: [
      { label: "🔐 Password Manager", pct: 72 },
      { label: "📝 Note-taking App", pct: 48 },
      { label: "🖼 Screenshot Tool", pct: 41 },
      { label: "⌨️ Code Snippets", pct: 31 },
    ],
    totalVotes: 1247,
    daysLeft: 14,
  },
];

const categories = ["Productivity", "Writing", "Dev Tools", "Design", "Other"];

export default function CommunityPulse() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState("Productivity");
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [voteIdx, setVoteIdx] = useState<number | null>(null);

  // Reveal on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
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

  // Bar fill on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setBarsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (barsRef.current) obs.observe(barsRef.current);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setIdea("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section
      id="community"
      className="section"
      ref={sectionRef}
      style={{ position: "relative" }}
    >
      {/* Section glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 700,
          height: 400,
          background: "radial-gradient(ellipse, rgba(200,241,53,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }} className="reveal">
          <span className="eyebrow">Community Pulse</span>
          <h2 className="display display-lg" style={{ marginTop: "0.75rem" }}>
            You decide what we{" "}
            <span style={{ color: "var(--accent)" }}>build next.</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem", maxWidth: "50ch", margin: "1rem auto 0", lineHeight: 1.7 }}>
            Drop a product idea, vote on existing ones, or just tell us what
            problem you wish someone would solve.
          </p>
        </div>

        {/* Two-panel grid */}
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}
          className="community-grid"
        >
          {/* Panel A — Poll */}
          <div className="card reveal" style={{ padding: "2rem" }} ref={barsRef}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: "0.3rem" }}>Active Poll</div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, lineHeight: 1.45, maxWidth: "26ch", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                  {polls[0].question}
                </h3>
              </div>
              <span className="pill pill-dot" style={{ alignSelf: "flex-start" }}>Live</span>
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {polls[0].options.map((opt, i) => (
                <button
                  key={opt.label}
                  onClick={() => setVoteIdx(i)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "opacity 0.2s",
                    opacity: voteIdx !== null && voteIdx !== i ? 0.55 : 1,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.83rem", color: voteIdx === i ? "var(--text)" : "var(--text-muted)", fontWeight: voteIdx === i ? 600 : 400 }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: "0.8rem", fontWeight: 700, color: voteIdx === i ? "var(--accent)" : "var(--text-muted)" }}>
                      {opt.pct}%
                    </span>
                  </div>
                  <div className="poll-bar-track">
                    <div
                      className="poll-bar-fill"
                      style={{
                        width: barsVisible ? `${opt.pct}%` : "0%",
                        transitionDelay: `${i * 0.15}s`,
                        background: voteIdx === i ? "var(--accent)" : "rgba(200,241,53,0.45)",
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {polls[0].totalVotes.toLocaleString()} votes · {polls[0].daysLeft} days left
              </span>
              <button
                onClick={() => setVoteIdx(voteIdx !== null ? voteIdx : 0)}
                className="btn btn-primary"
                style={{ fontSize: "0.78rem", padding: "0.5rem 1rem" }}
              >
                {voteIdx !== null ? "Voted ✓" : "Cast Vote"}
              </button>
            </div>
          </div>

          {/* Panel B — Idea Submission */}
          <div
            className="card reveal reveal-delay-2"
            style={{ padding: "2rem", position: "relative", overflow: "hidden" }}
          >
            {submitted && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "var(--bg-card)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  zIndex: 10,
                  borderRadius: "var(--radius-card)",
                  animation: "pop-in 0.4s ease",
                }}
              >
                <div style={{ fontSize: "2.5rem" }}>🎉</div>
                <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--accent)" }}>Idea submitted!</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", maxWidth: "24ch" }}>
                  We read every single one. Thank you!
                </div>
              </div>
            )}

            <div className="eyebrow" style={{ marginBottom: "0.5rem" }}>Got an Idea?</div>
            <h3 style={{ fontSize: "1.05rem", fontWeight: 800, marginBottom: "1.25rem", lineHeight: 1.45, fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
              Describe a problem you&apos;d love us to solve.
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. I wish there was a tool that automatically summarizes long articles into bullet points..."
                rows={5}
                style={{
                  background: "var(--bg-card-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "1rem",
                  color: "var(--text)",
                  fontSize: "0.85rem",
                  lineHeight: 1.7,
                  resize: "vertical",
                  outline: "none",
                  transition: "border-color 0.25s, box-shadow 0.25s",
                  fontFamily: "inherit",
                  width: "100%",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(200,241,53,0.5)";
                  e.target.style.boxShadow = "0 0 0 3px rgba(200,241,53,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--border)";
                  e.target.style.boxShadow = "none";
                }}
              />

              {/* Category */}
              <div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Category
                </div>
                <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCat(cat)}
                      style={{
                        padding: "0.3rem 0.75rem",
                        borderRadius: 9999,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        border: "1px solid",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: selectedCat === cat ? "var(--accent-dim)" : "transparent",
                        borderColor: selectedCat === cat ? "rgba(200,241,53,0.4)" : "var(--border)",
                        color: selectedCat === cat ? "var(--accent)" : "var(--text-muted)",
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }}>
                ✨ Submit Idea
              </button>

              <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                🔒 No login required. We read every single one.
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .community-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
