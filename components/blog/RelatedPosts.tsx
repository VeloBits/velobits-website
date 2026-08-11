
import PostCard from "./PostCard";
import type { BlogPostMeta } from "@/lib/blog";
import { EYEBROW } from "@/lib/ui-classes";

/** "Related posts" grid — same card/grid style as the blog index. */
export default function RelatedPosts({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) return null;

  const gridClass =
    posts.length === 1
      ? "grid grid-cols-1 gap-5"
      : posts.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-16 border-t border-border-subtle pt-10"
    >
      <h2 id="related-heading" className={`${EYEBROW} text-muted mb-6`}>
        Related posts
      </h2>
      <ol className={gridClass}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </ol>
    </section>
  );
}
