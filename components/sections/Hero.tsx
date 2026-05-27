"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (glowRef.current)
        glowRef.current.setAttribute("style", `transform: translateY(${window.scrollY * 0.22}px);`);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-[7.5rem] pb-12"
    >
      <div ref={glowRef} className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-[-12%] left-[-6%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(circle,rgba(200,241,53,0.07)_0%,transparent_60%)] blur-[70px] animate-[glow-pulse_7s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-8%] h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle,rgba(90,50,210,0.08)_0%,transparent_65%)] blur-[60px] animate-[glow-pulse_9s_ease-in-out_3s_infinite]" />
      </div>

      <div className="container relative z-1 w-full">
        <div className="hero-grid grid items-center gap-12 [grid-template-columns:1fr_1fr]">
          <div className="flex flex-col gap-[1.6rem]">
            <div className="flex items-center gap-3 animate-[pop-in_0.5s_ease_0.1s_both]">
              <div className="h-[1.5px] w-8 bg-accent opacity-85" />
              <span className="font-[var(--font-display)] text-[0.68rem] font-bold tracking-[0.22em] text-accent uppercase">
                Bits that matter.
              </span>
            </div>

            <div className="animate-[pop-in_0.55s_ease_0.2s_both]">
              <span className="pill pill-accent pill-dot">&nbsp;Launching Soon - FixMyText</span>
            </div>

            <h1 className="animate-[pop-in_0.65s_ease_0.3s_both] font-[var(--font-display)] text-[clamp(2.2rem,3.2vw,3.9rem)] leading-[0.93] font-extrabold tracking-[-0.025em] text-foreground uppercase">
              The smarter
              <br />
              <span className="text-accent">way</span> to build
              <br />
              software.
            </h1>

            <p className="max-w-[38ch] animate-[pop-in_0.65s_ease_0.42s_both] text-[0.97rem] leading-[1.82] text-muted">
              Velobits crafts thoughtful, everyday tools that cut through the noise. One product
              at a time - each one a <span className="font-semibold text-foreground">bit that matters.</span>
            </p>

            <div className="flex flex-wrap gap-3 animate-[pop-in_0.65s_ease_0.52s_both]">
              <a href="https://app.velobits.dev" className="btn btn-primary">
                Explore FixMyText
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a href="#community" className="btn btn-ghost">
                Community Pulse
              </a>
            </div>

            <div className="flex flex-wrap gap-[0.4rem] animate-[pop-in_0.65s_ease_0.62s_both]">
              {["AI-Powered", "Privacy-first", "Free to start", "Community-driven"].map((tag) => (
                <span key={tag} className="pill text-[0.68rem]">
                  * {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="hero-visual relative h-[500px] animate-[pop-in_0.8s_ease_0.45s_both]">
            <div className="card absolute top-[3%] left-[0%] z-4 flex min-w-[132px] items-center gap-[0.6rem] px-[0.9rem] py-[0.6rem] shadow-[0_8px_28px_rgba(0,0,0,0.55)] animate-[float-b_4.5s_ease-in-out_infinite]">
              <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-dim)] text-[0.85rem]">
                OK
              </div>
              <div>
                <div className="font-[var(--font-display)] text-[0.95rem] leading-1 font-extrabold text-accent">
                  98%
                </div>
                <div className="mt-[2px] text-[0.6rem] text-muted">Accuracy score</div>
              </div>
            </div>

            <div className="sticker absolute top-[0%] right-[2%] z-4 h-[58px] w-[58px] text-[0.54rem]">
              TRY
              <br />
              FREE
            </div>

            <div className="card absolute top-[40%] left-[44%] z-2 w-[84%] -translate-x-1/2 -translate-y-1/2 px-6 pt-6 pb-[1.4rem] shadow-[0_28px_72px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.05)] animate-[float-a_5.5s_ease-in-out_infinite]">
              <div className="mb-[1.05rem] flex items-center gap-[0.35rem] border-b border-border-subtle pb-[0.85rem]">
                <span className="inline-block h-2 w-2 rounded-full bg-[#ff5f57]" />
                <span className="inline-block h-2 w-2 rounded-full bg-[#febc2e]" />
                <span className="inline-block h-2 w-2 rounded-full bg-[#28c840]" />
                <span className="ml-[0.4rem] flex-1 rounded-[5px] bg-card-alt px-[0.65rem] py-[0.15rem] text-[0.67rem] tracking-[0.02em] text-faint">
                  app.fixmytext.com
                </span>
              </div>

              <div className="mb-[0.4rem] text-[0.6rem] font-bold tracking-[0.14em] text-muted uppercase">
                Original
              </div>
              <div className="mb-[0.75rem] rounded-[9px] border border-border-subtle bg-card-alt px-[0.9rem] py-[0.7rem]">
                <p className="text-[0.78rem] leading-[1.62] text-muted">
                  I writed this email yesterday but i think it can be improved alot. Can you help
                  me?
                </p>
              </div>

              <div className="mb-[0.75rem] flex gap-[0.35rem]">
                {["Fix Grammar", "Rephrase", "Improve Tone"].map((a, i) => (
                  <span
                    key={a}
                    className={`whitespace-nowrap rounded-full border px-[0.6rem] py-[0.25rem] text-[0.67rem] font-semibold ${i === 0 ? "border-[rgba(200,241,53,0.3)] bg-[var(--accent-dim)] text-accent" : "border-border-subtle bg-card-alt text-muted"}`}
                  >
                    {a}
                  </span>
                ))}
              </div>

              <div className="mb-[0.4rem] text-[0.6rem] font-bold tracking-[0.14em] text-accent uppercase">
                * Fixed
              </div>
              <div className="relative overflow-hidden rounded-[9px] border border-[rgba(200,241,53,0.16)] bg-[rgba(200,241,53,0.05)] px-[0.9rem] py-[0.7rem]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(200,241,53,0.07)_50%,transparent_80%)] animate-[shimmer-sweep_3.5s_ease-in-out_infinite]" />
                <p className="relative text-[0.78rem] leading-[1.62] text-foreground">
                  I wrote this email yesterday, but I believe it could be improved significantly.
                  Could you help me refine it?
                </p>
              </div>
            </div>

            <div className="absolute top-[42%] left-[3%] z-3 flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border-subtle bg-card text-[1rem] shadow-[0_4px_16px_rgba(0,0,0,0.4)] animate-[float-a_4.2s_ease-in-out_infinite]">
              P
            </div>

            <div className="absolute right-[3%] bottom-[18%] z-3 flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-card text-[0.9rem] shadow-[0_4px_16px_rgba(0,0,0,0.4)] animate-[float-b_3.8s_ease-in-out_1s_infinite]">
              N
            </div>

            <div className="absolute bottom-[12%] left-[14%] z-1">
              <span className="relative flex h-[9px] w-[9px]">
                <span className="absolute inset-0 rounded-full bg-accent opacity-45 animate-[ping_2.2s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <span className="inline-block h-[9px] w-[9px] rounded-full bg-accent opacity-90" />
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-[0.4rem] opacity-30 animate-[pop-in_1s_ease_1.2s_both]">
          <span className="text-[0.58rem] tracking-[0.2em] text-muted uppercase">
            Scroll to explore
          </span>
          <svg
            width="14"
            height="22"
            viewBox="0 0 14 22"
            fill="none"
            className="animate-[float-a_2.2s_ease-in-out_infinite]"
          >
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
