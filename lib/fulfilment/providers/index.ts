import type { ColdChainClass } from "@/lib/supabase/types";
import type { CourierProvider } from "./types";
import { getUber } from "./uber";
import { getStuart } from "./stuart";
import { getSendcloud } from "./sendcloud";
import { mockProvider } from "./mock";

export * from "./types";
export { mapCourierStatus } from "./status";

// Deterministic provider registry (CLAUDE.md rule 4 — no LLM in courier selection).
// Providers are swapped WITHOUT touching checkout/order code (they only ever call
// the seam in quote.ts). Selection is by an env flag + cold-chain tier.

export type ProviderKind = "mock" | "stuart" | "uber";

// The ON-DEMAND layer (chilled / same-day). Selected by COURIER_PROVIDER; default is
// Stuart when its sandbox keys are present, else the mock. Each real adapter returns
// null when unconfigured, so we always fall back to the mock (dev never breaks).
//
// PRODUCTION: Uber Direct is the intended LEAD (wider UK coverage) once its account
// is approved; Stuart is the food-specialist fallback. Set COURIER_PROVIDER=uber to
// make Uber lead once creds exist.
function onDemandProvider(): CourierProvider {
  const flag = process.env.COURIER_PROVIDER as ProviderKind | undefined;
  const kind: ProviderKind = flag ?? (getStuart() ? "stuart" : "mock");
  switch (kind) {
    case "stuart":
      return getStuart() ?? mockProvider;
    case "uber":
      return getUber() ?? mockProvider;
    default:
      return mockProvider;
  }
}

// The AMBIENT / hardy-goods layer routes to a multi-carrier AGGREGATOR.
// PRODUCTION: Sendcloud (lead, deeper UK carrier coverage) or EasyPost (international).
// Still a stub → falls back to the mock aggregator entry for now.
function aggregatorProvider(): CourierProvider {
  return getSendcloud() ?? mockProvider;
}

// Cold-chain routing (unchanged): ambient → aggregator; chilled / highly-perishable
// → on-demand. Returned as a list so quote.ts can rate-shop if we add providers.
export function providersForColdChain(coldChain: ColdChainClass): CourierProvider[] {
  return coldChain === "ambient" ? [aggregatorProvider()] : [onDemandProvider()];
}

// Back-compat: the on-demand provider set (used where cold-chain isn't branched).
export function enabledProviders(): CourierProvider[] {
  return [onDemandProvider()];
}
