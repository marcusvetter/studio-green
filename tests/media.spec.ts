import { test, expect } from '@playwright/test'

test.describe('Assets and links', () => {

  test('every rendered image has a source and an alt attribute', async ({ page }) => {
    await page.goto('/')

    // Image paths and alt texts are CMS-managed, so we only assert that every
    // image the page renders is addressable and accessible. This catches
    // templating regressions without depending on which image the editor picked.
    const images = page.locator('img')
    const count = await images.count()
    expect(count, 'the page should render at least one image').toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const image = images.nth(i)
      const src = await image.getAttribute('src')
      const alt = await image.getAttribute('alt')

      expect(src?.trim(), `image #${i} is missing a src`).toBeTruthy()
      expect(alt, `image #${i} is missing an alt attribute`).not.toBeNull()
    }
  })

  test('every rendered image resolves', async ({ page, request }) => {
    await page.goto('/')

    const srcs = await page.locator('img[src]').evaluateAll(images =>
      Array.from(new Set(
        images
          .map(image => image.getAttribute('src'))
          .filter((src): src is string => !!src && !src.startsWith('data:'))
      ))
    )

    expect(srcs.length).toBeGreaterThan(0)

    for (const src of srcs) {
      const response = await request.get(src)
      expect(response.status(), `image ${src} did not resolve`).toBe(200)
    }
  })

  test('every internal link resolves', async ({ page, request }) => {
    await page.goto('/')

    // Nav and footer links are hardcoded; body links come from CMS markdown.
    // Both are internal paths, so any of them must resolve.
    const hrefs = await page
      .locator('a[href^="/"]')
      .evaluateAll(links => Array.from(new Set(
        links.map(link => link.getAttribute('href')).filter((href): href is string => !!href)
      )))

    expect(hrefs.length, 'the page should render at least one internal link').toBeGreaterThan(0)

    for (const href of hrefs) {
      const path = href.split('#')[0] || '/'
      const response = await request.get(path)
      expect(response.status(), `link ${href} did not resolve`).toBe(200)
    }
  })
})
