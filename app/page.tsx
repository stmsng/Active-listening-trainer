import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/user-nav";
import {
  MessageCircle,
  Brain,
  Star,
  Zap,
  Heart,
  ArrowRight,
  Sparkles,
  Headphones,
} from "lucide-react";

const characters = [
  {
    name: "Satomi",
    age: 44,
    nationality: "Japanese",
    gender: "female" as const,
    is_therapist: false,
    badge: { label: "Reserved", color: "bg-secondary" },
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
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
    avatar: "/placeholder-user.jpg",
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
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            Active Listening Dojo
          </Link>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground sm:gap-4">
            <Link
              href="#practice"
              className="hidden rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:inline"
            >
              How it works
            </Link>
            <Link
              href="#partners"
              className="hidden rounded-md px-2 py-1.5 transition-colors hover:text-foreground md:inline"
            >
              Partners
            </Link>
            <UserNav />
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 sm:pb-28 sm:pt-16 md:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.646_0.222_280.116/0.18),transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-chart-2/20 blur-3xl animate-[pulse_12s_ease-in-out_infinite_1s]"
          />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Practice with AI that pushes back like real people
              </Badge>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl md:leading-[1.05]">
              Listen better.
              <span className="mt-1 block bg-gradient-to-r from-accent via-chart-4 to-chart-2 bg-clip-text text-transparent sm:mt-2">
                Connect deeper.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl md:leading-relaxed">
              Train active listening in short, guided conversations—then get
              structured feedback so you know what landed and what to try next.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[200px] rounded-full px-8 text-base shadow-lg shadow-accent/20"
              >
                <Link href="/train">
                  Start a session
                  <MessageCircle className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-w-[200px] rounded-full border-border/80 bg-background/50 text-base backdrop-blur-sm"
              >
                <Link href="/train">
                  <Headphones className="mr-2 h-5 w-5 opacity-80" />
                  Jump into demo
                </Link>
              </Button>
            </div>

            <div className="relative mx-auto mt-14 max-w-3xl">
              <div className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-br from-accent/30 via-transparent to-chart-2/25 blur-sm" />
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/30 shadow-2xl ring-1 ring-accent/10 backdrop-blur-sm">
                <img
                  src="/placeholder.jpg"
                  alt="Warm, inviting space for conversation"
                  className="h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section
          id="practice"
          className="scroll-mt-20 border-t border-border/40 bg-muted/40 px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wider text-accent">
                    How it works
                  </p>
                  <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Skills you build in the room,{" "}
                    <span className="text-accent">not in a slide deck</span>
                  </h2>
                  <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
                    You practice reflecting, clarifying, and staying curious in the
                    listener role—while AI partners respond like real humans, not
                    like a script.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    {
                      icon: Headphones,
                      title: "Humans listen only",
                      body: "You always practice as the listener; the AI holds the other side of the conversation—by design, for safety.",
                    },
                    {
                      icon: Heart,
                      title: "Low-stakes space",
                      body: "Mess up, retry, and build muscle memory without awkward stakes.",
                    },
                    {
                      icon: Brain,
                      title: "Feedback you can use",
                      body: "After sessions, see what worked and one clear next focus.",
                    },
                    {
                      icon: Zap,
                      title: "Paced to you",
                      body: "Scenarios from reserved to intense so you stretch at the right edge.",
                    },
                  ].map(({ icon: Icon, title, body }) => (
                    <div
                      key={title}
                      className="rounded-2xl border border-border/50 bg-background/80 p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                          <Icon className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-semibold leading-snug">{title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                            {body}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative lg:pl-4">
                <div className="overflow-hidden rounded-3xl border border-border/50 shadow-xl ring-1 ring-border/30">
                  <img
                    src="/placeholder.jpg"
                    alt="Person engaged in meaningful conversation"
                    className="h-auto w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-2 max-w-[220px] rounded-2xl border border-border/60 bg-card p-4 shadow-lg backdrop-blur-sm sm:-right-4 sm:bottom-6 sm:max-w-[240px]">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    After each chat
                  </p>
                  <p className="mt-1 text-lg font-semibold leading-snug">
                    Concrete notes on tone, pacing, and presence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Personalities */}
        <section
          id="partners"
          className="scroll-mt-20 bg-gradient-to-b from-background via-muted/30 to-background px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Conversation partners
              </p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Six voices,{" "}
                <span className="text-accent">six kinds of challenge</span>
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Each profile has different pace, emotion, and communication
                habits—so your practice generalizes beyond a single persona.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {characters.map((character) => (
                <Card
                  key={character.name}
                  className="group border-2 border-transparent bg-card/70 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl"
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="relative mx-auto w-fit">
                        <img
                          src={character.avatar}
                          alt={character.name}
                          className="h-20 w-20 rounded-full object-cover shadow-md ring-2 ring-background"
                        />
                        <Badge
                          className={`absolute -right-1 -top-1 shadow-sm ${character.badge.color}`}
                        >
                          {character.badge.label}
                        </Badge>
                      </div>

                      <div className="text-center">
                        <h3 className="text-xl font-bold">{character.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {character.age}y/o · {character.nationality}
                          {character.is_therapist && " · Therapist"}
                        </p>
                      </div>

                      <p className="text-center text-sm leading-relaxed text-muted-foreground">
                        {character.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 border-t border-border/60 pt-4">
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

            <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base shadow-lg shadow-accent/15"
              >
                <Link href="/train">
                  Train with a partner
                  <Star className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link href="/report">
                  See sample feedback layout
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-muted/30 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} Active Listening Dojo</p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/train" className="transition-colors hover:text-foreground">
              Practice
            </Link>
            <Link href="/report" className="transition-colors hover:text-foreground">
              Sample report
            </Link>
            <Link href="#partners" className="transition-colors hover:text-foreground">
              Partners
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
