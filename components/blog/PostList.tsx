import PostCard from "./PostCard";
import type { BlogPostMeta } from "@/lib/blog";

/** Responsive grid of PostCards matching the UpdatesList grid style. */
export default function PostList({ posts }: { posts: BlogPostMeta[] }) {
  if (posts.length === 0) {
    return (
      <p className="text-[0.9rem] leading-[1.7] text-muted">
        No posts yet — more coming soon. Subscribe below to hear about launches and new content
        first.
      </p>
    );
  }

  const gridClass =
    posts.length === 1
      ? "grid grid-cols-1 gap-5"
      : posts.length === 2
        ? "grid grid-cols-1 sm:grid-cols-2 gap-5"
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5";

  return (
    <ol className={gridClass}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ol>
  );
}
