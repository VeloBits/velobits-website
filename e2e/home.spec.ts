import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("has correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Velobits/);
  });

  test("renders the header with Velobits brand", async ({ page }) => {
    await page.goto("/");
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();
    await expect(header).toContainText("Velobits");
  });

  test("renders the footer with Velobits name", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Velobits");
  });

  test("hero heading contains FixMyText and Velobits", async ({ page }) => {
    await page.goto("/");
    const h1 = page.getByRole("heading", { level: 1 });
    await expect(h1).toContainText("FixMyText");
    await expect(h1).toContainText("Velobits");
  });

  test("hero waitlist CTA is visible and links to #waitlist", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /Join FixMyText Waitlist/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "#waitlist");
  });

  test("hero preview CTA links to #products", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /See Product Preview/i });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "#products");
  });

  test("navbar has main navigation landmark", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await expect(nav).toBeVisible();
  });

  test("has no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    expect(errors).toHaveLength(0);
  });
});
