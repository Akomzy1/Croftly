# Croftly — demo guide

End-to-end scripted demo of the two-sided marketplace.

## Prerequisites

1. A Supabase project (test). Apply the migrations in order:
   `supabase/migrations/0001_init.sql` → `0002_rls.sql` → `0003_auth_provisioning.sql`
   → `0004_product_allergens.sql` (via `supabase db push` or the SQL editor).
2. Fill `.env.local` from `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY` (test) — optional; checkout simulates success without it
   - `ANTHROPIC_API_KEY` — optional; intent parse + box explanation degrade gracefully without it
3. Seed the demo data:
   ```bash
   npm run seed
   ```
4. Run the app:
   ```bash
   NODE_OPTIONS=--use-system-ca npm run dev   # the system-CA flag is only needed on this machine
   ```

> Without Supabase configured, every product page renders in **preview mode** (no
> accounts/data) so you can still see the UI — but the live demo loop needs the steps above.

## Demo logins (password: `croftly-demo-1`)

| Email | Role | Profile |
|---|---|---|
| `farmer@croftly.test` | Farmer | Owns **Hartley's Field** (incl. a courgette **glut**) |
| `family@croftly.test` | Household | "Surprise me" family of 4, **nut allergy** |
| `exact@croftly.test` | Household | "Exact list", best-value, single person |

## Scripted path (the full loop)

1. **Farmer lists produce + a glut.** Sign in as `farmer@croftly.test` → `/farm`.
   See Hartley's listings incl. **Courgettes (glut)** clearing at £1.20. (Add/edit a product
   to show the supply-broadcast form, incl. the price-floor reassurance.)
2. **Household sets intent.** Sign in as `family@croftly.test` → `/shop/setup`. The intent is
   pre-seeded (surprise me, nut allergy). Try the **"Describe it in your own words"** box to see
   Sonnet pre-fill the form (if `ANTHROPIC_API_KEY` is set); confirm the fields → **Match my box**.
3. **Matching composes a box.** `/shop` shows the deterministically composed box — note the
   **courgette/Bramley glut** pulled in (priority boost, "Rescued · less waste") and that the
   **Walnut & honey loaf** and **Basil pesto are never present** (nut allergen hard-stop).
4. **Money-split shown.** `/shop/box` → the signature **MoneySplit** ("Where your money goes",
   farmers keep ~85%+; 8% on the glut). Swap/remove items; large items need explicit approval.
5. **Choose fulfilment.** **Approve & checkout** → `/shop/checkout`. Pick **Collection** (free,
   Cowley Road Hub / Summertown Pantry) or the **mocked courier** (cheapest viable for the box's
   cold-chain class). See the live order summary + the "what happens next" status stub.
6. **Test checkout.** **Pay & place order (test)** — creates the order, order_items (with the
   per-line commission split) and payouts (simulated Connect). Lands on `/shop/orders/[id]` with
   the money-split confirmation.
7. **Farmer sees order + payout.** Back as `farmer@croftly.test` → `/farm`: **Incoming orders**
   now shows the order and **your payout** (farmer keeps; Croftly fee).
8. **Forward-demand view.** `farmer@croftly.test` → `/farm/forward`: "N households want X in
   ~6 weeks" signals (10% forward tier) + how many households each **glut** could reach (8% tier).

Try `exact@croftly.test` too: an **exact-list, best-value** box — fewer, cheaper items matched
strictly to what they listed (tomatoes, carrots, salad), couriered.

## Notes
- All money is integer pence; commission is 15% standard / 10% forward / 8% glut.
- The matching engine (`/lib/matching`) is deterministic — **no LLM**. The LLM (Sonnet) only
  parses free-text intent and writes the cosmetic box explanation (`/lib/ai`).
- Allergens are a deterministic hard-stop enforced outside the LLM path.
