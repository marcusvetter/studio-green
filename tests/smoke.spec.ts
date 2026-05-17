import { test, expect } from '@playwright/test';

const pages = [
  { path: "/", headline: "Herzlich Willkommen bei Studio Green!" },
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
      { href: "/#leistungen", text: "Unsere Leistungen" },
      { href: "/#team", text: "Das Team" },
      { href: "/#kontakt", text: "Kontakt" },
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`nav a[href="${link.href}"]`);
      await expect(navLink).toBeVisible();
    }
  });
});
