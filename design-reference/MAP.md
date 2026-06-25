# Design Reference — File → Route Map

> **Source of truth.** Every prototype HTML here is the canonical visual/structural/copy spec for its route (see CLAUDE.md → "Prototype HTML is the source of truth"). Read the prototype fully before building or modifying its page, and verify alignment after. These are standalone bundled exports from Claude Design — to read the real source, decode the `<script type="__bundler/template">` payload (JSON-encoded HTML); see `design-reference/README` notes below.

## Marketing / discovery pages (SSR, crawlable)

| Prototype HTML | Route | Page file | Build prompt |
|---|---|---|---|
| `Croftly Home (standalone).html` | `/` | `app/page.tsx` | (marketing) |
| `Croftly Areas (standalone).html` | `/areas` | `app/areas/page.tsx` | (marketing) |
| `Croftly Area - Oxfordshire (standalone).html` | `/areas/[area]` | `app/areas/[area]/page.tsx` | (marketing) |
| `Croftly How It Works (standalone).html` | `/how-it-works` | `app/how-it-works/page.tsx` | (marketing) |
| `Croftly Pricing (standalone).html` | `/pricing` | `app/pricing/page.tsx` | (marketing) |
| `Croftly Sell (standalone).html` | `/sell` | `app/sell/page.tsx` | (marketing; farmer acquisition) |

## Product / flow pages (app-shell)

| Prototype HTML | Route | Page file | Build prompt |
|---|---|---|---|
| `Croftly Get Started (standalone).html` | `/get-started` | `app/get-started/page.tsx` | Prompt 3 (dual fork) |
| `Croftly Build Your Box (standalone).html` | `/shop/setup` + `/shop/box` | `app/shop/setup/page.tsx`, `app/shop/box/page.tsx` | Prompts 5–7 (intent capture → composed box → money-split) |

## Design system references (NOT routes)

| Prototype HTML | Purpose |
|---|---|
| `Croftly Foundations (standalone).html` | **Canonical design tokens** (colour, type scale, spacing, radii, shadows, schemes, fonts: Sora + Inter). Source for the Tailwind theme in `app/globals.css`. |
| `Croftly Brand Asset Sheet (standalone).html` | Logo, brand marks, asset usage. Source for PWA icons + brand assets. |

## Notes
- Route names are provisional where a prompt hasn't pinned them; confirm against the prototype's own nav/links when building each page and update this table if it differs.
- `Build Your Box` covers the household intent → composed box → money-split journey; it may split across `/shop/setup`, `/shop/box` per Prompts 5–7. Re-read it when building those.
- Farmer console (`/farm`, Prompt 4) and forward/glut (Prompt 10) have no standalone marketing prototype yet — build to the prompt + design tokens, and flag the absence of a prototype as a `// DEVIATION:` per CLAUDE.md.
