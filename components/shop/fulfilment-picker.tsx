"use client";

import * as React from "react";
import { Card } from "@/components/croftly/card";
import { Button } from "@/components/croftly/button";
import { Icon, type IconName } from "@/components/croftly/icon";
import { Field, Select } from "@/components/croftly/field";
import { OrderStatusStub } from "@/components/shop/order-status-stub";
import { formatPence } from "@/lib/money";
import type { CourierMatch } from "@/lib/fulfilment";
import type { CollectionPointOption } from "@/lib/shop/queries";
import type { FulfilmentType } from "@/lib/supabase/types";

type Method = FulfilmentType;

function OptionCard({
  selected,
  onSelect,
  icon,
  title,
  sub,
  price,
  disabled,
}: {
  selected: boolean;
  onSelect: () => void;
  icon: IconName;
  title: string;
  sub: string;
  price: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onSelect}
      aria-pressed={selected}
      disabled={disabled}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        width: "100%",
        textAlign: "left",
        padding: "1rem",
        cursor: disabled ? "not-allowed" : "pointer",
        font: "inherit",
        opacity: disabled ? 0.55 : 1,
        background: selected ? "var(--color-olive-drab-lightest)" : "var(--color-white)",
        border: "1px solid " + (selected ? "var(--color-olive-drab)" : "var(--color-ink-15)"),
        borderRadius: "var(--radius-input)",
        transition: "border-color var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)",
      }}
    >
      <span style={{ flexShrink: 0, width: "2.25rem", height: "2.25rem", borderRadius: "var(--radius-input)", display: "inline-flex", alignItems: "center", justifyContent: "center", background: selected ? "var(--color-white)" : "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)" }}>
        <Icon name={icon} size={20} stroke={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{title}</span>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-regular)", color: "var(--color-olive-drab-dark)" }}>{price}</span>
        </span>
        <span style={{ display: "block", marginTop: "0.15rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-snug)" }}>{sub}</span>
      </span>
    </button>
  );
}

export function FulfilmentPicker({
  subtotalPence,
  collectionPoints,
  courier,
  coldChainLabel,
  defaultMethod,
}: {
  subtotalPence: number;
  collectionPoints: CollectionPointOption[];
  courier: CourierMatch | null;
  coldChainLabel: string;
  defaultMethod: FulfilmentType;
}) {
  const courierAvailable = courier !== null;
  const [method, setMethod] = React.useState<Method>(defaultMethod === "courier" && courierAvailable ? "courier" : "collection");
  const [pointId, setPointId] = React.useState(collectionPoints[0]?.id ?? "");

  const deliveryPence = method === "courier" && courier ? courier.fee_pence : 0;
  const totalPence = subtotalPence + deliveryPence;
  const canContinue = method === "collection" ? pointId !== "" : courierAvailable;

  return (
    <div className="build-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "var(--space-12)", alignItems: "start" }}>
      {/* choose how to get the box */}
      <div className="grid gap-5">
        <OptionCard
          selected={method === "collection"}
          onSelect={() => setMethod("collection")}
          icon="mapPin"
          title="Collect from a local point"
          sub="Pick it up nearby — fresh, and free."
          price="Free"
        />
        {method === "collection" && (
          <Card padding="md">
            {collectionPoints.length > 0 ? (
              <Field label="Collection point">
                <Select value={pointId} onChange={(e) => setPointId(e.target.value)}>
                  {collectionPoints.map((cp) => (
                    <option key={cp.id} value={cp.id}>
                      {cp.name} — {cp.address}
                    </option>
                  ))}
                </Select>
              </Field>
            ) : (
              <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
                No collection points are live in your area yet — choose courier delivery, or check back soon.
              </p>
            )}
          </Card>
        )}

        <OptionCard
          selected={method === "courier"}
          onSelect={() => setMethod("courier")}
          icon="truck"
          title="Courier to your door"
          sub={
            courier
              ? `${courier.name} · ${courier.eta}`
              : `No courier can carry ${coldChainLabel.toLowerCase()} items to you yet — choose collection.`
          }
          price={courier ? formatPence(courier.fee_pence) : "—"}
          disabled={!courierAvailable}
        />
        {method === "courier" && courier && (
          <Card padding="md">
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
              We match your box to <strong style={{ color: "var(--color-neutral-darkest)" }}>{courier.name}</strong> — the cheapest courier that can carry your {coldChainLabel.toLowerCase()} box. The fee is passed through at cost; Croftly doesn&apos;t mark it up. There&apos;s no delivery for the farm to run.
            </p>
          </Card>
        )}
      </div>

      {/* summary + what happens next */}
      <div style={{ position: "sticky", top: "1.5rem", display: "grid", gap: "var(--space-6)" }}>
        <Card padding="lg" style={{ display: "grid", gap: "var(--space-4)" }}>
          <Row label="Box subtotal" value={formatPence(subtotalPence)} />
          <Row label={method === "courier" ? "Courier (at cost)" : "Collection"} value={deliveryPence === 0 ? "Free" : formatPence(deliveryPence)} />
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-ink-15)" }}>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>Total</span>
            <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>{formatPence(totalPence)}</span>
          </div>
          {/* PRODUCTION: enabled + wired to Stripe test checkout in Prompt 9. */}
          <Button type="button" size="lg" disabled={!canContinue} style={{ width: "100%", justifyContent: "center", ...(canContinue ? {} : { background: "var(--color-neutral-lighter)", borderColor: "var(--color-neutral-lighter)", color: "var(--color-neutral-dark)", cursor: "not-allowed" }) }} iconRight={<Icon name="arrowRight" size={18} />}>
            Continue to payment
          </Button>
          <p style={{ margin: 0, textAlign: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
            Secure card payment (test mode) connects at the next step.
          </p>
        </Card>

        <Card padding="lg">
          <OrderStatusStub fulfilment={method} />
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{value}</span>
    </div>
  );
}
