import Image from "next/image"
import Link from "next/link"
import { ArrowDownCircle } from "lucide-react"

export function HeroSection() {
  return (
    <section id="home" className="section relative bg-gradient-to-b from-muted to-background">
      <div className="container-custom grid md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            Master the Art of <span className="text-primary">Active Listening</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-muted-foreground">
            Transform your relationships and communication skills through interactive practice and personalized AI
            feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              href="#about"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-center"
            >
              Learn More
            </Link>
            <Link
              href="#technology"
              className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-center"
            >
              Explore Technology
            </Link>
          </div>
        </div>

        <div className="relative h-[300px] md:h-[500px] w-full">
          <Image
            src="/placeholder.svg?height=500&width=500"
            alt="Active listening illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Link href="#about">
          <ArrowDownCircle size={36} className="text-primary" />
        </Link>
      </div>
    </section>
  )
}

