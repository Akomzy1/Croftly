import type { ColdChainClass } from "@/lib/supabase/types";

// Mocked courier-match (Prompt 8). DETERMINISTIC, no LLM, no real API.
//
// The platform ORCHESTRATES logistics; it never owns or employs a fleet
// (CLAUDE.md rule 2). We filter mock couriers by the box's cold-chain class
// (the most perishable item sets it), then return the cheapest viable one.
//
// PRODUCTION: replace this mock with a real aggregator — EasyPost / Sendcloud
// for ambient parcels + an on-demand API (Uber Direct / Stuart) for chilled &
// highly-perishable, temperature-controlled runs. The selection stays "cheapest
// viable courier that can carry this cold-chain class".

export type CourierMatch = {
  name: string;
  fee_pence: number;
  eta: string;
};

type MockCourier = CourierMatch & { handles: ColdChainClass[] };

// Pricier than free collection, and rising with the cold-chain demands.
const MOCK_COURIERS: MockCourier[] = [
  { name: "PedalPost (local cycle courier)", handles: ["ambient"], fee_pence: 299, eta: "Same day · 2–4 hrs" },
  { name: "Rural Routes (local van)", handles: ["ambient", "chilled"], fee_pence: 449, eta: "Next day" },
  { name: "ChillRun (refrigerated)", handles: ["ambient", "chilled", "highly_perishable"], fee_pence: 690, eta: "Next day · temperature-controlled" },
];

/** Cheapest mock courier that can carry the box's cold-chain class, or null if none. */
export function matchCourier(coldChain: ColdChainClass): CourierMatch | null {
  const viable = MOCK_COURIERS.filter((c) => c.handles.includes(coldChain)).sort((a, b) => a.fee_pence - b.fee_pence);
  if (viable.length === 0) return null;
  const { name, fee_pence, eta } = viable[0];
  return { name, fee_pence, eta };
}
