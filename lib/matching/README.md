# /lib/matching — deterministic matching engine

**CONSTITUTIONAL RULE (CLAUDE.md 3 & 4): ZERO LLM calls in this module.**

This is the signature engine. It composes a household's box from real farm supply
using only deterministic logic. No Anthropic SDK import is permitted here.

- **Allergen exclusion** is an absolute, deterministic hard-stop — never inferred by a model.
- **Price floor** (`price_floor_pence`) is a deterministic hard-stop — best-value matching
  may surface a low offered price but must NEVER sell below the farmer's floor.
- Box-composition maths and courier selection are deterministic — never delegated to the LLM.

The human-readable *explanation* of a box is cosmetic and lives in `/lib/ai/explainBox.ts`;
it must never change the composition. Built for real in Prompt 6.

Money is integer **pence** everywhere.
