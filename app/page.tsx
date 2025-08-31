import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Brain, Users, Star, Zap, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-balance">
              Active Listening
              <span className="text-accent block">Dojo</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-2xl mx-auto">
              Master the art of active listening through AI-powered
              conversations that adapt to your learning style
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/train">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Learning
                <MessageCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/train">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
              >
                Try Demo
              </Button>
            </Link>
          </div>

          <div className="pt-8">
            <img
              src="/warm-therapy-office-with-comfortable-chairs-and-so.png"
              alt="Warm, inviting therapy office setting"
              className="rounded-2xl shadow-2xl mx-auto max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="min-h-screen flex items-center justify-center bg-muted px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-balance">
                Learn Through
                <span className="text-accent block">Interactive Practice</span>
              </h2>
              <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
                Active Listening Dojo transforms how you develop empathy and
                communication skills. Through interactive conversations with AI,
                you'll practice both giving and receiving active listening in a
                safe, supportive environment.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Practice Both Roles</h3>
                    <p className="text-sm text-muted-foreground">
                      Take turns as listener and speaker
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Heart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Safe Environment</h3>
                    <p className="text-sm text-muted-foreground">
                      Learn without judgment or pressure
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Brain className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Feedback</h3>
                    <p className="text-sm text-muted-foreground">
                      Get personalized insights after each session
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-accent/10 p-2 rounded-lg">
                    <Zap className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Adaptive Learning</h3>
                    <p className="text-sm text-muted-foreground">
                      Scenarios that match your skill level
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="/person-having-a-meaningful-conversation-in-a-comfo.png"
                alt="Person engaged in meaningful conversation"
                className="rounded-2xl shadow-xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm">Skill Improvement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Personalities Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-accent/5 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-balance">
              Meet Your AI
              <span className="text-accent block">Conversation Partners</span>
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-3xl mx-auto">
              Each AI personality brings unique stories, challenges, and
              communication styles to help you develop well-rounded active
              listening skills across diverse scenarios.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Personality Cards */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/professional-woman-therapist-headshot-warm-smile.png"
                      alt="Sarah - The Therapist"
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-accent">
                      Expert
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold">Sarah</h3>
                    <p className="text-muted-foreground">The Therapist</p>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Specializes in emotional processing and trauma-informed
                    conversations. Perfect for practicing deep empathy and
                    validation techniques.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.9</div>
                      <div className="text-xs text-muted-foreground">
                        Empathy
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.8</div>
                      <div className="text-xs text-muted-foreground">
                        Patience
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/young-professional-man-business-casual-confident.png"
                      alt="Marcus - The Executive"
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-primary">
                      Leader
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold">Marcus</h3>
                    <p className="text-muted-foreground">The Executive</p>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    High-pressure business scenarios and workplace conflicts.
                    Learn to navigate professional relationships with active
                    listening.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.7</div>
                      <div className="text-xs text-muted-foreground">
                        Directness
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.6</div>
                      <div className="text-xs text-muted-foreground">
                        Challenge
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/elderly-grandmother-wise-kind-eyes-gentle-smile.png"
                      alt="Elena - The Grandmother"
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-secondary">
                      Wise
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold">Elena</h3>
                    <p className="text-muted-foreground">The Grandmother</p>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Stories of life experience, family dynamics, and
                    intergenerational wisdom. Practice patience and respect in
                    conversations.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">5.0</div>
                      <div className="text-xs text-muted-foreground">
                        Wisdom
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.9</div>
                      <div className="text-xs text-muted-foreground">
                        Warmth
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/teenage-student-backpack-casual-clothes-thoughtful.png"
                      alt="Alex - The Student"
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-chart-2">
                      Growing
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold">Alex</h3>
                    <p className="text-muted-foreground">The Student</p>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Academic pressures, social challenges, and coming-of-age
                    struggles. Develop skills for supporting younger
                    individuals.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.5</div>
                      <div className="text-xs text-muted-foreground">
                        Energy
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.3</div>
                      <div className="text-xs text-muted-foreground">
                        Openness
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/middle-aged-man-doctor-medical-professional-caring.png"
                      alt="Dr. James - The Physician"
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-chart-3">
                      Healer
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold">Dr. James</h3>
                    <p className="text-muted-foreground">The Physician</p>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Medical conversations, health concerns, and bedside manner
                    scenarios. Learn compassionate communication in healthcare
                    settings.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.8</div>
                      <div className="text-xs text-muted-foreground">
                        Precision
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.7</div>
                      <div className="text-xs text-muted-foreground">Care</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="relative">
                    <img
                      src="/creative-artist-woman-colorful-clothing-expressive.png"
                      alt="Maya - The Artist"
                      className="w-20 h-20 rounded-full mx-auto shadow-lg"
                    />
                    <Badge className="absolute -top-2 -right-2 bg-chart-4">
                      Creative
                    </Badge>
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold">Maya</h3>
                    <p className="text-muted-foreground">The Artist</p>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    Creative struggles, artistic expression, and emotional
                    depth. Practice listening to abstract thoughts and creative
                    processes.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.9</div>
                      <div className="text-xs text-muted-foreground">
                        Creativity
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">4.6</div>
                      <div className="text-xs text-muted-foreground">Depth</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/train">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Conversations
                <Star className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
