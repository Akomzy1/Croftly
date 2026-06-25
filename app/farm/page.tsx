import { redirect } from "next/navigation";
import { getFarmData } from "@/lib/farm/queries";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";
import { Card } from "@/components/croftly/card";
import { Stat } from "@/components/croftly/stat";
import { ProductList } from "@/components/farm/product-list";
import type { Product } from "@/lib/supabase/types";

// Farmer console — the "supply broadcast" layer (Prompt 4). Lightweight, no AI.
// DEVIATION: no prototype exists for the product console; built to Croftly tokens.
export default async function FarmPage() {
  const farm = await getFarmData();
  if (farm.status === "anonymous") redirect("/auth/sign-in");
  if (farm.status === "no_producer") redirect("/shop");

  const preview = farm.status === "unconfigured";
  const products: Product[] = farm.status === "ok" ? farm.products : [];
  const active = products.filter((p) => p.quantity_available > 0).length;
  const gluts = products.filter((p) => p.is_glut).length;

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
            {/* PRODUCTION: real incoming orders land here once checkout (Prompt 9) is wired. */}
            <Stat value="0" label="Incoming orders" sub="Coming soon" />
          </Card>
        </div>

        <ProductList products={products} />
      </div>
    </AppShell>
  );
}
