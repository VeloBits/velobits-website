/** Accent-colored SVG icons for each product. `size` defaults to 22px. */
export default function ProductIcon({ id, size = 22 }: { id: string; size?: number }) {
  const props = { width: size, height: size, fill: "none", viewBox: "0 0 24 24" } as const;
  const stroke = "var(--accent)";
  const sw = "1.6";

  if (id === "fixmytext") {
    // Pencil / edit icon
    return (
      <svg {...props} aria-hidden="true">
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (id === "mystery") {
    // Sparkle / question mark icon
    return (
      <svg {...props} aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth={sw} />
        <path
          d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (id === "suite") {
    // Grid / suite icon
    return (
      <svg {...props} aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth={sw} />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth={sw} />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth={sw} />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke={stroke} strokeWidth={sw} />
      </svg>
    );
  }

  // Fallback — generic box
  return (
    <svg {...props} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke={stroke} strokeWidth={sw} />
    </svg>
  );
}
