import type { BlogPost, BlogPostMeta, BlogTag } from "@/lib/blog";

export const tag = (name: string, count?: number): BlogTag => ({
  name,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  count,
});

export const meta = (over: Partial<BlogPostMeta> = {}): BlogPostMeta => ({
  id: "p1",
  slug: "hello-world",
  title: "Hello World",
  excerpt: "A short excerpt about the post.",
  description: "Meta description.",
  date: "2026-06-01",
  updated: "2026-06-01",
  author: "Nency",
  tags: [tag("Writing"), tag("Grammar")],
  coverUrl: null,
  featured: false,
  ...over,
});

export const fullPost = (over: Partial<BlogPost> = {}): BlogPost => ({
  ...meta(over),
  markdown: "# Hi\n\nBody.",
  readingTimeMinutes: 5,
  ...over,
});
