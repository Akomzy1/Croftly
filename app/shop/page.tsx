import { redirect } from "next/navigation";
import { getShopData } from "@/lib/shop/queries";
import { AppShell } from "@/components/site/app-shell";
import { Button } from "@/components/croftly/button";
import { ComposedBoxView } from "@/components/shop/composed-box";

// Household home — shows the deterministically composed box for the logged-in
// household (Prompt 6). The money-split + approve/veto flow is Prompt 7.
export default async function ShopPage() {
  const today = new Date().toISOString().slice(0, 10);
  const data = await getShopData(today);

  if (data.status === "anonymous") redirect("/auth/sign-in");
  if (data.status === "no_household") redirect("/farm");

  const preview = data.status === "unconfigured";

  // No saved intent yet (or preview mode): prompt to set it up.
  if (data.status === "no_profile" || preview) {
    return (
      <AppShell role="household" preview={preview}>
        <div style={{ maxWidth: "44rem", display: "grid", gap: "var(--space-6)" }}>
          <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>This week&apos;s box</h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            Tell us what you like and we&apos;ll match it to what nearby farms have this week — fresher, fairer,
            less waste. Set your food intent to get your first box.
          </p>
          <div>
            <Button href="/shop/setup" size="lg">Set my food intent</Button>
          </div>
        </div>
      </AppShell>
    );
  }

  // status === "ok"
  const { box, explanation } = data;
  return (
    <AppShell role="household">
      <div className="grid gap-8" style={{ maxWidth: "44rem" }}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>This week&apos;s box</h1>
            <p style={{ margin: "var(--space-3) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral)" }}>
              Matched to your tastes from farms near you. Nothing&apos;s charged until you approve.
            </p>
          </div>
          <Button href="/shop/setup" variant="secondary">Edit preferences</Button>
        </div>

        <ComposedBoxView box={box} explanation={explanation} />
      </div>
    </AppShell>
  );
}
