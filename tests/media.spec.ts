import { test, expect } from '@playwright/test';

test.describe("Assets and links", () => {

  test("every rendered image has a source", async ({ page }) => {
    await page.goto("/");

    // Image paths are CMS-managed, so we only assert that every image the page
    // renders points somewhere. This catches templating regressions without
    // depending on which image the editor picked.
    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute("src");
      expect(src?.trim(), `image #${i} is missing a src`).toBeTruthy();
    }
  });

  test("hardcoded internal links resolve", async ({ page }) => {
    await page.goto("/");

    // Only nav and footer links are hardcoded in the layout. Body links come
    // from CMS markdown, so they are intentionally excluded here.
    const hrefs = await page
      .locator("nav a[href^='/'], footer a[href^='/']")
      .evaluateAll(links => Array.from(new Set(
        links.map(l => l.getAttribute("href")).filter((h): h is string => !!h)
      )));

    for (const href of hrefs) {
      const path = href.split("#")[0] || "/";
      const response = await page.request.get(path);
      expect(response.status(), `link ${href} did not resolve`).toBe(200);
    }
  });
});
