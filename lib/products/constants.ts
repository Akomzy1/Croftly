import type { ColdChainClass } from "@/lib/supabase/types";

// Shared, farmer-friendly option lists for product listings.

export const PRODUCT_CATEGORIES = [
  "Vegetables",
  "Fruit",
  "Salad & leaves",
  "Herbs",
  "Eggs & dairy",
  "Meat & poultry",
  "Bakery",
  "Pantry & preserves",
  "Other",
] as const;

export const COLD_CHAIN_OPTIONS: { value: ColdChainClass; label: string; hint: string }[] = [
  { value: "ambient", label: "Ambient", hint: "Keeps at room temperature (e.g. potatoes, apples, preserves)." },
  { value: "chilled", label: "Chilled", hint: "Needs the fridge (e.g. eggs, dairy, cut salad)." },
  { value: "highly_perishable", label: "Highly perishable", hint: "Eat within a day or two (e.g. soft fruit, fresh fish)." },
];

// Common selling units (free text is also allowed via "Other").
export const UNIT_SUGGESTIONS = [
  "per item",
  "per bunch",
  "per kg",
  "per 500g",
  "per dozen",
  "per punnet",
  "per bag",
  "per box",
] as const;
