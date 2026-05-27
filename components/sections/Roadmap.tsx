"use client";

import { useEffect, useRef, useState } from "react";

const milestones = [
  { date: "Q2 2025", label: "FixMyText Alpha", desc: "Core AI engine built and internally tested.", done: true, now: false },
  { date: "Q2 2026", label: "Public Launch", desc: "FixMyText goes live for everyone - free to start.", done: false, now: true },
  { date: "Q3 2026", label: "Community Pulse", desc: "Full community voting & idea platform goes live.", done: false, now: false },
  { date: "Q4 2026", label: "Product #2", desc: "Voted on by the community. Built by us.", done: false, now: false },
  { date: "2027", label: "Velobits Suite", desc: "A full ecosystem of everyday tools.", done: false, now: false },
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
    <section id="roadmap" className="section" ref={sectionRef}>
      <div className="container">
        <div className="reveal mb-14">
          <span className="eyebrow">What&apos;s Coming</span>
          <h2 className="display display-lg mt-3">
            The road <span className="text-accent">ahead.</span>
          </h2>
          <p className="mt-4 max-w-[44ch] leading-[1.7] text-muted">
            We move fast, build thoughtfully, and ship often. Here&apos;s what&apos;s on the horizon.
          </p>
        </div>

        <div className="relative">
          <svg className="timeline-svg pointer-events-none absolute top-7 left-0 block h-1 w-full overflow-visible max-[900px]:hidden">
            <line x1="2%" y1="2" x2="98%" y2="2" stroke="rgba(255,255,255,0.07)" strokeWidth="2" strokeLinecap="round" />
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
              className="opacity-60 transition-[stroke-dashoffset] delay-300 duration-[1800ms] [transition-timing-function:cubic-bezier(0.4,0,0.2,1)]"
            />
          </svg>

          <div className="timeline-grid relative grid grid-cols-5 gap-4 max-[900px]:grid-cols-1">
            {milestones.map((m, i) => (
              <div
                key={m.date}
                className={`reveal flex flex-col gap-4 ${i === 0 ? "delay-[0ms]" : i === 1 ? "delay-[100ms]" : i === 2 ? "delay-[200ms]" : i === 3 ? "delay-[300ms]" : "delay-[400ms]"}`}
              >
                <div className="flex justify-start">
                  <div
                    className={`relative z-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-[0.7rem] transition-shadow ${m.now ? "border-accent bg-accent shadow-[0_0_16px_rgba(200,241,53,0.4)]" : m.done ? "border-[rgba(200,241,53,0.5)] bg-[rgba(200,241,53,0.4)]" : "border-border-subtle bg-card"}`}
                  >
                    {m.done ? "✓" : m.now ? "⚡" : ""}
                  </div>
                </div>

                {m.now && (
                  <div className="-mt-2">
                    <span className="sticker h-[52px] w-[52px] text-[0.52rem]">NOW</span>
                  </div>
                )}

                <div
                  className={`card p-5 ${m.now ? "border-[rgba(200,241,53,0.25)] bg-[rgba(200,241,53,0.04)]" : "border-border-subtle bg-card"} ${!m.done && !m.now ? "opacity-65" : "opacity-100"}`}
                >
                  <div className={`mb-[0.4rem] text-[0.7rem] font-bold tracking-[0.1em] uppercase ${m.now ? "text-accent" : "text-muted"}`}>
                    {m.date}
                  </div>
                  <div className="mb-[0.4rem] font-[var(--font-display)] text-[0.95rem] font-extrabold tracking-[-0.01em] text-foreground uppercase">
                    {m.label}
                  </div>
                  <div className="text-[0.78rem] leading-[1.6] text-muted">{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
