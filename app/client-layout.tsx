'use client'

import React, { useEffect, useState, useId, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image";
import type { NavItem } from "./layout"
import "./globals.css";

export default function ClientLayout({ children, navItems }: { children: ReactNode; navItems: NavItem[] }) {

  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [revealScale, setRevealScale] = useState(1)
  const [vpW, setVpW] = useState(1920)
  const [vpH, setVpH] = useState(1080)
  const isSolid = pathname !== '/' || scrolled
  const maskId = useId()

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      const vh = window.innerHeight
      setScrolled(sy > vh - 100)
      const progress = Math.min(1, sy / (vh * 0.7))
      setOverlayOpacity(1 - progress)
      setRevealScale(1 + progress * 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setVpW(window.innerWidth)
      setVpH(window.innerHeight)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
    setMobileMenuOpen(false)
  }, [pathname])

  const svgAspect = 1920 / 1080
  const vpAspect = vpW / vpH
  const visibleWidth = vpAspect >= svgAspect ? 1920 : vpW * 1080 / vpH
  const fontSize = Math.min(300, Math.round(300 * visibleWidth / 1920))
  const dy1 = -Math.round(fontSize * 0.56)
  const dy2 = Math.round(fontSize * 1.12)

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-screen">

        {isSolid ? (
          <SolidNav navItems={navItems} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
        ) : (
          <HeroNav navItems={navItems} />
        )}

        {pathname === '/' && (
          <header className="relative w-full h-screen overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/header-background.jpeg)' }}
            />

            <svg
              className="absolute inset-0 w-full h-full"
              style={{ opacity: overlayOpacity }}
              viewBox={`${960 - (1920 / revealScale) / 2} ${540 - (1080 / revealScale) / 2} ${1920 / revealScale} ${1080 / revealScale}`}
              preserveAspectRatio="xMidYMid slice"
            >
              <defs>
                <mask id={maskId}>
                  <rect width="1920" height="1080" fill="white" />
                  <text x="960" y="540" textAnchor="middle" dominantBaseline="central"
                        fontSize={fontSize} fontWeight="bold" fill="black" fontFamily="system-ui, sans-serif">
                    <tspan x="960" dy={dy1}>STUDIO</tspan>
                    <tspan x="960" dy={dy2}>GREEN</tspan>
                  </text>
                </mask>
              </defs>
              <rect width="1920" height="1080" fill="#384828" mask={`url(#${maskId})`} />
            </svg>
          </header>
        )}

        <div className="bg-white">
          <main className={`px-4 lg:px-8 py-4 lg:py-8 ${pathname !== '/' ? 'pt-24 lg:pt-28' : ''}`}>
            {children}
          </main>
        </div>

        <footer className="px-4 lg:px-8 bg-white">
          <div className="w-full h-1 bg-linear-to-r from-studio-tertiary/70 via-studio-primary/70 to-studio-secondary/70"></div>
          <div className="py-4 space-y-4 lg:space-y-0 text-center">
            <Link href={"/impressum"} className="font-semibold">
              Impressum & Datenschutz
            </Link>
          </div>
        </footer>

      </body >
    </html >
  );
}

function SolidNav({ navItems, mobileMenuOpen, setMobileMenuOpen }: {
  navItems: NavItem[]
  mobileMenuOpen: boolean
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 bg-white h-15 border-b-2 border-studio-tertiary transition-all duration-300">
        <div className="px-4 lg:px-8 h-full">
          <div className="h-full">
            <nav className="flex flex-row items-center justify-between gap-2 h-full">
              <Link
                href={'/'}
                scroll={false}
                className="shrink-0 h-12"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <Image
                  src="/studio-green-logo-long.png"
                  alt="Studio Green"
                  width={200}
                  height={28}
                  className="h-full w-auto"
                  priority
                />
              </Link>

              <button
                onClick={() => setMobileMenuOpen(p => !p)}
                className="lg:hidden flex flex-col gap-1.5 p-2"
              >
                <span className={`block h-0.5 w-6 bg-studio-secondary transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 w-6 bg-studio-secondary transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 w-6 bg-studio-secondary transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>

              <div className="hidden lg:flex gap-1 lg:gap-2 flex-row items-center">
                {navItems.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="link border-b border-transparent hover:border-studio-accent transition-all duration-200 px-2 py-1 text-md text-studio-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className={`fixed top-15 left-0 right-0 z-10 bg-studio-primary lg:hidden transition-all duration-300 ease-in-out ${
        mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}>
        <div className="flex flex-col items-end px-4 lg:px-8 py-4 gap-2">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="link border-b border-transparent hover:border-studio-accent text-white text-base text-right py-2"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

function HeroNav({ navItems }: { navItems: NavItem[] }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 transition-all duration-300">
      <div className="px-4 lg:px-8 h-full">
        <div className="h-full">
          <nav className="flex flex-row items-start justify-between gap-2 h-full pt-2 lg:pt-3 pb-2 flex-wrap lg:flex-nowrap">
            <Link
              href={'/'}
              scroll={false}
              className="shrink-0 w-36 lg:w-44"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <Image
                src="/studio-green-logo-long-white.png"
                alt="Studio Green"
                width={400}
                height={236}
                className="w-full h-auto"
                priority
              />
            </Link>

            <div className="flex gap-1 lg:gap-2 flex-col items-end">
              {navItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="link border-b border-transparent hover:border-studio-accent transition-all duration-200 mx-4 lg:mx-6 py-2 text-base text-right sm:text-center lg:text-lg text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
