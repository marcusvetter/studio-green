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

    // Content is CMS-configurable (nav items can be hidden), so don't assert a
    // fixed list. Instead, every rendered nav link must target an existing
    // anchor on the home page.
    const navLinks = page.locator("nav a[href^='/#']");
    await expect(navLinks.first()).toBeVisible();

    const hrefs = (await navLinks.evaluateAll(links =>
      links.map(l => l.getAttribute("href"))
    )).filter((h): h is string => !!h);
    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      const anchor = href.slice(1); // "/#intro" -> "#intro"
      const count = await page.locator(anchor).count();
      expect(count, `anchor ${anchor} missing for nav link ${href}`).toBeGreaterThan(0);
    }
  });
});
