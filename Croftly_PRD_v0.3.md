# Croftly — Product Requirements Document

**Version:** 0.3 (Name locked: **Croftly** — supersedes v0.2)
**Name:** Croftly *(locked — D6 resolved; domain / UK trademark / Companies House check still pending before commercial commitment)*
**Category:** Asset-light, agent-mediated direct-from-farm marketplace (UK)
**One-line:** AI agents match households' food intent to farmers' real, perishable supply — and aggregate future demand so farmers plant against confirmed orders — on a platform that never owns the stock.
**Status:** Foundation thesis locked (§1). Agent architecture defined (§4). Name locked (Croftly). Open decisions D1–D5 and D7 (plus module decisions D8–D19) block CLAUDE.md.

**Changes from v0.2:** Project name locked to **Croftly** (was working name "Farmgate"); D6 resolved; all references rebranded. Notification stack updated: **Resend (email) + Twilio (SMS)** for transactional notifications; **WhatsApp removed from the stack** — optional later-phase channel only, gated on discovery, never the ordering interface (§5, §8, §9). No other architectural change. *(Sibling modules — Mission/Impact, Logistics, Pricing, Competitive Analysis, Relume prompt — still carry the old working name and the old WhatsApp reference; to be aligned in one pass.)*

**Changes from v0.1:** Core respec'd from a browse-catalogue marketplace to an asymmetric agent-matching one. Adds the agent/marketplace responsibility line (§4.2), the three jobs only agents can do (§4.3), trust guardrails (§6), and cost-control rules (§7). Asset-light money flow, hub model, phasing and regulatory carried forward, tightened.

---

## 1. The two decisions that matter

**Decision 1 — The platform never takes title to the food and never runs a central warehouse.** *(Carried from v0.1, non-negotiable.)*
Farmdrop did the opposite — owned stock, ran depots and a fleet, offered hourly slots — and collapsed in Dec 2021 with **>£50m of losses** and ~450 farmers unpaid, "a Goliath in a David world." The survivors (Open Food Network, Produce & Provide, CrowdFarming) all stay asset-light. Any feature that requires the platform to buy-then-resell is rejected on sight.

**Decision 2 — Agents are confined to the three jobs a catalogue does badly; everyday staple commerce stays dumb, deterministic and cheap.**
"Household wants carrots → show carrots" is a database query. Wrapping it in LLM calls adds cost and latency to a £2 transaction for no benefit. Agents earn their place *only* where supply is volatile, demand is forward-looking, or produce would otherwise be wasted (§4.3). This is what keeps the model both differentiated and affordable.

An agent-matching design also deepens Decision 1: a matching-and-clearing platform owns even less than a catalogue platform — it is pure intelligence plus payment rails.

---

## 2. Problem

**Farmers** don't have a fixed catalogue — they have *what the ground or the sea gave them this week*, at variable weights, with gluts and shortages. Supermarkets force a fixed spec and volume onto that reality and capture most of the price. Selling direct means each farm rebuilding storefront, payments, last-mile and marketing alone, with no way to plan production against real demand.

**Households** want fresher food and to back local farms, but face fragmented single-farm shops with minimum orders and no unified basket — and have to do the browsing, planning and re-ordering themselves every week.

**The gap:** no coordination layer turns loose household intent into matched, planned, low-waste orders against volatile farm supply — without the platform taking on grocery's lethal balance sheet.

---

## 3. The model (asset-light, carried from v0.1)

**Three roles:** Producer (sets own price, lists real availability, keeps brand) · Regional Hub (local aggregation + last-mile; an existing farm/co-op/community org, *not* a platform depot) · Household (states intent, receives matched orders by recurring box or à la carte, via delivery window or collection point).

**Money flow (the Farmdrop-proofing):** household pays platform → held via **Stripe Connect** (separate charges & transfers) → released on fulfilment as farmer share + hub share minus platform commission. The platform is a pass-through agent, never the farmer's creditor, never carrying perishable write-offs. Indicative split: **Farmer 70–78% · Hub 10–15% · Platform 8–12%** (D2).

