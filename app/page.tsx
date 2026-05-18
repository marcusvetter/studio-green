import type { Metadata } from "next";
import ReactMarkdown from "react-markdown"
import { loadSections } from "@/lib/content"
import type { Section } from "@/lib/content"

export const metadata: Metadata = {
  title: "Studio Green - Landschaftsgestaltung aus Andernach",
  description: "Studio Green",
};

export default function Home() {
  const sections: Section[] = loadSections()

  return (
    <div>
      {sections.map((section, i) => (
        <section key={section.section} id={section.section} className={`${i % 2 === 0 ? "bg-studio-accent/15" : "bg-studio-warm/15"} scroll-mt-18 lg:scroll-mt-24 rounded-lg p-4 lg:p-6 -mx-2 mt-10`}>
          <h1>{section.title}</h1>
          <div className={`flex flex-col ${section.image ? (section.imagePosition === "left" ? "lg:flex-row" : "lg:flex-row-reverse") : ""} gap-6 items-start`}>
            {section.image && (
              <img src={section.image} alt={section.title} className="w-full lg:w-1/3 rounded-lg object-cover" />
            )}
            <div className={section.image ? "lg:w-2/3" : "w-full"}>
              <ReactMarkdown>{section.body}</ReactMarkdown>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
