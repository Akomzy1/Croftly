import { redirect } from "next/navigation";
import { getShopData } from "@/lib/shop/queries";
import { COLD_CHAIN_LABEL } from "@/lib/fulfilment";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";
import { FulfilmentPicker, type CourierOption } from "@/components/shop/fulfilment-picker";

// /shop/checkout — fulfilment selection: collection (free) or the rate-shopped
// courier quote (one job per farm; simulated in the prototype), with a status stub.
export default async function ShopCheckoutPage() {
  const today = new Date().toISOString().slice(0, 10);
  // quoteCourier: produce the authoritative live courier quote here (not on /shop).
  const data = await getShopData(today, { quoteCourier: true });

  if (data.status === "anonymous") redirect("/auth/sign-in");
  if (data.status === "no_household") redirect("/farm");

  if (data.status === "no_profile" || data.status === "unconfigured") {
    const preview = data.status === "unconfigured";
    return (
      <AppShell role="household" preview={preview}>
        <div style={{ maxWidth: "44rem", display: "grid", gap: "var(--space-6)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Checkout</h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            Set your food intent and approve a box first — then choose collection or delivery here.
          </p>
          <div>
            <Button href="/shop/setup" size="lg">Set my food intent</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const { box, collectionPoints, courierQuote, coldChainClass, profile } = data;

  // Normalise the live quote for the picker (summed per-farm legs).
  const courierOption: CourierOption | null = courierQuote
    ? {
        fee_pence: courierQuote.total_fee_pence,
        label:
          courierQuote.legs.length > 1
            ? `${courierQuote.legs.length} farms · ${courierQuote.provider}`
            : courierQuote.legs[0]?.quote.service ?? courierQuote.provider,
        eta: courierQuote.eta,
        legs: courierQuote.legs.map((l) => ({ producer_name: l.producer_name, fee_pence: l.quote.fee_pence })),
      }
    : null;

  if (box.lines.length === 0) {
    return (
      <AppShell role="household">
        <div style={{ maxWidth: "44rem", display: "grid", gap: "var(--space-6)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Checkout</h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)" }}>
            There&apos;s no box to check out yet. Review this week&apos;s box first.
          </p>
          <div>
            <Button href="/shop/box" size="lg">Review my box</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell role="household">
      <div className="grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>How would you like it?</h1>
            <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral)" }}>
              Collect for free, or have it couriered to your door. Croftly orchestrates the delivery — the farm never runs a van.
            </p>
          </div>
          <Button href="/shop/box" variant="secondary">Back to box</Button>
        </div>

        <FulfilmentPicker
          subtotalPence={box.subtotal_pence}
          collectionPoints={collectionPoints}
          courier={courierOption}
          coldChainLabel={COLD_CHAIN_LABEL[coldChainClass]}
          defaultMethod={profile.fulfilment_pref}
        />
      </div>
    </AppShell>
  );
}
