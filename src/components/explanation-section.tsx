import Image from "next/image"
import { Headphones, MessageSquare, Award } from "lucide-react"

export function ExplanationSection() {
  return (
    <section id="about" className="section bg-card">
      <div className="container-custom">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What is Active Listening?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Active listening is more than just hearing words—it's about fully engaging with the speaker, understanding
            their message, and responding thoughtfully.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Interactive Learning Experience</h3>
            <p className="text-lg mb-6 text-muted-foreground">
              Our platform offers a unique approach to mastering active listening skills through:
            </p>

            <ul className="space-y-4">
              {[
                {
                  icon: <Headphones className="h-6 w-6 text-primary" />,
                  title: "Practice Active Listening",
                  description:
                    "Take turns performing active listening with our AI personalities in realistic scenarios.",
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-primary" />,
                  title: "Receive Virtual Active Listening",
                  description:
                    "Experience being heard and understood by our AI, modeling effective listening techniques.",
                },
                {
                  icon: <Award className="h-6 w-6 text-primary" />,
                  title: "Get Personalized Feedback",
                  description:
                    "After each session, receive detailed analysis and actionable tips to improve your skills.",
                },
              ].map((item, index) => (
                <li key={index} className="flex gap-4">
                  <div className="mt-1 bg-muted rounded-full p-2 flex-shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[300px] md:h-[400px] w-full order-1 md:order-2">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Interactive conversation illustration"
              fill
              className="object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src="/placeholder.svg?height=400&width=500"
              alt="Benefits of active listening"
              fill
              className="object-contain rounded-lg shadow-lg"
            />
          </div>

          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Why Active Listening Matters</h3>
            <p className="text-lg mb-6 text-muted-foreground">
              Active listening is a fundamental skill that enhances all aspects of communication:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                "Builds stronger relationships",
                "Reduces misunderstandings",
                "Creates psychological safety",
                "Improves conflict resolution",
                "Enhances empathy",
                "Fosters deeper connections",
              ].map((benefit, index) => (
                <div key={index} className="bg-muted/50 p-4 rounded-lg">
                  <p className="font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

