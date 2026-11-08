import { test, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  DEFAULT_HERO_IMAGE,
  DEFAULT_IMAGE_POSITION_X,
  DEFAULT_IMAGE_POSITION_Y,
  DEFAULT_INTRO_FULLBLEED_MIN_HEIGHT,
  DEFAULT_SERVICES_FULLBLEED_MIN_HEIGHT,
  loadAbout,
  loadContact,
  loadHero,
  loadIntro,
  loadProjects,
  loadQuote,
  loadSections,
  loadServices,
  parseImagePositionX,
  parseImagePositionY,
  parseMinHeight,
} from '../lib/content'

// These tests exercise the content pipeline (gray-matter + our normalisers)
// without asserting any CMS-managed copy. They are deliberately structural:
// an editor can change every text and image, but the shape and the references
// must stay valid.

const CONTENT_ROOT = path.join(process.cwd(), 'content')
const SECTION_FILES = [
  { dir: 'intro', file: 'intro.md' },
  { dir: 'projects', file: 'projects.md' },
  { dir: 'services', file: 'services.md' },
  { dir: 'quote', file: 'quote.md' },
  { dir: 'about-me', file: 'about-me.md' },
  { dir: 'contact', file: 'contact.md' },
] as const

type Frontmatter = Record<string, unknown>

function readFrontmatter(dir: string, file: string): Frontmatter {
  const fullPath = path.join(CONTENT_ROOT, dir, file)
  return matter(fs.readFileSync(fullPath, 'utf-8')).data as Frontmatter
}

function collectImagePaths(): string[] {
  const candidates: Array<string | undefined> = [
    loadHero().image,
    loadIntro()?.fullbleedImage,
    loadAbout()?.image,
    loadServices()?.fullbleedImage,
    ...(loadProjects()?.projects.map(project => project.image) ?? []),
  ]

  return candidates.filter((value): value is string => value !== undefined)
}

test.describe('content normalisers', () => {
  test('image position parsers accept only supported values', () => {
    for (const value of ['left', 'center', 'right'] as const) {
      expect(parseImagePositionX(value)).toBe(value)
    }
    for (const value of ['top', 'center', 'bottom'] as const) {
      expect(parseImagePositionY(value)).toBe(value)
    }

    for (const value of [undefined, null, '', 'LEFT', 'middle', 'start', 0, 1, {}, []]) {
      expect(parseImagePositionX(value)).toBe(DEFAULT_IMAGE_POSITION_X)
      expect(parseImagePositionY(value)).toBe(DEFAULT_IMAGE_POSITION_Y)
    }
  })

  test('parseMinHeight keeps positive finite numbers and falls back otherwise', () => {
    expect(parseMinHeight(420, 111)).toBe(420)
    expect(parseMinHeight('500', 111)).toBe(500)
    expect(parseMinHeight(0.5, 111)).toBe(0.5)

    for (const value of [0, -1, -0.5, '', 'abc', null, undefined, NaN, Infinity, -Infinity, {}]) {
      expect(parseMinHeight(value, 111), `value ${String(value)} should fall back`).toBe(111)
    }

    expect(DEFAULT_INTRO_FULLBLEED_MIN_HEIGHT).toBeGreaterThan(0)
    expect(DEFAULT_SERVICES_FULLBLEED_MIN_HEIGHT).toBeGreaterThan(0)
  })
})

