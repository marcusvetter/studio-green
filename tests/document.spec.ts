import { test, expect } from '@playwright/test'

// Document-level invariants. These are independent of CMS copy and catch
// regressions from framework/metadata changes (e.g. Next.js upgrades).

test.describe('Document metadata', () => {
  test('home page declares language, title, description, viewport and icon', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('lang', 'de')

    expect((await page.title()).trim().length).toBeGreaterThan(0)

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.trim().length ?? 0).toBeGreaterThan(0)

    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content')
    expect(viewport).toContain('width=device-width')

    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/favicon.png')
  })

  test('impressum page declares title and description', async ({ page }) => {
    await page.goto('/impressum')

    expect((await page.title()).trim().length).toBeGreaterThan(0)

    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.trim().length ?? 0).toBeGreaterThan(0)
  })
})

test.describe('Document structure', () => {
  test('home page has no duplicate element ids', async ({ page }) => {
    await page.goto('/')

    const duplicates = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll('[id]')).map(element => element.id)
      return Array.from(new Set(ids.filter((id, index) => ids.indexOf(id) !== index)))
    })

    expect(duplicates, `duplicate ids: ${duplicates.join(', ')}`).toEqual([])
  })

  test('unknown routes render a 404 response', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist')

    expect(response?.status()).toBe(404)
    await expect(page.locator('body')).toContainText(/404|not found/i)
  })

  test('home page renders the shell at a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })

    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(page.locator('header').first()).toBeVisible()
    await expect(page.locator('main')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })
})

test.describe('Client runtime', () => {
  test('home page hydrates without uncaught errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))

    await page.goto('/')

    // Wait until the client-side hero animation has completed and the nav is
    // revealed. This ensures hydration actually ran, not just SSR.
    await expect
      .poll(
        () => page.locator('nav').first().evaluate(nav => getComputedStyle(nav.parentElement!).opacity),
        { timeout: 15000 }
      )
      .toBe('1')

    expect(errors, `uncaught errors: ${errors.join(' | ')}`).toEqual([])
  })

  test('impressum page hydrates without uncaught errors', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))

    await page.goto('/impressum')
    await expect(page.locator('main')).toBeVisible()
    await page.waitForTimeout(250)

    expect(errors, `uncaught errors: ${errors.join(' | ')}`).toEqual([])
  })
})
