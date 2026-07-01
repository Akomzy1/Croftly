import type { ColdChainClass } from "@/lib/supabase/types";

// Cheap ESTIMATE courier-match (Prompt 8). DETERMINISTIC, no LLM, no real API.
//
// Used only for a pre-checkout ESTIMATE on /shop and /shop/box (no addresses
// needed, no network call). The full per-farm quote is produced at checkout via
// lib/fulfilment/quote.ts → quoteBoxCourier (also a simulation in the prototype).
//
// The platform ORCHESTRATES logistics; it never owns or employs a fleet
// (CLAUDE.md rule 2). We filter simulated couriers by the box's cold-chain class
// (the most perishable item sets it), then return the cheapest viable one. Naming
// reflects the intended lead providers (Uber Direct on-demand; Stuart specialist).
//
// PRODUCTION: replace this simulation with a multi-carrier aggregator (Sendcloud
// or EasyPost) for ambient goods, and an on-demand API for chilled/same-day —
// Uber Direct as the lead (widest UK coverage), Stuart as the food-specialist
// fallback. Final provider choice is region-dependent and must be confirmed
// against real coverage + rates for the chosen pilot region.

export type CourierMatch = {
  name: string;
  fee_pence: number;
  eta: string;
};

type MockCourier = CourierMatch & { handles: ColdChainClass[] };

// Pricier than free collection, and rising with the cold-chain demands. Lead-first
// within each tier (ambient → aggregator; chilled → Uber Direct; specialist → Stuart).
const MOCK_COURIERS: MockCourier[] = [
  { name: "Sendcloud (aggregator)", handles: ["ambient"], fee_pence: 299, eta: "1–2 days" },
  { name: "Uber Direct (on-demand)", handles: ["ambient", "chilled"], fee_pence: 449, eta: "Same day · on-demand" },
  { name: "Stuart (food specialist)", handles: ["ambient", "chilled", "highly_perishable"], fee_pence: 690, eta: "Same day · temperature-controlled" },
];

/** Cheapest mock courier that can carry the box's cold-chain class, or null if none. */
export function matchCourier(coldChain: ColdChainClass): CourierMatch | null {
  const viable = MOCK_COURIERS.filter((c) => c.handles.includes(coldChain)).sort((a, b) => a.fee_pence - b.fee_pence);
  if (viable.length === 0) return null;
  const { name, fee_pence, eta } = viable[0];
  return { name, fee_pence, eta };
}
