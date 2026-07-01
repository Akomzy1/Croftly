import type { ColdChainClass } from "@/lib/supabase/types";
import type { CourierProvider, CourierQuote, CourierJob, FulfilmentLeg } from "./types";

// SIMULATED courier match (MOCK — no real API calls). The naming reflects the
// intended production provider strategy so the demo shows the right leads:
//   • ambient / hardy goods → a multi-carrier AGGREGATOR (Sendcloud is the lead —
//     European, deeper native UK carrier coverage; EasyPost if going international).
//   • chilled / same-day → an ON-DEMAND API. Uber Direct is the LEAD (widest UK
//     coverage, ~90% of population). Stuart is the food-specialist FALLBACK — better
//     for fresh/chilled but denser in cities, thinner in rural areas.
//   • highly perishable → specialist (Stuart) or collection.
// The cold-chain routing (which provider can carry which class) is UNCHANGED — only
// the provider naming/ordering reflects the corrected strategy.
//
// PRODUCTION: replace this simulation with the real integrations above — a
// multi-carrier aggregator (Sendcloud or EasyPost) for ambient goods, and an
// on-demand API for chilled/same-day (Uber Direct as the lead, widest UK coverage;
// Stuart as the food-specialist fallback). Final provider choice is region-dependent
// and must be confirmed against real coverage + rates for the chosen pilot region.

type MockCourier = { provider: string; service: string; handles: ColdChainClass[]; fee_pence: number; eta: string };

// Ordered lead-first within each capability tier (Uber Direct ahead of Stuart).
const COURIERS: MockCourier[] = [
  { provider: "Sendcloud", service: "Sendcloud (aggregator)", handles: ["ambient"], fee_pence: 299, eta: "1–2 days" },
  { provider: "Uber Direct", service: "Uber Direct (on-demand)", handles: ["ambient", "chilled"], fee_pence: 449, eta: "Same day · on-demand" },
  { provider: "Stuart", service: "Stuart (food specialist)", handles: ["ambient", "chilled", "highly_perishable"], fee_pence: 690, eta: "Same day · temperature-controlled" },
];

function cheapest(coldChain: ColdChainClass): MockCourier | null {
  const viable = COURIERS.filter((c) => c.handles.includes(coldChain)).sort((a, b) => a.fee_pence - b.fee_pence);
  return viable[0] ?? null;
}

export const mockProvider: CourierProvider = {
  name: "mock",
  canHandle(coldChain) {
    return COURIERS.some((c) => c.handles.includes(coldChain));
  },
  async quote(leg: FulfilmentLeg): Promise<CourierQuote | null> {
    const c = cheapest(leg.coldChain);
    return c ? { provider: c.provider, service: c.service, fee_pence: c.fee_pence, eta: c.eta } : null;
  },
  async createJob(leg: FulfilmentLeg): Promise<CourierJob> {
    const c = cheapest(leg.coldChain);
    if (!c) throw new Error("mock: no viable courier for cold-chain class " + leg.coldChain);
    const id = "mock_" + (globalThis.crypto?.randomUUID?.() ?? String(Date.now()));
    return { provider: c.provider, providerJobId: id, trackingUrl: null, status: "scheduled", fee_pence: c.fee_pence };
  },
};
