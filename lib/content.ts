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
  fullbleedImage?: string
  fullbleedCaption?: string
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
  fullbleedImage?: string
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

const SINGLE_SECTIONS = [
  { dir: "intro", file: "intro.md" },
  { dir: "projects", file: "projects.md" },
  { dir: "services", file: "services.md" },
  { dir: "quote", file: "quote.md" },
  { dir: "about-me", file: "about-me.md" },
  { dir: "contact", file: "contact.md" },
] as const

function readSectionFile<T extends object>(
  dir: string,
  file: string,
  transform: (data: Record<string, unknown>, content: string, file: string) => T
): T | undefined {
  const filePath = path.join(process.cwd(), "content", dir, file)
  if (!fs.existsSync(filePath)) return undefined
  const raw = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(raw)
  return transform(data as Record<string, unknown>, content, file)
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
  return SINGLE_SECTIONS
    .map(({ dir, file }) => readSectionFile(dir, file, (data) => parseSection(data)))
    .filter((section): section is Section => section !== undefined)
    .sort((a, b) => a.order - b.order)
}

export function loadIntro(): IntroSection | undefined {
  return readSectionFile("intro", "intro.md", (data, content) => ({
    ...parseSection(data),
    body: content,
    fullbleedImage: data.fullbleed_image ? String(data.fullbleed_image) : undefined,
    fullbleedCaption: data.fullbleed_caption ? String(data.fullbleed_caption) : undefined,
  } as IntroSection))
}

export function loadProjects(): ProjectsSection | undefined {
  return readSectionFile("projects", "projects.md", (data) => {
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
}

export function loadServices(): ServicesSection | undefined {
  return readSectionFile("services", "services.md", (data) => {
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
    return {
      ...parseSection(data),
      cards,
      fullbleedImage: data.fullbleed_image ? String(data.fullbleed_image) : undefined,
    } as ServicesSection
  })
}

export function loadQuote(): QuoteSection | undefined {
  return readSectionFile("quote", "quote.md", (data) => ({
    ...parseSection(data),
    text: String(data.quote_text || ""),
    author: String(data.author || ""),
  } as QuoteSection))
}

export function loadAbout(): AboutSection | undefined {
  return readSectionFile("about-me", "about-me.md", (data, content) => ({
    ...parseSection(data),
    image: data.image ? String(data.image) : undefined,
    subtitle: data.subtitle ? String(data.subtitle) : undefined,
    body: content,
  } as AboutSection))
}

export function loadContact(): ContactSection | undefined {
  return readSectionFile("contact", "contact.md", (data) => ({
    ...parseSection(data),
    headline: String(data.headline || ""),
    text: String(data.text || ""),
    email: String(data.email || ""),
  } as ContactSection))
}
