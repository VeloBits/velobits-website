"use client";

import { useEffect, useRef, useState } from "react";
import { poll, type PollCount } from "@/lib/site-content";
import { CONTAINER, SECTION, EYEBROW, DISPLAY, DISPLAY_LG, PILL_BASE } from "@/lib/ui-classes";

const VOTER_KEY = "vb_voter_id";
const votedKey = (pollId: string) => `vb_voted_${pollId}`;

function getVoterId(): string {
  try {
    let id = localStorage.getItem(VOTER_KEY);
    if (!id) {
      id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(VOTER_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

export default function CommunityPulse() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  const [idea, setIdea] = useState("");
  const [ideaHp, setIdeaHp] = useState(""); // honeypot
  const [submitted, setSubmitted] = useState(false);
  const [counts, setCounts] = useState<PollCount[]>([]);
  const [voteIdx, setVoteIdx] = useState<number | null>(null);
  const [voted, setVoted] = useState(false);

  const countFor = (optionId: string) => counts.find((c) => c.option_id === optionId)?.count ?? 0;
  const total = poll.options.reduce((sum, o) => sum + countFor(o.id), 0);

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

  // Load live counts + restore any prior vote for this browser.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/poll")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.ok && Array.isArray(d.counts)) setCounts(d.counts);
      })
      .catch((err) => console.warn("poll fetch failed", err));

    // Restore a prior vote post-mount. This must run in an effect (not a lazy
    // useState initializer) so the SSR markup matches the first client render;
    // reading localStorage during render would cause a hydration mismatch.
    /* eslint-disable react-hooks/set-state-in-effect -- intentional post-mount hydration from localStorage */
    try {
      const prior = localStorage.getItem(votedKey(poll.id));
      if (prior) {
        const idx = poll.options.findIndex((o) => o.id === prior);
        if (idx >= 0) setVoteIdx(idx);
        setVoted(true);
        setBarsVisible(true);
      }
    } catch {
      /* localStorage unavailable — ignore */
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => {
      cancelled = true;
    };
  }, []);

  const submitVote = async () => {
    if (voted) return;
    const idx = voteIdx ?? 0;
    setVoteIdx(idx);
    setBarsVisible(true);
    const option = poll.options[idx];
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option_id: option.id, voter_id: getVoterId() }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        if (Array.isArray(data.counts)) setCounts(data.counts);
        setVoted(true);
        try {
          localStorage.setItem(votedKey(poll.id), option.id);
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      console.warn("vote failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, website: ideaHp }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (res.ok && data.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setIdea("");
          setSubmitted(false);
        }, 3000);
      }
    } catch (err) {
      console.warn("idea submit failed", err);
    }
  };

  return (
    <section id="community" className={SECTION} ref={sectionRef}>
      <div className="pointer-events-none absolute top-[20%] left-1/2 h-[400px] w-[700px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(200,241,53,0.04)_0%,transparent_70%)]" />

      <div className={`container ${CONTAINER} relative`}>
        <div className="reveal mb-14 text-center">
          <span className={`eyebrow ${EYEBROW} text-muted`}>Community Pulse</span>
          <h2 className={`${DISPLAY} ${DISPLAY_LG} text-foreground mt-3`}>
            You decide what we <span className="text-accent">build next.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[50ch] leading-[1.7] text-muted">
            Drop a product idea, vote on existing ones, or just tell us what problem you wish
            someone would solve.
          </p>
        </div>

        <div className="community-grid grid gap-6 [grid-template-columns:1fr_1fr] max-md:grid-cols-1">
          <div
            className="card reveal flex flex-col p-8 border-2 border-[rgba(200,241,53,0.15)] transition-all duration-500 hover:border-[rgba(200,241,53,0.3)] hover:shadow-[0_12px_40px_rgba(200,241,53,0.1)] hover:-translate-y-1"
            ref={barsRef}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className={`eyebrow ${EYEBROW} text-muted mb-[0.3rem]`}>Active Poll</div>
                <h3 className="max-w-[26ch] font-display text-[1.05rem] leading-[1.45] font-extrabold tracking-[-0.01em] uppercase">
                  {poll.question}
                </h3>
              </div>
              <span className={`pill ${PILL_BASE} pill-dot self-start bg-card border-border-subtle text-[0.73rem] text-accent`}>Live</span>
            </div>

            <div className="flex flex-col gap-4">
              {poll.options.map((opt, i) => {
                const pct = total === 0 ? 0 : Math.round((countFor(opt.id) / total) * 100);
                const selected = voteIdx === i;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      if (!voted) setVoteIdx(i);
                    }}
                    disabled={voted}
                    className={`border-none bg-transparent p-0 text-left transition-all duration-300 ${voted ? "cursor-default" : "cursor-pointer hover:pl-1"} ${voteIdx !== null && !selected ? "opacity-55" : "opacity-100"}`}
                  >
                    <div className="mb-[0.4rem] flex justify-between">
                      <span
                        className={`text-[0.83rem] ${selected ? "font-semibold text-foreground" : "font-normal text-muted"}`}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={`text-[0.8rem] font-bold ${selected ? "text-accent" : "text-muted"}`}
                      >
                        {pct}%
                      </span>
                    </div>
                    <div className="poll-bar-track">
                      <div
                        className={`poll-bar-fill ${selected ? "bg-accent" : "bg-[rgba(200,241,53,0.45)]"}`}
                        style={{
                          width: barsVisible ? `${pct}%` : "0%",
                          transitionDelay: `${i * 150}ms`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-5">
              <span className="text-[0.75rem] text-accent">
                {total === 0
                  ? "Be the first to vote"
                  : `${total.toLocaleString()} vote${total === 1 ? "" : "s"}`}
              </span>
              <button
                onClick={submitVote}
                disabled={voted}
                className="btn btn-primary px-4 py-2 text-[0.78rem]"
              >
                {voted ? "Voted" : "Cast Vote"}
              </button>
            </div>
          </div>

          <div className="card reveal reveal-delay-2 relative overflow-hidden p-8 border-2 border-[rgba(200,241,53,0.15)] transition-all duration-500 hover:border-[rgba(200,241,53,0.3)] hover:shadow-[0_12px_40px_rgba(200,241,53,0.1)] hover:-translate-y-1">
            {submitted && (
              <div className="absolute inset-0 z-10 flex animate-[pop-in_0.4s_ease] flex-col items-center justify-center gap-4 rounded-[var(--radius-card)] bg-card">
                <div className="text-[2.5rem]">Done</div>
                <div className="text-[1rem] font-semibold text-accent">Idea submitted!</div>
                <div className="max-w-[24ch] text-center text-[0.8rem] text-muted">
                  We read every single one. Thank you!
                </div>
              </div>
            )}

            <div className={`eyebrow ${EYEBROW} text-muted mb-2`}>Got an Idea?</div>
            <h3 className="mb-5 font-display text-[1.05rem] leading-[1.45] font-extrabold tracking-[-0.01em] uppercase">
              Describe a problem you&apos;d love us to solve.
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. I wish there was a tool that automatically summarizes long articles into bullet points..."
                rows={5}
                className="w-full resize-y rounded-[14px] border-2 border-[rgba(200,241,53,0.1)] bg-card-alt p-4 font-inherit text-[0.85rem] leading-[1.7] text-foreground outline-none transition-all duration-300 hover:border-[rgba(200,241,53,0.2)] focus:border-[rgba(200,241,53,0.4)] focus:shadow-[0_0_0_4px_rgba(200,241,53,0.12)]"
              />

              {/* Honeypot: hidden from users, catches bots. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={ideaHp}
                onChange={(e) => setIdeaHp(e.target.value)}
                className="absolute left-[-9999px] h-0 w-0 opacity-0"
              />

              <button type="submit" className="btn btn-primary self-start px-4 py-2 text-[0.78rem]">
                Submit Idea
              </button>

              <p className="flex items-center gap-[0.35rem] text-[0.72rem] text-accent">
                No login required. We read every single one.
              </p>
            </form>
          </div>
        </div>
      </div>

    </section>
  );
}
