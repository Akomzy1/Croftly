// Public surface of the deterministic matching engine (NO LLM — CLAUDE.md 3 & 4).
export { composeBox, effectiveUnitPence, type ComposeOptions } from "./engine";
export type { Candidate, ComposedBox, ComposedLine } from "./types";
// Forward-demand + glut-clearing modes (Prompt 10).
export { aggregateForwardDemand, type ForwardSignal } from "./forward";
export { matchGlutToHouseholds, householdToleratesGlut, type GlutCandidate } from "./glut";
