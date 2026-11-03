import { test, expect } from "@playwright/test";

// The blog is hidden for now: next.config.ts redirects every /blog URL to the
// home page. The blog code is untouched, so when it comes back, restore the
// original assertions from git history (page shell, empty state, nav link).
test.describe("Blog (hidden)", () => {
  for (const path of ["/blog", "/blog/some-post", "/blog/tag/anything", "/blog/rss.xml"]) {
    test(`${path} redirects to the home page`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/^http:\/\/localhost:3000\/$/);
    });
  }

  test("the blog is not in the sitemap", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.ok()).toBe(true);
    expect(await res.text()).not.toContain("/blog");
  });
});
