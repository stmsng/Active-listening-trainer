import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/user-nav";
import {
  Anchor,
  Waves,
  Mountain,
  Brain,
  Shield,
  Eye,
  HeartHandshake,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Flame,
} from "lucide-react";

const scenarios = [
  {
    name: "Naomi",
    age: 33,
    attachment: "Wave",
    icon: Waves,
    accent: "text-chart-4",
    badge: { label: "Wave", color: "bg-chart-4" },
    description:
      "Anxious-preoccupied — swept up by any whiff of distance. She'll test you with bids that look like provocations. Practice anchoring without rescuing.",
    teaches: ["Eyes on, no pursuit", "Hold the bubble", "Name the wave, ride it"],
  },
  {
    name: "Daniel",
    age: 41,
    attachment: "Island",
    icon: Mountain,
    accent: "text-chart-3",
    badge: { label: "Island", color: "bg-chart-3" },
    description:
      "Self-sufficient to a fault. Stress sends him inward; questions feel like trespass. Practice patient presence and the long, quiet welcome-home.",
    teaches: ["Slow approach", "Make it safe to come back", "No interrogations"],
  },
  {
    name: "Maya",
    age: 36,
    attachment: "Anchor",
    icon: Anchor,
    accent: "text-accent",
    badge: { label: "Anchor", color: "bg-accent" },
    description:
      "Securely attached and a steady model. Maya repairs in real time and stays in the bubble. A partner you can learn secure functioning from, beat by beat.",
    teaches: ["Two-person play", "Real-time repair", "Mutual care under stress"],
  },
  {
    name: "Dr. Sato",
    age: 52,
    attachment: "PACT-trained speaker",
    icon: Brain,
    accent: "text-accent",
    badge: { label: "Therapist", color: "bg-chart-2" },
    description:
      "Between her own sessions, she speaks with PACT precision — naming when her primitives spike, when she's reaching for her ambassadors, what she needs from the bubble. Your rep is listening at her pace without skipping past the precision.",
    teaches: [
      "Track self-state language",
      "Hear ambassador vs. primitive shifts",
      "Don't outrun the precision",
    ],
  },
  {
    name: "Theo",
    age: 39,
    attachment: "Primitives forward",
    icon: Flame,
    accent: "text-destructive",
    badge: { label: "War-ready", color: "bg-destructive" },
    description:
      "Threat-detector cranked to eleven. Sarcasm, sharp eyes, picks up slights you didn't send. Practice de-escalation without matching heat — and without flinching.",
    teaches: ["Stay in your seat", "Don't go to war", "Bring the room down"],
  },
  {
    name: "Carla",
    age: 45,
    attachment: "Button-pusher",
    icon: Shield,
    accent: "text-chart-5",
    badge: { label: "Triggers", color: "bg-chart-5" },
    description:
      "Knows where your buttons are and presses one to see what happens. The reps here are about the 10-second pause and resetting the welcome-home before responding.",
    teaches: ["10-second rule", "Reset, then reply", "Refuse the bait"],
  },
];

const pillars = [
  {
    icon: HeartHandshake,
    title: "Two-person psychology",
    body: "Every rep is a couple-bubble exercise: your nervous system and theirs, in the room together.",
  },
  {
    icon: Eye,
    title: "Eyes-on listening",
    body: "Practice reading face, tone, and prosody — not just words — the way PACT clinicians do.",
  },
  {
    icon: Brain,
    title: "Ambassadors in the lead",
    body: "Keep the prefrontal cortex online when primitives want to grab the wheel.",
  },
  {
    icon: ShieldCheck,
    title: "Secure-functioning reps",
    body: "Short scenarios that build the habit of treating each other as VIPs, especially under load.",
  },
];

