# /lib/ai — LLM calls (isolated)

All Anthropic SDK usage lives here and ONLY here. Per CLAUDE.md, the LLM is used
strictly for:

- `parseIntent.ts` — parse free-text household intent into structured fields (Sonnet). The
  user confirms every field before saving. **Hard allergens are captured as an explicit
  field and are NEVER left to the LLM to infer or honour at match time** (Prompt 5).
- `explainBox.ts` — write a short, friendly, human-readable explanation of an
  already-composed box (Sonnet). **Cosmetic only — must never change the composition** (Prompt 6).

Model roles (CLAUDE.md): Haiku = ops · Sonnet = intent parse + box explanation ·
Opus = forward forecasting (later).

NEVER call an LLM for box-composition maths, courier selection, or allergen/price-floor logic
— those are deterministic and live in `/lib/matching` and `/lib/fulfilment`.
