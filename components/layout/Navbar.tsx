"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Products",  href: "#products",  soon: false },
  { label: "Community", href: "#community", soon: false },
  { label: "About",     href: "#about",     soon: false },
  { label: "Blog",      href: "#",          soon: true  },
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
      {/* Outer wrapper — full-width, positions the island */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          justifyContent: "center",
          padding: "1rem 1.5rem",
          pointerEvents: "none",
        }}
      >
        {/* ── The island pill ── */}
        <nav
          id="navbar"
          style={{
            pointerEvents: "all",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1.5rem",
            width: "100%",
            maxWidth: 860,
            padding: "0.5rem 0.5rem 0.5rem 1.1rem",
            borderRadius: "var(--radius-card)",
            border: "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            background: scrolled
              ? "rgba(10,10,10,0.88)"
              : "rgba(16,16,16,0.72)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)"
              : "0 4px 24px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
            transition: "background 0.35s ease, box-shadow 0.35s ease",
          }}
        >
          {/* ── Logo ── */}
          <a
            href="#"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              textDecoration: "none",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 30,
                height: 30,
                background: "var(--accent)",
                borderRadius: 8,
                color: "#0c0c0c",
                fontSize: "0.9rem",
                flexShrink: 0,
              }}
            >
              ⚡
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "1.05rem",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text)",
              }}
            >
              Velobits
            </span>
          </a>

          {/* ── Desktop nav links — centered ── */}
          <div
            className="desktop-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.1rem",
              flex: 1,
              justifyContent: "center",
            }}
          >
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.42rem 0.85rem",
                  borderRadius: 9999,
                  fontSize: "0.84rem",
                  fontWeight: 500,
                  color: item.soon ? "var(--text-muted)" : "var(--text)",
                  textDecoration: "none",
                  transition: "background 0.18s ease, color 0.18s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                  if (!item.soon) e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = item.soon ? "var(--text-muted)" : "var(--text)";
                }}
              >
                {item.label}
                {item.soon && (
                  <span
                    style={{
                      fontSize: "0.55rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      background: "rgba(255,255,255,0.07)",
                      color: "var(--text-muted)",
                      padding: "0.15rem 0.45rem",
                      borderRadius: 9999,
                    }}
                  >
                    Soon
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* ── CTA button ── */}
          <a
            href="#waitlist"
            className="btn btn-primary"
            style={{
              fontSize: "0.82rem",
              padding: "0.55rem 1.25rem",
              flexShrink: 0,
              borderRadius: 9999,
            }}
          >
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

          {/* ── Hamburger (mobile only) ── */}
          <button
            className="menu-toggle"
            aria-label="Toggle menu"
            onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
            style={{
              display: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text)",
              padding: "0.4rem",
              borderRadius: 8,
              flexShrink: 0,
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

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "4.5rem",
            left: "1.5rem",
            right: "1.5rem",
            zIndex: 99,
            background: "rgba(12,12,12,0.96)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "var(--radius-card)",
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
            boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {NAV_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.75rem 1rem",
                borderRadius: 14,
                fontSize: "0.95rem",
                fontWeight: 500,
                color: item.soon ? "var(--text-muted)" : "var(--text)",
                textDecoration: "none",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {item.label}
              {item.soon && (
                <span style={{
                  fontSize: "0.58rem", fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.1em",
                  background: "rgba(255,255,255,0.07)",
                  color: "var(--text-muted)",
                  padding: "0.12rem 0.4rem", borderRadius: 9999,
                }}>Soon</span>
              )}
            </a>
          ))}
          <div style={{ borderTop: "1px solid var(--border)", marginTop: "0.25rem", paddingTop: "0.75rem" }}>
            <a
              href="#waitlist"
              className="btn btn-primary"
              onClick={() => setMenuOpen(false)}
              style={{ width: "100%", justifyContent: "center", fontSize: "0.9rem" }}
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