test.describe('content files', () => {
  test('every section file exists and keeps its CMS contract', () => {
    const sections = SECTION_FILES.map(({ dir, file }) => ({
      dir,
      data: readFrontmatter(dir, file),
    }))

    for (const { dir, data } of sections) {
      expect(data.section, `${dir}: section must match its folder`).toBe(dir)
      expect(Number.isFinite(Number(data.order)), `${dir}: order must be numeric`).toBe(true)
      expect(String(data.title ?? '').trim(), `${dir}: title must not be empty`).not.toBe('')

      if ('show_in_nav' in data) {
        expect(typeof data.show_in_nav, `${dir}: show_in_nav must be boolean`).toBe('boolean')
      }
    }

    const ids = sections.map(({ data }) => String(data.section))
    expect(new Set(ids).size, 'section ids must be unique').toBe(ids.length)
  })

  test('loadSections returns exactly the visible sections in order', () => {
    const expected = SECTION_FILES
      .map(({ dir, file }) => ({ dir, data: readFrontmatter(dir, file) }))
      .filter(({ data }) => data.show_in_nav !== false)
      .sort((a, b) => Number(a.data.order) - Number(b.data.order))
      .map(({ data }) => String(data.section))

    const actual = loadSections()

    expect(actual.map(section => section.section)).toEqual(expected)
    for (const section of actual) {
      expect(section.showInNav).toBe(true)
      expect(section.title.trim()).not.toBe('')
      expect((section.navTitle ?? section.title).trim()).not.toBe('')
    }
  })

  test('all content loaders return a defined section', () => {
    expect(loadIntro()).toBeDefined()
    expect(loadProjects()).toBeDefined()
    expect(loadServices()).toBeDefined()
    expect(loadQuote()).toBeDefined()
    expect(loadAbout()).toBeDefined()
    expect(loadContact()).toBeDefined()
    expect(loadHero()).toBeDefined()
  })

  test('hero falls back to a usable image and valid positions', () => {
    const hero = loadHero()

    expect(hero.image.trim()).not.toBe('')
    expect(['left', 'center', 'right']).toContain(hero.imagePositionX)
    expect(['top', 'center', 'bottom']).toContain(hero.imagePositionY)
    expect(DEFAULT_HERO_IMAGE).toMatch(/^\/.+/)
  })

  test('projects keep a renderable shape', () => {
    const projects = loadProjects()
    expect(projects).toBeDefined()

    expect(Array.isArray(projects?.projects)).toBe(true)
    for (const project of projects?.projects ?? []) {
      expect(project.nr.trim()).not.toBe('')
      expect(project.name.trim()).not.toBe('')
      expect(typeof project.description).toBe('string')
      expect(project.image.trim()).not.toBe('')
      expect(['left', 'center', 'right']).toContain(project.imagePositionX)
      expect(['top', 'center', 'bottom']).toContain(project.imagePositionY)
      expect(Array.isArray(project.tags)).toBe(true)
      for (const tag of project.tags) {
        expect(typeof tag).toBe('string')
      }
    }
  })

  test('services keep a renderable shape', () => {
    const services = loadServices()
    expect(services).toBeDefined()

    expect(Array.isArray(services?.cards)).toBe(true)
    expect(services?.fullbleedMinHeight).toBeGreaterThan(0)
    for (const card of services?.cards ?? []) {
      expect(card.nr.trim()).not.toBe('')
      expect(card.name.trim()).not.toBe('')
      expect(typeof card.tagline).toBe('string')
      expect(Array.isArray(card.steps)).toBe(true)
      for (const step of card.steps) {
        expect(step.title.trim()).not.toBe('')
        expect(typeof step.description).toBe('string')
      }
    }
  })

  test('remaining sections keep a renderable shape', () => {
    const intro = loadIntro()
    expect(intro?.body).toEqual(expect.any(String))
    expect(intro?.fullbleedMinHeight).toBeGreaterThan(0)
    expect(['left', 'center', 'right']).toContain(intro?.fullbleedImagePositionX)
    expect(['top', 'center', 'bottom']).toContain(intro?.fullbleedImagePositionY)

    const quote = loadQuote()
    expect(typeof quote?.text).toBe('string')
    expect(typeof quote?.author).toBe('string')

    const about = loadAbout()
    expect(about?.body).toEqual(expect.any(String))
    expect(['left', 'center', 'right']).toContain(about?.imagePositionX)
    expect(['top', 'center', 'bottom']).toContain(about?.imagePositionY)

    const contact = loadContact()
    expect(typeof contact?.headline).toBe('string')
    expect(typeof contact?.text).toBe('string')
    expect(typeof contact?.email).toBe('string')
  })
})

test.describe('CMS schema contract', () => {
  const config = fs.readFileSync(path.join(process.cwd(), 'public', 'cms', 'config.yml'), 'utf-8')

  test('exposes every content folder used by the loaders', () => {
    for (const { dir } of [...SECTION_FILES, { dir: 'hero', file: 'hero.md' }]) {
      expect(config, `CMS is missing folder content/${dir}`).toContain(`folder: content/${dir}`)
    }
  })

  test('exposes the front matter keys read by the content loaders', () => {
    const fields = [
      'image',
      'image_position_x',
      'image_position_y',
      'nav_title',
      'show_in_nav',
      'section',
      'order',
      'eyebrow',
      'headline',
      'fullbleed_image',
      'fullbleed_caption',
      'fullbleed_image_position_x',
      'fullbleed_image_position_y',
      'fullbleed_min_height',
      'body',
      'projects',
      'cards',
      'steps',
      'quote_text',
      'author',
      'name',
      'subtitle',
      'text',
      'email',
    ]

    for (const field of fields) {
      expect(config, `CMS is missing field ${field}`).toMatch(
        new RegExp(`name:\\s*${field}\\b`)
      )
    }
  })
})

test.describe('media references', () => {
  test('every referenced image is absolute and exists in public/', () => {
    const imagePaths = collectImagePaths()
    expect(imagePaths.length, 'the site should reference at least one image').toBeGreaterThan(0)

    for (const src of imagePaths) {
      expect(src.trim(), 'image reference must not be empty').not.toBe('')

      if (/^https?:\/\//.test(src)) continue

      expect(src.startsWith('/'), `image ${src} must be root-relative`).toBe(true)

      const publicPath = path.join(process.cwd(), 'public', src)
      expect(fs.existsSync(publicPath), `image ${src} is missing in public/`).toBe(true)
    }
  })
})
