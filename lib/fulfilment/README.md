# /lib/fulfilment — collection + courier orchestration

The platform **orchestrates** logistics; it never owns or employs a fleet (CLAUDE.md rule 2).
Courier selection is **deterministic — no LLM** (rules 3 & 4).

- **Collection** (free): household picks a `collection_point` in their area. £0 delivery,
  no minimum, ever.
- **Courier delivery**: a rate-shopped quote per farm leg. **Simulated in the prototype**
  (no real API calls) — the naming reflects the intended production providers.

## Provider strategy
Cold-chain class routes the leg (unchanged):
- **ambient / hardy goods → a multi-carrier AGGREGATOR** — **Sendcloud** is the lead (European,
  deeper native UK carrier coverage; **EasyPost** is the swap-in if going international).
- **chilled / same-day → an ON-DEMAND API** — **Uber Direct** is the **lead** (widest UK coverage,
  ~90% of population); **Stuart** is the **food-specialist fallback** (better for fresh/chilled but
  denser in cities, thinner in rural areas).
- **highly perishable → specialist (Stuart) or collection.**

Final provider choice is **region-dependent** and must be confirmed against real coverage + rates
for the chosen pilot region.

## Seam (`providers/`)
Pluggable `CourierProvider` adapters (quote + createJob), rate-shopped per leg:
- `providers/mock.ts` — the **active** provider in the prototype (simulation; names the real leads
  above so the demo is faithful). No network calls.
- `providers/stuart.ts` — **documented fallback** adapter (OAuth2 → `/v2/jobs/pricing` + `/v2/jobs`).
  **Not wired into selection** (see `providers/index.ts`). Also exports `mapStuartStatus()`.
- `providers/sendcloud.ts` — **stub** for the ambient aggregator (not wired yet).
- `providers/index.ts` — `enabledProviders()` returns `[mockProvider]` in the prototype.

## Box orchestration (`quote.ts`)
A box can span multiple farms; a courier job is one pickup→one dropoff, so we run **one leg per
distinct producer** (farm → household) and **sum the fees**:
- `quoteBoxCourier(box, pickups, dropoff)` — cheapest viable provider per leg; returns the summed
  quote + per-farm legs, or null if courier isn't viable (→ offer collection). Used at **checkout only**.
- `createBoxCourierJobs(...)` — records one job per farm; used by `placeOrder`.

`matchCourier.ts` is a cheap **estimate** for `/shop` + `/shop/box` (no addresses / network).
`coldChain.ts` (`boxColdChainClass`) is the deterministic viability gate. `constants.ts` holds the
£20 courier minimum + £45 free-delivery thresholds.

## Webhook
`app/api/webhooks/stuart/route.ts` is the reference on-demand-courier webhook (HMAC-verified): it
updates the matching `courier_jobs` leg and recomputes the parent order status (slowest leg wins).

## PRODUCTION notes
- Replace the simulation with the real integrations above (aggregator for ambient; on-demand for
  chilled — Uber Direct lead, Stuart fallback), confirmed against pilot-region coverage + rates.
- One-job-per-farm multiplies cost on multi-farm boxes; batching/virtual-hub is deferred (PRD).
- Address PII → restricted RLS (owner + service-role) + DPIA before launch.
- Job creation isn't yet idempotent/compensating — add before launch.
