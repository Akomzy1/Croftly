import type { CourierProvider } from "./types";
import { mockProvider } from "./mock";

export * from "./types";
export { mapStuartStatus } from "./stuart";

// Deterministic provider registry (CLAUDE.md rule 4 — no LLM in courier selection).
//
// PROTOTYPE: the SIMULATED (mock) provider is the active selection — NO real API
// calls are made. The real adapters (`stuart.ts`, `sendcloud.ts`) remain in the
// tree as DOCUMENTED FALLBACKS, wired to the same interface but intentionally not
// selected here.
//
// PRODUCTION: enable the real integrations — a multi-carrier aggregator (Sendcloud
// or EasyPost) for ambient goods, and an on-demand API for chilled/same-day with
// Uber Direct as the lead (widest UK coverage) and Stuart as the food-specialist
// fallback. Final provider choice is region-dependent and must be confirmed against
// real coverage + rates for the chosen pilot region.
export function enabledProviders(): CourierProvider[] {
  return [mockProvider];
}
