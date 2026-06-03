import { NextResponse } from "next/server";
import { postToScript, isConfigured } from "@/lib/apps-script";
import { poll, type PollCount } from "@/lib/site-content";

export const runtime = "nodejs";

const VALID_OPTIONS = new Set(poll.options.map((o) => o.id));

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const optionId = String(body.option_id ?? "").trim();
  if (!VALID_OPTIONS.has(optionId)) {
    return NextResponse.json({ ok: false, error: "unknown_option" }, { status: 400 });
  }
  const voterId = String(body.voter_id ?? "").trim();

  if (!isConfigured()) {
    return NextResponse.json({ ok: true, counts: [] });
  }
  try {
    const result = await postToScript<{ counts: PollCount[] }>("vote", {
      poll_id: poll.id,
      option_id: optionId,
      voter_id: voterId,
    });
    return NextResponse.json({ ok: true, counts: result.counts ?? [] });
  } catch (err) {
    console.warn("vote failed:", err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
