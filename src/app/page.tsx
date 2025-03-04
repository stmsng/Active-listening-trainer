import { HeroSection } from "@/components/hero-section"
import { ExplanationSection } from "@/components/explanation-section"
import { TechnologySection } from "@/components/technology-section"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ExplanationSection />
      <TechnologySection />
      <Footer />
    </main>
  )
}