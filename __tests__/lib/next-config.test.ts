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

describe("next.config headers", () => {
  it("lets the legal pages be framed, after the site-wide rule so it wins", async () => {
    const headers = await nextConfig.headers!();
    const sources = headers.map((h) => h.source);
    const general = sources.indexOf("/(.*)");
    for (const source of ["/app/revon/:path*", "/legal/:path*"]) {
      const i = sources.indexOf(source);
      expect(i).toBeGreaterThan(general);
      expect(headers[i].headers[0].value).toBe("frame-ancestors *");
    }
    expect(headers[general].headers[0].value).not.toContain("*");
  });
});