**Fulfilment solves density, not speed:** fixed weekly windows per postcode cluster (not Farmdrop's hourly slots), collection points (workplaces, gyms, community halls, churches), recurring boxes, and neighbour/group orders to lift drops-per-mile.

---

## 4. The agent architecture (the v0.2 core)

### 4.1 Asymmetric, not symmetric
This is **not** two agents haggling over carrots. Buyer-side and seller-side agents are deliberately unequal:

- **Buyer-Intent Agent (rich).** Holds each household's standing intent: budget, cadence, household size, likes/dislikes, hard allergy exclusions, adventurousness ("surprise me" ↔ "exactly this list"), and learned history. Translates fuzzy human intent into structured, matchable demand.
- **Supply-Broadcast layer (lightweight).** Farmers don't run a reasoning agent; they broadcast structured availability — "120 bunches carrots, 40kg courgette glut, ~30 variable-weight chickens, available Thu window." Cheap, near-real-time, no per-listing inference.
- **Matching & Clearing Engine (the middle).** Reconciles intent against supply for a hub's cluster and window: fills boxes, resolves substitutions within stated rules, clears gluts to tolerant buyers, and aggregates forward demand into plant signals.

Negotiation/price discovery is reserved for the cases where it's worth it (bulk, forward commitments, gluts). Everyday staples trade at the farmer's set price on deterministic rails.

### 4.2 The responsibility line (load-bearing — drives cost and trust)

| Job | Handled by | Why |
|---|---|---|
| "I want X, show me X" | **Deterministic marketplace** (DB query) | Cheap, instant, predictable. No LLM. |
| Fixed recurring box, same each week | **Deterministic** | Template + availability check. No LLM. |
| Price display for set-price staples | **Deterministic** | Trust requires stable, non-negotiated staple prices. |
| Parse fuzzy intent ("£30, surprise me, kid-friendly, no aubergine") | **Buyer-Intent Agent** | Genuine language → structured demand. |
| Fill a "surprise me" box against this week's volatile supply | **Matching Engine** | Stochastic, perishable, variable-weight. |
| Resolve a substitution when a farm's crop fails | **Matching Engine** (within guardrails §6) | Real-time, rules-bound. |
| Aggregate forward demand → plant signal | **Matching Engine** | Forward market; no catalogue does this. |
| Clear a glut to tolerant households | **Matching + Buyer-Intent Agent** | Proactive placement at clearing price. |

If a job isn't in the right column, it's in the wrong place. The default is deterministic; the agent is the exception that must justify its cost.

### 4.3 The three jobs only agents can do

**(1) Flexible intent against stochastic, perishable supply.**
Farms sell what came in, at variable weights, with gluts and shortages — a fixed catalogue chokes on this. A buyer agent holding loose intent matched to volatile supply beats browsing. *This is the primary unlock.*

**(2) Forward demand aggregation → harvest planning.**
Match *future* intent to *future* supply: aggregate, say, 40 households who'll commit to cabbage in six weeks → signal the farmer to plant against confirmed orders. Farmers stop guessing, waste falls, and the platform manufactures the predictable density that makes last-mile economics close. A forward market, not a shop.

**(3) Glut & surplus clearing.**
When a farmer has a courgette glut, the engine proactively places it with households whose stated preferences tolerate it, at a clearing price. Waste down, farmer upside up — the feature that makes farmers love the platform.

---

## 5. Core features — v1 (pilot)

**Household**
- Conversational intent setup → standing Buyer-Intent profile (budget, cadence, size, likes/dislikes, **hard allergy exclusions**, adventurousness)
- "Surprise me" box ↔ exact-list box, per cadence
- Weekly *proposed* box with a clear veto/skip/swap window before charge (§6)
- À la carte deterministic browse for people who just want to shop
- Forward "commit to future crop" offers; glut deals surfaced to tolerant profiles
- Delivery-window or collection-point selection; email + SMS notifications

**Farmer**
- Structured availability broadcast (incl. variable weights & declared gluts)
- Self-set pricing; availability tied to harvest, not a fixed catalogue
- Forward-demand dashboard: "X households want cabbage in 6 weeks"
- Order/pick view + Stripe Connect payout dashboard

**Hub**
- Consolidated pick/pack across farms for the cluster
- Auto-sequenced route sheet for the window
- Farm-to-hub reconciliation

**Platform/admin**
- Matching & clearing engine config (per hub/cluster/window)
- Commission + payout engine; guardrail + substitution-rule config; catalogue/food-safety moderation

---

## 6. Trust guardrails (non-negotiable once agents can auto-fill orders)

The moment an agent auto-composes a "surprise" box and charges for it, weak guardrails make a refund machine. People are particular about food in a way they aren't about playlists. Required from day one:

- **Hard spend cap** per box/period — agent can never exceed it.
- **Allergy hard-stops** — declared allergens are absolute exclusions, never substitutable, enforced deterministically *outside* the LLM path.
- **Veto / skip / swap window** — every proposed box is previewable and editable before charge; silence ≠ consent for new/unusual items above a threshold.
- **Substitution rules** — explicit per household ("swap within category only" / "never swap" / "anything within budget"); engine obeys, never improvises past them.
- **Clearing-price ceiling** — glut deals only ever *below* set price; agents can't talk a household *up*.
- **Auditability** — every agent decision (why this item, this sub, this price) is logged and human-readable for disputes.

---

## 7. Cost-control rules

- **Deterministic by default.** ~90% of actions ("I want X", fixed boxes, staple prices) never touch an LLM.
- **LLM only for:** initial fuzzy-intent parsing, "surprise me" composition against volatile supply, and glut placement. Tiered: **Haiku** for routine notify/ops, **Sonnet** for intent parsing + box composition, **Opus** reserved for forward-demand forecasting at scale (Phase 3).
- **Cache learned intent.** A household's structured profile is stored, not re-derived each week — re-parse only on change.
- **No per-match inference on cheap staples.** If a line item is a set-price staple, it's a DB write, full stop.

---

## 8. Tech architecture

Next.js 16 PWA + shadcn/ui · Supabase (Postgres + RLS + realtime, multi-tenant **by hub**) · **Stripe Connect** (separate charges & transfers) · Resend (email) + Twilio (SMS) for transactional notifications — *WhatsApp is not in the stack; optional later-phase channel only, pending discovery, never the ordering interface* · Claude API tiered per §7 · Vercel + PostHog. Matching engine: deterministic constraint-solver core (intent ↔ supply ↔ budget ↔ allergens ↔ substitution rules) with LLM only at the fuzzy edges; Phase-1 fixed windows, Phase-2 auto-sequencing (Mapbox/OR-Tools), Phase-3 forward-demand optimisation.

---

## 9. Phasing / build sequence

**Phase 0 — One hub, one region, *manual* matching.** 10–20 farms, recurring + "surprise me" boxes, collection-first. Run the matching by hand (or thin heuristics) to learn the intent↔supply↔substitution logic *before* automating it. Prove positive contribution per window. **The agent is specced here but not the gate — density and unit economics are.**

**Phase 1 — Automate the engine, multi-hub in one region.** Buyer-Intent Agent live, deterministic matching + LLM edges, guardrails enforced, Stripe Connect payouts, email + SMS notifications. Goal: repeatable hub onboarding + retention.

**Phase 2 — Open the hub model + forward market.** Third-party hub operators; forward demand aggregation → plant signals; glut clearing; group/neighbour orders. Goal: supply-side scale + density without platform capex.

**Phase 3 — National + intelligence + B2B.** Opus forward-demand forecasting; route optimisation; B2B baseload (restaurants, offices, schools). Mobile apps land here per standard practice.

---

## 10. Regulatory & compliance (UK)

Platform never owns/handles food → primary Food Business Operator duties sit with farmers/hubs (FSA/local-authority registration, traceability, cold chain); platform must still pin FBO responsibility crisply in T&Cs + hub onboarding (a real liability seam). Consumer Contracts Regs with perishable-returns exemptions + a clear substitution policy. Stripe Connect carries most KYC/AML/PSD2 — platform stays a marketplace, not a money transmitter, by never holding farmer funds outside the Connect flow. UK GDPR: ICO registration, privacy policy, **DPIA (7-step ICO structure)** before scaling household data — note the Buyer-Intent profiles are richer personal data (diet, allergies, household composition) and raise the DPIA bar. Variable-weight unit-pricing compliance.

---

## 11. Open decisions (block CLAUDE.md)

- **D1 — Fulfilment default:** collection-first vs delivery-first for Phase 0. *(Lean: collection-first.)*
- **D2 — Commission split:** exact farmer/hub/platform %; hub share fixed vs cost-plus.
- **D3 — Phase-0 hub:** recruit existing farm/co-op vs operate one directly. *(Lean: partner an existing farm.)*
- **D4 — Pilot region:** density + supply + ops proximity. *(Candidate: a county cluster within reach of Harpenden — Herts/Beds/Bucks.)*
- **D5 — Launch breadth:** veg+eggs+one meat (simpler cold-chain) vs full multi-category. *(Lean: veg + eggs + one meat.)*
- **D6 — Name (RESOLVED):** **Croftly** — locked. Small-farm ("croft") root: warm, British, credible to farmers, friendly to households, reads as a modern product. *Remaining action:* verify .com/.co domain, UK trademark (IPO), and Companies House name availability before commercial commitment; secure handles.
- **D7 — *(new)* Matching automation gate:** how much of Phase 0 runs on manual/heuristic matching before the agent ships. *(Lean: manual in Phase 0, automate in Phase 1 — learn the rules before coding them.)*

---

## 12. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| Cold-start: great matching over an empty marketplace matches nothing | High | Density-engineering seeds liquidity (collection points, recurring boxes, one anchor hub); matching is the multiplier, not the seed |
| Auto-buy "surprise" produce → refund machine | High | Guardrails §6: spend caps, allergy hard-stops, veto window, substitution rules |
| LLM cost per match doesn't scale | High | Cost rules §7: deterministic by default, LLM only at fuzzy edges |
| Last-mile economics don't close | High | Density-first; collection-first; kill criterion (positive contribution/window) |
| CAC > LTV | High | Recurring boxes for LTV; church/workplace collection = low-CAC trusted channels |
| Platform pulled into FBO liability | Med | Crisp FBO model in T&Cs + onboarding |
| "Become Farmdrop" creep | High | Constitutional rule: platform never takes title |

---

## 13. Next step

Resolve **D1, D3, D4, D5, D7** → then CLAUDE.md + SKILL.md + Phase-0 build-prompt sequence. But the real gate is unchanged and isn't code: **10–15 producer discovery conversations in the chosen region** to confirm (a) farmers will sell at the proposed split, (b) one will host hub zero, and (c) what their real glut/shortage patterns look like — because that volatility *is* the spec for the matching engine. Code follows a confirmed hub.
