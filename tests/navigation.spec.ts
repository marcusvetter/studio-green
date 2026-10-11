import { test, expect } from '@playwright/test';

test.describe("Navigation", () => {

  test("every rendered section link targets an existing anchor", async ({ page }) => {
    await page.goto("/");

    // Sections (and therefore nav entries) are CMS-managed: they can be added,
    // renamed or hidden. So we don't assert a fixed list — instead every nav
    // link that is rendered must resolve to an element on the page. Anchors and
    // links are generated from the same source, so they always match.
    const hrefs = await page
      .locator("nav a[href^='/#']")
      .evaluateAll(links => links
        .map(l => l.getAttribute("href"))
        .filter((h): h is string => !!h));

    for (const href of hrefs) {
      const anchor = href.slice(1); // "/#intro" -> "#intro"
      const count = await page.locator(anchor).count();
      expect(count, `anchor ${anchor} missing for nav link ${href}`).toBeGreaterThan(0);
    }
  });

  test("footer links to the impressum page", async ({ page }) => {
    await page.goto("/");

    const link = page.locator("footer a[href='/impressum']");
    await expect(link).toHaveCount(1);

    await link.click();
    await expect(page).toHaveURL(/\/impressum\/?$/);
    await expect(page.locator("h1").first()).toHaveText("Impressum");
  });
});
