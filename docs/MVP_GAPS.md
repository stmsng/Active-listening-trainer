# MVP Gaps — Consumer Launch Readiness

> **For future agents:** This document enumerates the work needed to take Active Listening Dojo from "demo with a clinician portal bolted on" to "consumer site behind a paywall, instrumented for an engagement/churn experiment via Google Ads." Each gap below is structured so you can pick it up cold: what's there now, why it matters for the launch goal, what to change, and what "done" looks like. Companion doc: `docs/MONETIZATION.md` (pricing, COGS, experiment design).

## Launch goal context

- **Product the consumer pays for:** browse characters → talk (text or voice) → get graded feedback → subscribe to keep practicing.
- **Acquisition:** paid Google Ads driving to `/`, `/gottman`, `/tatkin`.
- **Experiment:** small ad spend ($500) measuring funnel + early retention.
- **Out of scope for v1:** the clinician/admin portal (`/clinician`, `/admin`). Leave it intact, don't link to it from consumer pages, don't depend on it.

## Current state (snapshot)

What's already built and working:

- Next.js 15 + App Router, shadcn UI, Tailwind 4.
- BAML wired for `Talk`, `FilterPerception`, `DeriveVoice` (`baml_src/dojo.baml`) and `GradeActiveListening` (`baml_src/grade.baml`). All three Talk-loop functions run on **Claude Opus**; grade runs on **GPT-4**.
- Voice mode: Hume prosody + Hume TTS + transcription. Push-to-talk UI with waveform (`components/chat-interface.tsx`, `components/waveform.tsx`, `hooks/use-voice-session.ts`, `app/api/voice/*`).
- Auth: NextAuth credentials + Drizzle adapter, JWT sessions (`lib/auth.ts`). Middleware gates `/admin` and `/clinician` only (`middleware.ts`).
- DB schema in `lib/db/schema.ts` — Turso/libsql with local sqlite fallback. Includes `users`, `sessions` (with `messagesJson`, `gradeJson`), `characters`, `curricula`, etc.
- Pages: `/` (consumer landing, 6 hard-coded characters), `/gottman`, `/tatkin` (large niche landing variants), `/train` (single hard-coded "Satomi"), `/report` (loads from `localStorage`, auto-runs grading).
- PostHog initialized (`components/PostHogProvider.tsx`) with auto-pageviews. **No custom `capture()` calls anywhere.** Sentry + Vercel Analytics wired.
- Fly.io deploy config present (`fly.toml`).

## Gaps, by phase

### Phase 1 — Persistence & feedback loop

