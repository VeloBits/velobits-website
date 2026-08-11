import Link from "next/link";

import type { BlogTag } from "@/lib/blog";
import { PILL_BASE } from "@/lib/ui-classes";

/** A tag pill linking to its tag archive. `active` highlights the current tag. */
export default function TagBadge({ tag, active = false }: { tag: BlogTag; active?: boolean }) {
  return (
    <Link
      href={`/blog/tag/${tag.slug}`}
      className={`${PILL_BASE} text-[0.72rem] no-underline transition-colors duration-200 ${
        active
          ? "border-accent/40 bg-[var(--accent-dim)] text-accent"
          : "border-border-subtle bg-foreground/3 text-muted hover:text-foreground"
      }`}
    >
      {tag.name}
      {typeof tag.count === "number" && <span className="text-subtle">({tag.count})</span>}
    </Link>
  );
}
