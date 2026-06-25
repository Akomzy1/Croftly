"use client";

import * as React from "react";
import { useActionState } from "react";
import { Button } from "@/components/croftly/button";
import { Checkbox } from "@/components/croftly/ds-form";
import { Field, Input, Select } from "@/components/croftly/field";
import { saveProduct, type ProductFormState } from "@/lib/farm/actions";
import { PRODUCT_CATEGORIES, COLD_CHAIN_OPTIONS, UNIT_SUGGESTIONS } from "@/lib/products/constants";
import { penceToPoundsInput } from "@/lib/money";
import type { Product } from "@/lib/supabase/types";

// DEVIATION: no prototype exists for the farmer console; built to Croftly tokens
// + DS components, farmer-friendly copy (fair pay & less waste, not tech).
// Products inherit the farm's area (the schema ties area to the producer), so
// there's no per-product area field here.
export function ProductForm({ product, areaName }: { product?: Product; areaName?: string | null }) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(saveProduct, {});
  const [isGlut, setIsGlut] = React.useState(product?.is_glut ?? false);
  const [coldChain, setColdChain] = React.useState(product?.cold_chain_class ?? "");

  const coldHint = COLD_CHAIN_OPTIONS.find((o) => o.value === coldChain)?.hint;

  return (
    <form action={formAction} className="grid gap-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <Field label="Product name">
        <Input name="name" defaultValue={product?.name ?? ""} placeholder="e.g. Rainbow chard" required />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Category">
          <Select name="category" defaultValue={product?.category ?? ""} required>
            <option value="" disabled>
              Select a category
            </option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="How it's kept" hint={coldHint}>
          <Select
            name="cold_chain_class"
            defaultValue={product?.cold_chain_class ?? ""}
            onChange={(e) => setColdChain(e.target.value)}
            required
          >
            <option value="" disabled>
              Select cold-chain
            </option>
            {COLD_CHAIN_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Price (£)">
          <Input name="price" type="number" min="0" step="0.01" defaultValue={penceToPoundsInput(product?.price_pence)} placeholder="3.50" required />
        </Field>
        <Field label="Unit — how you sell it">
          <Input name="unit" list="unit-suggestions" defaultValue={product?.unit ?? ""} placeholder="e.g. per bunch" required />
          <datalist id="unit-suggestions">
            {UNIT_SUGGESTIONS.map((u) => (
              <option key={u} value={u} />
            ))}
          </datalist>
        </Field>
      </div>

      <Field
        label="Lowest you'll accept (£) — optional"
        hint="Your price floor. Even when we surface best-value matches to households, your produce is never sold below this. No race to the bottom."
      >
        <Input name="price_floor" type="number" min="0" step="0.01" defaultValue={penceToPoundsInput(product?.price_floor_pence)} placeholder="e.g. 2.80" />
      </Field>

      <Field label="Quantity available">
        <Input name="quantity" type="number" min="0" step="1" defaultValue={product?.quantity_available ?? 0} required />
      </Field>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Variable weight — min (kg, optional)">
          <Input name="variable_weight_min" type="number" min="0" step="0.01" defaultValue={product?.variable_weight_min ?? ""} placeholder="e.g. 0.4" />
        </Field>
        <Field label="Variable weight — max (kg, optional)">
          <Input name="variable_weight_max" type="number" min="0" step="0.01" defaultValue={product?.variable_weight_max ?? ""} placeholder="e.g. 0.6" />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Available from (optional)">
          <Input name="available_from" type="date" defaultValue={product?.available_from ?? ""} />
        </Field>
        <Field label="Available until (optional)">
          <Input name="available_to" type="date" defaultValue={product?.available_to ?? ""} />
        </Field>
      </div>

      {/* Glut / surplus */}
      <div
        className="grid gap-4"
        style={{ padding: "var(--space-5)", borderRadius: "var(--radius-card)", border: "1px solid var(--color-ink-15)", background: "var(--color-tulip-tree-lightest)" }}
      >
        <Checkbox
          name="is_glut"
          checked={isGlut}
          onChange={(e) => setIsGlut(e.target.checked)}
          label="This is a glut / surplus deal — produce I want to move before it's wasted"
        />
        {isGlut && (
          <Field label="Clearing price (£)" hint="Lower than your normal price, to shift surplus fast — but never below your floor.">
            <Input name="glut_clearing_price" type="number" min="0" step="0.01" defaultValue={penceToPoundsInput(product?.glut_clearing_price_pence)} placeholder="e.g. 2.00" />
          </Field>
        )}
      </div>

      {areaName && (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          Listed in your area: <strong style={{ color: "var(--color-neutral-darker)" }}>{areaName}</strong>
        </p>
      )}

      {state.error && (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)", background: "var(--color-tulip-tree-lighter)", border: "1px solid var(--color-tulip-tree-light)", borderRadius: "var(--radius-input)", padding: "0.625rem 0.75rem" }}>
          {state.error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" disabled={pending} style={{ background: "var(--color-potters-clay)", borderColor: "var(--color-potters-clay)" }}>
          {pending ? "Saving…" : product?.id ? "Save changes" : "List this product"}
        </Button>
        <Button href="/farm" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}
