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
    desc: "FixMyText goes live for everyone - free to start.",
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
    <section id="roadmap" className="section relative overflow-hidden" ref={sectionRef}>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(140,100,255,0.08)_0%,transparent_70%)] blur-[120px]" />
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.06)_0%,transparent_70%)] blur-[120px]" />
      </div>
      <div className="container relative z-1">
        <div className="reveal mb-16">
          <span className="eyebrow">What&apos;s Coming</span>
          <h2 className="display display-lg mt-3">
            The road{" "}
            <span className="bg-gradient-to-r from-accent via-accent to-[rgba(200,241,53,0.7)] bg-clip-text text-transparent">
              ahead.
            </span>
          </h2>
          <p className="mt-5 max-w-[44ch] leading-[1.8] text-muted">
            We move fast, build thoughtfully, and ship often. Here&apos;s what&apos;s on the
            horizon.
          </p>
        </div>

        <div className="relative pt-8">
          <svg className="timeline-svg pointer-events-none absolute top-14 left-0 block h-1 w-full overflow-visible max-[900px]:hidden">
            <defs>
              <filter id="timeline-glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <line
              x1="2%"
              y1="2"
              x2="98%"
              y2="2"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="2%"
              y1="2"
              x2="98%"
              y2="2"
              stroke="var(--accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="600"
              strokeDashoffset={lineVisible ? 0 : 600}
              filter="url(#timeline-glow)"
              className="opacity-70 transition-[stroke-dashoffset] delay-300 duration-[2000ms] [transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]"
            />
          </svg>

          <div className="timeline-grid relative grid grid-cols-5 gap-4 max-[900px]:grid-cols-1">
            {milestones.map((m, i) => (
              <div
                key={m.date}
                className={`reveal flex flex-col gap-4 transition-transform duration-500 hover:scale-105 ${i === 0 ? "delay-[0ms]" : i === 1 ? "delay-[100ms]" : i === 2 ? "delay-[200ms]" : i === 3 ? "delay-[300ms]" : "delay-[400ms]"}`}
              >
                <div className="flex justify-start">
                  <div className="relative">
                    <div
                      className={`relative z-1 h-5 w-5 rounded-full border-2 transition-all duration-300 ${m.now ? "border-accent bg-accent shadow-[0_0_24px_rgba(200,241,53,0.6)] scale-125" : m.done ? "border-accent bg-[rgba(200,241,53,0.6)]" : "border-border-subtle bg-card hover:border-accent/50"}`}
                    />
                    {m.now && (
                      <div
                        className="absolute inset-0 rounded-full animate-pulse"
                        style={{
                          boxShadow: "0 0 32px rgba(200,241,53,0.4)",
                          filter: "blur(1px)",
                        }}
                      />
                    )}
                  </div>
                </div>

                {m.now && (
                  <div className="-mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/40 px-3 py-1.5 text-[0.65rem] font-bold tracking-[0.12em] text-accent uppercase">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                      </span>
                      Currently Active
                    </span>
                  </div>
                )}

                <div
                  className={`card group relative overflow-hidden p-6 transition-all duration-300 backdrop-blur-md ${m.now ? "border-accent/40 bg-gradient-to-br from-[rgba(200,241,53,0.08)] via-[rgba(200,241,53,0.03)] to-transparent shadow-[0_16px_48px_rgba(200,241,53,0.1)]" : m.done ? "border-accent/20 bg-gradient-to-br from-[rgba(200,241,53,0.04)] to-transparent" : "border-border-subtle bg-card/50 hover:border-border-subtle/50"} ${!m.done && !m.now ? "opacity-70 hover:opacity-85" : "opacity-100"}`}
                >
                  {m.now && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div
                        className="absolute -inset-full animate-[spin_8s_linear_infinite] opacity-20"
                        style={{
                          backgroundImage:
                            "conic-gradient(from 0deg, transparent, rgba(200,241,53,0.4), transparent 180deg)",
                        }}
                      />
                    </div>
                  )}

                  <div className="relative z-1">
                    <div
                      className={`mb-2 text-[0.68rem] font-bold tracking-[0.12em] uppercase ${m.now ? "bg-gradient-to-r from-accent to-[rgba(200,241,53,0.7)] bg-clip-text text-transparent" : m.done ? "text-accent" : "text-muted"}`}
                    >
                      {m.date}
                    </div>
                    <div
                      className={`mb-3 font-display text-[1rem] font-extrabold tracking-[-0.01em] uppercase transition-colors ${m.now ? "bg-gradient-to-r from-accent to-[rgba(200,241,53,0.8)] bg-clip-text text-transparent" : "text-foreground"}`}
                    >
                      {m.label}
                    </div>
                    <div
                      className={`text-[0.8rem] leading-[1.7] transition-colors ${m.now ? "text-foreground/90" : "text-muted"}`}
                    >
                      {m.desc}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
