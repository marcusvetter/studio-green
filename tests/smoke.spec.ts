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

    const navLinks = [
      { href: "/#about-me", text: "Über mich" },
      { href: "/#about-studio", text: "Studio Green" },
      { href: "/#philosophy", text: "Haltung" },
      { href: "/#services", text: "Leistungen" },
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`nav a[href="${link.href}"]`);
      await expect(navLink).toBeVisible();
    }
  });
});
