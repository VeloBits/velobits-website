"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

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
    <section id="about" className="section relative pt-20 pb-20 overflow-x-hidden" ref={sectionRef}>
      <div className="pointer-events-none absolute top-[10%] right-[-5%] h-[480px] w-[480px] rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.05)_0%,transparent_68%)] blur-[55px]" />

      <div className="container">
        <div className="reveal mb-12">
          <span className="eyebrow">Our Mission</span>
          <div className="mt-[0.6rem] flex flex-wrap items-center gap-5">
            <h2 className="display display-lg">
              Built with <span className="text-accent">purpose.</span>
            </h2>
            <div className="h-[2px] w-12 shrink-0 rounded-[2px] bg-[rgba(200,241,53,0.38)]" />
          </div>
        </div>

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

            <div className="reveal reveal-delay-2 flex items-center gap-[1.1rem] rounded-2xl border-2 border-[rgba(200,241,53,0.25)] bg-gradient-to-r from-[rgba(200,241,53,0.08)] to-[rgba(200,241,53,0.03)] px-[1.4rem] py-[1.1rem] shadow-[0_8px_24px_rgba(200,241,53,0.08)] hover:border-[rgba(200,241,53,0.35)] hover:shadow-[0_12px_32px_rgba(200,241,53,0.12)] transition-all duration-300">
              <div className="h-[34px] w-[3px] shrink-0 rounded-full bg-gradient-to-b from-accent to-[rgba(200,241,53,0.5)]" />
              <p className="text-[0.88rem] leading-[1.65] text-foreground italic">
                &quot;We build tools that work for people, not the other way around.&quot;
              </p>
            </div>

            <div className="reveal reveal-delay-3 mt-2 grid grid-cols-3 gap-[0.8rem]">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className="card relative p-[1.1rem] text-center border-2 border-[rgba(200,241,53,0.2)] transition-all duration-300 hover:border-[rgba(200,241,53,0.35)] hover:shadow-[0_8px_24px_rgba(200,241,53,0.1)]"
                >
                  <div className="relative mb-[0.35rem] font-display text-[1.6rem] leading-[1] font-extrabold bg-gradient-to-r from-accent to-[rgba(200,241,53,0.8)] bg-clip-text text-transparent">
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
              <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.04)_0%,transparent_70%)]" />

              {/* ── Dashed orbit rings (radius matches animation translateX) ── */}
              {/* Ring 1: r=108 → inset-[122px] */}
              <div className="absolute inset-[122px] rounded-full border-2 border-dashed border-[rgba(200,241,53,0.25)] shadow-[inset_0_0_16px_rgba(200,241,53,0.05)]" />
              {/* Ring 2: r=148 → inset-[82px]  (main, highlighted) */}
              <div className="absolute inset-[82px] rounded-full border-2 border-dashed border-[rgba(200,241,53,0.45)] shadow-[inset_0_0_24px_rgba(200,241,53,0.1),0_0_16px_rgba(200,241,53,0.08)]" />
              {/* Ring 3: r=200 → inset-[30px] */}
              <div className="absolute inset-[30px] rounded-full border-2 border-dashed border-[rgba(200,241,53,0.18)] shadow-[inset_0_0_12px_rgba(200,241,53,0.03)]" />

              {/* Center glow */}
              <div className="pointer-events-none absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.2),transparent_70%)] blur-[28px] animate-[glow-pulse_3.5s_ease-in-out_infinite]" />

              {/* Center planet — Velobits logo */}
              <div className="absolute top-1/2 left-1/2 z-10 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-accent bg-card shadow-[0_0_40px_rgba(200,241,53,0.28),0_0_0_8px_rgba(200,241,53,0.05)]">
                <Image
                  src="/velobits-color-png.png"
                  alt="Velobits"
                  width={52}
                  height={14}
                  style={{ height: "auto", width: "auto" }}
                  sizes="52px"
                  className="w-[52px] drop-shadow-[0_0_6px_rgba(200,241,53,0.4)]"
                  priority
                />
              </div>

              {/* ── Ring 1: glowing dots at r=108px ── */}
              {[
                {
                  key: "r1a",
                  anim: "animate-[orbit-reverse-lg_8s_linear_0s_infinite]",
                  solid: true,
                },
                {
                  key: "r1b",
                  anim: "animate-[orbit-reverse-lg_8s_linear_-2.67s_infinite]",
                  solid: false,
                },
                {
                  key: "r1c",
                  anim: "animate-[orbit-reverse-lg_8s_linear_-5.33s_infinite]",
                  solid: false,
                },
              ].map(({ key, anim, solid }) => (
                <div
                  key={key}
                  className={`absolute top-1/2 left-1/2 h-[10px] w-[10px] -translate-x-[5px] -translate-y-[5px] ${anim}`}
                >
                  <div
                    className={`h-full w-full rounded-full ${solid ? "bg-accent shadow-[0_0_8px_rgba(200,241,53,0.9)]" : "border border-[rgba(200,241,53,0.55)] bg-transparent"}`}
                  />
                </div>
              ))}

              {/* ── Ring 2: product planets at r=148px ── */}
              {/* FixMyText — edit/document icon, accent green */}
              <div className="absolute top-1/2 left-1/2 h-[44px] w-[44px] -translate-x-[22px] -translate-y-[22px] animate-[orbit-lg_15s_linear_0s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border-2 border-accent bg-[rgba(200,241,53,0.07)] shadow-[0_0_20px_rgba(200,241,53,0.3),0_4px_14px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                  title="FixMyText"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      stroke="rgba(200,241,53,0.95)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                      stroke="rgba(200,241,53,0.95)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              {/* Coming Soon — flask/lab icon, purple */}
              <div className="absolute top-1/2 left-1/2 h-[44px] w-[44px] -translate-x-[22px] -translate-y-[22px] animate-[orbit-lg_15s_linear_-5s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border-2 border-[rgba(140,80,220,0.7)] bg-[rgba(140,80,220,0.07)] shadow-[0_0_16px_rgba(140,80,220,0.25),0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                  title="Coming Soon"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 3h6M12 3v6.5m0 0L7 18a2 2 0 0 0 1.7 3h6.6A2 2 0 0 0 17 18l-5-8.5z"
                      stroke="rgba(140,80,220,0.95)"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="9" cy="17" r="1" fill="rgba(140,80,220,0.7)" />
                    <circle cx="14" cy="19" r="0.8" fill="rgba(140,80,220,0.5)" />
                  </svg>
                </div>
              </div>
              {/* Suite — 2×2 grid icon, faint white */}
              <div className="absolute top-1/2 left-1/2 h-[44px] w-[44px] -translate-x-[22px] -translate-y-[22px] animate-[orbit-lg_15s_linear_-10s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border-2 border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] shadow-[0_4px_12px_rgba(0,0,0,0.5)] backdrop-blur-sm"
                  title="Suite"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.6"
                    />
                    <rect
                      x="14"
                      y="3"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.6"
                    />
                    <rect
                      x="3"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.6"
                    />
                    <rect
                      x="14"
                      y="14"
                      width="7"
                      height="7"
                      rx="1.5"
                      stroke="rgba(255,255,255,0.6)"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
              </div>

              {/* ── Ring 3: concept elements at r=200px ── */}
              {/* Community — accent circle */}
              <div className="absolute top-1/2 left-1/2 h-[40px] w-[40px] -translate-x-[20px] -translate-y-[20px] animate-[orbit-xl_24s_linear_0s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border border-[rgba(200,241,53,0.5)] bg-[rgba(200,241,53,0.05)] text-[0.9rem] shadow-[0_0_12px_rgba(200,241,53,0.15)]"
                  title="Community"
                >
                  💬
                </div>
              </div>
              {/* Saturn-style planet — purple ring */}
              <div className="absolute top-1/2 left-1/2 h-[36px] w-[36px] -translate-x-[18px] -translate-y-[18px] animate-[orbit-xl_24s_linear_-8s_infinite]">
                <div
                  className="relative flex h-full w-full items-center justify-center rounded-full border border-[rgba(140,80,220,0.65)] bg-[rgba(140,80,220,0.06)] shadow-[0_0_12px_rgba(140,80,220,0.2)]"
                  title="Vision"
                >
                  {/* Saturn ring oval extending beyond the circle */}
                  <div className="absolute left-1/2 top-1/2 h-[35%] w-[175%] -translate-x-1/2 -translate-y-1/2 rotate-[-22deg] rounded-[50%] border border-[rgba(140,80,220,0.45)]" />
                </div>
              </div>
              {/* Privacy — soft white circle */}
              <div className="absolute top-1/2 left-1/2 h-[38px] w-[38px] -translate-x-[19px] -translate-y-[19px] animate-[orbit-xl_24s_linear_-16s_infinite]">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.04)] text-[0.85rem] shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
                  title="Privacy"
                >
                  🔒
                </div>
              </div>

              {/* ── Scatter decorative elements ── */}
              {/* Zigzag top-right */}
              <svg
                className="absolute top-[52px] right-[-18px]"
                width="28"
                height="16"
                viewBox="0 0 28 16"
                fill="none"
              >
                <path
                  d="M0 12 L7 2 L14 12 L21 2 L28 12"
                  stroke="rgba(200,241,53,0.5)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Cross left */}
              <svg
                className="absolute top-[115px] left-[4px]"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <path
                  d="M0 0L14 14M14 0L0 14"
                  stroke="rgba(200,241,53,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {/* Small glowing dot right-upper */}
              <div className="absolute top-[132px] right-[8px] h-[7px] w-[7px] rounded-full bg-[rgba(200,241,53,0.45)] shadow-[0_0_6px_rgba(200,241,53,0.6)]" />
              {/* Zigzag bottom-left */}
              <svg
                className="absolute bottom-[85px] left-[-12px]"
                width="22"
                height="13"
                viewBox="0 0 22 13"
                fill="none"
              >
                <path
                  d="M0 10 L5.5 1 L11 10 L16.5 1 L22 10"
                  stroke="rgba(200,241,53,0.28)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Cross bottom-right */}
              <svg
                className="absolute bottom-[115px] right-[4px]"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M0 0L12 12M12 0L0 12"
                  stroke="rgba(200,241,53,0.28)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {/* Tiny dot left-middle */}
              <div className="absolute top-[205px] left-[6px] h-[5px] w-[5px] rounded-full bg-[rgba(200,241,53,0.3)]" />
              {/* Tiny dot bottom */}
              <div className="absolute bottom-[225px] right-[-45px] h-[4px] w-[4px] rounded-full bg-[rgba(140,80,220,0.5)]" />

              {/* Floating corner accents */}
              <div className="absolute top-[-20px] right-[-100px] h-10 w-10 rotate-[12deg] rounded-[10px] border border-[rgba(200,241,53,0.22)] bg-[var(--accent-dim)] animate-[float-b_5s_ease-in-out_infinite]" />
              <div className="absolute bottom-[-10px] left-[-84px] h-7 w-7 rounded-full border border-[rgba(200,241,53,0.12)] bg-[rgba(255,255,255,0.025)] animate-[float-a_6s_ease-in-out_1s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
