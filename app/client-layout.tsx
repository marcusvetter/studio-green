'use client'

import React, { useEffect, useState, useRef, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image"
import type { NavItem } from "./layout"
import "./globals.css"

function animateHero(
  svg: SVGSVGElement,
  group: SVGGElement,
  duration: number,
  onComplete: () => void
) {
  const start = performance.now()
  const cx = 960, cy = 540

  function tick(now: number) {
    const t = Math.min(1, (now - start) / duration)
    const e = t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2

    svg.style.opacity = String(Math.max(0, 0.9 - e * 0.9))
    const s = 1 + e * 50
    group.setAttribute('transform',
      `translate(${cx * (1 - s)}, ${cy * (1 - s)}) scale(${s})`)

    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      onComplete()
    }
  }
  requestAnimationFrame(tick)
}

export default function ClientLayout({ children, navItems }: { children: ReactNode; navItems: NavItem[] }) {

  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [vpW, setVpW] = useState(1920)
  const [vpH, setVpH] = useState(1080)
  const isSolid = pathname !== '/' || scrolled
  const svgRef = useRef<SVGSVGElement>(null)
  const groupRef = useRef<SVGGElement>(null)

  // Hero animation: plays on mount
  useEffect(() => {
    if (pathname !== '/') return
    const svg = svgRef.current
    const group = groupRef.current
    if (!svg || !group) return
    const delay = 1000
    const timer = setTimeout(() => {
      animateHero(svg, group, 2000, () => setAnimationDone(true))
    }, delay)
    return () => clearTimeout(timer)
  }, [pathname])

  // Scroll: track scrolled state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Resize: for SVG sizing
  useEffect(() => {
    const handleResize = () => {
      setVpW(window.innerWidth)
      setVpH(window.innerHeight)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Custom cursor
  useEffect(() => {
    const handleCursorMove = (e: MouseEvent) => {
      const cursor = document.getElementById('custom-cursor')
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
    }
    document.addEventListener('mousemove', handleCursorMove)
    return () => document.removeEventListener('mousemove', handleCursorMove)
  }, [])

  // Reset on navigation
  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
    setMobileMenuOpen(false)
  }, [pathname])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const svgAspect = 1920 / 1080
  const vpAspect = vpW / vpH
  const visibleWidth = vpAspect >= svgAspect ? 1920 : vpW * 1080 / vpH
  const fontSize = Math.min(300, Math.round(300 * visibleWidth / 1920))
  const dy1 = -Math.round(fontSize * 0.56)
  const dy2 = Math.round(fontSize * 1.12)

  return (
    <html lang="de" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">

        {/* Custom cursor dot */}
        <div
          id="custom-cursor"
          className="fixed w-2.5 h-2.5 rounded-full bg-[#1C2E1A] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-multiply transition-[opacity] duration-200"
        />

        {/* Mobile nav: always visible, always solid */}
        <div className="md:hidden">
          <Nav navItems={navItems} solid={true} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onLogoClick={scrollToTop} />
        </div>
        {/* Desktop nav: hidden during hero animation on home */}
        <div className="hidden md:block">
          {(pathname !== '/' || animationDone) && (
          <Nav navItems={navItems} solid={isSolid} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} onLogoClick={scrollToTop} />
          )}
        </div>

        {/* Hero: relative, scrolls away naturally */}
        {pathname === '/' && (
          <header className="relative w-full h-screen overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/header-background.jpeg)' }}
            />

            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full"
              style={{ opacity: 0.9 }}
              viewBox="0 0 1920 1080"
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <mask id="hero-mask">
                  <rect width="1920" height="1080" fill="white" />
                  <text x="960" y="540" textAnchor="middle" dominantBaseline="central"
                        fontSize={fontSize} fontWeight="bold" fill="black" fontFamily="system-ui, sans-serif">
                    <tspan x="960" dy={dy1}>STUDIO</tspan>
                    <tspan x="960" dy={dy2}>GREEN</tspan>
                  </text>
                </mask>
              </defs>
              <g ref={groupRef}>
                <rect width="1920" height="1080" fill="#1C2E1A" mask="url(#hero-mask)" />
              </g>
            </svg>
          </header>
        )}

        <div className="bg-[#F5F0E8]">
          <main className={`py-4 lg:py-8 ${pathname !== '/' ? 'pt-24 lg:pt-28' : ''}`}>
            {children}
          </main>
        </div>

        <footer className="bg-[#1C2E1A] px-6 md:px-12">
          <div className="w-full h-px bg-[#C9B99A]/20"></div>
          <div className="py-6 flex justify-end">
            <Link href={"/impressum"} className="text-[10px] tracking-[0.16em] uppercase text-[#7A9E76] no-underline hover:text-[#C9B99A] transition-colors">
              Impressum & Datenschutz
            </Link>
          </div>
        </footer>

      </body>
    </html>
  )
}

function Nav({ navItems, solid, mobileMenuOpen, setMobileMenuOpen, onLogoClick }: {
  navItems: NavItem[]
  solid: boolean
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  onLogoClick: () => void
}) {
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-20 flex justify-between items-center transition-all duration-400 ${
          solid
            ? 'bg-[#F5F0E8]/95 backdrop-blur-[8px] border-b border-[#C9B99A]/50 px-6 md:px-12 py-4'
            : 'bg-transparent px-6 md:px-12 py-4'
        }`}
      >
        <Link href="/" scroll={false} className="flex items-center no-underline shrink-0" onClick={onLogoClick}>
          <Image
            src="/studio-green-logo-long.png"
            alt="Studio Green"
            width={400}
            height={60}
            className="h-14 w-auto"
            priority
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-10 list-none">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`text-[11px] font-normal tracking-[0.14em] uppercase no-underline transition-colors duration-200 ${
                  solid ? 'text-[#2A1F14] hover:text-[#C9B99A]' : 'text-[#F5F0E8] hover:text-[#C9B99A]'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </div>

        {/* Mobile hamburger — only when solid */}
        {solid && (
          <button
            onClick={() => setMobileMenuOpen(p => !p)}
            className="md:hidden flex flex-col gap-1.5 p-2 bg-transparent border-none cursor-pointer"
            aria-label="Menü"
          >
            <span className={`block h-px w-6 bg-[#2A1F14] transition-transform duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-6 bg-[#2A1F14] transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-px w-6 bg-[#2A1F14] transition-transform duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        )}
      </nav>

      {/* Mobile menu slide-down */}
      <div className={`fixed top-0 left-0 right-0 z-10 bg-[#1C2E1A] transition-all duration-300 ease-in-out md:hidden ${
        mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
        <div className="flex flex-col items-end px-6 py-24 gap-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5F0E8] text-base no-underline py-2 tracking-wide hover:text-[#C9B99A] transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
