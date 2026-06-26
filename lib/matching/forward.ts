import { toStrArray } from "./util";

// FORWARD-DEMAND aggregation (Prompt 10). Deterministic, NO LLM.
// Aggregates households' stated likes across an area into a "plant against this"
// signal: how many households want a thing, and a rough implied quantity, for a
// future window. Items committed forward carry the 10% commission tier.

export type ForwardProfileInput = {
  likes: unknown; // jsonb string[]
  household_size: number;
};

export type ForwardSignal = {
  term: string;
  household_count: number;
  implied_qty: number; // rough units = sum of household sizes wanting it
  window: string;
};

export function aggregateForwardDemand(profiles: ForwardProfileInput[], window: string): ForwardSignal[] {
  const map = new Map<string, { count: number; qty: number }>();
  for (const p of profiles) {
    const size = Math.max(1, Math.round(p.household_size || 1));
    const seen = new Set<string>();
    for (const like of toStrArray(p.likes)) {
      if (seen.has(like)) continue; // count each household once per term
      seen.add(like);
      const cur = map.get(like) ?? { count: 0, qty: 0 };
      cur.count += 1;
      cur.qty += size;
      map.set(like, cur);
    }
  }
  return Array.from(map.entries())
    .map(([term, v]) => ({ term, household_count: v.count, implied_qty: v.qty, window }))
    .sort((a, b) => b.household_count - a.household_count || b.implied_qty - a.implied_qty);
}
