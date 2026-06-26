import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { aggregateForwardDemand, matchGlutToHouseholds, type ForwardSignal } from "@/lib/matching";
import type { Adventurousness, Json, Product } from "@/lib/supabase/types";

export const FORWARD_WINDOW = "in about 6 weeks";

export type GlutReach = { product: Product; households: number };

export type ForwardData =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "no_producer" }
  | { status: "ok"; window: string; signals: ForwardSignal[]; glutReach: GlutReach[]; live: boolean };

type ProfileRow = {
  likes: Json;
  dislikes: Json;
  hard_allergens: Json;
  adventurousness: Adventurousness;
  budget_pence: number;
  household_size: number;
};

// Forward-demand + glut-reach for the farmer (Prompt 10). Cross-household
// aggregation is privileged (other households' intent_profiles are RLS-private),
// so it runs via the service-role client and exposes only counts — no PII.
export async function getForwardData(): Promise<ForwardData> {
  const supabase = await createClient();
  if (!supabase) return { status: "unconfigured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  const { data: producer } = await supabase
    .from("producers")
    .select("id, area_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!producer) return { status: "no_producer" };

  const { data: glutProducts } = await supabase
    .from("products")
    .select("*")
    .eq("producer_id", producer.id)
    .eq("is_glut", true);
  const gluts = glutProducts ?? [];

  const admin = createAdminClient();
  if (!admin || !producer.area_id) {
    return {
      status: "ok",
      window: FORWARD_WINDOW,
      signals: [],
      glutReach: gluts.map((p) => ({ product: p, households: 0 })),
      live: false,
    };
  }

  const { data: profilesRaw } = await admin
    .from("intent_profiles")
    .select("likes, dislikes, hard_allergens, adventurousness, budget_pence, household_size, households!inner(area_id)")
    .eq("households.area_id", producer.area_id);
  const profiles = (profilesRaw ?? []) as unknown as ProfileRow[];

  const signals = aggregateForwardDemand(profiles, FORWARD_WINDOW).slice(0, 12);
  const glutReach = gluts.map((p) => ({ product: p, households: matchGlutToHouseholds(p, profiles).length }));

  return { status: "ok", window: FORWARD_WINDOW, signals, glutReach, live: true };
}
