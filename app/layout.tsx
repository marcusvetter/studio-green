'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image";
import "./globals.css";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [revealScale, setRevealScale] = useState(1)
  const isSolid = pathname !== '/' || scrolled

  function maskSvg(scale: number) {
    const zoom = scale
    const vbW = 1920 / zoom
    const vbH = 1080 / zoom
    const vbX = 960 - vbW / 2
    const vbY = 540 - vbH / 2
    const viewBox = `${vbX} ${vbY} ${vbW} ${vbH}`
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
      <rect width="1920" height="1080" fill="white"/>
      <text x="960" y="540" text-anchor="middle" dominant-baseline="central"
            font-size="250" font-weight="bold" fill="black" font-family="system-ui, sans-serif">
        <tspan x="960" dy="-140">STUDIO</tspan>
        <tspan x="960" dy="280">GREEN</tspan>
      </text>
    </svg>`
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  }

  useEffect(() => {
    const handleScroll = () => {
      const sy = window.scrollY
      const vh = window.innerHeight
      setScrolled(sy > vh - 100)
      const progress = Math.min(1, sy / (vh * 0.6))
      setOverlayOpacity(1 - progress)
      setRevealScale(1 + progress * 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!window.location.hash) {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="min-h-screen">

        <div className={`fixed top-0 left-0 right-0 z-10 overflow-hidden transition-all duration-300 ${isSolid ? 'bg-white h-15 border-b-2 border-studio-tertiary' : ''}`}>
          <div className="px-4 lg:px-8 h-full">
            <div className="h-full">
              <nav className={`flex flex-row items-center justify-between gap-2 h-full ${isSolid ? '' : 'pt-2 lg:pt-3 pb-2 flex-wrap lg:flex-nowrap'}`}>

                <Link href={'/'} className={`shrink-0 ${isSolid ? 'h-12' : 'w-36 lg:w-44'}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  {isSolid ? (
                    <Image
                      src="/studio-green-logo-long.png"
                      alt="Studio Green"
                      width={200}
                      height={28}
                      className="h-full w-auto"
                      priority
                    />
                  ) : (
                    <Image
                      src="/studio-green-logo.png"
                      alt="Studio Green"
                      width={400}
                      height={236}
                      className="w-full h-auto"
                      priority
                    />
                  )}
                </Link>

                <div className={`flex gap-1 lg:gap-2 ${isSolid ? 'flex-row items-center' : 'grid grid-cols-1 sm:grid-cols-3'}`}>
                  <Link href="/#portfolio" className={`link border-b border-transparent hover:border-studio-accent transition-all duration-200 ${isSolid ? 'px-2 py-1 text-md text-studio-secondary' : 'mx-4 lg:mx-6 py-2 text-base text-right sm:text-center lg:text-lg text-white'}`}>
                    Portfolio
                  </Link>

                  <Link href="/#referenzen" className={`link border-b border-transparent hover:border-studio-accent transition-all duration-200 ${isSolid ? 'px-2 py-1 text-md text-studio-secondary' : 'mx-4 lg:mx-6 py-2 text-base text-right sm:text-center lg:text-lg text-white'}`}>
                    Referenzen
                  </Link>

                  <Link href="/#kontakt" className={`link border-b border-transparent hover:border-studio-accent transition-all duration-200 ${isSolid ? 'px-2 py-1 text-md text-studio-secondary' : 'mx-4 lg:mx-6 py-2 text-base text-right sm:text-center lg:text-lg text-white'}`}>
                    Kontakt
                  </Link>
                </div>

              </nav>
            </div>
          </div>
        </div>

        {pathname === '/' && (
          <header className="relative w-full h-screen overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/header-background.jpeg)' }}
            />

            <div
              className="absolute inset-0"
              style={{
                backgroundColor: '#384828',
                opacity: overlayOpacity,
                WebkitMaskImage: maskSvg(revealScale),
                maskImage: maskSvg(revealScale),
                WebkitMaskSize: 'cover',
                maskSize: 'cover',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
            />
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
