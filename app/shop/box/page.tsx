import { redirect } from "next/navigation";
import { getShopData } from "@/lib/shop/queries";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";
import { BoxReview } from "@/components/shop/box-review";

// /shop/box — box review + the signature money-split (Prompt 7). The right-side
// review the Build Your Box prototype showed; built on the deterministic engine.
export default async function ShopBoxPage() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await getShopData(today);

  if (data.status === "anonymous") redirect("/auth/sign-in");
  if (data.status === "no_household") redirect("/farm");

  if (data.status === "no_profile" || data.status === "unconfigured") {
    const preview = data.status === "unconfigured";
    return (
      <AppShell role="household" preview={preview}>
        <div style={{ maxWidth: "44rem", display: "grid", gap: "var(--space-6)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Your box</h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            Set your food intent and we&apos;ll compose a box from nearby farms — then you can review and
            approve it here.
          </p>
          <div>
            <Button href="/shop/setup" size="lg">Set my food intent</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  const { box, explanation } = data;
  return (
    <AppShell role="household">
      <div className="grid gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Review your box</h1>
            <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral)" }}>
              Swap or remove anything, then approve. See exactly where your money goes.
            </p>
          </div>
          <Button href="/shop/setup" variant="secondary">Edit preferences</Button>
        </div>

        <BoxReview lines={box.lines} alternatives={box.alternatives} explanation={explanation} budgetPence={box.budget_pence} />
      </div>
    </AppShell>
  );
}
