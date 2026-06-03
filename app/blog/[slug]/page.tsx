import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import { brand } from "@/lib/site-content";
import { SECTION } from "@/lib/ui-classes";
import ArticleHeader from "@/components/blog/ArticleHeader";
import MarkdownContent from "@/components/blog/MarkdownContent";
import RelatedPosts from "@/components/blog/RelatedPosts";

// 5-min ISR (BLOG_REVALIDATE). Segment config must be a static literal.
export const revalidate = 300;

type RouteParams = { params: Promise<{ slug: string }> };

// Narrower reading column than the standard CONTAINER (1180px).
const ARTICLE_WRAP = "mx-auto max-w-[760px] px-5 min-[769px]:px-8";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found — Velobits Blog" };

  const url = `${brand.domain}/blog/${post.slug}`;
  const images = post.coverUrl ? [post.coverUrl] : undefined;
  return {
    title: `${post.title} — Velobits Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      siteName: brand.name,
      publishedTime: post.date || undefined,
      modifiedTime: post.updated || undefined,
      authors: [post.author],
      tags: post.tags.map((t) => t.name),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: RouteParams) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    datePublished: post.date || undefined,
    dateModified: post.updated || post.date || undefined,
    author: { "@type": "Person", name: post.author },
    publisher: {
      "@type": "Organization",
      name: brand.name,
      logo: { "@type": "ImageObject", url: `${brand.domain}${brand.logo.src}` },
    },
    mainEntityOfPage: `${brand.domain}/blog/${post.slug}`,
  };

  return (
    <article className={SECTION}>
      <div className={ARTICLE_WRAP}>
        <ArticleHeader post={post} />
        <MarkdownContent markdown={post.markdown} />
        <RelatedPosts posts={related} />
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </article>
  );
}
