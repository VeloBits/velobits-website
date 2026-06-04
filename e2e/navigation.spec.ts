import { test, expect } from "@playwright/test";

// ─── Navbar link hrefs ───────────────────────────────────────────────────────

test.describe("Navbar link hrefs", () => {
  test("each nav link has the expected href", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await expect(nav.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/#products");
    await expect(nav.getByRole("link", { name: "Community" })).toHaveAttribute("href", "/#community");
    await expect(nav.getByRole("link", { name: "Updates" })).toHaveAttribute("href", "/#updates");
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("href", "/#about");
    await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });

  test("logo has href '/'", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByRole("link", { name: /Velobits home/i });
    await expect(logo).toHaveAttribute("href", "/");
  });

  test("desktop Join Waitlist CTA has href '/#waitlist'", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await expect(nav.getByRole("link", { name: /Join Waitlist/i })).toHaveAttribute("href", "/#waitlist");
  });
});

// ─── Hash scrolling from homepage ────────────────────────────────────────────

test.describe("Hash scrolling from homepage", () => {
  test("clicking Products scrolls #products into view", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "Products" }).click();
    await expect(page.locator("#products")).toBeInViewport({ timeout: 5000 });
  });

  test("clicking Community scrolls #community into view", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "Community" }).click();
    await expect(page.locator("#community")).toBeInViewport({ timeout: 5000 });
  });

  test("clicking Updates scrolls #updates into view", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "Updates" }).click();
    await expect(page.locator("#updates")).toBeInViewport({ timeout: 5000 });
  });

  test("clicking About scrolls #about into view", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "About" }).click();
    await expect(page.locator("#about")).toBeInViewport({ timeout: 5000 });
  });

  test("desktop Join Waitlist CTA scrolls #waitlist into view", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: /Join Waitlist/i }).click();
    await expect(page.locator("#waitlist")).toBeInViewport({ timeout: 5000 });
  });
});

// ─── Blog route navigation ────────────────────────────────────────────────────

test.describe("Blog route navigation", () => {
  test("clicking Blog from homepage navigates to /blog", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "Blog" }).click();
    await expect(page).toHaveURL(/\/blog/);
  });

  test("Blog nav link on /blog has href '/blog'", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await expect(nav.getByRole("link", { name: "Blog" })).toHaveAttribute("href", "/blog");
  });
});

// ─── Cross-route: blog → home section ────────────────────────────────────────

test.describe("Cross-route: blog to home sections", () => {
  test("logo from /blog navigates to homepage", async ({ page }) => {
    await page.goto("/blog");
    await page.getByRole("link", { name: /Velobits home/i }).click();
    await expect(page).toHaveURL(/^http:\/\/localhost:3000\/$/);
  });

  test("clicking Products from /blog scrolls #products into view", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "Products" }).click();
    await expect(page.locator("#products")).toBeInViewport({ timeout: 5000 });
  });

  test("clicking About from /blog scrolls #about into view", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "About" }).click();
    await expect(page.locator("#about")).toBeInViewport({ timeout: 5000 });
  });

  test("Join Waitlist CTA from /blog scrolls #waitlist into view", async ({ page }) => {
    await page.goto("/blog");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: /Join Waitlist/i }).click();
    await expect(page.locator("#waitlist")).toBeInViewport({ timeout: 5000 });
  });
});

// ─── Mobile menu ─────────────────────────────────────────────────────────────

test.describe("Mobile menu", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("hamburger opens mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
  });

  test("mobile menu contains all nav links", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu.getByRole("menuitem", { name: "Products" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Community" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Updates" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "About" })).toBeVisible();
    await expect(menu.getByRole("menuitem", { name: "Blog" })).toBeVisible();
  });

  test("mobile menu has Join Waitlist button", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    const menu = page.locator("#mobile-menu");
    await expect(menu.getByRole("link", { name: /Join Waitlist/i })).toBeVisible();
  });

  test("clicking a mobile link closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    await page.locator("#mobile-menu").getByRole("menuitem", { name: "Blog" }).click();
    await expect(page.locator("#mobile-menu")).not.toBeVisible();
  });

  test("Escape key closes the mobile menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: /Open navigation menu/i }).click();
    await expect(page.locator("#mobile-menu")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.locator("#mobile-menu")).not.toBeVisible();
  });
});

// ─── Console errors during navigation ────────────────────────────────────────

test.describe("Console errors during navigation", () => {
  test("no console errors navigating homepage → /blog → homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /Main navigation/i });
    await nav.getByRole("link", { name: "Blog" }).click();
    await page.waitForURL(/\/blog/);
    await page.getByRole("link", { name: /Velobits home/i }).click();
    await page.waitForURL(/^http:\/\/localhost:3000\/$/);

    expect(errors).toHaveLength(0);
  });
});
