"use client";

import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "vb-theme";

/**
 * Runs before first paint (injected in <head> by app/layout.tsx).
 *
 * It only has to apply an EXPLICIT stored preference. The "follow the OS" case
 * needs no JS at all because :root declares `color-scheme: light dark` and every
 * token is a `light-dark()` pair — so the correct theme is already painted on
 * the very first frame, even with JS disabled. That is why there is no flash.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;

/** The product ships light-first: with no stored choice the answer is "light",
 *  regardless of the OS. The OS is not consulted anywhere. */
const DEFAULT_THEME: Theme = "light";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  // Keep the mobile browser chrome in step with the page.
  const meta = document.querySelector('meta[name="theme-color"]:not([media])');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0a0a" : "#faf9f6");
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // Starts at the default rather than null: because light is now the default
  // (not an OS coin-flip), the server already knows what the first paint looks
  // like, so the correct icon can render immediately with no mismatch.
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      /* storage blocked (private mode / embedded) — stay on the default */
    }
    if (stored !== "light" && stored !== "dark") return;
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage
       only exists on the client, so a stored override can only be applied after
       mount. Reading it during render would desync SSR from hydration. */
    setTheme(stored);
  }, []);

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage blocked — the toggle still works for this page view */
      }
      return next;
    });
  }, []);

  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border-subtle bg-transparent text-foreground transition-[background-color,border-color,color] duration-200 hover:border-border-strong hover:bg-card-alt hover:text-accent ${className}`}
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-500 ease-expo"
        style={{ transform: theme === "dark" ? "rotate(-180deg)" : "rotate(0deg)" }}
      >
        {theme === "dark" ? (
          /* In dark mode the control offers light — show a sun. */
          <>
            <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.7" />
            <path
              d="M12 2.4v2.3M12 19.3v2.3M4.4 12H2.1M21.9 12h-2.3M6.3 6.3 4.7 4.7M19.3 19.3l-1.6-1.6M6.3 17.7l-1.6 1.6M19.3 4.7l-1.6 1.6"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </>
        ) : (
          /* In light mode the control offers dark — show a moon. */
          <path
            d="M20.4 13.9A8.6 8.6 0 1 1 10.1 3.6a6.9 6.9 0 0 0 10.3 10.3z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