The `sessions` table exists in schema but nothing writes to it. The grade exists but is ephemeral (re-runs on every `/report` view, isn't saved). Without these, retention cannot be measured.

#### Gap 1.1 — Persist sessions to DB

- **What's broken:** `app/train/page.tsx:281–305` (`handleEndSession`) writes to `localStorage.lastSession`. `app/report/page.tsx:77–98` reads it back. The DB never sees the conversation.
- **Why it matters:** No persistence → no D7/D30 retention metric → the experiment produces no signal you can analyze. Also: anonymous users on a different device lose history.
- **What to do:**
  1. Add an API route `app/api/sessions/route.ts` (POST = create, GET = list for current user).
  2. Schema already has `sessions(id, userId, characterId, scenario, messagesJson, gradeJson, createdAt)`. Add columns `endedAt`, `turnCount`, `voiceTurnCount`, `model`, `costUsdMillicents` (integer; store as 1/1000 of a cent for precision) via a new Drizzle migration.
  3. In `handleEndSession`, `POST /api/sessions` with the message history. For anonymous users, defer (see Gap 2.1 quota strategy).
  4. `/report` reads via `?id=<sessionId>` query param, hitting `GET /api/sessions/[id]`.
- **Done when:** Ending a session as a logged-in user creates a row in `sessions`, and `/report?id=…` renders that row without touching `localStorage`.

#### Gap 1.2 — Persist the grade

- **What's broken:** `app/report/page.tsx:117` calls `useGradeActiveListening` on every page load. Grade is re-computed on every refresh — billed to OpenAI every time — and is never saved.
- **Why it matters:** GPT-4 grading is expensive (see `MONETIZATION.md`). Re-running on refresh is a direct cost leak and a UX flicker.
- **What to do:**
  1. Move grade generation server-side: `POST /api/sessions/[id]/grade` calls `b.GradeActiveListening(...)`, writes the result into `sessions.gradeJson`, returns it.
  2. Call this once on session end (queue from `handleEndSession`, await the grade before redirecting to `/report`), or lazily from `/report` if `gradeJson` is null.
  3. `/report` reads `gradeJson` from the DB instead of re-grading.
- **Done when:** Refreshing `/report` does not trigger another GPT-4 call.

#### Gap 1.3 — Static character/scenario catalog

- **What's broken:** `app/page.tsx:17–108` has 6 character cards hard-coded for marketing. `app/train/page.tsx:19–37` has a single hard-coded "Satomi" with no way to pick. The clinician portal has its own dynamic characters in the DB.
- **Why it matters:** Consumer flow needs character variety to demo well. Loading from the clinician DB couples products you want decoupled.
- **What to do:**
  1. Create `lib/catalog.ts` exporting `CONSUMER_CHARACTERS: ConsumerCharacter[]` where each entry is `{ slug, displayName, blurb, avatar, badge, characteristics: CharacterCharacteristics, scenario: string }`. The 6 landing-page personas (Satomi, Marcus, Elena, Alex, Dr. Priya, Kai) need full `CharacterCharacteristics` shapes — the landing page only has display fields today; you'll need to fill the BAML fields.
  2. Refactor `app/page.tsx` to map over `CONSUMER_CHARACTERS` instead of the inline array.
  3. `/train?character=<slug>` reads the catalog. Default still works (random or fixed) if no slug.
  4. Update the "Train with a partner" CTAs to deep-link by slug.
- **Done when:** Clicking any of the 6 cards on `/` lands on `/train?character=<slug>` and the conversation uses that character's traits.

---

### Phase 2 — Gate & monetize

#### Gap 2.1 — Free-tier quota / cost guard for `/train`

- **What's broken:** `/train` is wide open. No turn cap, no IP rate limit. A single user (or scraper) running voice mode can rack up real money on Claude Opus + Hume in minutes.
- **Why it matters:** Cost containment is a P0 before any ad spend. Also forms the basis of the paywall trigger.
- **What to do:**
  1. Decide the anonymous tier: e.g., 1 graded session with up to 10 turns, 0 voice turns (or 2 — voice is the most expensive). See `MONETIZATION.md` for limits.
  2. Track usage in a signed cookie + a server-side `anonymous_usage` table keyed by an `anonId` UUID. Don't trust the cookie alone.
  3. On each `Talk` invocation, increment the counter server-side. When exceeded, return 402-style "paywall" payload; client renders the paywall interstitial.
  4. Logged-in users count against `users.monthlyTurnsUsed` / `users.monthlyVoiceTurnsUsed` (new columns). Reset monthly via a Drizzle migration + a `resetAt` column.
- **Done when:** Hitting turn N+1 as an anonymous user renders the paywall instead of calling BAML. Logged-in non-paying users hit the same gate at their tier limit.

#### Gap 2.2 — Stripe Checkout + subscription state

- **What's broken:** No Stripe SDK in `package.json`, no payment routes, no subscription state on users.
- **Why it matters:** Required to monetize at all.
- **What to do:**
  1. `bun add stripe @stripe/stripe-js`.
  2. Add columns to `users`: `stripeCustomerId`, `subscriptionStatus` (`none | active | past_due | canceled`), `subscriptionCurrentPeriodEnd`, `tier` (default `free`).
  3. Routes:
     - `POST /api/billing/checkout` → creates a Stripe Checkout Session (mode=subscription, price = $5/mo), returns URL.
     - `POST /api/billing/portal` → creates a Customer Portal session for self-service.
     - `POST /api/webhooks/stripe` → verify signature, handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`. Update `users` rows.
  4. UI: paywall component with one CTA → `/api/billing/checkout` → Stripe-hosted page.
  5. `.env.local.example` additions: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID`.
- **Done when:** A user can subscribe via test-mode Stripe and `users.subscriptionStatus` becomes `active`; the `/train` gate respects it.

#### Gap 2.3 — Low-friction signup at the paywall

- **What's broken:** Existing auth is email+password (`lib/auth.ts`). High friction for a $5 consumer impulse buy.
- **Why it matters:** Every form field on the way to payment kills conversion. Industry rule of thumb: each extra field ≈ 10% drop.
- **What to do:** Add a magic-link credential provider (Resend or similar) alongside the password one. On paywall, default the form to "Enter email →" with a magic link; allow password as an "I have an account" alternative.
- **Done when:** A new user can go landing → email → paid in ≤ 60 seconds with no password.

#### Gap 2.4 — Cost-cut: model selection & prompt caching

- **What's broken:** All three Talk-loop functions use Claude Opus (`baml_src/dojo.baml`). Grading uses GPT-4 (not gpt-4o-mini). The full character description + scenario goes in every Talk call uncached.
- **Why it matters:** At $5/mo and ~50% margin, the current cost structure cannot support weekly usage. See `MONETIZATION.md` for the math.
- **What to do:**
  1. Switch `FilterPerception` and `DeriveVoice` to Haiku in `baml_src/dojo.baml`. They're narrow tasks; quality risk is low.
  2. Try Sonnet for `Talk` behind a flag; A/B against Opus. Default to Sonnet if perceived quality holds.
  3. Switch `GradeActiveListening` to `gpt-4o-mini` (or Sonnet/Haiku via a new BAML client).
  4. Enable Anthropic prompt caching on the stable parts of `Talk` (character characteristics, scenario, system instructions). Conversation history is the only thing that should be uncached.
  5. Verify pricing against current Anthropic and OpenAI pricing pages before locking in — model prices change.
- **Done when:** Average COGS per 15-turn voice session is under $0.50 (target; revise after measurement).

---

### Phase 3 — Marketing surface

#### Gap 3.1 — PostHog funnel events

- **What's broken:** PostHog auto-captures pageviews (`components/PostHogProvider.tsx`) but no custom events. There is no funnel definable in PostHog.
- **Why it matters:** The whole point of the $500 experiment is funnel + cohort retention. Without named events you'll have nothing to analyze.
- **What to do:** Instrument these events with consistent property names:
  - `landing_view` (with `variant: 'home' | 'gottman' | 'tatkin'`, UTM params)
  - `cta_click` (with `cta: 'hero' | 'partners' | 'demo'`, `variant`)
  - `demo_start` (with `characterSlug`)
  - `demo_message_sent` (with `mode: 'text' | 'voice'`, `turnIndex`)
  - `demo_quota_hit`
  - `paywall_view`
  - `checkout_started`
  - `checkout_completed` (server-side, from Stripe webhook → posthog-node)
  - `paid_session_start`, `paid_session_complete`
  - `grade_viewed`
  - `return_visit` (fired once per day from a client effect when an identified user lands)
  Call `posthog.identify(userId)` on login and at Stripe webhook time. Use `posthog-node` for server events (already in `package.json`).
- **Done when:** PostHog has a working funnel from `landing_view` → `checkout_completed`, and a Day-7 retention cohort is computable from `return_visit`.

#### Gap 3.2 — Legal pages + recording consent

- **What's broken:** No `/privacy`, `/terms`, or refund policy page. Voice mode records audio with no explicit consent step.
- **Why it matters:** Google Ads will reject or pause ads pointing at a paid product with no privacy policy. Recording voice without consent is a real regulatory issue depending on user jurisdiction.
- **What to do:**
  1. `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/refunds/page.tsx`. Link from footer.
  2. First-time voice consent modal: "We process your voice through Hume AI for emotion analysis and transcription. Voice recordings are stored against your account. [Continue / Cancel]." Persist the consent timestamp on the user.
- **Done when:** Privacy link is in the footer of every page, and the first voice-recording attempt in a session prompts the consent modal once per user.

#### Gap 3.3 — Email capture + lifecycle email

- **What's broken:** No email service integration. No transactional or lifecycle email.
- **Why it matters:** At small ad scale, win-back email is the highest-leverage retention lever. Also: no receipts for paying customers.
- **What to do:**
  1. Pick a provider. Recommendation: Resend for transactional + Loops for lifecycle, or just Loops for both. Add API key to `.env.local.example`.
  2. Transactional: receipt on subscribe (or rely on Stripe), monthly summary, password reset.
  3. Lifecycle: D1 ("how was your first session?"), D3 ("try a harder character"), D7 ("your free trial is wrapping up"), D14 ("we miss you" with grade trend).
- **Done when:** A test user gets D1 and D7 emails after their first session, and PostHog logs `email_open` / `email_click` events linked to the user.

#### Gap 3.4 — Google Ads conversion API

- **What's broken:** No Google Ads conversion tracking. Without it, the algorithm has no signal to optimize against, and $500 buys you very little.
- **Why it matters:** Server-side conversion uploads (enhanced conversions / offline conversion import) let Google Ads bid toward paying customers, not clicks. Critical at low budgets.
- **What to do:**
  1. Set up Google Ads conversion actions for `signup`, `subscribe` (primary), `paid_session_complete` (secondary).
  2. From the Stripe webhook (`checkout.session.completed`), upload a server-side conversion with the gclid you stored at signup time. Store `gclid` on the user at first landing-page hit.
- **Done when:** Test conversion appears in Google Ads within 24h of a test subscription.

#### Gap 3.5 — Landing-page refactor (deferred until 3.1–3.4 done)

- **What's broken:** `/gottman` (613 LOC) and `/tatkin` (528 LOC) duplicate big chunks of `/`. Adding a third variant means another 500-line file.
- **Why it matters:** Slower iteration on ad copy. A/B testing landing variants becomes painful.
- **What to do:** Extract shared sections (`<HeroSection>`, `<HowItWorks>`, `<CharacterGrid>`, `<Footer>`) into `components/landing/`. Each variant page is then ~50 LOC of copy + section composition.
- **Done when:** Adding a new landing variant means writing one ~50-LOC file with copy overrides.

---

### Phase 4 — Operational hygiene

#### Gap 4.1 — Daily LLM spend alert

- **What's broken:** No alerting on AI spend. A bug in the turn-cap logic can run up real money silently.
- **What to do:** Daily cron (Fly machine or Vercel cron) that queries `sessions.costUsdMillicents` for the trailing 24h. If > threshold, ping a webhook (Slack/Discord) or email.
- **Done when:** Test alert fires when a manual SQL insert puts spend over the threshold.

#### Gap 4.2 — Production database

- **What's broken:** Default falls back to `file:local.db`. On Fly with multiple machines this would corrupt or split data.
- **What to do:** Create a Turso DB, set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` in Fly secrets, run migrations against it.
- **Done when:** Production runs against Turso, not local sqlite.

#### Gap 4.3 — Drop unused BAML clients & dependencies

- **What's broken:** `baml_src/dojo.baml` defines `GPT4` and `FireworksKimi` clients that are not referenced. `package.json` has stray deps (`@remix-run/react`, `@sveltejs/kit`, `svelte`, `vue`, `vue-router`) probably left over from v0 scaffolding.
- **What to do:** Delete unreferenced clients. `bun remove` the stray frameworks after verifying nothing imports them.
- **Done when:** `bun run build` succeeds with the leaner deps.

---

## Suggested ordering

```
Phase 1 (foundation)        → 1.1 → 1.2 → 1.3
Phase 2 (monetize)          → 2.1 → 2.4 (cost cuts first) → 2.2 → 2.3
Phase 3 (market)            → 3.1 → 3.2 → 3.4 → 3.3 → 3.5
Phase 4 (ops)               → 4.2 → 4.1 → 4.3 (any time)
```

Cost cuts (2.4) are listed mid-Phase-2 because doing them before opening the paywall avoids re-pricing later.

## Caveats for the agent picking up a task

- **Verify pricing before quoting numbers.** Model prices in `MONETIZATION.md` are estimates as of this doc's writing; check current pages before committing pricing logic.
- **Test against Stripe test mode end-to-end** before turning on a real product price ID.
- **The user prefers `bun` over `npm`.** Don't run `npm run dev` — dev server is always already running on `:3000`; curl it to test.
- **Don't touch the clinician portal** unless the task explicitly says to. It's a different product.
