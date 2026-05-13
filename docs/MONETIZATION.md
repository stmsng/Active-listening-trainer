# Monetization Plan — Active Listening Dojo

> **For future agents:** This document is the source of truth for pricing, unit economics, cost-cut strategy, and the planned Google Ads engagement experiment. Companion doc: `docs/MVP_GAPS.md` (the work needed to get there). Numbers are estimates — verify current model pricing before encoding anything in code.

## Strategic goals

1. **Teach active listening at scale.** Real skill transfer, not toy demos. Implies the product must give genuine, specific feedback (grading) and must feel hard enough that practice matters.
2. **Maximize customer Lifetime Value (LTV).** LTV = average monthly revenue × average customer lifetime in months × gross margin. The only knobs are: price, retention, COGS. Everything in this doc is about pulling one of those three.

## Pricing decision

- **$5 / month**, single tier, hard usage cap (no overage billing).
- Target gross margin **≥ 50%**, i.e., ≤ $2.50 / user / month in COGS.
- Free anonymous tier: enough to feel the value moment (one full conversation + one grade), then a clean paywall.

**Why a hard cap, not metered overages:** overage charges create churn and refund disputes. A meter that shows "12/20 voice turns used this month" doubles as a re-engagement signal ("you have turns left, come back").

### Suggested caps (subject to revision after measurement)

| Tier | Voice turns / mo | Text turns / mo | Graded sessions / mo |
|---|---|---|---|
| Anonymous | 0–2 | ~10 | 1 |
| Paid ($5/mo) | 20 | 100 | unlimited |

Calibrate by measuring real COGS per session after Phase 2.4 cost cuts in `MVP_GAPS.md`.

## Unit economics math

### Revenue side

- Gross: $5.00 per active subscription per month.
- Stripe fees: 2.9% + $0.30 → **$0.45** on a $5 charge.
- **Net revenue: ~$4.55 / user / month.**

### COGS budget

At 50% gross margin target: **$2.27 / user / month** for all AI + voice spend combined.

### Current COGS reality (before cost cuts)

The Talk loop runs three Claude Opus calls per user turn:

1. `FilterPerception(prosody, character, state)` — small input, small output.
2. `Talk(character, scenario, full history)` — input grows linearly with conversation; structured JSON output.
3. `DeriveVoice(message, character, state)` — small input, tiny output.

Plus, in voice mode:

- Hume prosody scoring on the user's audio.
- Transcription (provider TBD — see `app/api/voice/transcribe/route.ts`).
- Hume TTS for the AI response.

Plus, at session end: `GradeActiveListening` on **GPT-4** (not gpt-4o-mini — costly).

**Rough per-turn cost estimates** (verify against current pricing):

- Opus call with ~3–5K tokens of context + 200 tokens of structured output: $0.05–$0.15.
- Three Opus calls per voice turn → **$0.15–$0.45 / turn just in LLM**.
- Hume prosody + TTS + transcription: estimate $0.05–$0.20 / voice turn.

**A 15-turn voice session ≈ $3–$8 in COGS today.** Two sessions/month and the $2.27 budget is gone. The current stack cannot support weekly usage.

### COGS after planned cuts (target)

| Function | Current | Planned | Rationale |
|---|---|---|---|
| `Talk` | Claude Opus | Claude Sonnet (A/B vs Opus) | 5× cheaper; quality difference may be invisible behind a character persona |
| `FilterPerception` | Claude Opus | Claude Haiku | Narrow scoring task, no character voice |
| `DeriveVoice` | Claude Opus | Claude Haiku | Generates ≤ 100-char acting direction + a number |
| `GradeActiveListening` | GPT-4 | gpt-4o-mini or Claude Sonnet | GPT-4 pricing is much higher than newer mini models |
| `Talk` prompt | Full prompt each call | Anthropic prompt caching on character + scenario + system | History stays uncached; the rest is stable |

Combined, these should drop COGS by **5–10×**. Target: **< $0.50 COGS per 15-turn voice session**.

