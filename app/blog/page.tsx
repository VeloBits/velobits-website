import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { brand } from "@/lib/site-content";
import { CONTAINER, SECTION, EYEBROW, DISPLAY, DISPLAY_LG } from "@/lib/ui-classes";
import PostList from "@/components/blog/PostList";
import TagFilter from "@/components/blog/TagFilter";

// 5-min ISR (BLOG_REVALIDATE). Segment config must be a static literal.
export const revalidate = 300;

const DESCRIPTION =
  "Writing tips on grammar, tone, and rewriting — plus product news and the story behind FixMyText by Velobits.";

export const metadata: Metadata = {
  title: "Blog — Velobits",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Velobits Blog",
    description: DESCRIPTION,
    url: `${brand.domain}/blog`,
    siteName: brand.name,
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Velobits Blog", description: DESCRIPTION },
};

export default async function BlogIndexPage() {
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `${brand.name} Blog`,
    url: `${brand.domain}/blog`,
    description: DESCRIPTION,
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${brand.domain}/blog/${p.slug}`,
      datePublished: p.date || undefined,
      author: { "@type": "Person", name: p.author },
    })),
  };

  return (
    <section className={SECTION}>
      <div className={`container ${CONTAINER}`}>
        <div className="mb-12">
          <span className={`${EYEBROW} text-muted`}>Blog</span>
          <h1 className={`${DISPLAY} ${DISPLAY_LG} mt-3 text-foreground`}>
            Writing, <span className="text-accent">decoded.</span>
          </h1>
          <p className="mt-4 max-w-[52ch] leading-[1.7] text-muted">{DESCRIPTION}</p>
        </div>
        {tags.length > 0 && (
          <div className="mb-10">
            <TagFilter tags={tags} />
          </div>
        )}
        <PostList posts={posts} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
