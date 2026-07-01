import type { ColdChainClass } from "@/lib/supabase/types";

// Courier provider seam. The platform ORCHESTRATES couriers; it never owns a
// fleet (CLAUDE.md rule 2). Provider selection is DETERMINISTIC — no LLM
// (CLAUDE.md rule 4). Each provider implements the same quote/createJob contract
// so they can be rate-shopped and swapped freely. Prototype selection is the mock;
// production leads are Uber Direct (on-demand) + Sendcloud (ambient), Stuart fallback.

export type Address = {
  line: string;
  city: string;
  postcode: string;
  lat?: number | null;
  lng?: number | null;
  contactName?: string | null;
  contactPhone?: string | null;
};

// Stuart package sizes; a Croftly veg box is treated as "large".
export type PackageSize = "xsmall" | "small" | "medium" | "large" | "xlarge";

export type FulfilmentLeg = {
  pickup: Address;
  dropoff: Address;
  coldChain: ColdChainClass;
  packageSize: PackageSize;
};

export type CourierQuote = {
  provider: string; // machine name, e.g. "stuart"
  service: string; // human label, e.g. "Uber Direct (on-demand)"
  fee_pence: number;
  eta: string;
};

export type CourierJob = {
  provider: string;
  providerJobId: string;
  trackingUrl: string | null;
  status: string;
  fee_pence: number;
};

export interface CourierProvider {
  readonly name: string;
  /** Can this provider carry a box of the given cold-chain class at all? */
  canHandle(coldChain: ColdChainClass): boolean;
  /** Price one pickup→dropoff leg. Returns null if it can't quote (caller treats leg as unservable). */
  quote(leg: FulfilmentLeg): Promise<CourierQuote | null>;
  /** Book one pickup→dropoff leg. Throws on failure. */
  createJob(leg: FulfilmentLeg): Promise<CourierJob>;
}
