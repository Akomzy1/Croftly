// Croftly matching engine — the signature, built for real.
//
// ⛔ CONSTITUTIONAL: ZERO LLM calls in this module (CLAUDE.md rules 3 & 4).
// This file MUST NOT import from @/lib/ai or @anthropic-ai/sdk. Box composition,
// the allergen hard-stop, and the price-floor hard-stop are all DETERMINISTIC.
//
// Pipeline: FILTER → SCORE → COMPOSE. Money in integer pence throughout.

import type { IntentProfile } from "@/lib/supabase/types";
import type { Candidate, ComposedBox, ComposedLine } from "./types";

export type ComposeOptions = {
  /** Household's area; products outside it are excluded. null = don't filter by area. */
  areaId?: string | null;
  /** ISO date (YYYY-MM-DD) for the availability-window check. */
  today: string;
  /** Target number of distinct items in the box. */
  targetItems?: number;
  /** Max items drawn from any one category (variety). */
  maxPerCategory?: number;
};

// ---- small deterministic helpers ----
function toStrArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];
}
const lc = (s: string) => s.toLowerCase();
function haystack(c: Candidate): string {
  return `${lc(c.name)} ${lc(c.category)}`;
}

/**
 * Effective per-unit price in pence. Glut items use the clearing price.
 * HARD RULE (deterministic, like the allergen filter): the offered price is
 * NEVER below the farmer's price_floor_pence. The farmer form already enforces
 * this; we clamp again here as defence in depth so matching can never undercut.
 */
export function effectiveUnitPence(c: Candidate): number {
  const base = c.is_glut && c.glut_clearing_price_pence != null ? c.glut_clearing_price_pence : c.price_pence;
  if (c.price_floor_pence != null && base < c.price_floor_pence) return c.price_floor_pence;
  return base;
}

function isAvailable(c: Candidate, today: string): boolean {
  if (c.quantity_available <= 0) return false;
  if (c.available_from && c.available_from > today) return false;
  if (c.available_to && c.available_to < today) return false;
  return true;
}

function inArea(c: Candidate, areaId: string | null | undefined): boolean {
  if (!areaId) return true;
  return c.producer_area_id === areaId;
}

// Collection handles any cold-chain class; the mocked courier (Prompt 8) can't
// carry the most perishable items in the prototype.
function coldChainAllowed(c: Candidate, fulfilment: IntentProfile["fulfilment_pref"]): boolean {
  if (fulfilment === "courier") return c.cold_chain_class !== "highly_perishable";
  return true;
}

/** ABSOLUTE allergen hard-stop: exclude if a hard allergen is tagged on the product OR appears in its name/category. */
function containsHardAllergen(c: Candidate, allergens: string[]): boolean {
  if (allergens.length === 0) return false;
  const tagged = toStrArray(c.allergens);
  const hay = haystack(c);
  return allergens.some((a) => tagged.includes(a) || hay.includes(a));
}

function isDisliked(c: Candidate, dislikes: string[]): boolean {
  if (dislikes.length === 0) return false;
  const hay = haystack(c);
  return dislikes.some((d) => hay.includes(d));
}

function likeMatches(c: Candidate, likes: string[]): number {
  const hay = haystack(c);
  return likes.reduce((n, l) => (hay.includes(l) ? n + 1 : n), 0);
}

// Freshness proxy: without geo/harvest data, recency of availability stands in
// for "freshest & closest". Items that just came available score highest.
function freshnessScore(c: Candidate, today: string): number {
  if (!c.available_from) return 0.5;
  const days = Math.max(0, (Date.parse(today) - Date.parse(c.available_from)) / 86_400_000);
  return 1 / (1 + days / 7); // ~1 when just listed, decays over weeks
}

type Weights = { cheap: number; fresh: number; like: number; glut: number };
function weightsFor(priority: IntentProfile["priority_preference"]): Weights {
  switch (priority) {
    case "best_value":
      return { cheap: 3, fresh: 0.5, like: 1, glut: 1.5 };
    case "support_specific":
      // No "followed farms" data yet — behave like freshest_closest. // PRODUCTION: boost chosen farms.
      return { cheap: 0.5, fresh: 2, like: 1.5, glut: 1 };
    case "freshest_closest":
    default:
      return { cheap: 0.5, fresh: 3, like: 1.5, glut: 1 };
  }
}

