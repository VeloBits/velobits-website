"use client";

const items = [
  "AI-Powered Tools",
  "Privacy First",
  "Community Driven",
  "Free to Start",
  "Bits That Matter",
  "Open Roadmap",
  "Built for Everyone",
  "Zero Bloat",
];

const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-border-subtle py-[1.35rem] [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
      <div className="flex w-max flex-nowrap animate-[marquee_32s_linear_infinite]">
        {doubled.map((item, i) => (
          <div key={i} className="inline-flex shrink-0 items-center gap-[0.9rem] whitespace-nowrap px-[2.2rem]">
            <span
              className={`font-display text-[0.72rem] font-bold tracking-[0.18em] uppercase ${i % 4 === 0 ? "text-accent" : "text-muted"}`}
            >
              {item}
            </span>
            <span
              className={`h-[3px] w-[3px] shrink-0 rounded-full ${i % 4 === 0 ? "bg-accent" : "bg-[rgba(255,255,255,0.15)]"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
