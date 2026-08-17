"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SectionHeader from "@/components/ui/SectionHeader";
import { CONTAINER } from "@/lib/ui-classes";

const stats = [
  { value: 1, suffix: "", label: "Product Launching", display: null },
  { value: 100, suffix: "%", label: "Community-First Roadmap", display: null },
  { value: 0, suffix: "", label: "Ideas Driven by Community", display: "∞" },
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
            entry.target
              .querySelectorAll(".reveal, .reveal-left, .reveal-scale")
              .forEach((el, i) => {
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

  const stat0 = useCountUp(1, 800, statsActive);
  const stat1 = useCountUp(100, 1200, statsActive);

  return (
    <section id="about" className="relative pt-20 pb-20 overflow-x-hidden" ref={sectionRef}>
      <div className="pointer-events-none absolute top-[10%] right-[-5%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgb(from_var(--accent-ink)_r_g_b/0.05)_0%,transparent_68%)] blur-[55px]" />

      <div className={`container ${CONTAINER}`}>
        <SectionHeader
          index="03"
          eyebrow="Our Mission"
          titleLines={["Built with", "purpose."]}
          lede="We listen first and build second. Every product starts with a problem someone actually has."
        />

        <div className="about-grid grid items-center gap-12 grid-cols-2 max-[1024px]:grid-cols-1 max-[1024px]:gap-10">
          <div className="flex flex-col gap-[1.4rem] pr-8">
            <p className="reveal text-[0.97rem] leading-[1.9] text-muted">
              We started Velobits because we kept hitting the same wall - great ideas, terrible
              tools. So we decided to build them ourselves and give them to the world.
            </p>

            <p className="reveal reveal-delay-1 text-[0.97rem] leading-[1.9] text-muted">
              Every product starts with a real problem. We listen first, build second. No bloat. No
              vaporware. <span className="font-bold text-foreground">Just bits that matter.</span>
            </p>

            <div className="reveal reveal-delay-2 flex items-center gap-[1.1rem] rounded-2xl bg-[var(--bg-card)] bg-gradient-to-r from-accent/8 to-accent/3 px-[1.4rem] py-[1.1rem] transition-all duration-300">
              <div className="h-8.5 w-[3px] shrink-0 rounded-full bg-linear-to-b from-accent to-accent/50" />
              <p className="text-[0.88rem] leading-[1.65] text-foreground italic">
                &quot;We build tools that work for people, not the other way around.&quot;
              </p>
            </div>

            <div className="reveal reveal-delay-3 mt-2 grid-cols-3 gap-[0.8rem] flex sm:flex-wrap">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="card relative p-[1.1rem] text-center transition-all duration-300 flex-1"
                >
                  <div className="relative mb-[0.35rem] font-display text-[1.6rem] leading-[1] font-extrabold text-accent">
                    {s.display
                      ? s.display
                      : i === 0
                        ? stat0 + s.suffix
                        : i === 1
                          ? stat1 + s.suffix
                          : s.value + s.suffix}
                  </div>
                  <div className="relative text-[0.62rem] leading-[1.5] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual flex items-center justify-center pl-8 max-[1024px]:hidden">
            <div className="relative h-[460px] w-[460px] shrink-0">
              {/* Ambient bg glow */}
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(from_var(--accent-ink)_r_g_b/0.04)_0%,transparent_70%)]" />

              {/* ── Dashed orbit rings (radius matches animation translateX) ── */}
              {/* Ring 1: r=108 → inset-[122px] */}
              <div className="absolute inset-[122px] rounded-full border-2 border-dashed border-accent/25 shadow-[inset_0_0_16px_rgb(from_var(--accent-ink)_r_g_b/0.05)]" />
              {/* Ring 2: r=148 → inset-[82px]  (main, highlighted) */}
              <div className="absolute inset-[82px] rounded-full border-2 border-dashed border-accent/45 shadow-[inset_0_0_24px_rgb(from_var(--accent-ink)_r_g_b/0.1),0_0_16px_rgb(from_var(--accent-ink)_r_g_b/0.08)]" />
              {/* Ring 3: r=200 → inset-[30px] */}
              <div className="absolute inset-[30px] rounded-full border-2 border-dashed border-accent/18 shadow-[inset_0_0_12px_rgb(from_var(--accent-ink)_r_g_b/0.03)]" />

              {/* Center glow */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(from_var(--accent-ink)_r_g_b/0.2),transparent_70%)] blur-[28px] animate-[glow-pulse_3.5s_ease-in-out_infinite]" />

              {/* Center planet — Velobits logo */}
              <div className="absolute top-1/2 left-1/2 z-10 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent bg-card shadow-[0_0_40px_rgb(from_var(--accent-ink)_r_g_b/0.28),0_0_0_8px_rgb(from_var(--accent-ink)_r_g_b/0.05)]">
                <Image
                  src="/velobits-color-png.png"
                  alt="Velobits"
                  width={52}
                  height={14}
                  style={{ height: "auto", width: "auto" }}
                  sizes="52px"
                  className="w-[52px] drop-shadow-[0_0_6px_rgb(from_var(--accent-ink)_r_g_b/0.4)]"
                  priority
                />
              </div>

              {/* ── Ring 1 (r=108): 3 icons, 120° apart — delays 0, -3.33s, -6.67s ── */}
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-reverse-lg_10s_linear_0s_infinite]">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] border border-accent/40 bg-[var(--surface-2)] shadow-[0_0_10px_rgb(from_var(--accent-ink)_r_g_b/0.18)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7h16M4 12h10M4 17h7"
                      stroke="var(--accent-ink)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="19" cy="17" r="3" stroke="var(--accent-ink)" strokeWidth="1.8" />
                    <path
                      d="M21.5 19.5l1.5 1.5"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-reverse-lg_10s_linear_-3.33s_infinite]">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] border border-accent/40 bg-[var(--surface-2)] shadow-[0_0_10px_rgb(from_var(--accent-ink)_r_g_b/0.18)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M10 20l4-16M4 15l-2-3 2-3M20 15l2-3-2-3"
                      stroke="var(--accent-ink)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-reverse-lg_10s_linear_-6.67s_infinite]">
                <div className="flex h-full w-full items-center justify-center rounded-[9px] border border-accent/40 bg-[var(--surface-2)] shadow-[0_0_10px_rgb(from_var(--accent-ink)_r_g_b/0.18)]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"
                      stroke="var(--accent-ink)"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="12" cy="12" r="3" stroke="var(--accent-ink)" strokeWidth="1.8" />
                  </svg>
                </div>
              </div>

              {/* ── Ring 2 (r=148): 3 icons, 120° apart — delays 0, -5s, -10s ── */}
              <div className="absolute top-1/2 left-1/2 h-[40px] w-[40px] -translate-x-[20px] -translate-y-[20px] animate-[orbit-lg_15s_linear_-2.5s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-[11px] bg-[var(--surface-2)] shadow-[0_0_16px_rgb(from_var(--accent-ink)_r_g_b/0.22)]"
                  title="FixMyText"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 20h9"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 h-[40px] w-[40px] -translate-x-[20px] -translate-y-[20px] animate-[orbit-lg_15s_linear_-7.5s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-[11px] bg-[var(--surface-2)] shadow-[0_0_14px_rgb(from_var(--accent-ink)_r_g_b/0.18)]"
                  title="Coming Soon"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M14.5 2v6.5l4.5 9a2 2 0 0 1-1.8 2.9H6.8A2 2 0 0 1 5 17.5l4.5-9V2"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 2h6"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                    <circle cx="9.5" cy="16" r="1" fill="var(--accent-ink)" />
                    <circle
                      cx="13.5"
                      cy="14"
                      r="0.8"
                      fill="rgb(from var(--accent-ink) r g b / 0.6)"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 h-[40px] w-[40px] -translate-x-[20px] -translate-y-[20px] animate-[orbit-lg_15s_linear_-12.5s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-[11px] bg-[var(--surface-2)] shadow-[0_0_12px_rgb(from_var(--accent-ink)_r_g_b/0.14)]"
                  title="Suite"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.7"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.7"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.7"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.7"
                    />
                  </svg>
                </div>
              </div>

              {/* ── Ring 3 (r=200): 3 icons, 120° apart — delays 0, -8s, -16s ── */}
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-reverse-xl_24s_linear_0s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-[9px] border border-accent/35 bg-[var(--surface-2)] shadow-[0_0_10px_rgb(from_var(--accent-ink)_r_g_b/0.12)]"
                  title="Community"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-reverse-xl_24s_linear_-8s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-[9px] border border-accent/35 bg-[var(--surface-2)] shadow-[0_0_10px_rgb(from_var(--accent-ink)_r_g_b/0.12)]"
                  title="Privacy"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-reverse-xl_24s_linear_-16s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-[9px] border border-accent/35 bg-[var(--surface-2)] shadow-[0_0_10px_rgb(from_var(--accent-ink)_r_g_b/0.12)]"
                  title="Roadmap"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="var(--accent-ink)" strokeWidth="1.7" />
                    <polygon
                      points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"
                      stroke="var(--accent-ink)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* ── Scatter decorative elements — soft float animations ── */}
              <svg
                className="absolute top-[52px] right-[-18px] animate-[float-b_4s_ease-in-out_0s_infinite]"
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
              >
                <path
                  d="M0 12 L7 2 L14 12 L21 2 L28 12"
                  stroke="rgb(from var(--accent-ink) r g b / 0.5)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="absolute top-[115px] left-[4px] animate-[float-a_5s_ease-in-out_0.8s_infinite]"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M0 0L14 14M14 0L0 14"
                  stroke="rgb(from var(--accent-ink) r g b / 0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-[132px] right-[8px] h-[7px] w-[7px] rounded-full bg-accent/45 shadow-[0_0_6px_rgb(from_var(--accent-ink)_r_g_b/0.6)] animate-[float-c_3.5s_ease-in-out_0.3s_infinite]" />
              <svg
                className="absolute bottom-[85px] left-[-12px] animate-[float-a_4.5s_ease-in-out_1.2s_infinite]"
                width="22"
                height="13"
                viewBox="0 0 22 13"
                fill="none"
              >
                <path
                  d="M0 10 L5.5 1 L11 10 L16.5 1 L22 10"
                  stroke="rgb(from var(--accent-ink) r g b / 0.28)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                className="absolute bottom-[115px] right-[4px] animate-[float-b_5.5s_ease-in-out_0.5s_infinite]"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M0 0L12 12M12 0L0 12"
                  stroke="rgb(from var(--accent-ink) r g b / 0.28)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute top-[205px] left-[6px] h-[5px] w-[5px] rounded-full bg-accent/30 animate-[float-c_4s_ease-in-out_1.5s_infinite]" />
              <div className="absolute bottom-[225px] right-[-45px] h-[4px] w-[4px] rounded-full bg-accent/40 animate-[float-a_3.8s_ease-in-out_0.7s_infinite]" />

              {/* Floating corner accents */}
              <div className="absolute top-[-20px] right-[-100px] h-10 w-10 rotate-[12deg] rounded-[10px] border border-accent/22 bg-[var(--accent-dim)] animate-[float-b_5s_ease-in-out_infinite]" />
              <div className="absolute bottom-[-10px] left-[-84px] h-7 w-7 rounded-full border border-accent/40 bg-accent/5 shadow-[0_0_8px_rgb(from_var(--accent-ink)_r_g_b/0.15)] animate-[float-a_6s_ease-in-out_1s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
