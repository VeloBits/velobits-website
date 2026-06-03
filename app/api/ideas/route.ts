import { NextResponse } from "next/server";
import { postToScript, isConfigured } from "@/lib/apps-script";

export const runtime = "nodejs";

const MAX_IDEA = 2000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  // Honeypot: a bot filled the hidden field. Pretend success, write nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const idea = String(body.idea ?? "").trim();
  if (!idea) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }

  if (!isConfigured()) {
    return NextResponse.json({ ok: true });
  }
  try {
    await postToScript("idea", {
      idea: idea.slice(0, MAX_IDEA),
      user_agent: req.headers.get("user-agent") ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.warn("idea failed:", err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
