import Link from "next/link";
import { PILL_BASE } from "@/lib/ui-classes";
import type { BlogTag } from "@/lib/blog";

/** A tag pill linking to its tag archive. `active` highlights the current tag. */
export default function TagBadge({ tag, active = false }: { tag: BlogTag; active?: boolean }) {
  return (
    <Link
      href={`/blog/tag/${tag.slug}`}
      className={`${PILL_BASE} text-[0.72rem] no-underline transition-colors duration-200 ${
        active
          ? "border-[rgba(200,241,53,0.4)] bg-[var(--accent-dim)] text-accent"
          : "border-border-subtle bg-[rgba(255,255,255,0.03)] text-muted hover:text-foreground"
      }`}
    >
      {tag.name}
      {typeof tag.count === "number" && <span className="text-faint">({tag.count})</span>}
    </Link>
  );
}
