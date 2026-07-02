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
- `providers/uber.ts` — **Uber Direct**, the LEAD adapter (OAuth2 → `/delivery_quotes` + `/deliveries`).
  **Active whenever `UBER_*` creds are present** (see `providers/index.ts`).
- `providers/mock.ts` — deterministic **simulation fallback** (used when no `UBER_*` creds); names the
  real leads so the demo stays faithful. No network calls.
- `providers/stuart.ts` — **documented fallback** adapter (food specialist; OAuth2 → `/v2/jobs/pricing`
  + `/v2/jobs`). Not wired into selection.
- `providers/sendcloud.ts` — **stub** for the ambient aggregator (not wired yet).
- `providers/status.ts` — `mapCourierStatus()` maps Uber + Stuart statuses → `order_status`.
- `providers/index.ts` — the **selector**: `COURIER_PROVIDER` (`mock` | `stuart` | `uber`) picks the
  on-demand provider (default = Stuart when its keys are present, else mock). `providersForColdChain()`
  routes by tier: **ambient → aggregator** (Sendcloud stub → mock for now); **chilled / same-day →
  on-demand** (the selected real provider, or mock fallback).

Providers are swapped **without touching checkout/order code** — those only call the seam in `quote.ts`.
Stuart is **sandbox-only**: real bookings are blocked unless `STUART_ALLOW_PRODUCTION=1`.

## Box orchestration (`quote.ts`)
A box can span multiple farms; a courier job is one pickup→one dropoff, so we run **one leg per
distinct producer** (farm → household) and **sum the fees**:
- `quoteBoxCourier(box, pickups, dropoff)` — cheapest viable provider per leg; returns the summed
  quote + per-farm legs, or null if courier isn't viable (→ offer collection). Used at **checkout only**.
- `createBoxCourierJobs(...)` — records one job per farm; used by `placeOrder`.

`matchCourier.ts` is a cheap **estimate** for `/shop` + `/shop/box` (no addresses / network).
`coldChain.ts` (`boxColdChainClass`) is the deterministic viability gate. `constants.ts` holds the
£20 courier minimum + £45 free-delivery thresholds.

## Webhooks
`app/api/webhooks/uber/route.ts` (lead) and `app/api/webhooks/stuart/route.ts` (fallback) share
`lib/fulfilment/webhook.ts` — HMAC-verify the payload, update the matching `courier_jobs` leg, and
recompute the parent order status (slowest leg wins).

## PRODUCTION notes
- Replace the simulation with the real integrations above (aggregator for ambient; on-demand for
  chilled — Uber Direct lead, Stuart fallback), confirmed against pilot-region coverage + rates.
- One-job-per-farm multiplies cost on multi-farm boxes; batching/virtual-hub is deferred (PRD).
- Address PII → restricted RLS (owner + service-role) + DPIA before launch.
- Job creation isn't yet idempotent/compensating — add before launch.
