import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("next.config redirects", () => {
  it("sends the hidden blog, its posts, tags and feed back to the home page", async () => {
    const redirects = await nextConfig.redirects!();
    const sources = redirects.map((r) => r.source);
    expect(sources).toEqual(expect.arrayContaining(["/blog", "/blog/:path*"]));
    redirects.forEach((r) => {
      expect(r.destination).toBe("/");
      expect(r.permanent).toBe(false);
    });
  });
});
