import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type Section = {
  title: string
  navTitle?: string
  section: string
  order: number
}

export type IntroSection = Section & {
  body: string
}

export type Project = {
  nr: string
  name: string
  description: string
  image: string
  tags: string[]
}

export type ProjectsSection = Section & {
  projects: Project[]
}

export type ServiceStep = {
  title: string
  description: string
}

export type ServiceCard = {
  nr: string
  name: string
  tagline: string
  steps: ServiceStep[]
  note?: string
}

export type ServicesSection = Section & {
  cards: ServiceCard[]
}

export type QuoteSection = Section & {
  text: string
  author: string
}

export type AboutSection = Section & {
  image?: string
  subtitle?: string
  body: string
}

export type ContactSection = Section & {
  headline: string
  text: string
  email: string
}

function loadDir<T extends object>(dirName: string, transform: (data: Record<string, unknown>, content: string, file: string) => T): T[] {
  const contentDir = path.join(process.cwd(), "content", dirName)
  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"))
  return files.map(file => {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8")
    const { data, content } = matter(raw)
    return transform(data as Record<string, unknown>, content, file)
  }).sort((a, b) => {
    const aOrder = "order" in a ? (a as unknown as Section).order : 0
    const bOrder = "order" in b ? (b as unknown as Section).order : 0
    return aOrder - bOrder
  })
}

function parseSection(data: Record<string, unknown>): Section {
  return {
    title: String(data.title),
    navTitle: data.nav_title ? String(data.nav_title) : undefined,
    section: String(data.section),
    order: Number(data.order),
  }
}

export function loadSections(): Section[] {
  return loadDir("sections", (data) => parseSection(data))
}

export function loadIntro(): IntroSection | undefined {
  const items = loadDir("sections", (data, content) => ({ ...parseSection(data), body: content } as IntroSection))
  return items.find(s => s.section === "intro")
}

export function loadProjects(): ProjectsSection | undefined {
  const items = loadDir("sections", (data) => {
    const rawProjects = data.projects as Record<string, unknown>[] | undefined
    const projects: Project[] = (rawProjects || []).map(p => ({
      nr: String(p.nr),
      name: String(p.name),
      description: String(p.description),
      image: String(p.image),
      tags: (p.tags as string[] || []),
    }))
    return { ...parseSection(data), projects } as ProjectsSection
  })
  return items.find(s => s.section === "projects")
}

export function loadServices(): ServicesSection | undefined {
  const items = loadDir("sections", (data) => {
    const rawCards = data.cards as Record<string, unknown>[] | undefined
    const cards: ServiceCard[] = (rawCards || []).map(c => {
      const rawSteps = c.steps as Record<string, unknown>[] || []
      const steps: ServiceStep[] = rawSteps.map(s => ({
        title: String(s.title),
        description: String(s.description),
      }))
      return {
        nr: String(c.nr),
        name: String(c.name),
        tagline: String(c.tagline),
        steps,
        note: c.note ? String(c.note) : undefined,
      }
    })
    return { ...parseSection(data), cards } as ServicesSection
  })
  return items.find(s => s.section === "services")
}

export function loadQuote(): QuoteSection | undefined {
  const items = loadDir("sections", (data) => ({
    ...parseSection(data),
    text: String(data.quote_text || ""),
    author: String(data.author || ""),
  } as QuoteSection))
  return items.find(s => s.section === "quote")
}

export function loadAbout(): AboutSection | undefined {
  const items = loadDir("sections", (data, content) => ({
    ...parseSection(data),
    image: data.image ? String(data.image) : undefined,
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    body: content,
  } as AboutSection))
  return items.find(s => s.section === "about-me")
}

export function loadContact(): ContactSection | undefined {
  const items = loadDir("sections", (data) => ({
    ...parseSection(data),
    headline: String(data.headline || ""),
    text: String(data.text || ""),
    email: String(data.email || ""),
  } as ContactSection))
  return items.find(s => s.section === "contact")
}
