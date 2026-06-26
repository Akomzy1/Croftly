import type { Product } from "@/lib/supabase/types";

// A product enriched with its producer's name + area, ready for matching.
export type Candidate = Product & {
  producer_name: string;
  producer_area_id: string | null;
};

export type ComposedLine = {
  product_id: string;
  name: string;
  category: string;
  producer_id: string;
  producer_name: string;
  qty: number;
  unit: string;
  unit_pence: number; // effective per-unit price (glut clearing price if glut), never below the floor
  line_pence: number;
  is_glut: boolean;
  is_forward: boolean;
  score: number;
};

export type ComposedBox = {
  lines: ComposedLine[];
  subtotal_pence: number;
  item_count: number;
  glut_count: number;
  budget_pence: number;
  within_budget: boolean;
  // Transparency counters (not money): how many candidates each hard-stop removed.
  excluded_allergen: number;
  excluded_floor: number;
};
