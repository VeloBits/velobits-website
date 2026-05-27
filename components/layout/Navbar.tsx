"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Products", href: "#products", soon: false },
  { label: "Community", href: "#community", soon: false },
  { label: "About", href: "#about", soon: false },
  { label: "Blog", href: "#", soon: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [menuOpen]);

  return (
    <>
      <div className="pointer-events-none fixed top-0 right-0 left-0 z-[100] flex justify-center px-6 pt-4 pb-4">
        <nav
          id="navbar"
          className={`pointer-events-auto flex w-full max-w-[860px] items-center justify-between gap-6 rounded-[var(--radius-card)] border px-2 py-2 pl-[1.1rem] backdrop-blur-[18px] transition-[background,box-shadow] duration-350 ${scrolled ? "border-[rgba(255,255,255,0.09)] bg-[rgba(10,10,10,0.88)] shadow-[0_8px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.05)]" : "border-[rgba(255,255,255,0.09)] bg-[rgba(16,16,16,0.72)] shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)]"}`}
        >
          <a href="#" className="flex shrink-0 items-center gap-2 no-underline">
            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[8px] bg-accent text-[0.9rem] text-background">
              ⚡
            </span>
            <span className="font-[var(--font-display)] text-[1.05rem] font-extrabold tracking-[0.06em] text-foreground uppercase">
              Velobits
            </span>
          </a>

          <div className="desktop-nav flex flex-1 items-center justify-center gap-[0.1rem]">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`inline-flex items-center gap-[0.35rem] rounded-full px-[0.85rem] py-[0.42rem] text-[0.84rem] font-medium whitespace-nowrap no-underline transition-[background,color] duration-200 hover:bg-[rgba(255,255,255,0.07)] ${item.soon ? "text-muted" : "text-foreground hover:text-white"}`}
              >
                {item.label}
                {item.soon && (
                  <span className="rounded-full bg-[rgba(255,255,255,0.07)] px-[0.45rem] py-[0.15rem] text-[0.55rem] font-bold tracking-[0.1em] text-muted uppercase">
                    Soon
                  </span>
                )}
              </a>
            ))}
          </div>

          <a href="#waitlist" className="btn btn-primary shrink-0 rounded-full px-5 py-[0.55rem] text-[0.82rem]">
            Join Waitlist
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>

          <button
            className="menu-toggle hidden shrink-0 cursor-pointer rounded-[8px] border-none bg-transparent p-[0.4rem] text-foreground"
            aria-label="Toggle menu"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </nav>
      </div>

      {menuOpen && (
        <div
          className="fixed top-[4.5rem] right-6 left-6 z-[99] flex flex-col gap-1 rounded-[var(--radius-card)] border border-[rgba(255,255,255,0.09)] bg-[rgba(12,12,12,0.96)] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-[20px]"
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-[14px] px-4 py-3 text-[0.95rem] font-medium no-underline transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)] ${item.soon ? "text-muted" : "text-foreground"}`}
            >
              {item.label}
              {item.soon && (
                <span className="rounded-full bg-[rgba(255,255,255,0.07)] px-[0.4rem] py-[0.12rem] text-[0.58rem] font-bold tracking-[0.1em] text-muted uppercase">
                  Soon
                </span>
              )}
            </a>
          ))}
          <div className="mt-1 border-t border-border-subtle pt-3">
            <a
              href="#waitlist"
              className="btn btn-primary w-full justify-center text-[0.9rem]"
              onClick={() => setMenuOpen(false)}
            >
              Join Waitlist →
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .desktop-nav { display: none !important; }
          .menu-toggle { display: flex !important; }
          #navbar > a.btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
