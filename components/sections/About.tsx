"use client";

import { useEffect, useRef, useState } from "react";

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

  const stat0 = useCountUp(1, 800, statsActive);
  const stat1 = useCountUp(100, 1200, statsActive);

  return (
    <section id="about" className="section relative pt-20 pb-20" ref={sectionRef}>
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

        <div className="about-grid grid items-center gap-12 [grid-template-columns:60%_40%] max-[1024px]:[grid-template-columns:55%_45%] max-[860px]:grid-cols-1 max-[860px]:gap-10">
          <div className="flex flex-col gap-[1.4rem]">
            <p className="reveal max-w-[54ch] text-[0.97rem] leading-[1.9] text-muted">
              We started Velobits because we kept hitting the same wall - great ideas, terrible
              tools. So we decided to build them ourselves and give them to the world.
            </p>

            <p className="reveal reveal-delay-1 max-w-[54ch] text-[0.97rem] leading-[1.9] text-muted">
              Every product starts with a real problem. We listen first, build second. No bloat.
              No vaporware. <span className="font-bold text-foreground">Just bits that matter.</span>
            </p>

            <div className="reveal reveal-delay-2 flex max-w-[54ch] items-center gap-[1.1rem] rounded-2xl border border-[rgba(200,241,53,0.12)] bg-[rgba(200,241,53,0.04)] px-[1.4rem] py-[1.1rem]">
              <div className="h-[34px] w-[3px] shrink-0 rounded-full bg-accent" />
              <p className="text-[0.88rem] leading-[1.65] text-foreground italic">
                &quot;We build tools that work for people, not the other way around.&quot;
              </p>
            </div>

            <div className="reveal reveal-delay-3 mt-2 grid max-w-[54ch] grid-cols-3 gap-[0.8rem]">
              {stats.map((s, i) => (
                <div key={s.label} className="card p-[1.1rem] text-center">
                  <div className="mb-[0.35rem] font-[var(--font-display)] text-[1.6rem] leading-1 font-extrabold text-accent">
                    {s.display ? s.display : i === 0 ? stat0 + s.suffix : i === 1 ? stat1 + s.suffix : s.value + s.suffix}
                  </div>
                  <div className="text-[0.62rem] leading-[1.5] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="about-visual flex items-center justify-end max-[860px]:hidden">
            <div className="relative h-[460px] w-[460px]">
              <div className="absolute inset-0 rounded-full border border-dashed border-[rgba(255,255,255,0.07)]" />
              <div className="absolute inset-[70px] rounded-full border border-dashed border-[rgba(200,241,53,0.14)]" />

              <div className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.16),transparent_70%)] blur-[22px] animate-[glow-pulse_3.5s_ease-in-out_infinite]" />

              <div className="absolute top-1/2 left-1/2 z-2 flex h-[90px] w-[90px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[rgba(200,241,53,0.25)] bg-card shadow-[0_0_36px_rgba(200,241,53,0.14)]">
                <span className="font-[var(--font-display)] text-[1.5rem] font-extrabold text-accent">⚡</span>
              </div>

              {[
                { icon: "✏️", label: "FixMyText", anim: "animate-[orbit-lg_13s_linear_infinite]" },
                { icon: "🔮", label: "Soon", anim: "animate-[orbit-lg_17s_linear_-6s_infinite]" },
                { icon: "🌌", label: "Suite", anim: "animate-[orbit-lg_22s_linear_-12s_infinite]" },
              ].map(({ icon, label, anim }) => (
                <div
                  key={label}
                  className={`absolute top-1/2 left-1/2 h-[58px] w-[58px] -translate-x-[29px] -translate-y-[29px] ${anim}`}
                >
                  <div
                    className="flex h-full w-full items-center justify-center rounded-full border border-border-subtle bg-card text-[1.35rem] shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                    title={label}
                  >
                    {icon}
                  </div>
                </div>
              ))}

              {[
                { key: 0, anim: "animate-[orbit-reverse-lg_8s_linear_0s_infinite]" },
                { key: 120, anim: "animate-[orbit-reverse-lg_8s_linear_-2.6667s_infinite]" },
                { key: 240, anim: "animate-[orbit-reverse-lg_8s_linear_-5.3333s_infinite]" },
              ].map(({ key, anim }) => (
                <div
                  key={key}
                  className={`absolute top-1/2 left-1/2 h-[9px] w-[9px] -translate-x-[4.5px] -translate-y-[4.5px] ${anim}`}
                >
                  <div className="h-full w-full rounded-full bg-accent opacity-55" />
                </div>
              ))}

              <div className="absolute top-[-20px] right-[-20px] h-11 w-11 rotate-[12deg] rounded-[10px] border border-[rgba(200,241,53,0.2)] bg-[var(--accent-dim)] animate-[float-b_5s_ease-in-out_infinite]" />
              <div className="absolute bottom-[-14px] left-[-14px] h-7 w-7 rounded-full border border-border-subtle bg-[rgba(255,255,255,0.025)] animate-[float-a_6s_ease-in-out_1s_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
