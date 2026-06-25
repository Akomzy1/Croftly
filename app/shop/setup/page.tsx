import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Icon } from "@/components/croftly/icon";
import { Card } from "@/components/croftly/card";
import { Accordion } from "@/components/croftly/accordion";
import { Nav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import { FSection, Eyebrow } from "@/components/site/section";
import { IntentForm } from "@/components/shop/intent-form";
import type { IntentProfile } from "@/lib/supabase/types";

// /shop/setup — household intent capture (Prompt 5). Header + FAQ reproduced
// faithfully from /design-reference/Croftly Build Your Box (standalone).html.
// DEVIATION: the prototype's right-side LIVE box review needs the matching
// engine; it is built at /shop/box in Prompts 6–7. Here we capture & save the
// full intent_profile (more fields than the prototype panel showed, per Prompt 5)
// and add the Sonnet free-text assist; the user confirms every field.

export const metadata: Metadata = {
  title: "Croftly — Tell us what you want, we'll build your box",
  description:
    "Set your tastes, what to avoid and a weekly budget. Croftly matches it to what nearby farms have picked this week — and you approve every box before it's charged.",
};

async function loadProfile(): Promise<IntentProfile | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: household } = await supabase.from("households").select("id").eq("user_id", user.id).maybeSingle();
  if (!household) return null;
  const { data } = await supabase.from("intent_profiles").select("*").eq("household_id", household.id).maybeSingle();
  return data ?? null;
}

export default async function ShopSetupPage() {
  const profile = await loadProfile();

  return (
    <>
      {/* HEADER */}
      <header className="scheme-dark" style={{ paddingBlock: "var(--space-12)", paddingInline: "var(--section-pad-x)" }}>
        <div className="croftly-container">
          <Nav />
          <div style={{ maxWidth: "52rem" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.8rem", borderRadius: "var(--radius-pill)", border: "1px solid var(--scheme-border)", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--scheme-text-muted)", marginBottom: "var(--space-6)" }}>
              <Icon name="basket" size={16} stroke={2} /> For households
            </span>
            <h1 style={{ margin: 0, fontSize: "var(--text-h1)", color: "var(--scheme-text)", lineHeight: "var(--leading-tight)", letterSpacing: "var(--tracking-tight)", maxWidth: "18ch", textWrap: "balance" }}>
              Tell us what you want — we&apos;ll build your box
            </h1>
            <p style={{ margin: "var(--space-8) 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-large)", lineHeight: "var(--leading-normal)", color: "var(--scheme-text-muted)", maxWidth: "50ch", textWrap: "pretty" }}>
              Set your tastes, what to avoid and a weekly budget. We&apos;ll match it to what nearby farms have picked this week — and you approve every box before it&apos;s charged.
            </p>
          </div>
        </div>
      </header>

      {/* INTENT FLOW — preferences */}
      <FSection scheme="scheme-light" id="build">
        <div className="mx-auto w-full" style={{ maxWidth: "42rem" }}>
          <Card padding="lg">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "var(--space-6)" }}>
              <span style={{ color: "var(--color-olive-drab)", display: "inline-flex" }}>
                <Icon name="sparkles" size={20} stroke={2} />
              </span>
              <h2 style={{ margin: 0, fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-h5)", color: "var(--color-neutral-darkest)" }}>Your preferences</h2>
            </div>
            <IntentForm profile={profile} />
          </Card>
        </div>
      </FSection>

      {/* FAQ — copy reproduced verbatim */}
      <FSection scheme="scheme-soft" id="faq">
        <div className="faq-grid" style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: "var(--space-16)", alignItems: "start" }}>
          <div>
            <Eyebrow>Common questions</Eyebrow>
            <h2 style={{ margin: 0, fontSize: "var(--text-h2)", color: "var(--scheme-text)", textWrap: "balance" }}>Your box, your rules</h2>
          </div>
          <Accordion
            defaultOpen={[0]}
            items={[
              { q: "What does “what matters most” actually change?", a: "It tells our matcher what to optimise for. Best value hunts the lowest price for each item; freshest & closest favours the nearest farms with the ripest crop; support specific farms builds your box from the growers you choose to back." },
              { q: "Can I swap or skip items?", a: "Yes — preview every box and swap, add or remove items before the weekly cut-off. Skip any week with one tap." },
              { q: "How are allergies handled?", a: "Set allergies once and we'll never match those foods to you, across every farm and box type — whatever you've chosen to prioritise." },
              { q: "How do I know what's in my box?", a: "Each box lists its exact contents and the farm each item came from — full traceability, every week." },
            ]}
          />
        </div>
      </FSection>

      <SiteFooter />
    </>
  );
}
