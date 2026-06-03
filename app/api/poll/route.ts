import { NextResponse } from "next/server";
import { getFromScript, isConfigured } from "@/lib/apps-script";
import type { PollCount } from "@/lib/site-content";

export const runtime = "nodejs";

export async function GET() {
  if (!isConfigured()) {
    return NextResponse.json({ ok: true, counts: [] });
  }
  try {
    const result = await getFromScript<{ counts: PollCount[] }>("poll", { cache: "no-store" });
    return NextResponse.json({ ok: true, counts: result.counts ?? [] });
  } catch (err) {
    console.warn("poll fetch failed:", err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
