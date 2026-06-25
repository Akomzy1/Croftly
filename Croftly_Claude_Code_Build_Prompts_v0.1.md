# Croftly — Claude Code Build Prompt Pack (Prototype, v0.1)

**Use:** Run in Claude Code, in order. Prompt 1 scaffolds the project and writes CLAUDE.md (the always-loaded guardrail). Each later prompt builds one slice and assumes the prior ones exist.
**Companion to:** PRD v0.3, Mission/Impact v0.1, Pricing v0.1, Logistics v0.4, Matching explainer, Claude Design pack.
**Scope = PROTOTYPE.** Built real: data model, two-sided flow, the matching engine, money-split, intent capture, **installable PWA**. **Mocked:** live courier APIs (simulated match), full Stripe Connect payouts (test checkout + simulated split display), notifications (in-app only). Single region, point-to-point, no batching.
**Notifications:** prototype = in-app only; production = **email (Resend) + SMS (Twilio)**. **WhatsApp is NOT in the stack** — optional later-phase channel only, gated on discovery (never the ordering interface).
**Baked-in leans (from open decisions):** collection-first + courier-match; 15% / 10% forward / 8% glut commission; free-to-list farmers; membership deferred. Discovery confirms/adjusts.

---

## PROMPT 1 — Scaffold + CLAUDE.md

```
Set up a new prototype web app called Croftly. Stack: Next.js (App Router, TypeScript), Tailwind CSS, shadcn/ui, Supabase (Postgres + Auth), Stripe (test mode), and the Anthropic SDK (@anthropic-ai/sdk). Set up env vars for Supabase, Stripe test keys, and ANTHROPIC_API_KEY. Use a clean, mobile-first project structure.

Then create a CLAUDE.md at the project root with this content:

# Croftly — Project Context

## What this is
An asset-light UK marketplace connecting local farmers directly to households. Households state their food intent; an AI matching engine composes boxes from real farm supply; farmers sell direct and keep ~85%. The platform never owns stock and never runs warehouses or its own delivery fleet.

## Constitutional rules (never violate)
1. The platform NEVER takes title to food and NEVER runs a warehouse. Pass-through only.
2. Orchestrate logistics; never own/employ a fleet. Integrate courier capacity, don't build it.
3. Allergen exclusions are HARD constraints enforced deterministically OUTSIDE the LLM path — an allergen must never be reasoned about by a language model.
4. Deterministic by default. The LLM is used ONLY for fuzzy-intent parsing and human-readable explanations — never for the box-composition maths or courier selection.
5. Never premium. The product competes on freshness, fairness, transparency and less waste — not luxury. UI and copy must never read elite/glossy.
6. Diversification, not dependency. Never let one farm or one channel dominate.

## Stack
Next.js (App Router, TS) · Tailwind + shadcn/ui · Supabase (Postgres, RLS, Auth) · Stripe Connect (test) · Anthropic SDK (Haiku=ops, Sonnet=intent+composition explain, Opus=forward forecasting later) · Vercel · PostHog (optional).

## Prototype scope
Real: data model, two-sided flow, matching engine, money-split, intent capture, forward + glut modes.
Mocked: live courier APIs (simulated), full Connect payouts (test checkout + simulated split), notifications (in-app only). Production notifications = email (Resend) + SMS (Twilio). WhatsApp is NOT in the stack — optional later-phase channel only, gated on discovery; never the ordering interface.
Single region, point-to-point, no batching.

## Commission
15% standard · 10% forward-committed · 8% glut/surplus (farmer keeps the rest).

## Conventions
TypeScript strict; server components by default; Supabase RLS on every table; keep AI calls isolated in a /lib/ai module; deterministic logic in /lib/matching with NO LLM calls.

Confirm the scaffold runs, then summarise the structure.
```

---

## PROMPT 2 — Data model (Supabase schema)

```
Create the Supabase schema and migrations for Croftly. Tables:

- areas (id, name, region) — serving clusters.
- collection_points (id, area_id, name, address).
- producers (id, name, area_id, story, bio).
- products (id, producer_id, name, category, cold_chain_class [ambient|chilled|highly_perishable], price_pence, unit, variable_weight_min, variable_weight_max, available_from, available_to, is_glut boolean, glut_clearing_price_pence nullable, quantity_available).
- households (id, user_id, area_id, name).
- intent_profiles (id, household_id, budget_pence, cadence [weekly|fortnightly], household_size, likes jsonb, dislikes jsonb, hard_allergens jsonb, adventurousness [exact|balanced|surprise], substitution_rule [never|within_category|anything_within_budget], fulfilment_pref [collection|courier]).
- orders (id, household_id, status, fulfilment_type, collection_point_id nullable, delivery_fee_pence, created_at).
- order_items (id, order_id, product_id, producer_id, qty, line_price_pence, commission_rate, commission_pence, farmer_pence, is_glut, is_forward).
- payouts (id, order_id, producer_id, farmer_pence, platform_pence, courier_pence).
- forward_demand (id, product_category, area_id, target_window, household_count, implied_qty) — for the forward market.

Enable RLS on all tables (households see their own; producers see their own; public read for areas/collection_points/active products). Generate TypeScript types. Keep money in integer pence everywhere.
```

