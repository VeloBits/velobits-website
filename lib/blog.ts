// Server-only data layer for the Notion-backed blog.
//
// The browser must NEVER import this: it reads the server-only NOTION_TOKEN (no
// NEXT_PUBLIC_ prefix, so it stays out of the client bundle). It is imported
// only by the async RSC blog pages, the sitemap, and the RSS route handler.
// Mirrors lib/apps-script.ts + lib/updates.ts: defensive normalization, ISR
// caching (via per-route `export const revalidate`), and graceful fallbacks
// ([] / null) on any failure so a flaky/unconfigured Notion never breaks build.

import { Client, isFullPage } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import { brand } from "@/lib/site-content";
import { readingTimeMinutes } from "@/lib/reading-time";

if (typeof window !== "undefined") {
  throw new Error("lib/blog.ts is server-only and must not be imported in the browser.");
}

/** ISR window (seconds). Comfortably under Notion's ~1h signed-image URL TTL so a
 *  cached page never outlives its cover/inline image URLs. Each blog route sets
 *  `export const revalidate = BLOG_REVALIDATE`. */
export const BLOG_REVALIDATE = 300;

// Notion property names — centralized so a rename in Notion is a one-line fix.
const PROP = {
  title: "Name",
  slug: "Slug",
  status: "Status",
  excerpt: "Excerpt",
  date: "Published date",
  updated: "Updated",
  author: "Author",
  tags: "Tags",
  cover: "Cover",
  seoDescription: "SEO description",
  featured: "Featured",
} as const;

const PUBLISHED = "Done";

export interface BlogTag {
  name: string;
  slug: string;
  count?: number;
}

export interface BlogPostMeta {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  description: string; // meta description (SEO description ?? excerpt ?? brand)
  date: string; // ISO published date ("" if unset)
  updated: string; // ISO updated date (falls back to `date`)
  author: string;
  tags: BlogTag[];
  coverUrl: string | null;
  featured: boolean;
}

export interface BlogPost extends BlogPostMeta {
  markdown: string;
  readingTimeMinutes: number;
}

export function isConfigured(): boolean {
  return !!(process.env.NOTION_TOKEN && process.env.NOTION_BLOG_DATABASE_ID);
}

let _notion: Client | null = null;
let _n2m: NotionToMarkdown | null = null;

function notion(): Client {
  if (!_notion) _notion = new Client({ auth: process.env.NOTION_TOKEN });
  return _notion;
}

function n2m(): NotionToMarkdown {
  if (!_n2m) _n2m = new NotionToMarkdown({ notionClient: notion() });
  return _n2m;
}

// ── Defensive property readers (every shape is treated as `unknown`) ─────────

type Props = Record<string, unknown>;

function richText(prop: unknown): string {
  const v = prop as
    | { title?: Array<{ plain_text?: string }>; rich_text?: Array<{ plain_text?: string }> }
    | undefined;
  const arr = v?.title ?? v?.rich_text ?? [];
  return arr
    .map((r) => r?.plain_text ?? "")
    .join("")
    .trim();
}

function statusName(prop: unknown): string {
  const v = prop as { status?: { name?: string }; select?: { name?: string } } | undefined;
  return v?.status?.name ?? v?.select?.name ?? "";
}

function selectOrText(prop: unknown): string {
  const v = prop as { select?: { name?: string } } | undefined;
  return v?.select?.name ?? richText(prop);
}

function multiSelect(prop: unknown): string[] {
  const v = prop as { multi_select?: Array<{ name?: string }> } | undefined;
  return (v?.multi_select ?? []).map((o) => o?.name ?? "").filter(Boolean);
}

function dateStart(prop: unknown): string {
  const v = prop as { date?: { start?: string } } | undefined;
  return v?.date?.start ?? "";
}

function checkbox(prop: unknown): boolean {
  return !!(prop as { checkbox?: boolean } | undefined)?.checkbox;
}

function fileUrl(prop: unknown): string | null {
  const files = (prop as { files?: Array<Record<string, unknown>> } | undefined)?.files ?? [];
  const first = files[0] as { external?: { url?: string }; file?: { url?: string } } | undefined;
  return first?.external?.url ?? first?.file?.url ?? null;
}

