"use client";

import { useEffect, useRef, useState } from "react";

const polls = [
  {
    id: "p1",
    question: "What should we build after FixMyText?",
    options: [
      { label: "Password Manager", pct: 72 },
      { label: "Note-taking App", pct: 48 },
      { label: "Screenshot Tool", pct: 41 },
      { label: "Code Snippets", pct: 31 },
    ],
    totalVotes: 1247,
    daysLeft: 14,
  },
];

const categories = ["Productivity", "Writing", "Dev Tools", "Design", "Other"];

export default function CommunityPulse() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  const [selectedCat, setSelectedCat] = useState("Productivity");
  const [idea, setIdea] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [voteIdx, setVoteIdx] = useState<number | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setIdea("");
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section id="community" className="section relative" ref={sectionRef}>
      <div className="pointer-events-none absolute top-[20%] left-1/2 h-[400px] w-[700px] -translate-x-1/2 bg-[radial-gradient(ellipse,rgba(200,241,53,0.04)_0%,transparent_70%)]" />

      <div className="container relative">
        <div className="reveal mb-14 text-center">
          <span className="eyebrow">Community Pulse</span>
          <h2 className="display display-lg mt-3">
            You decide what we <span className="text-accent">build next.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-[50ch] leading-[1.7] text-muted">
            Drop a product idea, vote on existing ones, or just tell us what problem you wish
            someone would solve.
          </p>
        </div>

        <div className="community-grid grid gap-6 [grid-template-columns:1fr_1fr] max-md:grid-cols-1">
          <div className="card reveal p-8" ref={barsRef}>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="eyebrow mb-[0.3rem]">Active Poll</div>
                <h3 className="max-w-[26ch] font-display text-[1.05rem] leading-[1.45] font-extrabold tracking-[-0.01em] uppercase">
                  {polls[0].question}
                </h3>
              </div>
              <span className="pill pill-dot self-start">Live</span>
            </div>

            <div className="flex flex-col gap-4">
              {polls[0].options.map((opt, i) =>
                (() => {
                  const widthClass = barsVisible
                    ? i === 0
                      ? "w-[72%]"
                      : i === 1
                        ? "w-[48%]"
                        : i === 2
                          ? "w-[41%]"
                          : "w-[31%]"
                    : "w-0";
                  const delayClass =
                    i === 0
                      ? "delay-[0ms]"
                      : i === 1
                        ? "delay-[150ms]"
                        : i === 2
                          ? "delay-[300ms]"
                          : "delay-[450ms]";
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setVoteIdx(i)}
                      className={`cursor-pointer border-none bg-transparent p-0 text-left transition-opacity duration-200 ${voteIdx !== null && voteIdx !== i ? "opacity-55" : "opacity-100"}`}
                    >
                      <div className="mb-[0.4rem] flex justify-between">
                        <span
                          className={`text-[0.83rem] ${voteIdx === i ? "font-semibold text-foreground" : "font-normal text-muted"}`}
                        >
                          {opt.label}
                        </span>
                        <span
                          className={`text-[0.8rem] font-bold ${voteIdx === i ? "text-accent" : "text-muted"}`}
                        >
                          {opt.pct}%
                        </span>
                      </div>
                      <div className="poll-bar-track">
                        <div
                          className={`poll-bar-fill ${widthClass} ${delayClass} ${voteIdx === i ? "bg-accent" : "bg-[rgba(200,241,53,0.45)]"}`}
                        />
                      </div>
                    </button>
                  );
                })()
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-5">
              <span className="text-[0.75rem] text-muted">
                {polls[0].totalVotes.toLocaleString()} votes - {polls[0].daysLeft} days left
              </span>
              <button
                onClick={() => setVoteIdx(voteIdx !== null ? voteIdx : 0)}
                className="btn btn-primary px-4 py-2 text-[0.78rem]"
              >
                {voteIdx !== null ? "Voted" : "Cast Vote"}
              </button>
            </div>
          </div>

          <div className="card reveal reveal-delay-2 relative overflow-hidden p-8">
            {submitted && (
              <div className="absolute inset-0 z-10 flex animate-[pop-in_0.4s_ease] flex-col items-center justify-center gap-4 rounded-[var(--radius-card)] bg-card">
                <div className="text-[2.5rem]">Done</div>
                <div className="text-[1rem] font-semibold text-accent">Idea submitted!</div>
                <div className="max-w-[24ch] text-center text-[0.8rem] text-muted">
                  We read every single one. Thank you!
                </div>
              </div>
            )}

            <div className="eyebrow mb-2">Got an Idea?</div>
            <h3 className="mb-5 font-display text-[1.05rem] leading-[1.45] font-extrabold tracking-[-0.01em] uppercase">
              Describe a problem you&apos;d love us to solve.
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="e.g. I wish there was a tool that automatically summarizes long articles into bullet points..."
                rows={5}
                className="w-full resize-y rounded-[14px] border border-border-subtle bg-card-alt p-4 font-inherit text-[0.85rem] leading-[1.7] text-foreground outline-none transition-[border-color,box-shadow] duration-250 focus:border-[rgba(200,241,53,0.5)] focus:shadow-[0_0_0_3px_rgba(200,241,53,0.1)]"
              />

              <div>
                <div className="mb-2 text-[0.7rem] tracking-[0.1em] text-muted uppercase">
                  Category
                </div>
                <div className="flex flex-wrap gap-[0.4rem]">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCat(cat)}
                      className={`cursor-pointer rounded-full border px-3 py-[0.3rem] text-[0.75rem] font-semibold transition-all duration-200 ${selectedCat === cat ? "border-[rgba(200,241,53,0.4)] bg-[var(--accent-dim)] text-accent" : "border-border-subtle bg-transparent text-muted"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn btn-primary self-start">
                Submit Idea
              </button>

              <p className="flex items-center gap-[0.35rem] text-[0.72rem] text-faint">
                No login required. We read every single one.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
