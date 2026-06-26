// Croftly commission — deterministic money split (integer pence everywhere).
// Tiers (CLAUDE.md): 15% standard · 10% forward-committed · 8% glut/surplus.
// The farmer keeps the rest (≥85%, up to 92% on glut).

export const COMMISSION_RATE = {
  standard: 0.15,
  forward: 0.1,
  glut: 0.08,
} as const;

export type CommissionTier = keyof typeof COMMISSION_RATE;

export function tierFor(opts: { is_glut: boolean; is_forward: boolean }): CommissionTier {
  if (opts.is_glut) return "glut";
  if (opts.is_forward) return "forward";
  return "standard";
}

export type LineSplit = {
  tier: CommissionTier;
  commission_rate: number;
  commission_pence: number;
  farmer_pence: number;
};

/** Split a single line's price into commission + farmer share. Rounding favours the farmer's pence total being exact. */
export function splitLine(linePence: number, opts: { is_glut: boolean; is_forward: boolean }): LineSplit {
  const tier = tierFor(opts);
  const rate = COMMISSION_RATE[tier];
  const commission_pence = Math.round(linePence * rate);
  return {
    tier,
    commission_rate: rate,
    commission_pence,
    farmer_pence: linePence - commission_pence,
  };
}

export type BoxFinancials = {
  subtotal_pence: number;
  farmer_pence: number;
  platform_pence: number;
  farmer_pct: number; // 0-100, rounded
};

/** Aggregate the money split across a set of priced lines. */
export function boxFinancials(
  lines: { line_pence: number; is_glut: boolean; is_forward: boolean }[]
): BoxFinancials {
  let subtotal = 0;
  let platform = 0;
  for (const l of lines) {
    subtotal += l.line_pence;
    platform += splitLine(l.line_pence, l).commission_pence;
  }
  const farmer = subtotal - platform;
  return {
    subtotal_pence: subtotal,
    farmer_pence: farmer,
    platform_pence: platform,
    farmer_pct: subtotal > 0 ? Math.round((farmer / subtotal) * 100) : 0,
  };
}
