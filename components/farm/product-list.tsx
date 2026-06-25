import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Button } from "@/components/croftly/button";
import { formatPence } from "@/lib/money";
import { COLD_CHAIN_OPTIONS } from "@/lib/products/constants";
import { deleteProduct } from "@/lib/farm/actions";
import type { Product } from "@/lib/supabase/types";

function coldChainLabel(value: Product["cold_chain_class"]) {
  return COLD_CHAIN_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

export function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <Card padding="lg" style={{ textAlign: "center" }}>
        <p style={{ margin: "0 0 var(--space-5)", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)" }}>
          No listings yet. Add what you have this week — it takes a minute.
        </p>
        <Button href="/farm/listings/new" style={{ background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" }}>
          Add your first product
        </Button>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {products.map((p) => (
        <Card key={p.id} padding="md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>
                  {p.name}
                </h3>
                {p.is_glut && <Badge variant="solid" tone="rescued">Glut deal</Badge>}
                {p.quantity_available === 0 && <Badge variant="solid" tone="earth">Out of stock</Badge>}
              </div>
              <p style={{ margin: "0.35rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
                {p.category} · {coldChainLabel(p.cold_chain_class)} · {formatPence(p.price_pence)} {p.unit} · {p.quantity_available} available
                {p.is_glut && p.glut_clearing_price_pence != null && (
                  <> · clearing at {formatPence(p.glut_clearing_price_pence)}</>
                )}
                {p.price_floor_pence != null && <> · floor {formatPence(p.price_floor_pence)}</>}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button href={`/farm/listings/${p.id}/edit`} size="sm" variant="secondary">
                Edit
              </Button>
              <form action={deleteProduct}>
                <input type="hidden" name="id" value={p.id} />
                <button
                  type="submit"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-small)",
                    color: "var(--color-neutral-dark)",
                    background: "transparent",
                    border: "1px solid var(--color-ink-15)",
                    borderRadius: "var(--radius-button)",
                    padding: "0.5rem 0.875rem",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </form>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
