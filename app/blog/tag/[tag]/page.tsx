import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { brand } from "@/lib/site-content";
import PostList from "@/components/blog/PostList";
import TagFilter from "@/components/blog/TagFilter";
import { CONTAINER, SECTION, EYEBROW, DISPLAY_LG, DISPLAY } from "@/lib/ui-classes";

// 5-min ISR (BLOG_REVALIDATE). Segment config must be a static literal.
export const revalidate = 300;

type RouteParams = { params: Promise<{ tag: string }> };

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.slug }));
}

async function findTag(slug: string) {
  const tags = await getAllTags();
  return tags.find((t) => t.slug === slug) ?? null;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { tag } = await params;
  const found = await findTag(tag);
  const label = found?.name ?? tag;
  const description = `Velobits blog posts tagged "${label}" — writing tips and product news.`;
  return {
    title: `${label} — Velobits Blog`,
    description,
    alternates: { canonical: `/blog/tag/${tag}` },
    openGraph: {
      title: `${label} — Velobits Blog`,
      description,
      url: `${brand.domain}/blog/tag/${tag}`,
      type: "website",
    },
  };
}

export default async function BlogTagPage({ params }: RouteParams) {
  const { tag } = await params;
  const [found, tags, posts] = await Promise.all([findTag(tag), getAllTags(), getPostsByTag(tag)]);

  // Unknown tag with no posts → 404. (A known tag that lost all its posts still renders.)
  if (!found && posts.length === 0) notFound();
  const label = found?.name ?? tag;

  return (
    <section className={SECTION}>
      <div className={`container ${CONTAINER}`}>
        <div className="mb-12">
          <span className={`${EYEBROW} text-muted`}>Tag</span>
          <h1 className={`${DISPLAY} ${DISPLAY_LG} mt-3 text-foreground`}>
            <span className="text-accent">{label}</span>
          </h1>
          <Link
            href="/blog"
            className="mt-4 inline-block text-[0.85rem] text-muted hover:text-accent"
          >
            ← All posts
          </Link>
        </div>
        {tags.length > 0 && (
          <div className="mb-10">
            <TagFilter tags={tags} activeSlug={tag} />
          </div>
        )}
        <PostList posts={posts} />
      </div>
    </section>
  );
}
