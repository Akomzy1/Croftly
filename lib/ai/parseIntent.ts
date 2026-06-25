import Anthropic from "@anthropic-ai/sdk";
import type {
  Adventurousness,
  Cadence,
  FulfilmentType,
  PriorityPreference,
  SubstitutionRule,
} from "@/lib/supabase/types";

// parseIntent — the ONLY LLM in the household intent flow (CLAUDE.md rule 4).
// Sonnet parses free-text into structured *suggestions* to pre-fill the form.
// The user confirms every field before saving. CRITICAL (rule 3): hard allergens
// are merely pre-filled here for confirmation; they are NEVER honoured by an LLM
// at match time — the deterministic engine in /lib/matching enforces them.
// Model: Sonnet, per CLAUDE.md's role assignment (intent parse + box explanation).

export type ParsedIntent = {
  budget_pounds: number | null;
  cadence: Cadence | null;
  household_size: number | null;
  likes: string[];
  dislikes: string[];
  hard_allergens: string[];
  adventurousness: Adventurousness | null;
  priority_preference: PriorityPreference | null;
  substitution_rule: SubstitutionRule | null;
  fulfilment_pref: FulfilmentType | null;
};

const EMPTY: ParsedIntent = {
  budget_pounds: null,
  cadence: null,
  household_size: null,
  likes: [],
  dislikes: [],
  hard_allergens: [],
  adventurousness: null,
  priority_preference: null,
  substitution_rule: null,
  fulfilment_pref: null,
};

const SYSTEM = `You extract structured grocery preferences from a household's free-text description for Croftly, a UK farm-to-door marketplace.

Return ONLY a JSON object (no prose, no code fences) with these keys:
- budget_pounds: number | null  (weekly budget in GBP, e.g. 30)
- cadence: "weekly" | "fortnightly" | null
- household_size: integer | null  (number of people)
- likes: string[]  (foods they enjoy / want more of)
- dislikes: string[]  (foods to avoid by preference — NOT allergies)
- hard_allergens: string[]  (only genuine allergies/intolerances explicitly stated, e.g. "nuts", "shellfish")
- adventurousness: "exact" | "balanced" | "surprise" | null  ("surprise me" -> surprise; "just what I list" -> exact)
- priority_preference: "best_value" | "freshest_closest" | "support_specific" | null
- substitution_rule: "never" | "within_category" | "anything_within_budget" | null
- fulfilment_pref: "collection" | "courier" | null

Rules:
- Extract ONLY what is explicitly stated. Use null / [] for anything not mentioned. Do not infer or invent.
- Keep allergies (hard_allergens) strictly separate from mere dislikes.
- Lowercase, singular-ish food terms; no duplicates.`;

const CADENCE = new Set<Cadence>(["weekly", "fortnightly"]);
const ADVENTUROUSNESS = new Set<Adventurousness>(["exact", "balanced", "surprise"]);
const PRIORITY = new Set<PriorityPreference>(["best_value", "freshest_closest", "support_specific"]);
const SUBSTITUTION = new Set<SubstitutionRule>(["never", "within_category", "anything_within_budget"]);
const FULFILMENT = new Set<FulfilmentType>(["collection", "courier"]);

function enumOrNull<T extends string>(set: Set<T>, v: unknown): T | null {
  return typeof v === "string" && set.has(v as T) ? (v as T) : null;
}

function stringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  const out = v
    .filter((x): x is string => typeof x === "string")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(out)).slice(0, 30);
}

function numberOrNull(v: unknown): number | null {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

/** Validate the model's raw JSON into a ParsedIntent (deterministic; never trusts the LLM blindly). */
function validate(raw: unknown): ParsedIntent {
  const o = (raw ?? {}) as Record<string, unknown>;
  return {
    budget_pounds: numberOrNull(o.budget_pounds),
    cadence: enumOrNull(CADENCE, o.cadence),
    household_size: (() => {
      const n = numberOrNull(o.household_size);
      return n === null ? null : Math.round(n);
    })(),
    likes: stringArray(o.likes),
    dislikes: stringArray(o.dislikes),
    hard_allergens: stringArray(o.hard_allergens),
    adventurousness: enumOrNull(ADVENTUROUSNESS, o.adventurousness),
    priority_preference: enumOrNull(PRIORITY, o.priority_preference),
    substitution_rule: enumOrNull(SUBSTITUTION, o.substitution_rule),
    fulfilment_pref: enumOrNull(FULFILMENT, o.fulfilment_pref),
  };
}

/**
 * Parse free-text into suggested intent fields. Returns null if the LLM isn't
 * configured (no ANTHROPIC_API_KEY) or the call fails — the form then works
 * fully by hand. Never throws to the caller.
 */
export async function parseIntent(text: string): Promise<ParsedIntent | null> {
  const trimmed = text.trim();
  if (!trimmed) return EMPTY;
  if (!process.env.ANTHROPIC_API_KEY) return null;

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM,
      messages: [{ role: "user", content: trimmed }],
    });
    const block = message.content.find((b) => b.type === "text");
    const textOut = block && block.type === "text" ? block.text : "";
    const jsonStr = textOut.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
    return validate(JSON.parse(jsonStr));
  } catch {
    // PRODUCTION: log to observability. Here we degrade to manual entry.
    return null;
  }
}
