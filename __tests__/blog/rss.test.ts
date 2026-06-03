// @vitest-environment node
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { BlogPostMeta } from "@/lib/blog";

vi.mock("@/lib/blog", () => ({
  BLOG_REVALIDATE: 300,
  getAllPosts: vi.fn(),
}));

import { getAllPosts } from "@/lib/blog";
import { GET } from "@/app/blog/rss.xml/route";

const mockGetAll = vi.mocked(getAllPosts);

const post = (over: Partial<BlogPostMeta> = {}): BlogPostMeta => ({
  id: "1",
  slug: "hello-world",
  title: "Tips & Tricks",
  excerpt: "Learn <b>fast</b>",
  description: "desc",
  date: "2026-06-01",
  updated: "2026-06-01",
  author: "Nency",
  tags: [{ name: "Writing", slug: "writing" }],
  coverUrl: null,
  featured: false,
  ...over,
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /blog/rss.xml", () => {
  it("returns a valid RSS feed with escaped, fully-qualified items", async () => {
    mockGetAll.mockResolvedValue([post()]);
    const res = await GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toContain("application/rss+xml");

    const body = await res.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<link>https://velobits.dev/blog/hello-world</link>");
    expect(body).toContain("Tips &amp; Tricks"); // escaped title
    expect(body).toContain("Learn &lt;b&gt;fast&lt;/b&gt;"); // escaped description
    expect(body).toContain("<category>Writing</category>");
    expect(body).toContain("<pubDate>");
  });

  it("returns an empty but valid feed when there are no posts", async () => {
    mockGetAll.mockResolvedValue([]);
    const res = await GET();
    const body = await res.text();
    expect(res.status).toBe(200);
    expect(body).toContain("<channel>");
    expect(body).not.toContain("<item>");
  });
});
