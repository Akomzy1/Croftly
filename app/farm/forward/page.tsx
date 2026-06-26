import { redirect } from "next/navigation";
import { getForwardData } from "@/lib/farm/forward";
import { AppShell } from "@/components/site/app-shell";
import { Card } from "@/components/croftly/card";
import { Badge } from "@/components/croftly/badge";
import { Icon } from "@/components/croftly/icon";
import { formatPence } from "@/lib/money";

// /farm/forward — forward-demand signals + glut reach (Prompt 10). No prototype;
// built to Croftly tokens (DEVIATION). Forward commitments carry the 10% tier;
// gluts clear at 8%.
export default async function FarmForwardPage() {
  const data = await getForwardData();
  if (data.status === "anonymous") redirect("/auth/sign-in");
  if (data.status === "no_producer") redirect("/shop");

  const preview = data.status === "unconfigured";
  const signals = data.status === "ok" ? data.signals : [];
  const glutReach = data.status === "ok" ? data.glutReach : [];
  const window = data.status === "ok" ? data.window : "in about 6 weeks";
  const live = data.status === "ok" ? data.live : false;

  return (
    <AppShell role="farmer" preview={preview}>
      <div className="grid gap-8">
        <div>
          <h1 style={{ margin: 0, fontSize: "var(--text-h3)", color: "var(--color-neutral-darkest)" }}>Forward demand</h1>
          <p style={{ margin: "var(--space-3) 0 0", maxWidth: "60ch", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
            What households near you want {window}. Plant against real demand instead of guessing — forward
            commitments carry our lowest standard fee, <strong style={{ color: "var(--color-neutral-darkest)" }}>10% (you keep 90%)</strong>.
          </p>
        </div>

        {(!live || signals.length === 0) && (
          <Card padding="lg">
            <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-normal)" }}>
              {live
                ? "No demand signals in your area yet — they appear as households nearby set their food intent."
                : "Demand aggregation runs server-side across households in your area. It'll show live signals once the platform is fully connected."}
            </p>
          </Card>
        )}

        {signals.length > 0 && (
          <div className="grid gap-4">
            {signals.map((s) => (
              <Card key={s.term} padding="md">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>
                        {s.household_count}
                      </span>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral-dark)" }}>
                        household{s.household_count === 1 ? "" : "s"} want <strong style={{ color: "var(--color-neutral-darkest)" }}>{s.term}</strong> {window}
                      </span>
                    </div>
                    <div style={{ marginTop: "0.25rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
                      ~{s.implied_qty} portions implied
                    </div>
                  </div>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "var(--color-olive-drab-dark)", fontFamily: "var(--font-body)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-small)" }}>
                    <Icon name="sprout" size={16} stroke={2} /> Plant against this
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Glut reach (supply-first): who your surplus could go to */}
        {glutReach.length > 0 && (
          <div className="grid gap-4">
            <div>
              <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>Your glut deals</h2>
              <p style={{ margin: "var(--space-2) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-neutral)" }}>
                How many nearby households could take your surplus this week — cleared at <strong>8% (you keep 92%)</strong>.
              </p>
            </div>
            {glutReach.map(({ product, households }) => (
              <Card key={product.id} padding="md">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{product.name}</span>
                    <Badge variant="solid" tone="rescued" size="sm">Glut</Badge>
                    {product.glut_clearing_price_pence != null && (
                      <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>clearing at {formatPence(product.glut_clearing_price_pence)} {product.unit}</span>
                    )}
                  </div>
                  <span style={{ flexShrink: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-regular)", color: "var(--color-olive-drab-dark)", fontWeight: "var(--weight-medium)" }}>
                    {live ? `Could reach ${households} household${households === 1 ? "" : "s"}` : "Reach shown when connected"}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
