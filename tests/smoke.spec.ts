import { test, expect } from '@playwright/test';

const pages = [
  { path: "/", headline: "Über mich" },
  { path: "/impressum", headline: "Impressum" },
];

test.describe("Smoke tests", () => {

  for (const page of pages) {
    test(`page ${page.path} should have expected headline`, async ({ page: pg }) => {
      const response = await pg.goto(page.path);
      expect(response?.status()).toBe(200);
      await expect(pg.locator("h1").first()).toHaveText(page.headline);
    });
  }

  test("anchor navigation links exist on home", async ({ page }) => {
    await page.goto("/");

    // Wait for React hydration to complete, then scroll past the hero mask
    // reveal animation threshold to make the desktop navigation visible.
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'instant' }));
    await page.waitForTimeout(300);

    const navLinks = [
      { href: "/#about-me", text: "Über mich" },
      { href: "/#about-studio", text: "Studio Green" },
      { href: "/#philosophy", text: "Haltung" },
      { href: "/#services", text: "Leistungen" },
    ];

    for (const link of navLinks) {
      // On desktop two <nav> elements are rendered: a hidden mobile one (lg:hidden,
      // zero bounding box) and a visible desktop one. Use .last() to target the visible one.
      const navLink = page.locator(`nav a[href="${link.href}"]`).last();
      await expect(navLink).toBeVisible();
    }
  });
});
