"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { navLinks, brand } from "@/lib/site-content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    const onOutsideClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !toggleRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onOutsideClick);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onOutsideClick);
    };
  }, [menuOpen]);

  return (
    <header role="banner" className="pointer-events-none fixed top-0 right-0 left-0 z-[100] flex justify-center px-4 pt-4 pb-4">
      <nav
        id="navbar"
        aria-label="Main navigation"
        className={`pointer-events-auto flex w-full max-w-[1100px] items-center justify-between gap-6 rounded-[10px] border px-4 py-[0.55rem] pl-[1.1rem] backdrop-blur-[18px] transition-[background,box-shadow,border-color] duration-300 ${
          scrolled
            ? "border-[rgba(200,241,53,0.25)] bg-[rgba(10,10,10,0.92)] shadow-[0_8px_40px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.05),inset_0_-1px_0_rgba(200,241,53,0.08)]"
            : "border-[rgba(200,241,53,0.15)] bg-[rgba(16,16,16,0.75)] shadow-[0_4px_24px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.04)]"
        }`}
      >
        {/* Logo */}
        <a
          href="#"
          aria-label="Velobits home"
          className="group flex shrink-0 items-center gap-[0.6rem] no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-[6px] transition-transform duration-200 hover:scale-[1.03]"
        >
          <Image
            src="/velobits-color-png.png"
            alt={brand.logo.alt}
            width={52}
            height={14}
            priority
            sizes="(max-width: 640px) 40px, 52px"
            style={{ height: "auto", width: "auto" }}
            className="h-[26px] transition-[filter] duration-200 group-hover:drop-shadow-[0_0_8px_rgba(200,241,53,0.35)]"
          />
          <span className="font-[var(--font-display)] text-[1.2rem] font-extrabold tracking-[-0.03em] text-accent uppercase">
            {brand.name}
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="desktop-nav flex flex-1 items-center justify-center gap-[0.25rem]">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`inline-flex items-center gap-[0.35rem] rounded-full px-[0.85rem] py-[0.42rem] text-[0.84rem] font-medium whitespace-nowrap no-underline transition-[background,color] duration-200 hover:bg-[rgba(255,255,255,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                item.soon ? "text-muted" : "text-foreground hover:text-white"
              }`}
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

        {/* Desktop CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="nav-divider h-[18px] w-[1px] bg-[rgba(255,255,255,0.1)] rounded-full" />
          <a
            href="#waitlist"
            className="btn btn-primary rounded-full px-5 py-[0.55rem] text-[0.82rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Join Waitlist
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          ref={toggleRef}
          className="menu-toggle hidden shrink-0 cursor-pointer rounded-[8px] border-none bg-transparent p-[0.4rem] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {menuOpen ? (
              <path
                d="M6 6l12 12M6 18L18 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 6h16M4 12h16M4 18h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          id="mobile-menu"
          role="menu"
          className="pointer-events-auto absolute top-[4.6rem] right-4 left-4 z-[99] flex flex-col gap-1 rounded-[12px] border border-[rgba(255,255,255,0.09)] bg-[rgba(12,12,12,0.97)] p-3 shadow-[0_16px_48px_rgba(0,0,0,0.5)] backdrop-blur-[20px] animate-[menu-slide-in_0.2s_ease_both]"
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 rounded-[10px] px-4 py-3 text-[0.95rem] font-medium no-underline transition-colors duration-150 hover:bg-[rgba(255,255,255,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                item.soon ? "text-muted" : "text-foreground"
              }`}
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
          #navbar > div { display: none !important; }
          .nav-divider { display: none !important; }
        }
        @keyframes menu-slide-in {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </header>
  );
}
