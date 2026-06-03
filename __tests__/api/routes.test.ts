import { describe, it, expect, beforeEach, vi, type Mock } from "vitest";

vi.mock("@/lib/apps-script", () => ({
  postToScript: vi.fn(),
  getFromScript: vi.fn(),
  isConfigured: vi.fn(() => true), // configured by default; override per-test if needed
}));

import { postToScript, getFromScript } from "@/lib/apps-script";
import { POST as subscribePOST } from "@/app/api/subscribe/route";
import { POST as ideasPOST } from "@/app/api/ideas/route";
import { POST as votePOST } from "@/app/api/vote/route";
import { GET as pollGET } from "@/app/api/poll/route";

const post = postToScript as unknown as Mock;
const get = getFromScript as unknown as Mock;

function makeReq(body: unknown, opts: { badJson?: boolean } = {}): Request {
  return {
    json: async () => {
      if (opts.badJson) throw new Error("bad json");
      return body;
    },
    headers: { get: () => "vitest-agent" },
  } as unknown as Request;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("POST /api/subscribe", () => {
  it("forwards a valid email and returns ok", async () => {
    post.mockResolvedValue({ ok: true });
    const res = await subscribePOST(makeReq({ email: "User@Example.com" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(post).toHaveBeenCalledWith(
      "subscribe",
      expect.objectContaining({ email: "user@example.com", source: "waitlist" })
    );
  });

  it("rejects an invalid email with 400 and does not call the script", async () => {
    const res = await subscribePOST(makeReq({ email: "nope" }));
    expect(res.status).toBe(400);
    expect(post).not.toHaveBeenCalled();
  });

  it("silently accepts a honeypot hit without writing anything", async () => {
    const res = await subscribePOST(makeReq({ email: "a@b.com", website: "bot" }));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
    expect(post).not.toHaveBeenCalled();
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await subscribePOST(makeReq(null, { badJson: true }));
    expect(res.status).toBe(400);
  });

  it("returns 502 when the upstream script fails", async () => {
    post.mockRejectedValue(new Error("boom"));
    const res = await subscribePOST(makeReq({ email: "a@b.com" }));
    expect(res.status).toBe(502);
  });
});

describe("POST /api/ideas", () => {
  it("forwards a non-empty idea", async () => {
    post.mockResolvedValue({ ok: true });
    const res = await ideasPOST(makeReq({ idea: "build a thing" }));
    expect(res.status).toBe(200);
    expect(post).toHaveBeenCalledWith("idea", expect.objectContaining({ idea: "build a thing" }));
  });

  it("rejects an empty idea with 400", async () => {
    const res = await ideasPOST(makeReq({ idea: "   " }));
    expect(res.status).toBe(400);
    expect(post).not.toHaveBeenCalled();
  });

  it("silently accepts a honeypot hit", async () => {
    const res = await ideasPOST(makeReq({ idea: "x", website: "bot" }));
    expect(res.status).toBe(200);
    expect(post).not.toHaveBeenCalled();
  });

  it("returns 502 when the upstream script fails", async () => {
    post.mockRejectedValue(new Error("boom"));
    const res = await ideasPOST(makeReq({ idea: "valid idea" }));
    expect(res.status).toBe(502);
  });
});

describe("POST /api/vote", () => {
  it("accepts a known option and returns counts", async () => {
    post.mockResolvedValue({ ok: true, counts: [{ option_id: "fixmytext", count: 1 }] } as never);
    const res = await votePOST(makeReq({ option_id: "fixmytext", voter_id: "v1" }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.counts).toHaveLength(1);
    expect(post).toHaveBeenCalledWith(
      "vote",
      expect.objectContaining({ poll_id: "next-app", option_id: "fixmytext", voter_id: "v1" })
    );
  });

  it("rejects an unknown option with 400", async () => {
    const res = await votePOST(makeReq({ option_id: "totally-made-up" }));
    expect(res.status).toBe(400);
    expect(post).not.toHaveBeenCalled();
  });

  it("returns 502 when the upstream script fails", async () => {
    post.mockRejectedValue(new Error("boom"));
    const res = await votePOST(makeReq({ option_id: "note-sharing" }));
    expect(res.status).toBe(502);
  });
});

describe("GET /api/poll", () => {
  it("returns counts from the script", async () => {
    get.mockResolvedValue({ ok: true, counts: [{ option_id: "fixmytext", count: 3 }] } as never);
    const res = await pollGET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.counts[0].count).toBe(3);
  });

  it("returns 502 when the upstream script fails", async () => {
    get.mockRejectedValue(new Error("boom"));
    const res = await pollGET();
    expect(res.status).toBe(502);
  });
});
