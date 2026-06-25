# Croftly — Master Product Requirements Document (v1.0)

**Consolidates and supersedes:** PRD v0.3, Mission & Impact v0.1, Logistics v0.1–v0.4, Pricing v0.1, Competitive Analysis v0.1.
**Category:** Asset-light, agent-mediated, direct-from-farm marketplace (UK).
**One-line:** Cut food waste, get households eating fresher, and pay farmers fairly — by matching demand to real farm supply on a platform that never owns the stock.
**Status:** Strategy settled. Name locked (Croftly). Open decisions D1–D20 inform Phase-0 scope; the binding gate is producer discovery + a real courier-rate scan, not code.

---

## 1. Thesis — the decisions everything else flows from

1. **The platform never takes title to food and never runs a warehouse.** Pass-through only. The largest UK attempt at this exact idea, Farmdrop, owned stock/depots/a fleet and collapsed in 2021 with >£50m of losses and ~450 unpaid farmers — "a Goliath in a David world." Asset-light is non-negotiable.
2. **Orchestrate logistics; never own or employ a fleet.** Integrate courier capacity (it's a commodity, API-accessible); never build it.
3. **Waste reduction is the economic engine.** Recovering value from surplus (worth £0) is what funds fair farmer pay *and* affordable food simultaneously. The three mission pillars are a causal chain, not a wishlist.
4. **Agents are confined to the three jobs a catalogue does badly** (volatile supply, forward demand, glut-clearing). Everyday staple commerce stays deterministic and cheap.
5. **Deterministic by default; the LLM lives only at the fuzzy edges.** Allergen and price-floor constraints are hard, enforced outside the LLM.
6. **Never premium.** Compete on freshness, fairness, transparency and less waste — not luxury.
7. **Diversification, not dependency.** Never let one farm or channel dominate (the Farmdrop trap that destroyed its suppliers).

---

## 2. Problem

**Farmers** don't have a fixed catalogue — they have what the ground or sea gave them this week, at variable weights, with gluts and shortages. Supermarkets force a fixed spec and capture most of the price; selling direct means each farm rebuilding storefront, payments, last-mile and marketing alone, with no way to plan production against real demand.

**Households** want fresher food and to back local farms, but face fragmented single-farm shops with minimum orders and no unified basket — and must do the browsing, planning and re-ordering themselves every week.

**The gap:** no coordination layer turns loose household intent into matched, planned, low-waste orders against volatile farm supply — without the platform taking on grocery's lethal balance sheet.

---

## 3. Mission & impact (the spine)

### 3.1 Three outcomes, one engine
1. **Less food wasted** · 2. **Households eating fresher, healthier food** · 3. **Farmers better off economically.**

These are a **causal chain**: produce heading for waste is worth £0; recover its value via forward-planning + glut-clearing → margin that didn't exist → split between **fair farmer pay** and **affordable food**; the same forward-planning gives farmers **revenue certainty** and households **reliable fresh supply**. One mechanism, three outcomes.

### 3.2 The tensions (named and refereed)
- **Waste vs variety:** glut-clearing is opt-in and bounded by stated preferences + diet-diversity — the engine balances, never dumps.
- **Fair pay vs affordability:** relieved by the waste engine + collection economics; **refuse to drift premium-only**.
- **Affordable access vs the affluent-customer reality:** collection points in diverse communities, glut deals as the affordable tier; acknowledged as genuinely hard.
- **Mission vs returns pressure:** see ownership structure (D10).

### 3.3 Impact dashboard (track outcomes, not just GMV)
| Pillar | North-star | Guardrail (catches drift) |
|---|---|---|
| Waste | Tonnes diverted / % output monetised | Glut-clear rate |
| Healthy | % baskets meeting variety/freshness threshold | **Affordability index** (vs supermarket-equivalent — catches premium drift) |
| Farmer | Take-home vs wholesale; revenue predictability | **Concentration ceiling** (no farm > X% via platform — catches the Farmdrop trap) |

**Constitutional design rules:** never drift premium-only; diversification not dependency; no nutrition overclaim (claim access/freshness/variety, never health outcomes).

---

## 4. The model

**Three roles:** Producer (sets own price + floor, lists real availability, keeps brand) · Household (states intent; receives matched boxes; collects free or pays for delivery) · *Hub (a local aggregation node — an existing farm/co-op, not a platform depot; deferred in favour of courier-matching, see §6).*

**Money flow (the Farmdrop-proofing):** household pays the platform → held via **Stripe Connect** (separate charges & transfers) → released on fulfilment as farmer share minus platform commission (+ courier fee if applicable). The platform is a pass-through agent — never the farmer's creditor, never carrying perishable write-offs. **Farmers keep ~85%** (more than the hub model, since courier-matching removes the hub share).

---

## 5. Agent architecture & matching

### 5.1 Asymmetric, not symmetric
- **Buyer-Intent Agent (rich):** holds standing intent — budget, cadence, household size, likes/dislikes, **hard allergens**, adventurousness, **priority preference** (best-value / freshest-closest / support-specific — D20), substitution rules, fulfilment preference.
- **Supply-Broadcast layer (lightweight):** farmers broadcast structured availability (variable weights, declared gluts, windows). No per-listing inference.
- **Matching & Clearing Engine (the middle):** composes boxes, resolves substitutions within rules, clears gluts, aggregates forward demand into plant signals.

### 5.2 The responsibility line (drives cost and trust)
Deterministic by default — "I want X", fixed boxes, staple prices, the composition maths, courier selection, allergen and price-floor enforcement. **LLM only** for: parsing fuzzy intent, "surprise me" composition rationale, and glut placement explanation. The composition maths never run through the LLM.

### 5.3 The three jobs only agents do
1. **Flexible intent vs stochastic perishable supply** (the primary unlock).
2. **Forward demand aggregation → harvest planning** (a forward market; manufactures predictable density).
3. **Glut & surplus clearing** (proactive placement at a clearing price — the feature farmers love).

### 5.4 How matching works (two stages)
**Match 1 — compose box (constraint-satisfaction):** FILTER (availability + cluster + cold-chain + **hard allergen exclusion** + dislikes — deterministic) → SCORE (preferences, variety, freshness, glut-priority boost, and the household's **priority_preference** weighting — incl. best-value price weighting) → COMPOSE (pack to budget). **Hard rule:** never select below a product's **price floor** (D20), enforced like the allergen filter. LLM writes a cosmetic explanation only.
**Match 2 — assign courier (assignment/routing):** the composed box yields a fulfilment spec (what, from where, to where, window, cold-chain class) → filter viable couriers by cold-chain class + window → rank by cost → book. Not "nearest" — *cheapest viable*. No LLM. Collection orders skip this entirely (no courier).

### 5.5 Trust guardrails (non-negotiable once agents auto-fill)
Hard spend cap · **allergen hard-stops outside the LLM** · veto/skip/swap window before charge · explicit substitution rules · clearing-price ceiling (never talk a household up) · **farmer price floor** · auditability of every agent decision.

---

## 6. Logistics (consolidated final state)

**Principle: orchestrate logistics it does not own. The platform owns the promise, not the vehicle.** Across every capacity source, the platform owns the SLA, tracking, packaging/cold-chain spec, and fallback — execution is distributed and asset-light; accountability is centralised.

### 6.1 Delivery is a heterogeneous capacity pool
| Source | How added | Cost | Cold-chain | Best for |
|---|---|---|---|---|
| **Free collection point** | Platform sets up | £0 to customer | passive | Dense clusters; the affordability backbone |
| **Farmer self-deliver** (opt-in toggle, D17) | Already onboarded | cheapest / £0 | farmer meets spec | Single-farm local orders |
| **Farmer self-post** | Opt-in toggle | postage | **ambient only** | Non-perishable, wider geography |
| **Commodity courier (API)** | **Integrate, not onboard** | per-drop, variable | per channel class | Doorstep where no cheaper option |
| **Local driver/captain register** | Light register (Phase 2) | low | per packaging spec | Thin / rural routes |

### 6.2 The chosen delivery model: courier-matching, asset-light
- **Courier-matching** is the delivery model: the platform matches each order to an outside courier (farm-gate pickup → household), owning the matching + payment + tracking, **not** vehicles. Farmers need zero logistics capability.
- **Point-to-point first; route-batching later.** Batching (Phase 2) groups orders into one courier job — consolidation **without a physical hub** (the "virtual hub" = the courier's route). Physical hubs are deferred, earn-it-later only.
- **Cold-chain class governs courier choice.** Ambient/robust → aggregator + national carriers; chilled/short-life → on-demand fast + passive packaging; highly perishable → specialist or collection-only. **Passive cold chain** (insulated boxes, not refrigerated vans) on the final leg is the key asset-light cost unlock.
- **Fixed weekly windows per postcode cluster** (not Farmdrop's hourly slots) + density-engineering (group orders, collection points, recurring boxes) — drops-per-route is the dominant economics lever.

### 6.3 Courier integration is real and commodity (not built)
Mature UK options validate the asset-light thesis: **multi-carrier aggregators** (EasyPost, Sendcloud — one API, many carriers, rate-shopping = the Match-2 engine off the shelf) for ambient; **on-demand APIs** (Uber Direct ~90% UK population coverage, Stuart — does fresh/frozen) for same-day chilled. Couriers are *integrated*, never onboarded — unlike farmers, who are unique must-recruit supply. **Never build a managed fleet.**

### 6.4 Reverse logistics
Returnable insulated crates collected on the next delivery (Riverford model); crate pooling across areas; reverse flow rides the same leg as the outbound drop.

---

## 7. Pricing

### 7.1 Principles
Commission-based, farmer-absorbed. **Farmers keep 85%+ — shown transparently.** Commission is a behavioural lever, not a flat tax. Waste recovery funds affordability. Collection free; courier the honest paid upgrade. **Radical money-split transparency** is the brand signature. Never price into premium-only.

### 7.2 Commission (behavioural tiering — the differentiator)
| Produce type | Commission | Farmer keeps |
|---|---|---|
| Standard | 15% | 85% |
| **Forward-committed** | **10%** | 90% |
| **Glut-clearing** | **8%** | 92% of clearing price |

Makes the three pillars *economically self-enforcing*: farmers are paid to plant against orders and clear surplus. No competitor prices this way — none has the forward/glut mechanism.

### 7.3 Farmer price floor (D20)
Each product carries a price and an optional **floor** (lowest acceptable). The opt-in "best value" matching mode weights price and prefers the cheapest equivalent item, but **never sells below the floor** — competition within farmer-defined limits, never unbounded undercutting. A deterministic guardrail, enforced like the allergen filter.

### 7.4 Delivery, membership, money-split
- **Collection free** (the backbone); **courier from £4.95** (honest, cost-reflective); free over £45; £20 min for courier (D14).
- **Croftly+ membership** (optional, Phase 1+): £5.99/mo — *half-price* delivery (not free — guards the courier-cost trap), locked box pricing, early access to rescued/glut produce, 5% credit (D15).
- **Money-split shown at checkout** (e.g. £24 box → £20.40 farmer / £3.60 platform). The glut tier is the affordable, near-supermarket entry point.
- **Farmers free to list**; Stripe fees absorbed in commission (D16).

---

## 8. Competitive landscape

### 8.1 The map (nine strategic groups)
Anti-pattern: **Farmdrop †** (vertically integrated, dead). High threat: **Riverford / Abel & Cole** (premium single-brand boxes — Riverford £117m, ~70k boxes/week; both B-Corps; both *more expensive* than supermarkets), **Oddbox** (surplus rescue — 62k+ tonnes, 110+ growers; owns the waste narrative but *reactively*), and **Open Food Network** (the structural twin — asset-light, multi-farm, already offers reduced-rate courier, but values-first, weak UX, *passive*). Structural competitor: **supermarkets** (+ wonky/local ranges) — own price and convenience. Lower threat: directories (Produce & Provide), CrowdFarming, farm SaaS, and AI ag-marketplaces in other geographies.

### 8.2 Findings
- **The combination is white space; the mission is not.** No UK player combines asset-light + true multi-farm marketplace + AI matching + consumer-grade UX + a forward/waste engine. But every competitor already uses the same mission language — **mission is table stakes; the wedge is the mechanism.**
- **Nobody beats supermarkets on price.** The category's universal failure and the premium-drift risk made real. **Affordability via the waste engine is the make-or-break thesis** — the affordability index is *the* competitive KPI, not just a guardrail.
- **Two sharp, defensible borders:** *prevention vs Oddbox's rescue*; *active AI-matching + consumer UX vs OFN's passive tooling.* Both are genuinely hard, which is why they're defensible.
- **Tailwinds:** UK organic grew 7.3% in 2024 to £3.7bn (20-year high); ~25% of UK food waste happens on farms (more than retail, manufacturing, hospitality combined).

### 8.3 Vulnerabilities
Affordability ceiling (top risk); cold-start two-sided liquidity (the empty quadrant is empty partly because it's *hard*, not unseen); OFN closing the UX/AI gap; a funded overseas AI-marketplace entering the UK; incumbents' war chests.

---

## 9. Tech architecture
Next.js (App Router, TS) **PWA** (installable; app-shell for the logged-in product, **SSR + crawlable for marketing/location/farm/guide pages** — non-negotiable for SEO/GEO) · Tailwind + shadcn/ui · Supabase (Postgres, RLS, Auth) · **Stripe Connect** · Anthropic SDK tiered (Haiku ops / Sonnet intent+explain / Opus forward-forecasting later) · **Resend (email) + Twilio (SMS)** notifications — *WhatsApp not in the stack; optional later-phase channel only, never the ordering interface* · Vercel · PostHog. Matching: deterministic constraint-solver core (no LLM) with LLM only at the fuzzy edges. Money in integer pence.

---

## 10. Phasing

- **Phase 0 — Prove density & economics.** Single region, one anchor farm, 10–20 farms, recurring + "surprise me" boxes, **collection-first** + commodity-courier overflow (point-to-point), **manual/heuristic matching** (learn the rules before coding them). Gate: positive contribution per window; a confirmed hosting farm.
- **Phase 1 — Automate.** Buyer-Intent Agent live; deterministic matching + LLM edges; guardrails; **best-value mode + price floor (D20)**; **farmer self-fulfilment toggle (D17)**; Stripe Connect payouts; email+SMS; Croftly+ membership; money-split transparency; full PWA.
- **Phase 2 — Scale supply & density.** Route-batching (virtual hub); **light local-driver/captain register**; forward market + glut clearing; group orders; open the hub model to third-party operators.
- **Phase 3 — National + intelligence + B2B.** Opus forward-demand forecasting; route optimisation; B2B baseload (offices/schools); native mobile.

---

## 11. Regulatory & compliance (UK)
Platform never owns/handles food → primary **Food Business Operator** duties sit with farmers (+ hubs); the **packaging/cold-chain spec is a platform responsibility** (a real liability seam — pin it in T&Cs + onboarding). Consumer Contracts Regs with perishable-returns exemptions + clear substitution policy. Stripe Connect carries most KYC/AML/PSD2 — stay a marketplace, not a money transmitter, by never holding farmer funds outside the Connect flow. **UK GDPR:** ICO registration, privacy policy, **DPIA (7-step ICO structure)** before scaling household data — note the Buyer-Intent profiles (diet, allergies, household composition) raise the DPIA bar. Variable-weight unit-pricing compliance.

---

## 12. Open decisions

| # | Decision | Status / lean |
|---|---|---|
| D1 | Fulfilment default (Phase 0) | Collection-first |
| D2 | Commission split | 15% / 10% forward / 8% glut (confirm in discovery) |
| D3 | Phase-0 anchor | Partner an existing farm |
| D4 | Pilot region | **Open** — density + supply + ops proximity |
| D5 | Launch breadth | Veg + eggs + one meat (simpler cold-chain) |
| D6 | Name | **RESOLVED — Croftly** (domain check done) |
| D7 | Matching automation gate | Manual Phase 0, automate Phase 1 |
| D8 | Phase-0 last-mile mix | Collection-only + one courier overflow |
| D9 | Cold-chain packaging spec/ownership | Platform sets spec; sourced to it; crate deposit |
| D10 | Mission/ownership structure | **B-Corp + farmer-advisory stake** |
| D11 | First-mile when farm has no transport | Courier does farm-gate pickup (resolved) |
| D12 | Courier panel | Aggregator (ambient) + on-demand (chilled) |
| D13 | Multi-farm basket pre-batching | Transparent separate deliveries |
| D14 | Delivery fee level | £4.95 / free over £45 / £20 min (validate vs real rates) |
| D15 | Membership | Ship Croftly+ in Phase 1 |
| D16 | Payment-fee handling | Absorb Stripe in commission |
| D17 | Farmer self-fulfilment | Phase 1, single-farm, with courier fallback |
| D18 | Courier sourcing | Integrate APIs; light local register Phase 2; **never a fleet** (locked) |
| D19 | Self-delivery pricing | Farmer waives or charges delivery |
| D20 | Best-value matching + price floor | Opt-in Phase 1, floored; default never "best value" |

---

## 13. Risks (consolidated)

| Risk | Severity | Mitigation |
|---|---|---|
| Affordability never beats/matches supermarkets | High | Waste engine as the price-gap closer; glut tier; collection-first; affordability-index KPI |
| Cold-start two-sided liquidity | High | Density-engineering + one anchor farm; matching is the multiplier, not the seed |
| Last-mile economics don't close | High | Collection-first; passive cold chain; existing-capacity tiers; kill criterion |
| Auto-fill "surprise" box → refund machine | High | Spend caps, allergen hard-stops, veto window, substitution rules |
| LLM cost per match doesn't scale | High | Deterministic by default; LLM only at fuzzy edges |
| "Become Farmdrop" creep (own stock / own fleet) | High | Constitutional rules: never take title; orchestrate never own; integrate never employ |
| Mission undifferentiated vs competitors | Med | Lead on mechanism, not mission language |
| Platform pulled into FBO liability | Med | Crisp FBO model + platform packaging spec in T&Cs/onboarding |
| Farmer price war (race to the bottom) | Med | Price floor (D20); best-value never the default; concentration ceiling |
| OFN closes the UX/AI gap | Med | Execute the active-matching + consumer-UX edge fast |

---

## 14. The validation gate (the real next step)

Every section lands on the same truth: the design is settled, but **viability is unproven on paper.** The binding next step is not code — it's **10–15 producer discovery conversations in the chosen region (D4)** plus a **real regional courier-rate scan**, to confirm: (a) farmers will sell at the 15% split, (b) one will host the first anchor, (c) their real glut/shortage patterns (which *are* the spec for the matching engine), and (d) whether the doorstep delivery fee is £5 or £12 (which sets the whole affordability picture). A working prototype proves desirability; these conversations prove viability. Code follows a confirmed anchor.
