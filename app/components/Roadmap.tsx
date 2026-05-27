"use client";

import { useEffect, useRef, useState } from "react";

const milestones = [
  {
    date: "Q2 2025",
    label: "FixMyText Alpha",
    desc: "Core AI engine built and internally tested.",
    done: true,
    now: false,
  },
  {
    date: "Q2 2026",
    label: "Public Launch",
    desc: "FixMyText goes live for everyone — free to start.",
    done: false,
    now: true,
  },
  {
    date: "Q3 2026",
    label: "Community Pulse",
    desc: "Full community voting & idea platform goes live.",
    done: false,
    now: false,
  },
  {
    date: "Q4 2026",
    label: "Product #2",
    desc: "Voted on by the community. Built by us.",
    done: false,
    now: false,
  },
  {
    date: "2027",
    label: "Velobits Suite",
    desc: "A full ecosystem of everyday tools.",
    done: false,
    now: false,
  },
];

export default function Roadmap() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgLineRef = useRef<SVGLineElement>(null);
  const [lineVisible, setLineVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("visible"), i * 100);
            });
            setLineVisible(true);
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
    <section id="roadmap" className="section" ref={sectionRef}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }} className="reveal">
          <span className="eyebrow">What&apos;s Coming</span>
          <h2 className="display display-lg" style={{ marginTop: "0.75rem" }}>
            The road <span style={{ color: "var(--accent)" }}>ahead.</span>
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: "1rem", maxWidth: "44ch", lineHeight: 1.7 }}>
            We move fast, build thoughtfully, and ship often. Here&apos;s
            what&apos;s on the horizon.
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* SVG connecting line — desktop */}
          <svg
            style={{
              position: "absolute",
              top: 28,
              left: 0,
              width: "100%",
              height: 4,
              overflow: "visible",
              pointerEvents: "none",
              display: "block",
            }}
            className="timeline-svg"
          >
            <line
              ref={svgLineRef}
              x1="2%"
              y1="2"
              x2="98%"
              y2="2"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="2%"
              y1="2"
              x2="98%"
              y2="2"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={lineVisible ? 0 : 600}
              style={{ transition: "stroke-dashoffset 1.8s cubic-bezier(0.4,0,0.2,1) 0.3s", opacity: 0.6 }}
            />
          </svg>

          {/* Milestone items */}
          <div
            style={{ display: "grid", gridTemplateColumns: `repeat(${milestones.length}, 1fr)`, gap: "1rem", position: "relative" }}
            className="timeline-grid"
          >
            {milestones.map((m, i) => (
              <div
                key={m.date}
                className="reveal"
                style={{ transitionDelay: `${i * 0.1}s`, display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                {/* Node */}
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: m.now
                        ? "var(--accent)"
                        : m.done
                        ? "rgba(200,241,53,0.4)"
                        : "var(--bg-card)",
                      border: `2px solid ${
                        m.now
                          ? "var(--accent)"
                          : m.done
                          ? "rgba(200,241,53,0.5)"
                          : "var(--border)"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      boxShadow: m.now ? "0 0 16px rgba(200,241,53,0.4)" : "none",
                      transition: "box-shadow 0.3s",
                      zIndex: 1,
                      position: "relative",
                    }}
                  >
                    {m.done ? "✓" : m.now ? "⚡" : ""}
                  </div>
                </div>

                {/* NOW sticker */}
                {m.now && (
                  <div style={{ marginTop: "-0.5rem" }}>
                    <span
                      className="sticker"
                      style={{ width: 52, height: 52, fontSize: "0.52rem" }}
                    >
                      NOW
                    </span>
                  </div>
                )}

                {/* Card */}
                <div
                  className="card"
                  style={{
                    padding: "1.25rem",
                    border: m.now
                      ? "1px solid rgba(200,241,53,0.25)"
                      : "1px solid var(--border)",
                    background: m.now ? "rgba(200,241,53,0.04)" : "var(--bg-card)",
                    opacity: !m.done && !m.now ? 0.65 : 1,
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: m.now ? "var(--accent)" : "var(--text-muted)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: "0.4rem",
                    }}
                  >
                    {m.date}
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 800, marginBottom: "0.4rem", color: "var(--text)", fontFamily: "var(--font-display)", textTransform: "uppercase", letterSpacing: "-0.01em" }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                    {m.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .timeline-grid {
            grid-template-columns: 1fr !important;
          }
          .timeline-svg {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
