import Link from "next/link";
import { PILL_BASE } from "@/lib/ui-classes";
import TagBadge from "./TagBadge";
import type { BlogTag } from "@/lib/blog";

/**
 * Route-based tag filter row: an "All" link plus one TagBadge per tag.
 * Server-rendered (no client state) so filtering is just navigation.
 */
export default function TagFilter({ tags, activeSlug }: { tags: BlogTag[]; activeSlug?: string }) {
  if (tags.length === 0) return null;
  return (
    <nav aria-label="Filter posts by tag" className="flex flex-wrap items-center gap-2">
      <Link
        href="/blog"
        className={`${PILL_BASE} text-[0.72rem] no-underline transition-colors duration-200 ${
          activeSlug
            ? "border-border-subtle bg-[rgba(255,255,255,0.03)] text-muted hover:text-foreground"
            : "border-[rgba(200,241,53,0.4)] bg-[var(--accent-dim)] text-accent"
        }`}
      >
        All
      </Link>
      {tags.map((tag) => (
        <TagBadge key={tag.slug} tag={tag} active={tag.slug === activeSlug} />
      ))}
    </nav>
  );
}
