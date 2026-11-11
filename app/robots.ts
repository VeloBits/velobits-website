import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Invite pages are personal to a ride, so they stay out of search.
      disallow: "/join/",
    },
    sitemap: "https://velobits.dev/sitemap.xml",
  };
}
