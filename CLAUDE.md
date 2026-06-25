# CLAUDE.md — Croftly

> Project root context for Claude Code. Always loaded. This supersedes the inline CLAUDE.md from the build-prompt pack.

## What this is
Croftly is an asset-light UK marketplace connecting local farmers directly to households. Households state their food intent; an AI matching engine composes boxes from real farm supply; farmers sell direct and keep ~85%. The platform never owns stock, never runs warehouses, and never operates its own delivery fleet.

---

## ⛔ STRICT: Prototype HTML is the source of truth

The `/design-reference/` directory holds the canonical prototype HTML exported from Claude Design. **These files are the SINGLE SOURCE OF TRUTH for all UI.** The build must align with them fully and faithfully.

**Mandatory rules — non-negotiable:**
1. **Read before you build.** Before implementing ANY page or component, locate and fully read its corresponding prototype HTML in `/design-reference/`. Treat it as the exact specification.
2. **Reproduce faithfully.** The build must reproduce the prototype's structure, section order, layout, component hierarchy, copy, spacing, typography, colour, and responsive behaviour. No redesign, no "improvements", no added / removed / reordered elements.
3. **Copy is authoritative.** Headlines, body copy and microcopy in the prototype are reproduced **verbatim**. Do not paraphrase, rewrite, or "polish" prototype copy.
4. **Tokens from the prototype, not invented.** Extract colour, type scale, spacing, and radii from the prototype HTML into the Tailwind theme. Never invent design values.
5. **Verification gate.** After building each page, compare it against the prototype HTML and confirm alignment (structure, section order, copy, components, tokens, responsive) BEFORE moving on. Misalignment is a bug to fix, not a stylistic choice.
6. **No silent deviation.** Any deviation (technical necessity, a gap in the prototype) must be explicitly flagged in your output AND as a `// DEVIATION:` code comment with justification. Silent deviation from the prototype is a defect.
7. **Maintain the file→route map** (see `/design-reference/MAP.md`): e.g. `home.html → app/page.tsx`, `sell.html → app/farm/sell/page.tsx`.

**Build prompts vs prototype HTML:** where a build prompt and a prototype HTML describe the same page, the **prototype HTML is authoritative for visuals, structure, and copy**; the **build prompt and this CLAUDE.md are authoritative for data, logic, and behaviour**. They must align. A build prompt never overrides the prototype's UI, and the prototype never overrides a constitutional rule.

**Conflict resolution:** prototype HTML wins on UI; CLAUDE.md constitutional rules win on logic/safety. If a genuine conflict exists between them, **STOP and flag it** — do not resolve it silently.

See `SKILL.md` (prototype-alignment) for the step-by-step build workflow and verification checklist.

---

## Constitutional rules (never violate)
1. The platform NEVER takes title to food and NEVER runs a warehouse. Pass-through only.
2. Orchestrate logistics; never own or employ a fleet. Integrate courier capacity, don't build it.
3. **Allergen exclusions are HARD constraints enforced deterministically OUTSIDE the LLM path.** An allergen must never be reasoned about, inferred, or honoured by a language model.
4. **Deterministic by default.** The LLM is used ONLY for fuzzy-intent parsing and human-readable explanations — NEVER for box-composition maths or courier selection.
5. **Never premium.** Croftly competes on freshness, fairness, transparency and less waste — not luxury. UI and copy must never read elite/glossy. (The prototype already encodes this; do not undo it.)
6. **Diversification, not dependency.** Never let one farm or one channel dominate.

---

## Stack
Next.js (App Router, TypeScript) · **PWA (next-pwa / @ducanh2912/next-pwa)** · Tailwind + shadcn/ui · Supabase (Postgres, RLS, Auth) · Stripe Connect (test mode) · Anthropic SDK (Haiku = ops, Sonnet = intent parse + box explanation, Opus = forward forecasting later) · Vercel · PostHog (optional).

## 📱 PWA-first (required)
Croftly ships as an installable Progressive Web App, not just a responsive site. Required:
1. **Web app manifest** (`manifest.json`): name "Croftly", short_name, full icon set (use the Claude Design logo at all required sizes incl. maskable), `theme_color` + `background_color` from the design tokens, `display: standalone`, dual-entry `start_url`.
2. **Service worker** with an explicit caching split:
   - **Cache-first for the app shell** — nav, layout, the design system, static assets (instant load, offline-capable).
   - **Network-first for live data** — farm supply, available boxes, prices, order status. These must NEVER be served stale; fall back to cache only when offline, clearly marked as offline.
3. **Installability** — an install prompt and home-screen install support.
4. **Offline states** — a household can view their saved box and intent profile offline; checkout and live matching require a connection and degrade gracefully with clear messaging.

**Critical PWA ↔ SEO/GEO rule (do not violate):**
Public **marketing pages stay server-rendered (SSR) and fully crawlable** — Home, Areas/location pages, Farm profiles, Learn/Guides, Compare, FAQ. The PWA app-shell / client-rendered behaviour applies to the **logged-in product** (shop, farm console, matching) only. NEVER turn the whole site into a single client-rendered shell — that would destroy the local-SEO long tail and AI-citation visibility the marketing pages are built for. SSR for discovery, app-shell for the product.

## Prototype scope (this build)
- **Real:** data model, two-sided flow, matching engine, money-split, intent capture, forward + glut modes.
- **Mocked:** live courier APIs (simulated match), full Stripe Connect payouts (test checkout + simulated split display), notifications (in-app only in the prototype).
- Single region, point-to-point, no batching.

## Notifications
- **Prototype:** in-app only.
- **Production:** **email (Resend) + SMS (Twilio)** for transactional notifications (order confirmed, box ready for collection, out for delivery, substitution/veto-window prompt). These cover the time-sensitive moments.
- **WhatsApp Business API is NOT in the Croftly stack.** It is an *optional later-phase channel only*, gated on a discovery finding that UK households or farmers genuinely want it. Rationale: Croftly is a PWA with a rich UI and a money-split transparency component — WhatsApp can't render the product's signature surfaces, and the WhatsApp Business API carries real friction (Meta verification, template approval, per-message pricing). Do not import it by default. If added later, it is an *additional notification channel*, never the ordering interface.

## Commission (money in integer pence everywhere)
15% standard · 10% forward-committed · 8% glut/surplus. Farmer keeps the rest.

## Conventions
- TypeScript strict; server components by default.
- Supabase RLS on every table.
- All AI calls isolated in `/lib/ai`. Deterministic matching in `/lib/matching` with **zero** LLM calls.
- Mobile-first; reproduce the prototype's responsive behaviour.
- Marketing pages SSR and crawlable; PWA app-shell only for the logged-in product (see PWA-first).
- Mark every mock and every production-gap with a `// PRODUCTION:` comment.

## Directory map
- `/design-reference/` — canonical prototype HTML (read-only source of truth) + `MAP.md`.
- `/lib/ai` — LLM calls only (parseIntent, explainBox).
- `/lib/matching` — deterministic engine, NO LLM.
- `/lib/fulfilment` — collection + mocked courier match.
- `/app` — routes, mapped 1:1 to prototype HTML files.
- `/public/manifest.json` + icons — PWA manifest and home-screen icons.
- service worker (via next-pwa) — app-shell cache-first, live-data network-first.
