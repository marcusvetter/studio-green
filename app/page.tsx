import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"
import {
  loadIntro,
  loadProjects,
  loadServices,
  loadQuote,
  loadAbout,
  loadContact,
} from "@/lib/content"
import RevealSection from "./reveal-section"

export const metadata: Metadata = {
  title: "Studio Green - Landschaftsgestaltung aus Andernach",
  description: "Studio Green",
}

function FullbleedImage({ src, alt, caption, className = "" }: { src: string; alt: string; caption?: string; className?: string }) {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="w-full h-full object-cover block" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-studio-primary/55" />
      {caption && (
        <p className="absolute bottom-10 left-6 md:left-14 font-['Cormorant_Garamond',serif] italic text-base text-[#F5F0E8]/65 tracking-[0.04em]">
          {caption}
        </p>
      )}
    </div>
  )
}

function IntroSection() {
  const intro = loadIntro()
  if (!intro) return null
  return (
    <RevealSection id={intro.section} className="max-w-[1200px] mx-auto py-16 md:py-32 px-6 md:px-14">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-studio-tertiary mb-5 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-studio-tertiary">
            {intro.eyebrow}
          </p>
          <h1 className="font-['Cormorant_Garamond',serif] text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-[1.4] text-[#2A1F14]">
            {intro.headline}
          </h1>
        </div>
        <div>
          <div className="text-[15px] leading-[1.95] text-[#5a4a3a]">
            <ReactMarkdown>{intro.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </RevealSection>
  )
}

function ProjectsSection() {
  const projects = loadProjects()
  if (!projects) return null
  return (
    <RevealSection id={projects.section} className="max-w-[1200px] mx-auto py-16 md:py-32 px-6 md:px-14">
      <div className="flex justify-between items-baseline mb-20 border-b border-studio-accent pb-5">
        <h2 className="font-['Cormorant_Garamond',serif] text-[2.2rem] font-light text-[#2A1F14]">{projects.title}</h2>
      </div>
      {projects.projects.map((project, i) => (
        <div
          key={project.nr}
          className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center mb-24 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}
        >
          <div className="aspect-[4/3] overflow-hidden relative md:[direction:ltr]">
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-cover block transition-transform duration-700 hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
          <div className="md:[direction:ltr]">
            <p className="text-[10px] tracking-[0.22em] text-studio-accent mb-5">{project.nr}</p>
            <h3 className="font-['Cormorant_Garamond',serif] text-[clamp(1.5rem,2.5vw,2.2rem)] font-light leading-[1.2] mb-5 text-[#2A1F14]">
              {project.name}
            </h3>
            <p className="text-[14px] leading-[1.9] text-[#5a4a3a] mb-8">{project.description}</p>
            <div className="flex gap-2.5 flex-wrap">
              {project.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.18em] uppercase text-studio-tertiary border border-studio-tertiary px-3.5 py-[5px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </RevealSection>
  )
}

function ServicesSection() {
  const services = loadServices()
  if (!services) return null
  return (
    <section id={services.section} className="bg-studio-primary py-14 md:py-28 px-6 md:px-14">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-16">
          <p className="text-[10px] tracking-[0.22em] uppercase text-studio-tertiary mb-5 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-studio-tertiary">
            {services.eyebrow}
          </p>
          <h2 className="font-['Cormorant_Garamond',serif] text-[2rem] font-light text-[#F5F0E8] mt-4 mb-0 whitespace-pre-line">
            {services.headline}
          </h2>
        </div>
        <div className="flex md:grid gap-px overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none md:grid-cols-3 -mx-6 md:mx-0">
          <div aria-hidden className="basis-[7.5%] shrink-0 md:hidden" />
          {services.cards.map(card => (
            <div
              key={card.nr}
              className="basis-[85%] shrink-0 snap-center bg-white/[0.04] border border-studio-accent/20 p-11 md:p-9 flex flex-col transition-colors hover:bg-white/[0.07]"
            >
              <p className="text-[9px] tracking-[0.22em] uppercase text-studio-accent opacity-60 mb-6">{card.nr}</p>
              <h3 className="font-['Cormorant_Garamond',serif] text-[1.7rem] font-light text-[#F5F0E8] leading-[1.2] mb-3">
                {card.name}
              </h3>
              <p className="text-xs text-studio-tertiary tracking-[0.04em] mb-8 pb-6 border-b border-studio-accent/20">
                {card.tagline}
              </p>
              <ul className="list-none flex flex-col flex-1">
                {card.steps.map((step, si) => (
                  <li
                    key={si}
                    className="flex items-start gap-4 py-3.5 border-b border-white/[0.07] last:border-b-0"
                  >
                    <span className="w-[5px] h-[5px] rounded-full bg-studio-tertiary opacity-70 shrink-0 mt-[4px]" />
                    <div>
                      <p className="text-xs font-medium tracking-[0.05em] text-[#F5F0E8] mb-1">{step.title}</p>
                      <p className="text-xs leading-[1.75] text-[#F5F0E8]/50">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {card.note && (
                <p className="mt-8 pt-5 border-t border-studio-accent/15 text-[11px] text-[#F5F0E8]/30 tracking-[0.04em] italic">
                  {card.note}
                </p>
              )}
            </div>
          ))}
          <div aria-hidden className="basis-[7.5%] shrink-0 md:hidden" />
        </div>
      </div>
    </section>
  )
}

function QuoteSection() {
  const quote = loadQuote()
  if (!quote) return null
  return (
    <RevealSection id={quote.section} className="py-20 md:py-36 px-6 md:px-14 text-center max-w-[820px] mx-auto">

      <p className="font-['Cormorant_Garamond',serif] text-[clamp(1.6rem,3vw,2.4rem)] font-light italic leading-[1.5] text-[#2A1F14]">
        <span className="block text-left font-['Cormorant_Garamond',serif] text-[6rem] leading-[0.4] text-studio-accent opacity-50 mb-4">
          &ldquo;
        </span>
        {quote.text}      
      </p>
      <div className="text-right font-['Cormorant_Garamond',serif] text-[6rem] leading-[0.4] text-studio-accent opacity-50 mt-7">
        &rdquo;
      </div>
      <p className="mt-10 text-[10px] tracking-[0.22em] uppercase text-studio-tertiary">
        {quote.author}
      </p>
    </RevealSection>
  )
}

function AboutSection() {
  const about = loadAbout()
  if (!about) return null
  return (
    <section id={about.section} className="bg-[#EDE8E0] border-t border-studio-accent py-14 md:py-28 px-6 md:px-14">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-12 md:gap-24 items-center">
        {about.image && (
          <div className="aspect-[3/4] overflow-hidden">
            <img src={about.image} alt={about.title} className="w-full h-full object-cover block" />
          </div>
        )}
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-studio-tertiary mb-5 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-studio-tertiary">
            {about.eyebrow}
          </p>
          <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(2rem,3.5vw,3rem)] font-light text-[#2A1F14] mb-1">
            {about.name}
          </h2>
          {about.subtitle && (
            <p className="text-[11px] tracking-[0.12em] text-studio-tertiary uppercase mb-10">
              {about.subtitle}
            </p>
          )}
          <div className="text-[15px] leading-[1.95] text-[#5a4a3a]">
            <ReactMarkdown>{about.body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const contact = loadContact()
  if (!contact) return null
  return (
    <section id={contact.section} className="border-t border-studio-accent py-16 md:py-32 px-6 md:px-14">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
        <div>
          <p className="text-[10px] tracking-[0.22em] uppercase text-studio-tertiary mb-5 flex items-center gap-3 before:content-[''] before:inline-block before:w-6 before:h-px before:bg-studio-tertiary">
            {contact.eyebrow}
          </p>
          <h2 className="font-['Cormorant_Garamond',serif] text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-[1.3] text-[#2A1F14] mb-4 mt-4">
            {contact.headline}
          </h2>
          <p className="text-[14px] leading-[1.95] text-[#5a4a3a]">{contact.text}</p>
          <div className="mt-10 text-[13px] text-studio-primary tracking-[0.04em]">
            <a
              href={`mailto:${contact.email}`}
              className="text-studio-primary no-underline border-b border-studio-tertiary pb-px transition-colors hover:border-studio-primary"
            >
              {contact.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  const intro = loadIntro()
  const services = loadServices()
  return (
    <div>
      <IntroSection />
      {intro?.fullbleedImage && (
        <FullbleedImage
          src={intro.fullbleedImage}
          alt="Wildgräser im Morgenlicht"
          caption={intro.fullbleedCaption}
          className="h-[70vh] min-h-[420px]"
        />
      )}
      <ProjectsSection />
      <ServicesSection />
      {services?.fullbleedImage && (
        <FullbleedImage
          src={services.fullbleedImage}
          alt="Garten im Morgenlicht"
          className="h-[55vh] min-h-[360px]"
        />
      )}
      <QuoteSection />
      <AboutSection />
      <ContactSection />
    </div>
  )
}
