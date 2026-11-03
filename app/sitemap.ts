import type { MetadataRoute } from "next";
import { brand } from "@/lib/site-content";

/**
 * The blog is hidden (see redirects in next.config.ts), so it stays out of the
 * sitemap. Restore the post and tag entries from lib/blog when it comes back.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const site = brand.domain;
  const now = new Date();

  return [
    { url: `${site}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site}/app/revon/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: `${site}/app/revon/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
