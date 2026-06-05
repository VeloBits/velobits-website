import { test, expect, type Page } from "@playwright/test";

/**
 * Mobile-responsiveness regression suite.
 *
 * Primary guard: the homepage must not scroll horizontally on phone-sized
 * viewports. This previously regressed because decorative radial-glow layers in
 * the Community and Updates sections were positioned with negative offsets but
 * their sections lacked `overflow-hidden`, so the glows leaked past the viewport
 * and forced a ~520px-wide document on a 360px screen.
 *
 * Secondary guards: the key grids collapse to a single column on phones and
 * restore their multi-column layouts on a tablet, and the mobile menu trigger
 * meets the 44px tap-target minimum with a working backdrop.
 *
 * Runs under both the desktop `chromium` project and the touch-emulated
 * `Mobile Chrome` project (see playwright.config.ts).
 */

const PHONE_WIDTHS = [360, 375, 390, 414, 768] as const;

/** Computed grid-track count for a selector, or null when the element is absent. */
function gridTracks(page: Page, selector: string): Promise<number | null> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const value = getComputedStyle(el).gridTemplateColumns;
    return value && value !== "none" ? value.trim().split(/\s+/).length : null;
  }, selector);
}

test.describe("Mobile responsiveness", () => {
  test.describe("no horizontal overflow on the homepage", () => {
    for (const width of PHONE_WIDTHS) {
      test(`fits the viewport at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto("/");
        // Let late client components (marquee, background grid) mount + settle.
        await page.waitForLoadState("networkidle").catch(() => {});
        const { scrollW, innerW } = await page.evaluate(() => ({
          scrollW: document.documentElement.scrollWidth,
          innerW: window.innerWidth,
        }));
        expect(
          scrollW,
          `document scrollWidth (${scrollW}) should not exceed the viewport (${innerW}) at ${width}px`
        ).toBeLessThanOrEqual(innerW + 1);
      });
    }
  });

  test("hero heading is not clipped at 360px", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/");
    const h1Right = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      if (!h1) return 0;
      return h1.getBoundingClientRect().right;
    });
    expect(
      h1Right,
      `h1 right edge (${Math.round(h1Right)}) should fit within the 360px viewport`
    ).toBeLessThanOrEqual(365); // 5px tolerance for sub-pixel rounding
  });

  test("key grids collapse to a single column on a 375px phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    expect(await gridTracks(page, ".about-grid")).toBe(1);
    expect(await gridTracks(page, "#about .grid-cols-3")).toBe(1); // stats cards
    expect(await gridTracks(page, ".products-grid")).toBe(1);
    expect(await gridTracks(page, ".community-grid")).toBe(1);
    expect(await gridTracks(page, ".footer-grid")).toBe(1);
  });

  test("grids restore their multi-column layout on a 768px tablet", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/");
    expect(await gridTracks(page, "#about .grid-cols-3")).toBe(3);
    expect(await gridTracks(page, ".products-grid")).toBe(2);
    expect(await gridTracks(page, ".footer-grid")).toBe(4);
  });

  test.describe("mobile menu", () => {
    test.use({ viewport: { width: 375, height: 812 } });

    test("hamburger meets the 44px tap-target minimum", async ({ page }) => {
      await page.goto("/");
      const toggle = page.getByRole("button", { name: /Open navigation menu/i });
      const box = await toggle.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.width).toBeGreaterThanOrEqual(44);
      expect(box!.height).toBeGreaterThanOrEqual(44);
    });

    test("the backdrop scrim closes the menu when tapped", async ({ page }) => {
      await page.goto("/");
      await page.getByRole("button", { name: /Open navigation menu/i }).click();
      const menu = page.locator("#mobile-menu");
      await expect(menu).toBeVisible();
      // The scrim is the only element carrying the z-[95] utility class.
      const scrim = page.locator('div[class*="z-[95]"]');
      await expect(scrim).toBeVisible();
      // Tap below the menu so the click lands on the scrim, not a menu item.
      await scrim.click({ position: { x: 10, y: 500 } });
      await expect(menu).not.toBeVisible();
    });
  });
});
