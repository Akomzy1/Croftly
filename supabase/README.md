# supabase/ — schema & migrations

Money is integer **pence** everywhere. RLS is enabled on **every** table.

## Files
- `migrations/0001_init.sql` — enums + tables (areas, collection_points, producers, products,
  households, intent_profiles, orders, order_items, payouts, forward_demand) + indexes.
- `migrations/0002_rls.sql` — Row Level Security policies for every table.
- `../lib/supabase/types.ts` — TypeScript `Database` types mirroring the schema.

## Apply
With the Supabase CLI and a linked project:
```bash
supabase link --project-ref <ref>
supabase db push
supabase gen types typescript --linked > lib/supabase/types.ts   # regenerate types
```
Or paste `0001_init.sql` then `0002_rls.sql` into the Supabase SQL editor, in order.

> No live project is connected yet (`.env` keys are blank), so `lib/supabase/types.ts`
> is hand-authored to match the migrations. Regenerate it once a project exists.

## Ownership & RLS model
- Ownership via `households.user_id = auth.uid()` and `producers.user_id = auth.uid()`.
- **Public read** (discovery/marketing, SSR-crawlable): `areas`, `collection_points`,
  `producers` (farm profiles), **active** `products` (in window + in stock), `forward_demand`.
- **Household-private**: `households`, `intent_profiles`, `orders`, `order_items` — owner only;
  involved producers get read access to the orders/items that include their products.
- **Payouts**: the producer sees their own; the household sees payouts for its own orders.

## Deviations from the Prompt 2 spec (flagged per CLAUDE.md rule 6)
- `// DEVIATION:` added **`producers.user_id`** (not in the prompt's column list) — required to
  satisfy the prompt's own RLS requirement "producers see their own". Without an owner link,
  per-producer RLS is impossible.
- `// DEVIATION:` `producers` is **public-read** (not owner-only) because farm profiles are
  public marketing pages per CLAUDE.md (SSR/crawlable). Writes remain owner-only.
- `// DEVIATION:` added `created_at` to all tables (prompt only specified it on `orders`) — standard, harmless.
- `target_window` typed as `text` (e.g. "2026-08") for prototype simplicity.
  `// PRODUCTION:` consider a `daterange`.
- `// PRODUCTION:` checkout writes orders/items/payouts via a service-role path that bypasses
  RLS; tighten write policies + add audited functions, full RLS hardening, and a DPIA before launch.
