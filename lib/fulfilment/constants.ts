// Delivery economics thresholds (PRD D14, §7.4). These govern the COURIER path
// ONLY. They are NOT a per-farm spend gate and NEVER apply to collection —
// Croftly's promise is to REMOVE the single-farm minimum orders households face
// elsewhere, so anyone who COLLECTS has no minimum, ever. This is purely about
// the economics of running a courier leg.
//
// Both values live here so there is a SINGLE place to change them.
//
// PRODUCTION: MIN_DELIVERY_ORDER_PENCE and FREE_DELIVERY_THRESHOLD_PENCE are
// PROVISIONAL placeholders. They must be tuned against real regional courier
// rates during the pilot (the binding gate is a real courier-rate scan, not
// code). Do not treat these numbers as settled.

/**
 * Soft minimum basket subtotal to qualify for COURIER delivery (£20).
 * Below this we nudge the household toward free collection — we never hard-block
 * the order (they can always collect), and we never apply this to collection.
 */
export const MIN_DELIVERY_ORDER_PENCE = 2000;

/**
 * At/above this basket subtotal the courier fee is waived — free delivery (£45).
 * Separate, independently configurable from MIN_DELIVERY_ORDER_PENCE.
 */
export const FREE_DELIVERY_THRESHOLD_PENCE = 4500;

/** Courier fee after the free-delivery waiver: £0 at/above the threshold, else the base fee. */
export function courierFeePence(subtotalPence: number, baseFeePence: number): number {
  return subtotalPence >= FREE_DELIVERY_THRESHOLD_PENCE ? 0 : baseFeePence;
}

/** True when a COURIER basket is below the soft delivery minimum. (Caller gates on method === courier.) */
export function belowDeliveryMinimum(subtotalPence: number): boolean {
  return subtotalPence < MIN_DELIVERY_ORDER_PENCE;
}

/** How much more is needed to reach the courier minimum (0 once met). */
export function deliveryShortfallPence(subtotalPence: number): number {
  return Math.max(0, MIN_DELIVERY_ORDER_PENCE - subtotalPence);
}
