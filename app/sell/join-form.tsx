"use client";

import * as React from "react";
import { Card } from "@/components/croftly/card";
import { Button } from "@/components/croftly/button";
import { Icon } from "@/components/croftly/icon";
import { Input, Textarea, Checkbox } from "@/components/croftly/ds-form";

// "Join as a farm" form — reproduced verbatim from the Sell page helpers.
// PRODUCTION: wire to a real applications table / Resend notification.

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "grid", gap: "0.5rem" }}>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", color: "var(--color-neutral-darker)" }}>
        {label}
        {hint && <span style={{ fontWeight: "var(--weight-regular)", color: "var(--color-neutral)" }}> · {hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function JoinForm() {
  const [sent, setSent] = React.useState(false);
  return (
    <Card padding="lg" style={{ background: "var(--color-white)", display: "grid", gap: "var(--space-6)" }}>
      {sent ? (
        <div style={{ display: "grid", gap: "var(--space-4)", placeItems: "start", paddingBlock: "var(--space-6)" }}>
          <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "var(--radius-card)", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={28} stroke={2.4} />
          </span>
          <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>
            Thanks — we&apos;ll be in touch
          </h3>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)", maxWidth: "44ch" }}>
            A real person from the Croftly team reads every application. We&apos;ll email within two
            working days to set up your listing — no automated rejection, no chasing.
          </p>
          <Button variant="secondary" onClick={() => setSent(false)}>Send another</Button>
        </div>
      ) : (
        <>
          <div>
            <p style={{ margin: "0 0 0.15rem", fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", letterSpacing: "0.02em", textTransform: "uppercase", color: "var(--color-neutral)" }}>
              Free to apply · 2 minutes
            </p>
            <h3 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>
              Join as a farm
            </h3>
          </div>

          <Field label="Farm name">
            <Input placeholder="e.g. Hartley's Field" />
          </Field>
          <Field label="Where you farm" hint="town or postcode">
            <Input icon={<Icon name="mapPin" size={18} stroke={2} />} placeholder="e.g. Ludlow, Shropshire" />
          </Field>
          <Field label="What you grow or rear">
            <Textarea rows={3} placeholder="e.g. Seasonal veg, salad leaves, free-range eggs — plus a polytunnel of tomatoes in summer." />
          </Field>
          <Field label="How we reach you" hint="email or phone">
            <Input placeholder="you@yourfarm.co.uk" />
          </Field>

          <Checkbox label="I'd like a Croftly grower to call me to walk through it." defaultChecked />

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexWrap: "wrap", paddingTop: "var(--space-1)" }}>
            <Button onClick={() => setSent(true)} iconRight={<Icon name="arrowRight" size={18} />}>Join as a farm</Button>
            <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
              No fee, no lock-in. You set your prices.
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
