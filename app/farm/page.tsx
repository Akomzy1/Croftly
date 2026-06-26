import { redirect } from "next/navigation";
import { getFarmData } from "@/lib/farm/queries";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";
import { Card } from "@/components/croftly/card";
import { Stat } from "@/components/croftly/stat";
import { ProductList } from "@/components/farm/product-list";
import { formatPence } from "@/lib/money";
import type { FarmPayout } from "@/lib/farm/queries";
import type { Product } from "@/lib/supabase/types";

// Farmer console — the "supply broadcast" layer (Prompt 4) + incoming orders &
// payouts (Prompt 9). Lightweight, no AI.
// DEVIATION: no prototype exists for the product console; built to Croftly tokens.
export default async function FarmPage() {
  const farm = await getFarmData();
  if (farm.status === "anonymous") redirect("/auth/sign-in");
  if (farm.status === "no_producer") redirect("/shop");

  const preview = farm.status === "unconfigured";
  const products: Product[] = farm.status === "ok" ? farm.products : [];
  const payouts: FarmPayout[] = farm.status === "ok" ? farm.payouts : [];
  const active = products.filter((p) => p.quantity_available > 0).length;
  const gluts = products.filter((p) => p.is_glut).length;
  const earned = payouts.reduce((n, p) => n + p.farmer_pence, 0);

  return (
    <AppShell role="farmer" preview={preview}>
      <div className="grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Your listings</h1>
            <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)" }}>
              List what you have, set your prices, clear surplus. You keep 85%+ of every order — up to 92% on a glut.
            </p>
          </div>
          <Button href="/farm/listings/new" size="lg" style={{ background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" }}>
            Add a product
          </Button>
        </div>

        {/* Simple dashboard */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card padding="md">
            <Stat value={String(active)} label="Active listings" />
          </Card>
          <Card padding="md">
            <Stat value={String(gluts)} label="Glut deals live" />
          </Card>
          <Card padding="md">
            <Stat value={String(payouts.length)} label="Incoming orders" sub={payouts.length > 0 ? `${formatPence(earned)} earned` : "None yet"} />
          </Card>
        </div>

        {payouts.length > 0 && (
          <div className="grid gap-4">
            <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>Recent orders</h2>
            <Card padding="none">
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {payouts.map((p, i) => (
                  <li key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-4) var(--space-6)", borderTop: i === 0 ? "none" : "1px solid var(--color-ink-15)" }}>
                    <div>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>Order #{p.order_id.slice(0, 8)}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>Croftly fee {formatPence(p.platform_pence)}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--color-olive-drab-dark)" }}>{formatPence(p.farmer_pence)}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>your payout</div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        <ProductList products={products} />
      </div>
    </AppShell>
  );
}
