"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import { CONTAINER, SECTION } from "@/lib/ui-classes";

const milestones = [
  {
    id: "m1",
    date: "2025",
    label: "FixMyText Alpha",
    desc: "Core editor and 200+ text tools built and internally tested.",
    done: true,
    now: false,
  },
  {
    id: "m2",
    date: "2026",
    label: "Public Launch",
    desc: "254 tools go live for everyone - free to start.",
    done: false,
    now: true,
  },
  {
    id: "m3",
    date: "2026",
    label: "AI Suite & Sharing",
    desc: "50+ AI tools, shareable results, and gamification go live.",
    done: false,
    now: false,
  },
  {
    id: "m4",
    date: "2026",
    label: "API Access & Batch",
    desc: "Programmatic tool access and batch processing for teams.",
    done: false,
    now: false,
  },
  {
    id: "m5",
    date: "2027",
    label: "Suite & Integrations",
    desc: "Slack/Discord bots, mobile apps, and a full Velobits ecosystem.",
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
    <section id="roadmap" className={`${SECTION} overflow-hidden`} ref={sectionRef}>
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgb(from_var(--accent-ink)_r_g_b/0.06)_0%,transparent_70%)] blur-[120px]" />
      </div>
      <div className={`container ${CONTAINER} relative z-1`}>
        <SectionHeader
          index="04"
          eyebrow="What's Coming"
          titleLines={["The road", "ahead."]}
          lede="We move fast, build thoughtfully, and ship often. Here's what's on the horizon."
        />

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
              stroke="rgb(from var(--ink) r g b / 0.08)"
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
                key={m.id}
                className={`reveal flex flex-col gap-4 transition-transform duration-500 hover:scale-105 ${i === 0 ? "delay-[0ms]" : i === 1 ? "delay-[100ms]" : i === 2 ? "delay-[200ms]" : i === 3 ? "delay-[300ms]" : "delay-[400ms]"}`}
              >
                <div className="flex justify-start">
                  <div className="relative">
                    <div
                      className={`relative z-1 h-5 w-5 rounded-full border-2 transition-all duration-300 ${m.now ? "border-accent bg-accent shadow-[0_0_24px_rgb(from_var(--accent-ink)_r_g_b/0.6)] scale-125" : m.done ? "border-accent bg-accent/60" : "border-border-subtle bg-card"}`}
                    />
                    {m.now && (
                      <div className="absolute inset-0 rounded-full animate-pulse shadow-[0_0_32px_rgb(from_var(--accent-ink)_r_g_b/0.4)] [filter:blur(1px)]" />
                    )}
                  </div>
                </div>

                <div
                  className={`card group relative overflow-hidden p-5 transition-all duration-300 backdrop-blur-md h-full flex flex-col ${m.now ? "border-accent/40 bg-gradient-to-br from-accent/8 via-accent/3 to-transparent" : m.done ? "border-accent/20 bg-gradient-to-br from-accent/4 to-transparent" : "border-border-subtle bg-card/50 hover:border-border-subtle/50"} ${!m.done && !m.now ? "opacity-70 hover:opacity-85" : "opacity-100"}`}
                >
                  {m.now && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute -inset-full animate-[spin_8s_linear_infinite] opacity-20 bg-[conic-gradient(from_0deg,transparent,rgb(from_var(--accent-ink)_r_g_b/0.4),transparent_180deg)]" />
                    </div>
                  )}

                  {m.now && (
                    <div className="absolute bottom-4 right-4 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/40 px-2 py-1 text-[0.55rem] font-bold tracking-[0.12em] text-accent uppercase">
                        <span className="relative flex h-1.5 w-1.5 shrink-0">
                          <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-ping opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-accent"></span>
                        </span>
                        Active
                      </span>
                    </div>
                  )}

                  <div className="relative z-1">
                    <div
                      className={`mb-2 text-[0.68rem] font-bold tracking-[0.12em] uppercase ${m.now ? "text-accent" : m.done ? "text-accent" : "text-muted"}`}
                    >
                      {m.date}
                    </div>
                    <div
                      className={`mb-3 font-display text-[0.85rem] font-extrabold tracking-[-0.01em] uppercase leading-[1.2] transition-colors ${m.now ? "text-accent" : "text-foreground"}`}
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
