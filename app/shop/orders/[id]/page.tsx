import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppShell } from "@/components/site/app-shell";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Icon } from "@/components/croftly/icon";
import { MoneySplit, type MoneySegment } from "@/components/croftly/money-split";
import { OrderStatusStub } from "@/components/shop/order-status-stub";
import { formatPence } from "@/lib/money";

type OrderItemRow = {
  qty: number;
  line_price_pence: number;
  is_glut: boolean;
  products: { name: string | null } | null;
  producers: { name: string | null } | null;
};

// Order confirmation (Prompt 9): shows the money-split (farmers / Croftly /
// courier) and the order journey. Payouts are SIMULATED Connect — recorded & shown.
export default async function OrderConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  if (!supabase) redirect("/shop");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-in");

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, fulfilment_type, delivery_fee_pence, collection_point_id")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const { data: itemsData } = await supabase
    .from("order_items")
    .select("qty, line_price_pence, is_glut, products(name), producers(name)")
    .eq("order_id", id);
  const items = (itemsData ?? []) as unknown as OrderItemRow[];

  const { data: payouts } = await supabase
    .from("payouts")
    .select("farmer_pence, platform_pence")
    .eq("order_id", id);

  const farmerPence = (payouts ?? []).reduce((n, p) => n + p.farmer_pence, 0);
  const platformPence = (payouts ?? []).reduce((n, p) => n + p.platform_pence, 0);
  const courierPence = order.delivery_fee_pence;
  const subtotal = farmerPence + platformPence;
  const total = subtotal + courierPence;

  const segments: MoneySegment[] = [
    { label: "Farmers keep", amount: farmerPence / 100, color: "var(--color-olive-drab)" },
    { label: "Croftly", amount: platformPence / 100, color: "var(--color-tulip-tree)" },
  ];
  if (courierPence > 0) segments.push({ label: "Courier (at cost)", amount: courierPence / 100, color: "var(--color-potters-clay-light)" });

  return (
    <AppShell role="household">
      <div className="grid gap-8" style={{ maxWidth: "44rem" }}>
        <div style={{ display: "grid", gap: "var(--space-3)" }}>
          <span style={{ width: "3.25rem", height: "3.25rem", borderRadius: "999px", background: "var(--color-olive-drab-lightest)", color: "var(--color-olive-drab-dark)", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="check" size={28} stroke={2.4} />
          </span>
          <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Order confirmed</h1>
          <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            Thanks — your box is on its way to the farms. Here&apos;s exactly where your{" "}
            <strong style={{ color: "var(--color-neutral-darkest)" }}>{formatPence(total)}</strong> goes.
          </p>
        </div>

        {/* signature money-split */}
        <Card padding="lg">
          <h2 style={{ margin: "0 0 var(--space-5)", fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h6)", color: "var(--color-neutral-darkest)" }}>Where your money goes</h2>
          <MoneySplit total={subtotal / 100} segments={segments} />
          <p style={{ margin: "var(--space-5) 0 0", paddingTop: "var(--space-4)", borderTop: "1px solid var(--color-ink-15)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            We&apos;ve recorded the split and the farmers&apos; payouts. {/* PRODUCTION: Stripe Connect transfers run here. */}
            Real multi-party transfers run via Stripe Connect in production; this prototype records the split in test mode.
          </p>
        </Card>

        {/* items */}
        <Card padding="none">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {items.map((it, i) => (
              <li key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)", padding: "var(--space-4) var(--space-6)", borderTop: i === 0 ? "none" : "1px solid var(--color-ink-15)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{it.products?.name ?? "Item"}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>· {it.producers?.name ?? "A local farm"}</span>
                  {it.is_glut && <Badge variant="solid" tone="rescued" size="sm">Rescued</Badge>}
                </span>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{formatPence(it.line_price_pence)}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card padding="lg">
          <OrderStatusStub fulfilment={order.fulfilment_type} />
        </Card>
      </div>
    </AppShell>
  );
}
