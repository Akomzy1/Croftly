"use client";

import * as React from "react";
import { useActionState } from "react";
import { Icon, type IconName } from "@/components/croftly/icon";
import { Button } from "@/components/croftly/button";
import { Field, Input, Select } from "@/components/croftly/field";
import { saveIntent, parseIntentAction, type SaveIntentState } from "@/app/shop/setup/actions";
import { penceToPoundsInput } from "@/lib/money";
import { track } from "@/lib/analytics";
import type { IntentProfile, PriorityPreference } from "@/lib/supabase/types";

// The three priorities the matcher can optimise for — reproduced verbatim from
// the Build Your Box prototype (titles/subs/icons). Keys map to the DB enum;
// the default is "freshest_closest", NEVER "best_value" (CLAUDE.md / Prompt 5).
const PRIORITIES: { key: PriorityPreference; icon: IconName; title: string; sub: string }[] = [
  { key: "best_value", icon: "scale", title: "Best value", sub: "We find the lowest price for each item." },
  { key: "freshest_closest", icon: "leaf", title: "Freshest & closest", sub: "Picked nearest to you, as fresh as it comes." },
  { key: "support_specific", icon: "sprout", title: "Support specific farms", sub: "Let me choose the farms I want to back." },
];

function PriorityCard({ p, selected, onSelect }: { p: (typeof PRIORITIES)[number]; selected: boolean; onSelect: (k: PriorityPreference) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(p.key)}
      aria-pressed={selected}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.875rem",
        width: "100%",
        textAlign: "left",
        padding: "0.875rem 1rem",
        cursor: "pointer",
        font: "inherit",
        background: selected ? "var(--color-olive-drab-lightest)" : "var(--color-white)",
        border: "1px solid " + (selected ? "var(--color-olive-drab)" : "var(--color-ink-15)"),
        borderRadius: "var(--radius-input)",
        transition: "border-color var(--dur-base) var(--ease-standard), background var(--dur-base) var(--ease-standard)",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: "2.25rem",
          height: "2.25rem",
          borderRadius: "var(--radius-input)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: selected ? "var(--color-white)" : "var(--color-olive-drab-lightest)",
          color: "var(--color-olive-drab-dark)",
        }}
      >
        <Icon name={p.icon} size={20} stroke={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: "var(--weight-medium)", fontSize: "var(--text-regular)", color: "var(--color-neutral-darkest)" }}>{p.title}</span>
          {selected && (
            <span style={{ color: "var(--color-olive-drab)", display: "inline-flex" }}>
              <Icon name="check" size={16} stroke={2.6} />
            </span>
          )}
        </span>
        <span style={{ display: "block", marginTop: "0.15rem", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)", lineHeight: "var(--leading-snug)" }}>{p.sub}</span>
      </span>
    </button>
  );
}

// jsonb columns come back as Json; render as a comma-separated string.
function toCsv(v: unknown): string {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").join(", ") : "";
}

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "0.5rem", margin: "0 0 var(--space-4)" }}>
      <span style={{ fontFamily: "var(--font-body)", fontWeight: "var(--weight-semibold)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)" }}>{children}</span>
      {hint && <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>{hint}</span>}
    </div>
  );
}

