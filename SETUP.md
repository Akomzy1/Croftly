# Croftly — running the end-to-end demo

Two ways to stand up the backend. Either gives the full loop (auth → matching →
money-split → fulfilment → checkout → payouts → forward demand). **Stripe is
optional** — without a key, checkout simulates a successful test charge.

> **This machine:** prefix `npm run dev` / `npm run build` with
> `NODE_OPTIONS=--use-system-ca` (there's a corporate root CA; otherwise npm/Next
> TLS fails). Not needed on a normal machine.

---

## Option A — Cloud Supabase (recommended for a real "live" project)

1. **Create a project** at https://supabase.com (free tier). Note from
   **Project Settings → API**: the Project URL, the `anon` public key, and the
   `service_role` secret key.
2. **Create `.env.local`** (copy `.env.example`) and fill:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key>
   # optional — genuine Stripe test charge (else simulated):
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   # optional — enables the Sonnet intent-parse + box explanation:
   ANTHROPIC_API_KEY=sk-ant-...
   ```
3. **Apply the schema** (migrations in `supabase/migrations`, in order):
   ```bash
   npx --yes supabase@latest login          # one-time
   npx --yes supabase@latest link --project-ref <ref>
   npm run db:push                            # applies 0001 → 0004
   ```
   *(Or paste `0001_init.sql`, `0002_rls.sql`, `0003_auth_provisioning.sql`,
   `0004_product_allergens.sql` into the Supabase SQL editor, in that order.)*
4. **Seed + run:**
   ```bash
   npm run seed
   NODE_OPTIONS=--use-system-ca npm run dev
   ```

---

## Option B — Local Supabase (no account; needs Docker)

1. **Start Docker Desktop** (the daemon must be running).
2. **Start the stack** (first run pulls images, a few minutes):
   ```bash
   npm run db:start     # prints API URL + anon key + service_role key + Studio URL
   npm run db:reset     # applies all migrations (0001 → 0004)
   ```
3. **Create `.env.local`** with the values `db:start` printed:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key from db:start>
   SUPABASE_SERVICE_ROLE_KEY=<service_role key from db:start>
   ```
   (Stripe/Anthropic keys optional, as above.)
4. **Seed + run:**
   ```bash
   npm run seed
   NODE_OPTIONS=--use-system-ca npm run dev
   ```
   Studio (DB browser) runs at http://127.0.0.1:54323. Stop with `npm run db:stop`.

---

## After it's up

Open http://localhost:3000 and follow **DEMO.md** for the scripted path. Demo
logins (password `croftly-demo-1`):

- `farmer@croftly.test` → `/farm` (Hartley's Field, has a glut)
- `family@croftly.test` → `/shop` (surprise me, **nut allergy**)
- `exact@croftly.test` → `/shop` (exact list, best value)

Re-running `npm run seed` is safe (idempotent). Without any keys the app still
runs in **preview mode** (no accounts/data) so you can browse the UI.
