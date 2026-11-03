import type { ReactNode } from "react";
import Link from "next/link";
import { CONTAINER } from "@/lib/ui-classes";

/**
 * Shared shell for the legal pages. These are plain server-rendered pages: no
 * client JavaScript, no login, no PDF, so they work as a standard web page for
 * store listings and for anyone with scripts blocked.
 */
export type LegalSectionData = { id: string; title: string; body: ReactNode };

export function P({ children }: { children: ReactNode }) {
  return <p className="text-[0.92rem] leading-[1.85] text-muted">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="flex list-disc flex-col gap-2 pl-5 text-[0.92rem] leading-[1.75] text-muted marker:text-accent">
      {children}
    </ul>
  );
}

export function A({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="font-medium text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
    >
      {children}
    </a>
  );
}

export function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-border-subtle">
      <table className="w-full min-w-[560px] border-collapse text-left text-[0.84rem]">
        <thead>
          <tr className="bg-card-alt text-foreground">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-border-subtle align-top text-muted">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 leading-[1.65] ${j === 0 ? "text-foreground" : ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function LegalDocument({
  eyebrow,
  title,
  updated,
  summary,
  sections,
  sibling,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  summary: ReactNode;
  sections: LegalSectionData[];
  sibling: { label: string; href: string };
}) {
  return (
    <div className={`${CONTAINER} pt-[8rem] pb-24`}>
      <article className="mx-auto max-w-[780px]">
        <p className="label-mono mb-5 text-accent">{eyebrow}</p>
        <h1 className="font-display text-[clamp(2rem,6vw,3.4rem)] leading-[0.95] font-extrabold tracking-[-0.03em] text-foreground uppercase">
          {title}
        </h1>
        <p className="mt-5 text-[0.8rem] text-subtle">Last updated {updated}</p>

        <div className="card mt-8 p-6">
          <div className="flex flex-col gap-3">{summary}</div>
        </div>

        <nav aria-label="On this page" className="mt-10">
          <p className="label-mono mb-3 text-subtle">On this page</p>
          <ol className="grid grid-cols-2 gap-x-6 gap-y-2 text-[0.85rem] max-[560px]:grid-cols-1">
            {sections.map((s, i) => (
              <li key={s.id} className="flex gap-3">
                <span className="label-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                <a href={`#${s.id}`} className="text-muted no-underline hover:text-foreground">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-col gap-12">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-28">
              <h2 className="mb-4 flex items-baseline gap-3 font-display text-[1.1rem] font-extrabold tracking-[-0.01em] text-foreground uppercase">
                <span className="label-mono text-accent">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              <div className="flex flex-col gap-4">{s.body}</div>
            </section>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border-subtle pt-6 text-[0.85rem]">
          <Link href="/" className="text-muted no-underline hover:text-foreground">
            ← Back to velobits.dev
          </Link>
          <Link
            href={sibling.href}
            className="font-medium text-foreground underline decoration-accent/50 underline-offset-4 hover:decoration-accent"
          >
            {sibling.label}
          </Link>
        </div>
      </article>
    </div>
  );
}
