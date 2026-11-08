import { test, expect } from '@playwright/test'

// Interaction tests for the client-side layout. They never depend on which
// sections the CMS exposes — they always operate on whatever nav links render.

async function waitForNavVisible(page: import('@playwright/test').Page) {
  await expect
    .poll(
      () => page.locator('nav').first().evaluate(nav => getComputedStyle(nav.parentElement!).opacity),
      { message: 'nav should become visible after the hero animation' }
    )
    .toBe('1')
}

test.describe('Navigation behaviour', () => {
  test('nav fades in after the hero animation on the home page', async ({ page }) => {
    await page.goto('/')
    await waitForNavVisible(page)
  })

  test('nav is visible immediately on non-home pages', async ({ page }) => {
    await page.goto('/impressum')
    await waitForNavVisible(page)
  })

  test('clicking a nav link reveals the target below the fixed nav', async ({ page }) => {
    await page.goto('/')

    // Remove smooth scrolling so the assertion is not racing the animation.
    await page.addStyleTag({ content: 'html { scroll-behavior: auto !important; }' })
    await waitForNavVisible(page)

    const link = page.locator('nav a[href^="/#"]').first()
    await expect(link).toBeVisible()

    const href = await link.getAttribute('href')
    expect(href).toBeTruthy()
    const anchor = `#${href!.split('#')[1]}`

    await link.click()
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(anchor)

    await expect
      .poll(
        () => page.evaluate(selector => {
          const target = document.querySelector(selector)
          const nav = document.querySelector('nav')
          if (!target || !nav) return Number.NEGATIVE_INFINITY
          return target.getBoundingClientRect().top - nav.getBoundingClientRect().height
        }, anchor),
        { message: `target ${anchor} should not be hidden behind the nav` }
      )
      .toBeGreaterThanOrEqual(-2)
  })

  test('--scroll-offset matches the rendered nav height', async ({ page }) => {
    await page.goto('/impressum')

    await expect
      .poll(() => page.evaluate(() => {
        const nav = document.querySelector('nav')
        if (!nav) return Number.POSITIVE_INFINITY
        const offset = parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--scroll-offset')
        )
        return Math.abs(offset - nav.getBoundingClientRect().height)
      }))
      .toBeLessThanOrEqual(1)
  })
})

test.describe('Mobile navigation', () => {
  test('menu opens, mirrors the section links, and closes on selection', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const hamburger = page.getByRole('button', { name: 'Menü' })
    await expect(hamburger).toBeVisible({ timeout: 15000 })

    // The slide-down panel is the sibling right after the app's fixed <nav>.
    // Scope to the first nav so the Next.js dev-tools overlay cannot interfere.
    const appNav = page.locator('nav').first()
    const menu = appNav.locator('xpath=following-sibling::div[1]')
    await expect(menu).toHaveCSS('opacity', '0')

    await hamburger.click()
    await expect(menu).toHaveCSS('opacity', '1')

    const menuLinks = menu.locator('a[href^="/#"]')
    const menuCount = await menuLinks.count()
    expect(menuCount, 'the mobile menu should render the section links').toBeGreaterThan(0)

    const desktopHrefs = await appNav.locator('a[href^="/#"]').evaluateAll(links =>
      links.map(link => link.getAttribute('href')).filter((href): href is string => !!href)
    )
    const menuHrefs = await menuLinks.evaluateAll(links =>
      links.map(link => link.getAttribute('href')).filter((href): href is string => !!href)
    )

    expect([...menuHrefs].sort()).toEqual([...desktopHrefs].sort())

    const firstHref = await menuLinks.first().getAttribute('href')
    expect(firstHref).toBeTruthy()
    const anchor = `#${firstHref!.split('#')[1]}`

    await menuLinks.first().click()
    await expect(menu).toHaveCSS('opacity', '0')
    await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(anchor)
  })
})

test.describe('Contact', () => {
  test('contact email renders as a valid mailto link', async ({ page }) => {
    await page.goto('/')

    const mailLink = page.locator('main a[href^="mailto:"]').first()
    await expect(mailLink).toBeAttached()

    const href = await mailLink.getAttribute('href')
    expect(href).toMatch(/^mailto:[^@\s]+@[^@\s]+$/)
    expect((await mailLink.textContent())?.trim()).toBeTruthy()
  })
})
