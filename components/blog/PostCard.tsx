import Image from "next/image";
import Link from "next/link";
import TagBadge from "./TagBadge";
import { formatDate } from "./format";
import type { BlogPostMeta } from "@/lib/blog";

/** Blog post card — cover image shown full (natural ratio), content below. */
export default function PostCard({ post }: { post: BlogPostMeta }) {
  const date = formatDate(post.date);
  return (
    <li className="card flex flex-col gap-0 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
      {post.coverUrl && (
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block">
          <Image src={post.coverUrl} alt="" width={640} height={400} className="w-full h-auto" />
        </Link>
      )}
      <div className="flex flex-col gap-2 p-6">
        <div className="flex flex-wrap items-center gap-3">
          {post.tags.slice(0, 2).map((tag) => (
            <TagBadge key={tag.slug} tag={tag} />
          ))}
          {date && <span className="text-[0.72rem] text-faint">{date}</span>}
        </div>
        <h3 className="font-display text-[1.05rem] leading-[1.4] font-extrabold tracking-[-0.01em] text-foreground">
          <Link
            href={`/blog/${post.slug}`}
            className="no-underline transition-colors hover:text-accent"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && <p className="text-[0.85rem] leading-[1.7] text-muted">{post.excerpt}</p>}
        <div className="mt-1 flex items-center justify-between">
          <span className="text-[0.72rem] text-faint">By {post.author}</span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 self-start text-[0.78rem] font-semibold text-accent hover:underline"
          >
            Read more
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </li>
  );
}
