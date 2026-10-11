import { test, expect } from '@playwright/test';

// Structural smoke tests. These deliberately never assert CMS-managed copy:
// every front matter field can be edited through the CMS, which would otherwise
// break the pipeline. We only check invariants that hold for any valid content.

test.describe("Smoke tests", () => {

  test("home page loads and renders the page shell", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);

    // The layout always renders these regions regardless of content.
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("home page renders a non-empty heading", async ({ page }) => {
    await page.goto("/");

    // The intro section always renders an <h1>. Its text is CMS-managed, so we
    // only assert that a heading with some text exists.
    const h1 = page.locator("main h1").first();
    await expect(h1).toBeVisible();
    const text = (await h1.textContent())?.trim() ?? "";
    expect(text.length).toBeGreaterThan(0);
  });

  test("impressum page loads with its heading", async ({ page }) => {
    const response = await page.goto("/impressum");
    expect(response?.status()).toBe(200);

    // The Impressum copy is hardcoded (not CMS-managed), so asserting its
    // heading is safe.
    await expect(page.locator("h1").first()).toHaveText("Impressum");
  });
});
