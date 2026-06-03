import { getAllPosts } from "@/lib/blog";
import { brand } from "@/lib/site-content";

// 5-min ISR (BLOG_REVALIDATE). Segment config must be a static literal.
export const revalidate = 300;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** RSS 2.0 feed for the blog. getAllPosts() already degrades to [] on failure,
 *  so this always returns a valid (possibly empty) feed. */
export async function GET() {
  const posts = await getAllPosts();
  const site = brand.domain;

  const items = posts
    .map((p) => {
      const url = `${site}/blog/${p.slug}`;
      const pubDate = p.date ? new Date(p.date).toUTCString() : "";
      const categories = p.tags.map((t) => `<category>${escapeXml(t.name)}</category>`).join("");
      return [
        "<item>",
        `<title>${escapeXml(p.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        pubDate ? `<pubDate>${pubDate}</pubDate>` : "",
        `<description>${escapeXml(p.excerpt || p.description)}</description>`,
        categories,
        "</item>",
      ].join("");
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0"><channel>` +
    `<title>${escapeXml(`${brand.name} Blog`)}</title>` +
    `<link>${site}/blog</link>` +
    `<description>${escapeXml(`Writing tips and product news from ${brand.name}.`)}</description>` +
    items +
    `</channel></rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}
