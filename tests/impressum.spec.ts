import { test, expect } from '@playwright/test'

// The Impressum is hardcoded, so unlike the CMS-driven home page we can safely
// assert its legal section headings. These tests also cover the non-home shell.

test.describe('Impressum page', () => {
  test('renders the legal sections', async ({ page }) => {
    await page.goto('/impressum')

    await expect(page.locator('h1').first()).toHaveText('Impressum')
    await expect(page.getByRole('heading', { name: 'Angaben gemäß § 5 DDG' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Datenschutzerklärung' })).toBeVisible()
  })

  test('uses the non-home layout without the hero', async ({ page }) => {
    await page.goto('/impressum')

    await expect(page.locator('header')).toHaveCount(0)
    await expect(page.locator('nav').first()).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('logo navigates back to the home page', async ({ page }) => {
    await page.goto('/impressum')

    await page.locator('nav a[href="/"]').click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('header').first()).toBeVisible()
  })
})
