import { test, expect } from "@playwright/test";

// CI runs without Notion credentials, so getAllPosts() returns [] and /blog
// renders its empty state. These tests assert the page shell + chrome render and
// the Blog nav link is wired — independent of whether any posts exist.
test.describe("Blog", () => {
  test("blog index has a Velobits title", async ({ page }) => {
    await page.goto("/blog");
    await expect(page).toHaveTitle(/Blog|Velobits/);
  });

  test("renders the header and footer chrome", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("renders the blog index heading even with no posts", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Writing/i);
  });

  test("navbar Blog link points to /blog and is not marked 'Soon'", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    const blogLink = nav.getByRole("link", { name: "Blog" });
    await expect(blogLink).toHaveAttribute("href", "/blog");
    await expect(nav).not.toContainText(/Soon/i);
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/blog");
    expect(errors).toHaveLength(0);
  });

  test("blog page logo links to '/'", async ({ page }) => {
    await page.goto("/blog");
    const logo = page.getByRole("link", { name: /Velobits home/i });
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("section nav links on /blog use root-relative hash hrefs", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await expect(nav.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/#products");
    await expect(nav.getByRole("link", { name: "Community" })).toHaveAttribute("href", "/#community");
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/#about");
  });

  test("Join Waitlist CTA on /blog has '/#waitlist' href", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await expect(nav.getByRole("link", { name: /Join Waitlist/i })).toHaveAttribute("href", "/#waitlist");
  });
});
