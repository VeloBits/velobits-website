"use client";

import Image from "next/image";
import { CONTAINER } from "@/lib/ui-classes";

export default function Footer() {
  const year = new Date().getFullYear();

  const links = {
    Products: [
      { label: "FixMyText", href: "https://app.velobits.dev" },
      { label: "Community Pulse", href: "/#community" },
      { label: "Roadmap", href: "/#roadmap" },
    ],
    Company: [
      { label: "About", href: "/#about" },
      { label: "Blog", href: "/blog" },
      { label: "Join Waitlist", href: "/#waitlist" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="mt-auto pt-16 pb-8 relative z-[1] bg-[var(--bg)] border-t-[0.5px] border-accent/40">
      <div className={`container ${CONTAINER}`}>
        <div className="footer-grid mb-12 grid gap-12 [grid-template-columns:2fr_1fr_1fr_1fr] max-md:grid-cols-2 max-md:gap-8 max-[480px]:grid-cols-1">
          <div className="flex flex-col gap-4 max-md:col-span-2 max-[480px]:col-span-1">
            <div className="flex items-center gap-2">
              <Image
                src="/velobits-color-png.png"
                alt="Velobits"
                width={30}
                height={14}
                className="h-auto w-[30px]"
                priority
              />
              <span className="font-display text-[1rem] font-extrabold tracking-[0.04em] uppercase text-foreground">
                Velobits
              </span>
            </div>
            <p className="max-w-[28ch] text-[0.82rem] leading-[1.75] text-muted">
              Software that works for you. Building everyday tools that solve real problems - one
              product at a time.
            </p>
            <div className="mt-1 flex gap-2">
              {[
                {
                  label: "GitHub",
                  href: "https://github.com/VeloBits/velobits-website",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                    </svg>
                  ),
                },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-border-subtle bg-card text-muted no-underline hover:text-accent transition-colors duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <div className="mb-4 label text-subtle">{group}</div>
              <div className="flex flex-col gap-[0.6rem]">
                {items.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-[0.85rem] text-muted no-underline transition-colors duration-200 hover:text-foreground"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="h-[0.5px] opacity-30 bg-[linear-gradient(to_right,transparent,var(--accent-ink),transparent)]" />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
          <p className="text-[0.78rem] text-subtle">© {year} Velobits. All rights reserved.</p>
          <p className="text-[0.78rem] text-subtle">Made by the Velobits team</p>
        </div>
      </div>
    </footer>
  );
}
