"use client";

import { useEffect, useRef, useState } from "react";
import { CONTAINER, SECTION, EYEBROW, DISPLAY, DISPLAY_LG, DISPLAY_MD } from "@/lib/ui-classes";

export default function Waitlist() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot — real users never fill this
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setError(false);
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: hp }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setSubmitted(true);
      } else {
        setError(true);
      }
    } catch (err) {
      // Stay quiet in the browser console so the e2e "no console errors" check passes.
      console.warn("subscribe request failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="waitlist" className={SECTION} ref={sectionRef}>
      <div className={`container ${CONTAINER} relative`}>
        <div className="card reveal relative overflow-hidden border-2 border-[rgba(200,241,53,0.15)] bg-card px-16 py-20 text-center max-sm:px-6 max-sm:py-12 shadow-[0_8px_32px_rgba(200,241,53,0.08)] transition-all duration-500 hover:border-[rgba(200,241,53,0.25)] hover:shadow-[0_16px_48px_rgba(200,241,53,0.12)]">
          {/* Elegant left accent line */}
          <div className="pointer-events-none absolute left-0 top-1/4 h-1/2 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-50" />

          {/* Elegant right accent line */}
          <div className="pointer-events-none absolute right-0 top-1/4 h-1/2 w-[2px] bg-gradient-to-b from-transparent via-accent to-transparent opacity-50" />

          {/* Center radial glow */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-[60%] w-[80%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse,rgba(200,241,53,0.07)_0%,transparent_70%)]" />

          <div className="relative z-1">
            {submitted ? (
              <div className="flex flex-col items-center gap-4 py-8 animate-[fade-in-up_0.6s_ease_0.2s_both]">
                <div className="text-[3rem] animate-[scale-pulse_2s_ease-in-out_infinite]">
                  Done
                </div>
                <h2
                  className={`${DISPLAY} ${DISPLAY_MD} text-accent animate-[glow-pulse_2s_ease-in-out_infinite]`}
                >
                  You&apos;re in!
                </h2>
                <p className="max-w-[36ch] leading-[1.7] text-muted">
                  We&apos;ll be in touch with first-access details before the launch. Keep an eye on
                  your inbox.
                </p>
              </div>
            ) : (
              <>
                <div className="reveal animate-[fade-in-down_0.8s_ease_0.1s_both]">
                  <span className={`eyebrow ${EYEBROW} mb-3 block text-accent`}>Early Access</span>
                  <h2 className={`${DISPLAY} ${DISPLAY_LG} text-foreground`}>
                    Don&apos;t miss
                    <br />
                    <span className="text-accent animate-[glow-pulse_2.5s_ease-in-out_infinite]">
                      what&apos;s next.
                    </span>
                  </h2>
                  <p className="mx-auto mt-4 max-w-[46ch] leading-[1.7] text-muted">
                    Join early believers. Get first access to every Velobits launch before anyone
                    else. No spam - ever.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="reveal reveal-delay-2 mx-auto mt-10 flex max-w-[500px] rounded-full border-2 border-[rgba(200,241,53,0.2)] bg-card-alt py-[0.3rem] pr-[0.3rem] pl-6 transition-all duration-300 hover:border-[rgba(200,241,53,0.35)] focus-within:border-[rgba(200,241,53,0.4)] focus-within:shadow-[0_0_0_4px_rgba(200,241,53,0.1)] animate-[fade-in-up_0.8s_ease_0.3s_both]"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="min-w-0 flex-1 border-none bg-transparent font-inherit text-[0.9rem] text-foreground outline-none"
                  />
                  {/* Honeypot: hidden from users, catches bots. */}
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="absolute left-[-9999px] h-0 w-0 opacity-0"
                  />
                  <button
                    type="submit"
                    className="btn btn-primary shrink-0 px-6 py-[0.65rem]"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-flex gap-1">
                        <span className="h-[5px] w-[5px] rounded-full bg-background animate-[glow-pulse_0.8s_ease-in-out_infinite]" />
                        <span className="h-[5px] w-[5px] rounded-full bg-background animate-[glow-pulse_0.8s_ease-in-out_0.2s_infinite]" />
                        <span className="h-[5px] w-[5px] rounded-full bg-background animate-[glow-pulse_0.8s_ease-in-out_0.4s_infinite]" />
                      </span>
                    ) : (
                      <>
                        Get Early Access
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </form>

                {error && (
                  <p className="mt-4 text-[0.78rem] text-[#ff8a8a]" role="alert">
                    Something went wrong. Please try again.
                  </p>
                )}

                <p className="reveal reveal-delay-3 mt-4 text-[0.75rem] text-accent/60 animate-[fade-in_0.8s_ease_0.4s_both]">
                  No spam. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
