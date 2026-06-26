import { toStrArray } from "./util";
import type { Candidate } from "./types";
import type { IntentProfile } from "@/lib/supabase/types";

// GLUT clearing — supply-first matching (Prompt 10). Deterministic, NO LLM.
// Given one glut product, find households whose profiles TOLERATE it so it can be
// offered into their next box at the clearing price (8% tier). The allergen
// exclusion is absolute; the household still vetoes within the box-review window.

export type GlutCandidate = Pick<
  Candidate,
  "name" | "category" | "allergens" | "is_glut" | "price_pence" | "price_floor_pence" | "glut_clearing_price_pence"
>;

type ToleranceProfile = Pick<
  IntentProfile,
  "hard_allergens" | "dislikes" | "likes" | "adventurousness" | "budget_pence"
>;

/** Does this household tolerate this glut item being offered into their box? */
export function householdToleratesGlut(product: GlutCandidate, profile: ToleranceProfile): boolean {
  const hay = `${product.name.toLowerCase()} ${product.category.toLowerCase()}`;

  // ABSOLUTE allergen hard-stop (tag or name/category match).
  const allergens = toStrArray(profile.hard_allergens);
  const tagged = toStrArray(product.allergens);
  if (allergens.some((a) => tagged.includes(a) || hay.includes(a))) return false;

  // Not in their dislikes.
  if (toStrArray(profile.dislikes).some((d) => hay.includes(d))) return false;

  // Adventurousness: "exact" shoppers only take what they listed.
  if (profile.adventurousness === "exact") {
    const likes = toStrArray(profile.likes);
    if (!likes.some((l) => hay.includes(l))) return false;
  }

  // Spend cap: the clearing price must fit within their weekly budget. Never
  // below the farmer's floor (deterministic, like elsewhere in the engine).
  // (Variety budget + the veto window are honoured at box-compose / review time.)
  const base = product.is_glut && product.glut_clearing_price_pence != null ? product.glut_clearing_price_pence : product.price_pence;
  const price = product.price_floor_pence != null && base < product.price_floor_pence ? product.price_floor_pence : base;
  if (price > profile.budget_pence) return false;

  return true;
}

/** Count / list the households a glut item could be offered to. */
export function matchGlutToHouseholds<T extends ToleranceProfile>(product: GlutCandidate, profiles: T[]): T[] {
  return profiles.filter((p) => householdToleratesGlut(product, p));
}
