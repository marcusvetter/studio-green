import { test, expect } from '@playwright/test';

test.describe("Smoke tests", () => {

  test("home page should have expected headline", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toContainText("Ich gestalte Gärten");
  });

  test("impressum page should have expected headline", async ({ page }) => {
    const response = await page.goto("/impressum");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toHaveText("Impressum");
  });

  test("anchor navigation links exist on home", async ({ page }) => {
    await page.goto("/");

    // Wait for hero animation to complete, then scroll past the hero so the
    // IntersectionObserver sets animationDone=true and the desktop nav renders.
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'instant' }));
    await page.waitForTimeout(500);

    const navLinks = [
      { href: "/#intro", text: "Arbeit" },
      { href: "/#projects", text: "Gärten" },
      { href: "/#services", text: "Leistungen" },
      { href: "/#about-me", text: "Über mich" },
      { href: "/#contact", text: "Kontakt" },
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`nav a[href="${link.href}"]`).last();
      await expect(navLink).toBeVisible();
    }
  });
});
