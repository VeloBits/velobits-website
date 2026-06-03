// @vitest-environment node
// lib/blog.ts is server-only (guards against a browser `window`), so this suite
// runs under the node environment rather than the project-default jsdom.
import { describe, it, expect, beforeEach, vi } from "vitest";

const mockQuery = vi.fn();
const mockPageToMarkdown = vi.fn(async () => []);
const mockToMarkdownString = vi.fn(() => ({ parent: "# Title\n\nSome body words here." }));

// Constructor mocks MUST use a regular `function` (not an arrow) to be valid with
// `new` under vitest v4 — same gotcha as the IntersectionObserver setup mock.
vi.mock("@notionhq/client", () => ({
  Client: vi.fn(function () {
    return { databases: { query: mockQuery } };
  }),
  isFullPage: (x: unknown) => !!(x as { properties?: unknown })?.properties,
}));

vi.mock("notion-to-md", () => ({
  NotionToMarkdown: vi.fn(function () {
    return { pageToMarkdown: mockPageToMarkdown, toMarkdownString: mockToMarkdownString };
  }),
}));

import {
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getRelatedPosts,
  slugify,
} from "@/lib/blog";

type PageOverrides = {
  id?: string;
  status?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  date?: string;
  updated?: string;
  author?: string;
  tags?: string[];
  coverExternal?: string | null;
  seo?: string;
  featured?: boolean;
  cover?: unknown;
};

function makePage(over: PageOverrides = {}) {
  const {
    id = "p1",
    status = "Done",
    title = "Hello World",
    slug = "hello-world",
    excerpt = "An excerpt.",
    date = "2026-06-01",
    updated = "",
    author = "Nency",
    tags = ["Writing", "Grammar"],
    coverExternal = "https://img.example.com/x.png",
    seo = "",
    featured = false,
    cover = null,
  } = over;
  return {
    id,
    cover,
    properties: {
      Name: { title: title ? [{ plain_text: title }] : [] },
      Slug: { rich_text: slug ? [{ plain_text: slug }] : [] },
      Status: { status: { name: status } },
      Excerpt: { rich_text: excerpt ? [{ plain_text: excerpt }] : [] },
      "Published date": { date: date ? { start: date } : null },
      Updated: { date: updated ? { start: updated } : null },
      Author: { rich_text: author ? [{ plain_text: author }] : [] },
      Tags: { multi_select: tags.map((name) => ({ name })) },
      Cover: {
        files: coverExternal ? [{ type: "external", external: { url: coverExternal } }] : [],
      },
      "SEO description": { rich_text: seo ? [{ plain_text: seo }] : [] },
      Featured: { checkbox: featured },
    },
  };
}

function queryResult(pages: unknown[], hasMore = false, nextCursor: string | null = null) {
  return { results: pages, has_more: hasMore, next_cursor: nextCursor };
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.NOTION_TOKEN = "secret_test";
  process.env.NOTION_BLOG_DATABASE_ID = "db_test";
  mockToMarkdownString.mockReturnValue({ parent: "# Title\n\nSome body words here." });
});

describe("getAllPosts", () => {
  it("maps Notion pages to typed BlogPostMeta", async () => {
    mockQuery.mockResolvedValue(queryResult([makePage()]));
    const posts = await getAllPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0]).toMatchObject({
      id: "p1",
      slug: "hello-world",
      title: "Hello World",
      excerpt: "An excerpt.",
      author: "Nency",
      coverUrl: "https://img.example.com/x.png",
    });
    expect(posts[0].tags).toEqual([
      { name: "Writing", slug: "writing" },
      { name: "Grammar", slug: "grammar" },
    ]);
  });

  it("filters out posts that are not Published", async () => {
    mockQuery.mockResolvedValue(
      queryResult([
        makePage({ id: "a", slug: "a", status: "Done" }),
        makePage({ id: "b", slug: "b", status: "Draft" }),
      ])
    );
    const posts = await getAllPosts();
    expect(posts.map((p) => p.id)).toEqual(["a"]);
  });

  it("sorts posts newest first by published date", async () => {
    mockQuery.mockResolvedValue(
      queryResult([
        makePage({ id: "old", slug: "old", date: "2026-01-01" }),
        makePage({ id: "new", slug: "new", date: "2026-12-01" }),
      ])
    );
    const posts = await getAllPosts();
    expect(posts.map((p) => p.id)).toEqual(["new", "old"]);
  });

  it("paginates across multiple result pages", async () => {
    mockQuery
      .mockResolvedValueOnce(queryResult([makePage({ id: "a", slug: "a" })], true, "cursor2"))
      .mockResolvedValueOnce(queryResult([makePage({ id: "b", slug: "b" })], false, null));
    const posts = await getAllPosts();
    expect(posts).toHaveLength(2);
    expect(mockQuery).toHaveBeenCalledTimes(2);
  });

  it("falls back to the page cover when no Cover file property is set", async () => {
    mockQuery.mockResolvedValue(
      queryResult([
        makePage({ coverExternal: null, cover: { external: { url: "https://img/page.png" } } }),
      ])
    );
    const posts = await getAllPosts();
    expect(posts[0].coverUrl).toBe("https://img/page.png");
  });

  it("returns [] when Notion is not configured", async () => {
    delete process.env.NOTION_TOKEN;
    delete process.env.NOTION_BLOG_DATABASE_ID;
    await expect(getAllPosts()).resolves.toEqual([]);
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("returns [] when the Notion query throws", async () => {
    mockQuery.mockRejectedValue(new Error("offline"));
    await expect(getAllPosts()).resolves.toEqual([]);
  });
});

