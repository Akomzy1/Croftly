import Anthropic from "@anthropic-ai/sdk";
import type { ComposedBox } from "@/lib/matching/types";
import type { IntentProfile } from "@/lib/supabase/types";

// explainBox — writes a short, friendly, human-readable explanation of an
// ALREADY-COMPOSED box (Sonnet, per CLAUDE.md's role assignment).
//
// ⚠️ COSMETIC ONLY (CLAUDE.md rule 4): this never changes the composition. The
// box is composed deterministically in /lib/matching; this only describes it.
// Returns null when the LLM isn't configured — the box still renders without prose.

const PRIORITY_LABEL: Record<IntentProfile["priority_preference"], string> = {
  best_value: "best value",
  freshest_closest: "freshest & closest",
  support_specific: "supporting specific farms",
};

export async function explainBox(box: ComposedBox, intent: IntentProfile): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (box.lines.length === 0) return null;

  const allergens = Array.isArray(intent.hard_allergens) ? (intent.hard_allergens as string[]) : [];
  const items = box.lines.map((l) => ({
    name: l.name,
    farm: l.producer_name,
    glut: l.is_glut,
  }));

  const facts = {
    priority: PRIORITY_LABEL[intent.priority_preference],
    items,
    glut_count: box.glut_count,
    allergies_excluded: allergens,
    subtotal_gbp: (box.subtotal_pence / 100).toFixed(2),
  };

  const system = `You write a short, warm explanation of a household's weekly farm box for Croftly (a UK farm-to-door marketplace). 2-3 sentences, plain and friendly, never premium or salesy.

Rules:
- Describe ONLY the items provided. Do not invent or add items.
- If any item is a glut/surplus item, mention it was included to help a local farm cut waste (at a lower price).
- If allergies were excluded, reassure briefly that those were kept out.
- Reflect what the household prioritised.
- Do not mention prices beyond the overall feel; do not output JSON or lists.`;

  try {
    const client = new Anthropic();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 300,
      system,
      messages: [{ role: "user", content: JSON.stringify(facts) }],
    });
    const block = message.content.find((b) => b.type === "text");
    const text = block && block.type === "text" ? block.text.trim() : "";
    return text || null;
  } catch {
    return null; // PRODUCTION: log; degrade to no explanation.
  }
}