After cuts, the cap math works:

- $2.27/mo COGS budget × 5× headroom from cuts ≈ ~$11/mo of pre-cut budget.
- That covers ~3–4 voice sessions/mo + plenty of text turns + monthly grading.
- Matches the suggested caps above with margin to spare.

## Retention is the real LTV lever

CAC sustainability requires `CAC < ⅓ × net LTV`. With $5/mo and 50% margin:

| Avg retention | Net LTV | Max sustainable CAC |
|---|---|---|
| 3 months | $7.50 | $2.50 |
| 6 months | $15 | $5 |
| 12 months | $30 | $10 |
| 24 months | $60 | $20 |

Google Ads CAC for a niche consumer subscription is typically $5–$20 once optimized. **The product needs ≥ 6 month average retention to make Google Ads viable as a sustained channel.** The whole engagement/feedback loop (grading, lifecycle email, character variety) exists to push this number up.

## The $500 Google Ads experiment

### Sizing

- Estimated Google Ads CPC on relevant keywords ("active listening practice", "communication coach", relationship niche): **$1–$3**, call it $2 blended.
- $500 ÷ $2 ≈ **250 clicks**.
- Landing → email/signup at 10% (target) = **25 signups**.
- Signup → paid at 10–20% = **3–5 paying customers**.

This is **not a statistically meaningful retention dataset.** It is enough to learn directional signal on the funnel and an early gut check on whether anyone comes back.

### Success criteria (set these *before* spending)

| Metric | Target | Signal if missed |
|---|---|---|
| Click-through rate on ads | ≥ 2% | Ad copy / targeting wrong |
| Landing → demo_start | ≥ 40% | Hero / CTA weak |
| demo_start → demo quota hit | ≥ 30% | Product not engaging enough to finish a session |
| Paywall view → checkout completed | ≥ 10% | Price too high, or paywall framing weak |
| Paid D7 return rate | ≥ 40% | Retention problem — grading not landing, or content too thin |
| Paid D30 return rate | ≥ 25% | Long-term retention problem |

If conversion misses but D7 hits, the funnel is broken — fix landing/paywall. If conversion hits but D7 misses, the product is the problem — invest in feedback quality and character variety. Both missing → reconsider price or positioning.

### Required instrumentation (see `docs/MVP_GAPS.md` Gap 3.1)

- PostHog funnel: `landing_view → cta_click → demo_start → demo_message_sent → demo_quota_hit → paywall_view → checkout_started → checkout_completed → paid_session_start → paid_session_complete → grade_viewed → return_visit`.
- Google Ads server-side conversion upload on `checkout_completed` (see Gap 3.4).
- UTM params captured on first landing and persisted on the user record (so cohort analysis by ad set is possible).

### What we're explicitly *not* trying to do with $500

- Prove profitability. The experiment will probably lose money in absolute terms — that's expected.
- Test multiple price points. Sample size is too small to power more than one variant of anything.
- Optimize ad creative. One ad set, one landing variant per niche, one price.

## Pricing experiments to run *after* the $500 baseline

Once a baseline is established and `≥ 100` paying customers have flowed through, single-variable tests in priority order:

1. **Price: $5 vs $7.** $7 raises COGS budget materially (to ~$3 net) and may not hurt conversion much for a niche product.
2. **Annual option: $5/mo or $48/yr.** Annual locks in retention; the discount is the price of certainty.
3. **Voice add-on: $5 text-only / $9 with voice.** If voice is the cost driver and the feature people pay for, pricing it separately may grow both ARPU and margin.

Each test needs PostHog feature flags + experiment definitions and 4–6 weeks of paid traffic to call.

## Numbers that should change this doc

Update this doc when any of the following move significantly:

- Model pricing (Anthropic Sonnet / Haiku, OpenAI gpt-4o-mini, Hume TTS, transcription).
- Measured average COGS per session (track in `sessions.costUsdMillicents`).
- Measured CAC, conversion rate, D7/D30 retention.
- Stripe fees or jurisdiction (international users → higher fees).
