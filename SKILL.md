# SKILL.md — Prototype-Aligned Build (Croftly)

**Skill:** Faithfully implement Croftly pages and components from the canonical prototype HTML, and verify alignment before moving on.
**When to use:** Whenever you implement, modify, or refactor ANY page or component that has a corresponding prototype HTML in `/design-reference/`. This is virtually every UI task.
**Priority:** This skill enforces CLAUDE.md's "Prototype HTML is the source of truth" rules. Follow it strictly.

---

## Core principle
The prototype HTML in `/design-reference/` is the **exact visual and structural specification**. Your job is to reproduce it faithfully in the Next.js build — not to redesign, improve, reinterpret, or "clean up" anything. Build prompts tell you what the page must *do*; the prototype HTML tells you what it must *look like and say*. Both must be satisfied, and they must align.

---

## Build workflow (follow in order, every time)

1. **Locate the prototype.** Find the page's prototype HTML via `/design-reference/MAP.md`. If no mapping exists, STOP and ask — do not invent a design.
2. **Read it fully.** Read the entire prototype HTML before writing any code. Note: every section and its order; all components; all copy; the layout and grid; spacing, type, colour, radii; responsive behaviour.
3. **Extract tokens.** Pull colour values, type scale, spacing, and radii from the prototype into the Tailwind theme / shadcn config. Reuse them — never hard-code one-off values that differ from the prototype.
4. **Identify shared components.** If a component appears in multiple prototypes (e.g. the money-split visual, farm cards, the dual CTA), build it ONCE as a shared component and reuse it identically. It must look the same everywhere it appears.
5. **Implement faithfully.** Reproduce structure, section order, layout, components, spacing, typography, colour, and copy. Wire in the data/logic from the build prompt and CLAUDE.md. Keep `/lib/matching` LLM-free and allergen logic deterministic.
6. **Verify against the prototype** (checklist below) before considering the page done.
7. **Flag deviations** explicitly (output + `// DEVIATION:` comment + justification).

---

## Verification checklist (run after every page)
- [ ] Every section from the prototype is present, in the same order.
- [ ] No elements added, removed, or reordered beyond the prototype.
- [ ] All copy (headlines, body, microcopy, button labels) matches the prototype **verbatim**.
- [ ] All shared components match their canonical version and each other.
- [ ] Colour, type, spacing, radii come from the extracted tokens — no invented values.
- [ ] Responsive behaviour (mobile-first) matches the prototype's breakpoints/layout.
- [ ] The page reads warm/fresh and **never premium/glossy** (CLAUDE.md rule 5).
- [ ] Any deviation is flagged with justification; none are silent.

If any box fails, it's a bug — fix it to match the prototype before moving on.

---

## Token extraction guidance
- Read inline styles, classes, and any `<style>`/CSS in the prototype HTML.
- Map the prototype's palette to Tailwind theme colours (primary green, deep green, cream/oat neutrals, warm accent). Do NOT substitute "close enough" defaults.
- Match the type pairing and scale; match border-radius and spacing rhythm.
- Centralise tokens so the whole build inherits them — one source, like the prototype.

---

## Deviation protocol
A deviation is only allowed when the prototype is genuinely impossible or incomplete (e.g. a missing state, a technical constraint). When that happens:
1. Implement the closest faithful interpretation.
2. Add a `// DEVIATION: <what and why>` comment at the site of the change.
3. Call it out explicitly in your response so it can be reviewed.
Never deviate for preference, "improvement", or convenience.

---

## Anti-patterns (do NOT do these)
- ❌ Building a page from the build prompt alone without reading the prototype HTML.
- ❌ Redesigning, restyling, or "improving" the prototype's layout or look.
- ❌ Paraphrasing or rewriting prototype copy.
- ❌ Inventing colours, spacing, or type that differ from the prototype.
- ❌ Adding sections, features, or flourishes not in the prototype.
- ❌ Letting a shared component look different on different pages.
- ❌ Making the UI look premium/elite (violates CLAUDE.md rule 5).
- ❌ Resolving a prototype-vs-CLAUDE.md conflict silently — STOP and flag instead.

---

## Interaction with logic & safety
While reproducing the prototype's UI exactly, the underlying behaviour still obeys CLAUDE.md:
- Allergen exclusions are deterministic hard-stops, outside the LLM.
- `/lib/matching` composition is deterministic; the LLM only parses intent and writes the (cosmetic) box explanation.
- Money is integer pence; commission tiers are 15% / 10% forward / 8% glut.
- The money-split component is the brand signature — identical everywhere, prominent, honest.
The prototype governs how these are *presented*; CLAUDE.md governs how they *work*. Satisfy both.