---

## PROMPT 3 — Auth + two-sided shell

```
Build Supabase email auth and a two-sided app shell. On sign-up, capture role (household or farmer) and area. Route households to /shop and farmers to /farm. Build a "Get started" page with the dual fork: two equal cards — "I want to shop" and "I'm a farmer who wants to sell." Add a clean mobile-first nav and layout that differs by role. Apply the Croftly look (warm greens, cream backgrounds, rounded, friendly — never premium/glossy) using shadcn/ui + Tailwind.
```

---

## PROMPT 4 — Farmer console (supply broadcast)

```
Build the farmer console at /farm. A producer can:
- Add/edit products: name, category, cold-chain class, price, unit, variable-weight range, quantity, availability window, and which area/cluster.
- Mark a product as a GLUT with a clearing price (lower than normal) — this is surplus they want to move.
- See their listings and a simple dashboard (active listings, incoming orders placeholder).
This is the "supply broadcast" layer — lightweight, no AI. Keep it fast and practical, farmer-friendly copy (speak to fair pay and cutting waste, not tech).
```

---

## PROMPT 5 — Household intent capture (Buyer-Intent Agent)

```
Build household intent capture at /shop/setup. A conversational, friendly flow that collects: budget, cadence, household size, likes, dislikes, HARD allergens, adventurousness (exact / balanced / surprise me), substitution rule, and fulfilment preference. Save as an intent_profile.

Use the Anthropic SDK (Sonnet) ONLY to parse free-text input (e.g. "£30 a week, family of four, kids hate aubergine, nut allergy, surprise me") into the structured fields. Put this in /lib/ai/parseIntent.ts.

CRITICAL: hard allergens are captured and stored as a separate explicit field and are NEVER left to the LLM to infer or honour at match time — they are a deterministic hard exclusion later. The LLM only helps fill the form; the user confirms every field before saving.
```

---

## PROMPT 6 — The matching engine (the signature — build for real)

```
Build the matching engine in /lib/matching (NO LLM calls in this module — deterministic only). Given an intent_profile and the available products in the household's area for the current window, compose a box:

1. FILTER (deterministic): keep only products that are available this window, in the household's area, in the right cold-chain class for their fulfilment preference, and NOT containing any hard allergen, and not in their dislikes. The allergen filter is absolute.
2. SCORE (deterministic): rank survivors by preference match (likes up, kid-friendly up if relevant), variety (penalise repeats), freshness, and a PRIORITY BOOST for glut products (to clear waste).
3. COMPOSE (deterministic): pick the combination that maximises score while staying within budget, hitting a variety target, and only using available quantity. Greedy or simple constraint solver is fine for the prototype.

Output a composed box (line items, qty, prices) + which items are glut/forward.

Separately, in /lib/ai/explainBox.ts, use the Anthropic SDK (Sonnet) to write a short, friendly human-readable explanation of the box ("we included X… added the courgette glut to help a local farm cut waste, at a lower price…"). The explanation is cosmetic — it must never change the composition.

Wire this so /shop shows a composed box for the logged-in household.
```

---

## PROMPT 7 — Box review + money-split transparency

```
Build the box review page at /shop/box. Show the composed box, the AI explanation, and per-item prices. Apply commission tiers: 15% standard, 10% on forward items, 8% on glut items — compute farmer_pence and commission_pence per line.

Build the signature MONEY-SPLIT component: a clear, friendly breakdown showing the total, how much goes to the farmer(s) (~85%+), and how much runs the platform. Make it prominent and proud — this is the brand signature; reuse the exact same component design wherever the split appears.

Add: a substitution/veto preview (user can swap or remove items before checkout), and enforce the spend cap (box never exceeds budget). Silence is not consent for unusual items above a threshold — surface those for explicit approval.
```

---

## PROMPT 8 — Fulfilment (collection + mocked courier-match)

```
Build fulfilment selection. Two options:
- COLLECTION (free): pick a collection_point in the household's area. £0 delivery.
- COURIER DELIVERY: a MOCKED courier-match. In /lib/fulfilment/matchCourier.ts, simulate: filter "viable couriers" by the box's cold-chain class (the most perishable item sets the class), then return the cheapest viable mock courier with a name, fee, and ETA. Show this honestly as the paid doorstep upgrade (it's pricier than collection).

The platform owns the promise: show an order status/tracking stub regardless of who "delivers". Add a clear note in code comments that production replaces this mock with a real aggregator (EasyPost/Sendcloud) for ambient + an on-demand API (Uber Direct/Stuart) for chilled.
```

