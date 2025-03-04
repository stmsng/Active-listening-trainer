"use client"

import { useState } from "react"
import Image from "next/image"
import { Brain, Star, BarChart3 } from "lucide-react"

type AIPersonality = {
  id: number
  name: string
  role: string
  description: string
  image: string
  stats: {
    empathy: number
    patience: number
    insight: number
  }
}

const personalities: AIPersonality[] = [
  {
    id: 1,
    name: "Emma",
    role: "Therapist",
    description:
      "Emma creates a safe space for sharing difficult emotions and provides thoughtful, empathetic responses.",
    image: "/placeholder.svg?height=200&width=200",
    stats: {
      empathy: 95,
      patience: 90,
      insight: 85,
    },
  },
  {
    id: 2,
    name: "Marcus",
    role: "Career Coach",
    description: "Marcus helps you navigate professional challenges with practical advice and supportive listening.",
    image: "/placeholder.svg?height=200&width=200",
    stats: {
      empathy: 80,
      patience: 85,
      insight: 95,
    },
  },
  {
    id: 3,
    name: "Sophia",
    role: "Relationship Counselor",
    description: "Sophia specializes in interpersonal dynamics and helps you improve communication in relationships.",
    image: "/placeholder.svg?height=200&width=200",
    stats: {
      empathy: 90,
      patience: 95,
      insight: 90,
    },
  },
  {
    id: 4,
    name: "David",
    role: "Mindfulness Guide",
    description:
      "David helps you practice present-moment awareness and emotional regulation through mindful listening.",
    image: "/placeholder.svg?height=200&width=200",
    stats: {
      empathy: 85,
      patience: 100,
      insight: 80,
    },
  },
]

export function TechnologySection() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section id="technology" className="section bg-gradient-to-b from-background to-muted/30">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Technology</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Powered by advanced AI, our platform creates realistic conversations and provides personalized feedback to
            help you master active listening skills.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">AI-Powered Learning</h3>
            <p className="text-lg mb-6 text-muted-foreground">
              Our platform uses cutting-edge artificial intelligence to create natural, engaging conversations and
              provide detailed feedback on your active listening skills.
            </p>

            <ul className="space-y-6">
              {[
                {
                  icon: <Brain className="h-6 w-6 text-secondary" />,
                  title: "Natural Language Processing",
                  description: "Our AI understands context, emotions, and nuances in conversation.",
                },
                {
                  icon: <Star className="h-6 w-6 text-secondary" />,
                  title: "Personalized Scenarios",
                  description: "Practice with scenarios tailored to your specific goals and challenges.",
                },
                {
                  icon: <BarChart3 className="h-6 w-6 text-secondary" />,
                  title: "Detailed Analysis",
                  description: "Receive comprehensive feedback on your listening patterns and techniques.",
                },
              ].map((item, index) => (
                <li key={index} className="flex gap-4 bg-card p-4 rounded-lg shadow-sm">
                  <div className="mt-1 bg-secondary/10 rounded-full p-2 flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="AI technology illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Meet Our AI Personalities</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalities.map((personality) => (
            <div
              key={personality.id}
              className={`perspective-card bg-card rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                hoveredCard === personality.id ? "scale-105" : ""
              } ${hoveredCard !== null && hoveredCard !== personality.id ? "scale-95 opacity-70" : ""}`}
              onMouseEnter={() => setHoveredCard(personality.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="p-6">
                <div className="relative h-48 w-48 mx-auto mb-4">
                  <Image
                    src={personality.image || "/placeholder.svg"}
                    alt={personality.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>

                <h4 className="text-xl font-bold text-center">{personality.name}</h4>
                <p className="text-secondary font-medium text-center mb-2">{personality.role}</p>
                <p className="text-muted-foreground text-center mb-6">{personality.description}</p>

                <div className="space-y-2">
                  {Object.entries(personality.stats).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize">{key}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            key === "empathy" ? "bg-primary" : key === "patience" ? "bg-secondary" : "bg-accent"
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
