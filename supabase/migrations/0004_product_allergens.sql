-- Croftly — product allergen tags (Prompt 6)
-- The matching engine excludes any product whose allergens intersect a
-- household's hard_allergens. This is a DETERMINISTIC hard-stop enforced outside
-- the LLM path (CLAUDE.md rule 3). Farmers tag what a product contains.
alter table products
  add column allergens jsonb not null default '[]'::jsonb;
