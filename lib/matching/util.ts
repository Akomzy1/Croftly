// Small shared helpers for the deterministic matching modes (NO LLM).
export function toStrArray(v: unknown): string[] {
  return Array.isArray(v)
    ? v.filter((x): x is string => typeof x === "string").map((s) => s.trim().toLowerCase()).filter(Boolean)
    : [];
}