function scoreCandidate(c: Candidate, intent: IntentProfile, likes: string[], today: string): number {
  const w = weightsFor(intent.priority_preference);
  const eff = effectiveUnitPence(c);
  const cheap = 1 / (1 + eff / 100); // higher for cheaper
  const fresh = freshnessScore(c, today);
  const like = likeMatches(c, likes);
  const glut = c.is_glut ? 1 : 0; // PRIORITY BOOST for gluts — clear waste
  return w.cheap * cheap + w.fresh * fresh + w.like * like + w.glut * glut;
}

/**
 * Compose a box for a household. Pure & deterministic.
 * FILTER (incl. absolute allergen + floor) → SCORE (by priority) → COMPOSE (greedy within budget + variety).
 */
export function composeBox(intent: IntentProfile, candidates: Candidate[], opts: ComposeOptions): ComposedBox {
  const { areaId, today } = opts;
  const targetItems = opts.targetItems ?? 10;
  const maxPerCategory = opts.maxPerCategory ?? 2;

  const allergens = toStrArray(intent.hard_allergens);
  const dislikes = toStrArray(intent.dislikes);
  const likes = toStrArray(intent.likes);

  let excludedAllergen = 0;
  let excludedFloor = 0;

  // ---- 1. FILTER ----
  const survivors = candidates.filter((c) => {
    if (!isAvailable(c, today)) return false;
    if (!inArea(c, areaId)) return false;
    if (!coldChainAllowed(c, intent.fulfilment_pref)) return false;
    if (containsHardAllergen(c, allergens)) {
      excludedAllergen++;
      return false; // absolute — never reconsidered
    }
    if (isDisliked(c, dislikes)) return false;
    // Floor sanity: a product priced below its own floor is malformed supply — skip it.
    if (c.price_floor_pence != null && effectiveUnitPence(c) < c.price_floor_pence) {
      excludedFloor++;
      return false;
    }
    return true;
  });

  // "Exact" shoppers only want what they listed; relax only if that empties the box.
  let pool = survivors;
  if (intent.adventurousness === "exact" && likes.length > 0) {
    const liked = survivors.filter((c) => likeMatches(c, likes) > 0);
    if (liked.length > 0) pool = liked;
  }

  // ---- 2. SCORE ----
  const scored = pool
    .map((c) => ({ c, score: scoreCandidate(c, intent, likes, today) }))
    .sort((a, b) => b.score - a.score);

  // ---- 3. COMPOSE (greedy within budget + variety) ----
  const budget = intent.budget_pence;
  const lines: ComposedLine[] = [];
  const perCategory = new Map<string, number>();
  let subtotal = 0;

  const lineOf = (c: Candidate, score: number): ComposedLine => {
    const unit = effectiveUnitPence(c);
    return {
      product_id: c.id,
      name: c.name,
      category: c.category,
      producer_id: c.producer_id,
      producer_name: c.producer_name,
      cold_chain_class: c.cold_chain_class,
      qty: 1,
      unit: c.unit,
      unit_pence: unit,
      line_pence: unit,
      is_glut: c.is_glut,
      is_forward: false, // forward market is Prompt 10
      score,
    };
  };

  for (const { c, score } of scored) {
    if (lines.length >= targetItems) break;
    const used = perCategory.get(c.category) ?? 0;
    if (used >= maxPerCategory) continue;
    const unit = effectiveUnitPence(c);
    if (subtotal + unit > budget) continue; // hard spend cap — never exceed budget

    lines.push(lineOf(c, score));
    perCategory.set(c.category, used + 1);
    subtotal += unit;
  }

  // Ranked, allergen-safe candidates not selected — offered as swaps in /shop/box.
  const selected = new Set(lines.map((l) => l.product_id));
  const alternatives = scored
    .filter((s) => !selected.has(s.c.id))
    .slice(0, 24)
    .map(({ c, score }) => lineOf(c, score));

  return {
    lines,
    alternatives,
    subtotal_pence: subtotal,
    item_count: lines.length,
    glut_count: lines.filter((l) => l.is_glut).length,
    budget_pence: budget,
    within_budget: subtotal <= budget,
    excluded_allergen: excludedAllergen,
    excluded_floor: excludedFloor,
  };
}
