import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { brand } from "@/lib/site-content";

/**
 * Dynamic sitemap: the static home + blog index entries, plus one entry per
 * published post and tag. getAllPosts/getAllTags degrade to [] when Notion is
 * unconfigured/unreachable, so this safely falls back to home + /blog.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = brand.domain;
  const now = new Date();
  const [posts, tags] = await Promise.all([getAllPosts(), getAllTags()]);

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${site}/blog/${p.slug}`,
    lastModified: p.updated ? new Date(p.updated) : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((t) => ({
    url: `${site}/blog/tag/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.4,
  }));

  return [
    { url: `${site}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...postEntries,
    ...tagEntries,
  ];
}
