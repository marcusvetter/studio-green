import fs from "fs"
import path from "path"
import matter from "gray-matter"

export type Section = {
  title: string
  navTitle?: string
  section: string
  order: number
  image?: string
  imagePosition?: "left" | "right"
  body: string
}

function loadDir<T>(dirName: string, transform: (data: Record<string, unknown>, content: string, file: string) => T): T[] {
  const contentDir = path.join(process.cwd(), "content", dirName)
  if (!fs.existsSync(contentDir)) return []

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith(".md"))
  return files.map(file => {
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8")
    const { data, content } = matter(raw)
    return transform(data as Record<string, unknown>, content, file)
  })
}

export function loadSections(): Section[] {
  return loadDir("sections", (data, content) => {
    const imagePosition: Section["imagePosition"] =
      data.image_position === "left" ? "left" : data.image_position === "right" ? "right" : undefined
    return {
      title: String(data.title),
      navTitle: data.nav_title ? String(data.nav_title) : undefined,
      section: String(data.section),
      order: Number(data.order),
      image: data.image ? String(data.image) : undefined,
      imagePosition,
      body: content,
    }
  }).sort((a, b) => a.order - b.order)
}
