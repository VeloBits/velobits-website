import { describe, it, expect } from "vitest";
import nextConfig from "../../next.config";

describe("next.config redirects", () => {
  it("sends the hidden blog, its posts, tags and feed back to the home page", async () => {
    const redirects = await nextConfig.redirects!();
    const blog = redirects.filter((r) => r.source.startsWith("/blog"));
    expect(blog.map((r) => r.source)).toEqual(expect.arrayContaining(["/blog", "/blog/:path*"]));
    blog.forEach((r) => {
      expect(r.destination).toBe("/");
      expect(r.permanent).toBe(false);
    });
  });

  it("sends only the bare Revon subdomain to the Revon section, never /join or /.well-known", async () => {
    const redirects = await nextConfig.redirects!();
    const host = redirects.filter((r) => r.has?.some((h) => h.type === "host"));
    expect(host).toHaveLength(1);
    expect(host[0].source).toBe("/");
    expect(host[0].has).toEqual([{ type: "host", value: "revon.velobits.dev" }]);
    expect(host[0].destination).toBe("https://velobits.dev/#revon");
    const sources = redirects.map((r) => r.source);
    expect(sources.some((s) => s.startsWith("/join") || s.includes(".well-known"))).toBe(false);
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
