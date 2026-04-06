import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Brain, Users, Star, Zap, Heart } from "lucide-react";

const characters = [
  {
    name: "Satomi",
    age: 44,
    nationality: "Japanese",
    gender: "female" as const,
    is_therapist: false,
    badge: { label: "Reserved", color: "bg-secondary" },
    avatar: "/professional-woman-therapist-headshot-warm-smile.png",
    description:
      "Low communication skill and moderate introversion. Practice patience and drawing out someone who struggles to express themselves.",
    stats: [
      { label: "Introversion", value: 5 },
      { label: "Openness", value: 5 },
    ],
  },
  {
    name: "Marcus",
    age: 38,
    nationality: "American",
    gender: "male" as const,
    is_therapist: false,
    badge: { label: "Reactive", color: "bg-primary" },
    avatar: "/young-professional-man-business-casual-confident.png",
    description:
      "High reactivity and conscientiousness. Navigating workplace stress with strong opinions and quick emotional responses.",
    stats: [
      { label: "Reactivity", value: 8 },
      { label: "Conscientiousness", value: 9 },
    ],
  },
  {
    name: "Elena",
    age: 72,
    nationality: "Mexican",
    gender: "female" as const,
    is_therapist: false,
    badge: { label: "Wise", color: "bg-secondary" },
    avatar: "/elderly-grandmother-wise-kind-eyes-gentle-smile.png",
    description:
      "High openness and low reactivity. Rich life experience and a willingness to share, but she takes her time.",
    stats: [
      { label: "Openness", value: 9 },
      { label: "Reactivity", value: 2 },
    ],
  },
  {
    name: "Alex",
    age: 17,
    nationality: "British",
    gender: "nonbinary" as const,
    is_therapist: false,
    badge: { label: "Guarded", color: "bg-chart-2" },
    avatar: "/teenage-student-backpack-casual-clothes-thoughtful.png",
    description:
      "High introversion and low communication skill. Dealing with academic pressure and social anxiety - requires gentle, non-pushy listening.",
    stats: [
      { label: "Introversion", value: 9 },
      { label: "Communication", value: 2 },
    ],
  },
  {
    name: "Dr. Priya",
    age: 50,
    nationality: "Indian",
    gender: "female" as const,
    is_therapist: true,
    badge: { label: "Therapist", color: "bg-chart-3" },
    avatar: "/middle-aged-man-doctor-medical-professional-caring.png",
    description:
      "A therapist character who may use coaching language. High communication skill - great for learning from an expert listener.",
    stats: [
      { label: "Communication", value: 9 },
      { label: "Openness", value: 8 },
    ],
  },
  {
    name: "Kai",
    age: 28,
    nationality: "Korean",
    gender: "male" as const,
    is_therapist: false,
    badge: { label: "Volatile", color: "bg-chart-4" },
    avatar: "/creative-artist-woman-colorful-clothing-expressive.png",
    description:
      "High reactivity and low conscientiousness. Creative and emotionally intense - conversations can escalate quickly if not handled with care.",
    stats: [
      { label: "Reactivity", value: 9 },
      { label: "Conscientiousness", value: 2 },
    ],
  },
];

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
            {characters.map((character) => (
              <Card
                key={character.name}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur border-2 hover:border-accent/50"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="w-20 h-20 rounded-full mx-auto shadow-lg"
                      />
                      <Badge className={`absolute -top-2 -right-2 ${character.badge.color}`}>
                        {character.badge.label}
                      </Badge>
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold">{character.name}</h3>
                      <p className="text-muted-foreground">
                        {character.age}y/o &middot; {character.nationality}
                        {character.is_therapist && " &middot; Therapist"}
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      {character.description}
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      {character.stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                          <div className="text-lg font-bold text-accent">
                            {stat.value}/10
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