---

## PROMPT 9 — Checkout + payout split (Stripe test, simulated Connect)

```
Build checkout with Stripe in TEST mode. On payment success, create the order, order_items (with commission/farmer split per line), and payouts rows. SIMULATE the Stripe Connect multi-party payout — record and DISPLAY the split (farmer_pence, platform_pence, courier_pence) but don't wire real multi-party transfers (prototype). Show the household a confirmation with the money-split, and show the farmer the new order + their payout in /farm. Add code comments marking where production wires real Connect transfers.
```

---

## PROMPT 10 — Forward-demand + glut-clearing modes

```
Add the two extra matching modes.

FORWARD: build /farm/forward — aggregate intent_profiles across an area for a future window into forward_demand rows ("38 households want leafy greens in ~6 weeks") and show farmers a simple "plant against this" signal. Items committed forward carry the 10% commission tier.

GLUT: when a farmer marks a product as a glut, run the matching engine in supply-first mode to find households whose profiles tolerate it (not excluded, within variety budget, adventurousness allows) and offer it into their next box at the clearing price (8% tier), respecting spend cap and the veto window.
```

---

## PROMPT 11 — Seed data, demo flow, polish

```
Seed realistic data: 1 area (e.g. Oxfordshire), 2 collection points, 6–8 producers with varied products across cold-chain classes, including at least 2 active gluts; 2 demo households with different intent profiles (one "surprise me" family with a nut allergy, one "exact list"). 

Create a scripted demo path that works end-to-end: farmer lists produce + a glut → household sets intent → matching composes a box (clearing the glut, respecting the allergy) → money-split shown → choose collection or mocked courier → test checkout → farmer sees order + payout → show the forward-demand view. 

Final polish: apply the Croftly design system consistently (warm, fresh, never premium), ensure mobile-first, add PostHog events on key actions (optional). Confirm the whole demo loop runs.
```

---

## PROMPT 12 — PWA setup (installable, offline-capable)

```
Make Croftly an installable Progressive Web App. Use next-pwa (or @ducanh2912/next-pwa) on the existing Next.js app.

1. Web app manifest (/public/manifest.json): name "Croftly", short_name "Croftly", full icon set from the Claude Design logo at all required sizes including a maskable icon, theme_color and background_color taken from the design tokens (warm green / cream — not premium), display "standalone", start_url "/". Link it in the app head.

2. Service worker with an EXPLICIT caching split:
   - Cache-first for the app shell — layout, nav, design-system assets, fonts, static images (instant load, works offline).
   - Network-first for live/dynamic data — farm supply, available boxes, prices, order status. These must NEVER be served stale; only fall back to cache when truly offline, and mark it clearly as offline data.

3. Installability: add an install prompt (custom "Add Croftly to your home screen" affordance) and ensure home-screen install works on Android/Chrome and iOS/Safari.

4. Offline states: a logged-in household can view their saved box and intent profile offline; checkout and live matching require a connection and must degrade gracefully with clear "you're offline" messaging — never fail silently or show stale prices as if live.

CRITICAL (do not violate): public marketing pages stay server-rendered and fully crawlable — Home, Areas/location pages, Farm profiles, Learn/Guides, Compare, FAQ. The PWA app-shell / client-rendered behaviour applies ONLY to the logged-in product (shop, farm console, matching). Do NOT convert the whole site into a single client-rendered shell — that would destroy the local-SEO and AI-citation visibility of the marketing pages. SSR for discovery, app-shell for the product.

Confirm: the app is installable, passes a basic Lighthouse PWA check, marketing pages remain SSR/crawlable, and the offline states work.
```

---

## Notes
- **Run in order.** Prompt 1's CLAUDE.md is the guardrail — if Claude Code drifts (e.g. puts an LLM call in the matching maths, or makes the UI premium), point it back to CLAUDE.md.
- **The matching engine (Prompt 6) is the heart** — build it real and deterministic; the allergen hard-stop and the no-LLM-in-composition rule are non-negotiable.
- **SKILL.md (optional next):** the matching engine and the money-split are good candidates for SKILL.md files if you want them as reusable, documented Claude Code skills — say the word and I'll draft them.
- **Production gap (not prototype):** real Stripe Connect payouts, live courier APIs (EasyPost/Sendcloud + Uber Direct/Stuart), **email (Resend) + SMS (Twilio) notifications**, full RLS hardening, DPIA/compliance, batching/virtual-hub. **WhatsApp Business API is deliberately NOT here** — it's an optional later-phase channel pending a discovery finding that UK households/farmers want it, never the ordering interface.
```
