import type { ColdChainClass } from "@/lib/supabase/types";

// The most perishable item sets the whole box's cold-chain class — that's what
// the courier must be able to carry (Prompt 8). Deterministic, no LLM.
const RANK: Record<ColdChainClass, number> = {
  ambient: 0,
  chilled: 1,
  highly_perishable: 2,
};

export const COLD_CHAIN_LABEL: Record<ColdChainClass, string> = {
  ambient: "Ambient",
  chilled: "Chilled",
  highly_perishable: "Highly perishable",
};

export function boxColdChainClass(items: { cold_chain_class: ColdChainClass }[]): ColdChainClass {
  let worst: ColdChainClass = "ambient";
  for (const it of items) {
    if (RANK[it.cold_chain_class] > RANK[worst]) worst = it.cold_chain_class;
  }
  return worst;
}
