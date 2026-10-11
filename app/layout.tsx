import type { ReactNode } from "react"
import type { Metadata } from "next"
import { loadSections, loadHero } from "@/lib/content"
import ClientLayout from "./client-layout"

export type NavItem = { href: string; label: string }

export const metadata: Metadata = {
  title: "Studio Green - Landschaftsgestaltung aus Andernach",
  description: "Studio Green",
};

export default function Layout({ children }: { children: ReactNode }) {
  const sections = loadSections()
  const navItems: NavItem[] = sections.map(s => ({
    href: `/#${s.section}`,
    label: s.navTitle || s.title,
  }))
  const hero = loadHero()

  return (
    <ClientLayout navItems={navItems} hero={hero}>{children}</ClientLayout>
  )
}
