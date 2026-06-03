import { getFromScript, isConfigured } from "@/lib/apps-script";
import type { Update, UpdateType } from "@/lib/site-content";

const VALID_TYPES: UpdateType[] = ["launch", "feature", "update", "fix"];

function normalizeType(value: unknown): UpdateType {
  return VALID_TYPES.includes(value as UpdateType) ? (value as UpdateType) : "update";
}

/**
 * Fetch published updates for the on-site "Latest Updates" feed.
 *
 * Uses no-store in dev so the dev server always fetches fresh data.
 * In production, ISR revalidates every 5 minutes.
 * Returns [] on any failure so a flaky Apps Script never takes down the page.
 */
export async function getUpdates(): Promise<Update[]> {
  if (!isConfigured()) return [];
  try {
    const cacheOpt =
      process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 300 } };
    const data = await getFromScript<{ updates: unknown[] }>("updates", cacheOpt);
    const raw = Array.isArray(data.updates) ? data.updates : [];
    return raw.map((u) => {
      const item = u as Record<string, unknown>;
      return {
        id: String(item.id ?? ""),
        date: String(item.date ?? ""),
        type: normalizeType(item.type),
        title: String(item.title ?? ""),
        body: String(item.body ?? ""),
        link: item.link ? String(item.link) : undefined,
      } satisfies Update;
    });
  } catch {
    return [];
  }
}
