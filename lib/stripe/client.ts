import Stripe from "stripe";

// Stripe client (TEST mode for the prototype). Returns null when no secret key
// is configured so checkout can degrade gracefully.
// PRODUCTION: use live keys + Stripe Connect for real multi-party farmer payouts.
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}
