"use client";

const items = [
  "AI-Powered Tools", "Privacy First", "Community Driven", "Free to Start",
  "Bits That Matter", "Open Roadmap", "Built for Everyone", "Zero Bloat",
];

// Double the array so the seamless loop works perfectly
const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div
      style={{
        padding: "1.35rem 0",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        overflow: "hidden",
        WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      {/* scrolling row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "nowrap",
          width: "max-content",
          animation: "marquee 32s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.9rem",
              padding: "0 2.2rem",
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                color: i % 4 === 0 ? "var(--accent)" : "var(--text-muted)",
              }}
            >
              {item}
            </span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: i % 4 === 0 ? "var(--accent)" : "rgba(255,255,255,0.15)",
                flexShrink: 0,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
