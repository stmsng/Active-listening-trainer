import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserNav } from "@/components/user-nav";
import {
  Home,
  Map,
  Heart,
  HandHeart,
  Sparkles,
  ArrowRight,
  Bird,
  ShieldOff,
  Wrench,
  MessageCircle,
  Compass,
  Flame,
} from "lucide-react";

const scenarios = [
  {
    slug: "rachel",
    name: "Rachel",
    age: 37,
    role: "Harsh start-up",
    icon: Flame,
    accent: "text-destructive",
    badge: { label: "Criticism", color: "bg-destructive" },
    description:
      "Opens with character attacks — \"you always,\" \"you never.\" The lesson isn't defending yourself; it's finding the longing under the complaint and replying to that.",
    teaches: [
      "Don't defend, listen",
      "Find the soft underneath",
      "Reply to the longing, not the dig",
    ],
  },
  {
    slug: "ben",
    name: "Ben",
    age: 42,
    role: "Stonewaller",
    icon: ShieldOff,
    accent: "text-chart-3",
    badge: { label: "Flooded", color: "bg-chart-3" },
    description:
      "Diffuse Physiological Arousal — heart over 100 bpm, gone behind glass. Practice giving the 20-minute break without pursuing, and the return without scoreboard.",
    teaches: [
      "Notice flooding cues",
      "Offer a real break",
      "Welcome the return",
    ],
  },
  {
    slug: "priya",
    name: "Priya",
    age: 31,
    role: "Bid-sender",
    icon: HandHeart,
    accent: "text-chart-4",
    badge: { label: "Bids", color: "bg-chart-4" },
    description:
      "Quiet, low-key bids for connection — a comment about a bird, a sigh, a half-question. Easy to miss. Practice turning toward bids you might otherwise scroll past.",
    teaches: [
      "Hear the small bids",
      "Turn toward, not away",
      "Build emotional capital",
    ],
  },
  {
    slug: "dr-fields",
    name: "Dr. Fields",
    age: 55,
    role: "Soft start-up speaker",
    icon: Sparkles,
    accent: "text-accent",
    badge: { label: "Therapist", color: "bg-accent" },
    description:
      "A Gottman-trained therapist opening a hard conversation with you — soft start-up, gentle complaint, named need. Your rep is hearing the longing under language that's already careful, instead of getting lulled by the polish.",
    teaches: [
      "Listen past the I-statement",
      "Don't be soothed by careful words",
      "Reflect the need, not the form",
    ],
  },
  {
    slug: "jordan",
    name: "Jordan",
    age: 39,
    role: "Dreams within",
    icon: Compass,
    accent: "text-chart-5",
    badge: { label: "Dream", color: "bg-chart-5" },
    description:
      "Same fight, same kitchen, same Sunday. There's a dream under the gridlock — something about how they want to live. Practice finding it instead of negotiating around it.",
    teaches: [
      "Open-ended dream questions",
      "Look past the position",
      "Honor before solving",
    ],
  },
  {
    slug: "avery",
    name: "Avery",
    age: 28,
    role: "Repair-maker",
    icon: Wrench,
    accent: "text-accent",
    badge: { label: "Repair", color: "bg-chart-2" },
    description:
      "Mid-argument, slips in a small joke, a touch, a softer word. The skill is catching the repair attempt mid-air — and choosing to let it land instead of staying on the offense.",
    teaches: [
      "Spot the repair attempt",
      "Accept rather than rebut",
      "Reset the temperature",
    ],
  },
];

const horsemen = [
  {
    icon: Flame,
    title: "Criticism",
    line: "Attacks character, not behavior.",
    antidote: "Gentle start-up · I-statement + positive need",
    practice: [
      { slug: "rachel", name: "Rachel", why: "the criticism itself" },
      { slug: "dr-fields", name: "Dr. Fields", why: "the soft-startup antidote" },
    ],
  },
  {
    icon: Bird,
    title: "Contempt",
    line: "Mockery, sarcasm, eye-rolls. The #1 predictor of divorce.",
    antidote: "Build culture of fondness and admiration",
    practice: [
      { slug: "rachel", name: "Rachel", why: "contempt under the criticism" },
      { slug: "priya", name: "Priya", why: "build the fondness bank" },
    ],
  },
  {
    icon: Bird,
    title: "Defensiveness",
    line: "Counter-attack or innocent-victim stance.",
    antidote: "Take responsibility for even a slice",
    practice: [
      { slug: "avery", name: "Avery", why: "accept the repair, take the slice" },
      { slug: "dr-fields", name: "Dr. Fields", why: "reflect the need, not the form" },
    ],
  },
  {
    icon: ShieldOff,
    title: "Stonewalling",
    line: "Behind glass. Flooded. Gone.",
    antidote: "Physiological self-soothing · take a real break",
    practice: [
      { slug: "ben", name: "Ben", why: "the flooded partner" },
    ],
  },
];