function pageCoverUrl(cover: unknown): string | null {
  const c = cover as { external?: { url?: string }; file?: { url?: string } } | null;
  return c?.external?.url ?? c?.file?.url ?? null;
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTag(name: string): BlogTag {
  return { name, slug: slugify(name) };
}

interface FullPage {
  id: string;
  cover?: unknown;
  properties: Props;
}

function normalizePage(page: FullPage): BlogPostMeta {
  const props = page.properties;
  const title = richText(props[PROP.title]) || "Untitled";
  const rawSlug = richText(props[PROP.slug]);
  const slug = slugify(rawSlug || title);
  const excerpt = richText(props[PROP.excerpt]);
  const seo = richText(props[PROP.seoDescription]);
  const date = dateStart(props[PROP.date]);
  const updated = dateStart(props[PROP.updated]) || date;
  const author = selectOrText(props[PROP.author]) || brand.name;
  const coverUrl = fileUrl(props[PROP.cover]) ?? pageCoverUrl(page.cover);

  return {
    id: page.id,
    slug,
    title,
    excerpt,
    description: seo || excerpt || brand.description,
    date,
    updated,
    author,
    tags: multiSelect(props[PROP.tags]).map(toTag),
    coverUrl,
    featured: checkbox(props[PROP.featured]),
  };
}

function isPublished(page: FullPage): boolean {
  return statusName(page.properties[PROP.status]) === PUBLISHED;
}

/** Fetch every full page in the blog database (paginated), unfiltered. */
async function queryAllPages(): Promise<FullPage[]> {
  const databaseId = process.env.NOTION_BLOG_DATABASE_ID as string;
  const pages: FullPage[] = [];
  let cursor: string | undefined;

  do {
    const res = await notion().databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
    });
    for (const result of res.results) {
      if (isFullPage(result)) {
        pages.push({ id: result.id, cover: result.cover, properties: result.properties });
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined;
  } while (cursor);

  return pages;
}

function byDateDesc(a: BlogPostMeta, b: BlogPostMeta): number {
  return (b.date || "").localeCompare(a.date || "");
}

/**
 * All published posts, newest first. Metadata only (no page bodies fetched).
 * Returns [] when Notion is unconfigured or any request fails.
 */
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  if (!isConfigured()) return [];
  try {
    const pages = await queryAllPages();
    return pages.filter(isPublished).map(normalizePage).sort(byDateDesc);
  } catch {
    return [];
  }
}

/** Derive a short excerpt from the first prose paragraph of a markdown string. */
function deriveExcerpt(markdown: string): string {
  const firstPara = markdown
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .find((b) => b && !b.startsWith("#") && !b.startsWith("!") && !b.startsWith("```"));
  if (!firstPara) return "";
  const clean = firstPara
    .replace(/[#>*_`[\]()!]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > 200 ? `${clean.slice(0, 197)}…` : clean;
}

/**
 * A single published post (metadata + rendered markdown). Reading time is
 * computed accurately from the full body. Returns null for an unknown slug,
 * an unconfigured/failed Notion, or any error.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isConfigured()) return null;
  try {
    const meta = (await getAllPosts()).find((p) => p.slug === slug);
    if (!meta) return null;

    const blocks = await n2m().pageToMarkdown(meta.id);
    const markdown = n2m().toMarkdownString(blocks).parent ?? "";

    const excerpt = meta.excerpt || deriveExcerpt(markdown);
    return {
      ...meta,
      excerpt,
      description: meta.description || excerpt || brand.description,
      markdown,
      readingTimeMinutes: readingTimeMinutes(markdown),
    };
  } catch {
    return null;
  }
}

/** Published posts carrying a given tag slug, newest first. */
export async function getPostsByTag(tagSlug: string): Promise<BlogPostMeta[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.tags.some((t) => t.slug === tagSlug));
}

/** All tags across published posts, deduped by slug, with post counts. */
export async function getAllTags(): Promise<BlogTag[]> {
  const posts = await getAllPosts();
  const counts = new Map<string, BlogTag>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const existing = counts.get(tag.slug);
      if (existing) existing.count = (existing.count ?? 0) + 1;
      else counts.set(tag.slug, { ...tag, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => a.name.localeCompare(b.name));
}

/** Posts sharing the most tags with `post` (excluding itself), newest first. */
export async function getRelatedPosts(post: BlogPostMeta, limit = 3): Promise<BlogPostMeta[]> {
  const slugs = new Set(post.tags.map((t) => t.slug));
  if (slugs.size === 0) return [];
  const posts = await getAllPosts();
  return posts
    .filter((p) => p.id !== post.id)
    .map((p) => ({ p, shared: p.tags.filter((t) => slugs.has(t.slug)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared || byDateDesc(a.p, b.p))
    .slice(0, limit)
    .map((x) => x.p);
}
