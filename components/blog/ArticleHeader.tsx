import Image from "next/image";
import { DISPLAY, DISPLAY_LG, EYEBROW } from "@/lib/ui-classes";
import TagBadge from "./TagBadge";
import ReadingTime from "./ReadingTime";
import { formatDate } from "./format";
import type { BlogPost } from "@/lib/blog";

/** Article title block: eyebrow, h1, byline (author · date · reading time), tags, hero cover. */
export default function ArticleHeader({ post }: { post: BlogPost }) {
  const date = formatDate(post.date);
  return (
    <header className="mb-10 flex flex-col gap-5">
      <span className={`${EYEBROW} text-muted`}>Blog</span>
      <h1 className={`${DISPLAY} ${DISPLAY_LG} text-foreground`}>{post.title}</h1>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.82rem] text-muted">
        <span>By {post.author}</span>
        {date && <span aria-hidden="true">·</span>}
        {date && <time dateTime={post.date}>{date}</time>}
        <span aria-hidden="true">·</span>
        <ReadingTime minutes={post.readingTimeMinutes} />
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <TagBadge key={tag.slug} tag={tag} />
          ))}
        </div>
      )}

      {post.coverUrl && (
        <div className="mt-2 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] border border-border-subtle">
          <Image
            src={post.coverUrl}
            alt={post.title}
            width={1200}
            height={675}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      )}
    </header>
  );
}