const styles = [
  {
    icon: Anchor,
    title: "Anchors",
    label: "Secure",
    accent: "from-accent/30 to-accent/0",
    text: "text-accent",
    body: "Internal working model of safety. Repair is fast, contact is easy, conflict doesn't capsize the bubble.",
  },
  {
    icon: Mountain,
    title: "Islands",
    label: "Avoidant",
    accent: "from-chart-3/30 to-chart-3/0",
    text: "text-chart-3",
    body: "Learned to soothe alone. Withdraws under stress; needs space to return on their own terms.",
  },
  {
    icon: Waves,
    title: "Waves",
    label: "Anxious",
    accent: "from-chart-4/30 to-chart-4/0",
    text: "text-chart-4",
    body: "Riding the swell of perceived closeness and distance. Strong bids, sharp drops, deep need for the bubble.",
  },
];

export default function TatkinPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/tatkin"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            <Anchor className="h-4 w-4 text-accent" />
            <span>PACT Listening Dojo</span>
            <Badge
              variant="secondary"
              className="ml-1 hidden rounded-full border border-border/60 bg-background/80 px-2 py-0 text-[10px] font-medium sm:inline-flex"
            >
              Tatkin Edition
            </Badge>
          </Link>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground sm:gap-4">
            <Link
              href="#styles"
              className="hidden rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:inline"
            >
              Attachment styles
            </Link>
            <Link
              href="#scenarios"
              className="hidden rounded-md px-2 py-1.5 transition-colors hover:text-foreground md:inline"
            >
              Scenarios
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
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.398_0.07_227.392/0.22),transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-chart-3/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]"
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
                Built on the Psychobiological Approach to Couple Therapy
              </Badge>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl md:leading-[1.05]">
              Hold the bubble.
              <span className="mt-1 block bg-gradient-to-r from-accent via-chart-3 to-chart-2 bg-clip-text text-transparent sm:mt-2">
                Even when primitives want the wheel.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl md:leading-relaxed">
              A Tatkin-aligned active listening dojo. Train with anchors, islands,
              waves, and partners who know exactly where your buttons are — and
              build the reps to keep your ambassadors in the lead.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[200px] rounded-full px-8 text-base shadow-lg shadow-accent/20"
              >
                <Link href="/train">
                  Step into the bubble
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 min-w-[200px] rounded-full border-border/80 bg-background/50 text-base backdrop-blur-sm"
              >
                <Link href="#scenarios">
                  <Eye className="mr-2 h-5 w-5 opacity-80" />
                  See the scenarios
                </Link>
              </Button>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border/50 bg-background/80 p-4 text-left shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <h3 className="mt-3 font-semibold leading-snug">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Attachment styles */}
        <section
          id="styles"
          className="scroll-mt-20 border-t border-border/40 bg-muted/40 px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Three attachment styles
              </p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Anchors, islands, and waves —{" "}
                <span className="text-accent">in the room with you</span>
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                Each style needs a different kind of listening. The dojo lets you
                practice the specific moves that keep each one feeling safe.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {styles.map(({ icon: Icon, title, label, accent, text, body }) => (
                <Card
                  key={title}
                  className="relative overflow-hidden border-2 border-transparent bg-card/70 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl"
                >
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 bg-gradient-to-b ${accent}`}
                  />
                  <CardContent className="relative p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 shadow-sm">
                        <Icon className={`h-6 w-6 ${text}`} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{title}</h3>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {label}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                      {body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Ambassadors vs primitives */}
        <section className="border-t border-border/40 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <p className="text-sm font-medium uppercase tracking-wider text-accent">
                  Ambassadors vs. primitives
                </p>
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Who's driving when the conversation{" "}
                  <span className="text-accent">heats up?</span>
                </h2>
                <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                  PACT names two camps inside every conversation. The{" "}
                  <span className="font-medium text-foreground">ambassadors</span> —
                  slow, social, prefrontal — and the{" "}
                  <span className="font-medium text-foreground">primitives</span> —
                  fast, threat-scanning, ready to fight, flee, or freeze. The
                  dojo gives you the reps to keep ambassadors in the lead when
                  it matters most.
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-accent" />
                      <h3 className="font-semibold">Ambassadors</h3>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>· Deliberate pacing</li>
                      <li>· Reads face + tone</li>
                      <li>· Holds the bubble</li>
                      <li>· Repairs in real time</li>
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-background/80 p-4">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-destructive" />
                      <h3 className="font-semibold">Primitives</h3>
                    </div>
                    <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <li>· Threat-first</li>
                      <li>· Sharp + fast</li>
                      <li>· Pushes buttons</li>
                      <li>· Ready for war</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="relative lg:pl-4">
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-accent/15 via-chart-3/10 to-chart-2/15 p-8 shadow-xl ring-1 ring-border/30">
                  <div className="grid gap-4">
                    {[
                      {
                        from: "Primitive",
                        line: '"You\'re doing this on purpose."',
                        to: "Ambassador",
                        repair: '"Help me understand what I missed — I want to get this right."',
                      },
                      {
                        from: "Primitive",
                        line: "(eye-roll, silence, jaw clenched)",
                        to: "Ambassador",
                        repair: "(soft eyes, slow breath) \"I see you're tired. Want a minute, then we try again?\"",
                      },
                      {
                        from: "Primitive",
                        line: '"Fine. Whatever."',
                        to: "Ambassador",
                        repair: '"Something just landed wrong. Can we rewind ten seconds?"',
                      },
                    ].map(({ from, line, to, repair }, i) => (
                      <div
                        key={i}
                        className="rounded-2xl border border-border/50 bg-background/90 p-4 shadow-sm"
                      >
                        <p className="text-xs font-medium uppercase tracking-wide text-destructive">
                          {from}
                        </p>
                        <p className="mt-1 text-sm italic text-muted-foreground">
                          {line}
                        </p>
                        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-accent">
                          {to} repair
                        </p>
                        <p className="mt-1 text-sm font-medium leading-snug text-foreground">
                          {repair}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scenarios */}
        <section
          id="scenarios"
          className="scroll-mt-20 bg-gradient-to-b from-background via-muted/30 to-background px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Listening reps
              </p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Six speaking partners.{" "}
                <span className="text-accent">Six PACT reps.</span>
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                You're always the listener. Each partner brings a different
                challenge — from holding eyes-on with an island to refusing the
                bait from a button-pusher.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {scenarios.map((s) => {
                const Icon = s.icon;
                return (
                  <Card
                    key={s.name}
                    className="group border-2 border-transparent bg-card/70 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background/80 shadow-sm ring-1 ring-border/50">
                          <Icon className={`h-6 w-6 ${s.accent}`} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold leading-tight">
                            {s.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {s.age}y/o · {s.attachment}
                          </p>
                        </div>
                        <Badge className={`ml-auto shadow-sm ${s.badge.color}`}>
                          {s.badge.label}
                        </Badge>
                      </div>

                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>

                      <div className="mt-5 border-t border-border/60 pt-4">
                        <p className="text-xs font-medium uppercase tracking-wider text-accent">
                          You'll practice
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-foreground">
                          {s.teaches.map((t) => (
                            <li key={t} className="flex items-start gap-2">
                              <span
                                aria-hidden
                                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                              />
                              <span className="leading-snug">{t}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-full px-8 text-base shadow-lg shadow-accent/15"
              >
                <Link href="/train">
                  Start a PACT rep
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="ghost" className="text-muted-foreground">
                <Link href="/report">
                  See how feedback looks
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 bg-muted/30 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 text-center text-sm text-muted-foreground sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} Active Listening Dojo · PACT-aligned
            edition. Inspired by the work of Stan Tatkin and the PACT Institute.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/train" className="transition-colors hover:text-foreground">
              Practice
            </Link>
            <Link href="#styles" className="transition-colors hover:text-foreground">
              Styles
            </Link>
            <Link href="#scenarios" className="transition-colors hover:text-foreground">
              Scenarios
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