export function IntentForm({ profile }: { profile?: IntentProfile | null }) {
  const [state, formAction, pending] = useActionState<SaveIntentState, FormData>(saveIntent, {});

  // Controlled fields so the AI parse can pre-fill them; the user confirms before saving.
  const [budget, setBudget] = React.useState(penceToPoundsInput(profile?.budget_pence) || "");
  const [cadence, setCadence] = React.useState(profile?.cadence ?? "weekly");
  const [householdSize, setHouseholdSize] = React.useState(String(profile?.household_size ?? 1));
  const [adventurousness, setAdventurousness] = React.useState(profile?.adventurousness ?? "balanced");
  const [priority, setPriority] = React.useState<PriorityPreference>(profile?.priority_preference ?? "freshest_closest");
  const [likes, setLikes] = React.useState(toCsv(profile?.likes));
  const [dislikes, setDislikes] = React.useState(toCsv(profile?.dislikes));
  const [allergens, setAllergens] = React.useState(toCsv(profile?.hard_allergens));
  const [substitution, setSubstitution] = React.useState(profile?.substitution_rule ?? "within_category");
  const [fulfilment, setFulfilment] = React.useState(profile?.fulfilment_pref ?? "collection");

  const [description, setDescription] = React.useState("");
  const [parsing, setParsing] = React.useState(false);
  const [parseNote, setParseNote] = React.useState<string | null>(null);

  async function fillFromDescription() {
    setParsing(true);
    setParseNote(null);
    track("intent_ai_assist_used");
    const p = await parseIntentAction(description);
    setParsing(false);
    if (!p) {
      setParseNote("Couldn't auto-fill (AI assist isn't configured) — set your preferences by hand below.");
      return;
    }
    if (p.budget_pounds != null) setBudget(String(p.budget_pounds));
    if (p.cadence) setCadence(p.cadence);
    if (p.household_size != null) setHouseholdSize(String(p.household_size));
    if (p.adventurousness) setAdventurousness(p.adventurousness);
    if (p.priority_preference) setPriority(p.priority_preference);
    if (p.likes.length) setLikes(p.likes.join(", "));
    if (p.dislikes.length) setDislikes(p.dislikes.join(", "));
    if (p.hard_allergens.length) setAllergens(p.hard_allergens.join(", "));
    if (p.substitution_rule) setSubstitution(p.substitution_rule);
    if (p.fulfilment_pref) setFulfilment(p.fulfilment_pref);
    setParseNote("Filled in what we found — please check every field, especially allergies, before saving.");
  }

  return (
    <form action={formAction} className="grid gap-8">
      {/* AI assist: describe it in your own words (Sonnet pre-fills; you confirm). */}
      <div className="grid gap-3" style={{ padding: "var(--space-5)", borderRadius: "var(--radius-card)", background: "var(--color-olive-drab-lightest)", border: "1px solid var(--color-olive-drab-light)" }}>
        <FieldLabel hint="Optional">Describe it in your own words</FieldLabel>
        <textarea
          className="croftly-input"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. £30 a week, family of four, kids hate aubergine, nut allergy, surprise me"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="secondary" onClick={fillFromDescription} disabled={parsing}>
            {parsing ? "Reading…" : "Fill in my preferences"}
          </Button>
          {parseNote && <span style={{ fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral-dark)" }}>{parseNote}</span>}
        </div>
      </div>

      {/* What matters most — reproduced verbatim from the prototype */}
      <div>
        <FieldLabel hint="Pick one">What matters most to you?</FieldLabel>
        <input type="hidden" name="priority_preference" value={priority} />
        <div className="grid gap-3">
          {PRIORITIES.map((p) => (
            <PriorityCard key={p.key} p={p} selected={priority === p.key} onSelect={setPriority} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="Weekly budget (£)">
          <Input name="budget" type="number" min="0" step="0.01" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="18" required />
        </Field>
        <Field label="Household size">
          <Input name="household_size" type="number" min="1" step="1" value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} required />
        </Field>
        <Field label="How often">
          <Select name="cadence" value={cadence} onChange={(e) => setCadence(e.target.value as typeof cadence)}>
            <option value="weekly">Weekly</option>
            <option value="fortnightly">Fortnightly</option>
          </Select>
        </Field>
        <Field label="How adventurous?">
          <Select name="adventurousness" value={adventurousness} onChange={(e) => setAdventurousness(e.target.value as typeof adventurousness)}>
            <option value="exact">Exact — just what I list</option>
            <option value="balanced">Balanced</option>
            <option value="surprise">Surprise me</option>
          </Select>
        </Field>
      </div>

      <Field label="Foods you like" hint="Separate with commas">
        <Input name="likes" value={likes} onChange={(e) => setLikes(e.target.value)} placeholder="e.g. leafy greens, tomatoes, eggs" />
      </Field>
      <Field label="Foods to avoid (preference)" hint="Separate with commas">
        <Input name="dislikes" value={dislikes} onChange={(e) => setDislikes(e.target.value)} placeholder="e.g. aubergine, coriander" />
      </Field>

      {/* Hard allergens — the deterministic hard-exclusion field. */}
      <Field
        label="Allergies — never include these"
        hint="Separate with commas"
      >
        <Input name="hard_allergens" value={allergens} onChange={(e) => setAllergens(e.target.value)} placeholder="e.g. nuts, shellfish" />
      </Field>
      <p style={{ margin: "-0.75rem 0 0", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-olive-drab-dark)" }}>
        Allergies are a hard rule — we never match these foods to you, on any farm or box, whatever you prioritise.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Field label="If a farm runs short">
          <Select name="substitution_rule" value={substitution} onChange={(e) => setSubstitution(e.target.value as typeof substitution)}>
            <option value="never">Never substitute — leave it out</option>
            <option value="within_category">Swap for something similar</option>
            <option value="anything_within_budget">Anything good within budget</option>
          </Select>
        </Field>
        <Field label="How you'll get it">
          <Select name="fulfilment_pref" value={fulfilment} onChange={(e) => setFulfilment(e.target.value as typeof fulfilment)}>
            <option value="collection">Collect from a nearby point (free)</option>
            <option value="courier">Courier to my door</option>
          </Select>
        </Field>
      </div>

      {state.error && (
        <p style={{ margin: 0, fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-potters-clay-dark)", background: "var(--color-tulip-tree-lighter)", border: "1px solid var(--color-tulip-tree-light)", borderRadius: "var(--radius-input)", padding: "0.625rem 0.75rem" }}>
          {state.error}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={pending} style={{ width: "100%", justifyContent: "center" }} iconRight={<Icon name="arrowRight" size={18} />}>
          {pending ? "Saving…" : "Match my box"}
        </Button>
        <p style={{ margin: "var(--space-4) 0 0", textAlign: "center", fontFamily: "var(--font-body)", fontSize: "var(--text-small)", color: "var(--color-neutral)" }}>
          Nothing&apos;s charged until you approve the box.
        </p>
      </div>
    </form>
  );
}
