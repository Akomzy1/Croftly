// Money helpers. CLAUDE.md: money is stored as integer PENCE everywhere.
// These convert at the UI boundary (forms display pounds; DB stores pence).

/** Parse a pounds string/number (e.g. "12.50") into integer pence. Returns null if blank/invalid. */
export function poundsToPence(value: string | number | null | undefined): number | null {
  if (value === null || value === undefined || value === "") return null;
  const n = typeof value === "number" ? value : Number(String(value).replace(/[£,\s]/g, ""));
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * 100);
}

/** Integer pence → a plain pounds string for form inputs (e.g. 1250 → "12.50"). */
export function penceToPoundsInput(pence: number | null | undefined): string {
  if (pence === null || pence === undefined) return "";
  return (pence / 100).toFixed(2);
}

/** Integer pence → a display string (e.g. 1250 → "£12.50"). */
export function formatPence(pence: number, currency = "£"): string {
  return currency + (pence / 100).toFixed(2);
}