describe("getPostBySlug", () => {
  it("returns a post with rendered markdown and accurate reading time", async () => {
    mockQuery.mockResolvedValue(queryResult([makePage()]));
    mockToMarkdownString.mockReturnValue({
      parent: `# Heading\n\n${Array.from({ length: 400 }, () => "word").join(" ")}`,
    });
    const post = await getPostBySlug("hello-world");
    expect(post).not.toBeNull();
    expect(post?.markdown).toContain("# Heading");
    expect(post?.readingTimeMinutes).toBe(2);
  });

  it("derives an excerpt from the body when Excerpt is empty", async () => {
    mockQuery.mockResolvedValue(queryResult([makePage({ excerpt: "" })]));
    mockToMarkdownString.mockReturnValue({
      parent: "# Title\n\nThis is the opening paragraph of the post.",
    });
    const post = await getPostBySlug("hello-world");
    expect(post?.excerpt).toBe("This is the opening paragraph of the post.");
  });

  it("returns null for an unknown slug", async () => {
    mockQuery.mockResolvedValue(queryResult([makePage()]));
    await expect(getPostBySlug("does-not-exist")).resolves.toBeNull();
  });

  it("returns null when not configured", async () => {
    delete process.env.NOTION_TOKEN;
    delete process.env.NOTION_BLOG_DATABASE_ID;
    await expect(getPostBySlug("hello-world")).resolves.toBeNull();
  });
});

describe("getPostsByTag / getAllTags / getRelatedPosts", () => {
  beforeEach(() => {
    mockQuery.mockResolvedValue(
      queryResult([
        makePage({ id: "a", slug: "a", tags: ["Writing", "Grammar"], date: "2026-03-01" }),
        makePage({ id: "b", slug: "b", tags: ["Writing", "Product"], date: "2026-02-01" }),
        makePage({ id: "c", slug: "c", tags: ["Company"], date: "2026-01-01" }),
      ])
    );
  });

  it("filters posts by tag slug", async () => {
    const posts = await getPostsByTag("writing");
    expect(posts.map((p) => p.id).sort()).toEqual(["a", "b"]);
  });

  it("dedupes tags and counts posts per tag", async () => {
    const tags = await getAllTags();
    const writing = tags.find((t) => t.slug === "writing");
    expect(writing?.count).toBe(2);
    expect(tags.find((t) => t.slug === "company")?.count).toBe(1);
  });

  it("ranks related posts by shared tags and excludes the post itself", async () => {
    const seed = { id: "a", tags: [{ name: "Writing", slug: "writing" }] } as unknown as Parameters<
      typeof getRelatedPosts
    >[0];
    const related = await getRelatedPosts(seed);
    expect(related.map((p) => p.id)).not.toContain("a");
    expect(related[0].id).toBe("b"); // shares "Writing"
    expect(related.map((p) => p.id)).not.toContain("c"); // no shared tag
  });

  it("returns no related posts when the seed has no tags", async () => {
    const seed = { id: "x", tags: [] } as unknown as Parameters<typeof getRelatedPosts>[0];
    await expect(getRelatedPosts(seed)).resolves.toEqual([]);
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Hello, World!")).toBe("hello-world");
    expect(slugify("  AI & Writing  ")).toBe("ai-writing");
  });
});
