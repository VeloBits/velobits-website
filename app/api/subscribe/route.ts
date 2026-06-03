import { NextResponse } from "next/server";
import { postToScript, isConfigured } from "@/lib/apps-script";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  if (!isConfigured()) {
    return NextResponse.json({ ok: true });
  }
  try {
    await postToScript("subscribe", {
      email,
      source: "waitlist",
      user_agent: req.headers.get("user-agent") ?? "",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.warn("subscribe failed:", err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
}
