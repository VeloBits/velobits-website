import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("@/lib/apps-script", () => ({
  getFromScript: vi.fn(),
  isConfigured: vi.fn(() => true), // configured by default
}));

import { getFromScript } from "@/lib/apps-script";
import { getUpdates } from "@/lib/updates";

const get = vi.mocked(getFromScript);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getUpdates", () => {
  it("maps script rows to typed Update objects", async () => {
    get.mockResolvedValue({
      ok: true,
      updates: [
        {
          id: "u1",
          date: "2026-06-01",
          type: "feature",
          title: "T",
          body: "B",
          link: "https://x.dev",
        },
      ],
    } as never);
    const updates = await getUpdates();
    expect(updates).toHaveLength(1);
    expect(updates[0]).toMatchObject({
      id: "u1",
      type: "feature",
      title: "T",
      link: "https://x.dev",
    });
  });

  it("normalizes an unknown type to 'update'", async () => {
    get.mockResolvedValue({
      ok: true,
      updates: [{ id: "u2", type: "bogus", title: "T" }],
    } as never);
    const updates = await getUpdates();
    expect(updates[0].type).toBe("update");
    expect(updates[0].link).toBeUndefined();
  });

  it("returns an empty array when the script throws", async () => {
    get.mockRejectedValue(new Error("offline"));
    await expect(getUpdates()).resolves.toEqual([]);
  });

  it("returns an empty array when updates is missing", async () => {
    get.mockResolvedValue({ ok: true });
    await expect(getUpdates()).resolves.toEqual([]);
  });
});