const pillars = [
  {
    icon: Map,
    title: "Love maps",
    body: "Train the habit of asking open-ended questions and remembering the answers — the foundation of the Sound Relationship House.",
  },
  {
    icon: HandHeart,
    title: "Bids for connection",
    body: "Practice spotting and turning toward the small bids — the moments John Gottman calls the building blocks of trust.",
  },
  {
    icon: MessageCircle,
    title: "Stress-reducing conversation",
    body: "Reps for the daily 20-minute check-in: be a witness, not a problem-solver. Listen for feelings under the facts.",
  },
  {
    icon: Wrench,
    title: "Repair attempts",
    body: "Notice the joke, the touch, the softer word in the middle of a hard moment — and let it work.",
  },
];

export default function GottmanPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/75 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/gottman"
            className="flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            <Home className="h-4 w-4 text-accent" />
            <span>Sound Listening Dojo</span>
            <Badge
              variant="secondary"
              className="ml-1 hidden rounded-full border border-border/60 bg-background/80 px-2 py-0 text-[10px] font-medium sm:inline-flex"
            >
              Gottman Edition
            </Badge>
          </Link>
          <nav className="flex items-center gap-1 text-sm text-muted-foreground sm:gap-4">
            <Link
              href="#horsemen"
              className="hidden rounded-md px-2 py-1.5 transition-colors hover:text-foreground sm:inline"
            >
              Four Horsemen
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
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.828_0.189_84.429/0.2),transparent)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-chart-4/20 blur-3xl animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 bottom-0 -z-10 h-80 w-80 rounded-full bg-chart-5/20 blur-3xl animate-[pulse_12s_ease-in-out_infinite_1s]"
          />

          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                Grounded in 40+ years of Gottman research
              </Badge>
            </div>

            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl md:text-7xl md:leading-[1.05]">
              Turn toward.
              <span className="mt-1 block bg-gradient-to-r from-accent via-chart-4 to-chart-5 bg-clip-text text-transparent sm:mt-2">
                One bid at a time.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl md:leading-relaxed">
              A Gottman-aligned active listening dojo. Practice love maps,
              fondness, bids, repair attempts, and the soft start-up — and learn
              to spot the Four Horsemen before they take the room.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button
                asChild
                size="lg"
                className="h-12 min-w-[200px] rounded-full px-8 text-base shadow-lg shadow-accent/20"
              >
                <Link href="/train">
                  Open the conversation
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
                  <Heart className="mr-2 h-5 w-5 opacity-80" />
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

        {/* Sound Relationship House */}
        <section className="border-t border-border/40 bg-muted/40 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <p className="text-sm font-medium uppercase tracking-wider text-accent">
                  The Sound Relationship House
                </p>
                <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                  Seven floors,{" "}
                  <span className="text-accent">two load-bearing walls</span>
                </h2>
                <p className="text-pretty text-lg leading-relaxed text-muted-foreground">
                  The Gottmans' model holds up a relationship on seven levels —
                  love maps at the base, shared meaning at the top — supported
                  on either side by{" "}
                  <span className="font-medium text-foreground">trust</span> and{" "}
                  <span className="font-medium text-foreground">commitment</span>.
                  The dojo gives you focused reps on the floors that show up
                  most in active listening: love maps, fondness, turning toward,
                  and managing conflict.
                </p>

                <div className="grid gap-2">
                  {[
                    {
                      floor: "Create shared meaning",
                      practice: { slug: "jordan", name: "Jordan" },
                    },
                    {
                      floor: "Make life dreams come true",
                      practice: { slug: "jordan", name: "Jordan" },
                    },
                    {
                      floor: "Manage conflict",
                      practice: { slug: "rachel", name: "Rachel" },
                    },
                    {
                      floor: "The positive perspective",
                      practice: { slug: "avery", name: "Avery" },
                    },
                    {
                      floor: "Turn toward instead of away",
                      practice: { slug: "priya", name: "Priya" },
                    },
                    {
                      floor: "Share fondness & admiration",
                      practice: { slug: "priya", name: "Priya" },
                    },
                    {
                      floor: "Build love maps",
                      practice: { slug: "dr-fields", name: "Dr. Fields" },
                    },
                  ].map(({ floor, practice }, i, arr) => (
                    <Link
                      key={floor}
                      href={`#scenario-${practice.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border/50 bg-background/80 px-4 py-2 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-background hover:shadow-md"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          Floor {arr.length - i}
                        </span>
                        <span className="font-medium">{floor}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs text-accent opacity-80 transition-opacity group-hover:opacity-100">
                        Practice with {practice.name}
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="relative lg:pl-4">
                <div className="overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-accent/15 via-chart-4/10 to-chart-5/15 p-8 shadow-xl ring-1 ring-border/30">
                  <p className="text-sm font-medium uppercase tracking-wider text-accent">
                    Magic ratio
                  </p>
                  <p className="mt-2 text-balance text-2xl font-bold leading-tight">
                    During conflict, stable couples maintain roughly
                    <span className="ml-2 text-accent">5 : 1</span> positive to
                    negative interactions.
                  </p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    The dojo helps you build that bank — by training the small,
                    cheap moves: the nod, the joke, the repair, the soft
                    question. The interactions that don't feel like much, until
                    you don't have them.
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-border/50 bg-background/90 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-accent">
                        Soft start-up
                      </p>
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        "When the dishes piled up last night, I felt
                        invisible. I'd love it if we figured out a Sunday
                        reset together."
                      </p>
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-background/90 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-destructive">
                        Harsh start-up
                      </p>
                      <p className="mt-2 text-sm italic text-muted-foreground">
                        "You never lift a finger around here. It's
                        disgusting."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Four Horsemen */}
        <section
          id="horsemen"
          className="scroll-mt-20 border-t border-border/40 px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Spot them before they take the room
              </p>
              <h2 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                The Four Horsemen —{" "}
                <span className="text-accent">and their antidotes</span>
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                The Gottmans named the four communication patterns that
                reliably predict disconnection. The dojo gives you reps on
                hearing them in the moment — and on the listener moves that
                pull a conversation back.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {horsemen.map(({ icon: Icon, title, line, antidote, practice }) => (
                <Card
                  key={title}
                  className="flex flex-col border-2 border-transparent bg-card/70 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl"
                >
                  <CardContent className="flex flex-1 flex-col p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/10">
                      <Icon className="h-5 w-5 text-destructive" />
                    </div>
                    <h3 className="mt-3 font-semibold leading-snug">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {line}
                    </p>
                    <div className="mt-4 border-t border-border/60 pt-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-accent">
                        Antidote
                      </p>
                      <p className="mt-1 text-sm leading-snug">{antidote}</p>
                    </div>
                    <div className="mt-4 flex flex-1 flex-col justify-end border-t border-border/60 pt-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Practice with
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {practice.map(({ slug, name, why }) => (
                          <li key={slug}>
                            <Link
                              href={`#scenario-${slug}`}
                              className="group/link flex items-start gap-1.5 text-sm text-foreground transition-colors hover:text-accent"
                            >
                              <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                              <span className="leading-snug">
                                <span className="font-medium">{name}</span>
                                <span className="text-muted-foreground">
                                  {" — "}
                                  {why}
                                </span>
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
                <span className="text-accent">Six Gottman reps.</span>
              </h2>
              <p className="mt-4 text-pretty text-lg text-muted-foreground">
                You're always the listener. Each partner trains a different
                Sound Relationship House move — from catching small bids to
                spotting a repair mid-fight.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {scenarios.map((s) => {
                const Icon = s.icon;
                return (
                  <Card
                    key={s.slug}
                    id={`scenario-${s.slug}`}
                    className="group scroll-mt-24 border-2 border-transparent bg-card/70 shadow-md backdrop-blur-sm transition-all duration-300 target:border-accent/60 target:shadow-xl hover:-translate-y-1 hover:border-accent/35 hover:shadow-xl"
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
                            {s.age}y/o · {s.role}
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
                  Start a Gottman rep
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
            © {new Date().getFullYear()} Active Listening Dojo · Gottman-aligned
            edition. Inspired by the work of Drs. John & Julie Gottman and the
            Gottman Institute.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/train" className="transition-colors hover:text-foreground">
              Practice
            </Link>
            <Link href="#horsemen" className="transition-colors hover:text-foreground">
              Four Horsemen
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
