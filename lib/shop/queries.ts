import { createClient } from "@/lib/supabase/server";
import { composeBox } from "@/lib/matching";
import type { Candidate, ComposedBox } from "@/lib/matching";
import { explainBox } from "@/lib/ai/explainBox";
import type { IntentProfile, Product } from "@/lib/supabase/types";

export type ShopData =
  | { status: "unconfigured" }
  | { status: "anonymous" }
  | { status: "no_household" }
  | { status: "no_profile" }
  | { status: "ok"; box: ComposedBox; explanation: string | null; profile: IntentProfile };

type ProductRow = Product & {
  producers: { name: string | null; area_id: string | null } | { name: string | null; area_id: string | null }[] | null;
};

// Compose the logged-in household's box: deterministic matching (no LLM), then a
// cosmetic explanation (Sonnet). The engine call and the explanation are kept
// strictly separate (CLAUDE.md rules 3 & 4).
export async function getShopData(today: string): Promise<ShopData> {
  const supabase = await createClient();
  if (!supabase) return { status: "unconfigured" };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { status: "anonymous" };

  const { data: household } = await supabase
    .from("households")
    .select("id, area_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!household) return { status: "no_household" };

  const { data: profile } = await supabase
    .from("intent_profiles")
    .select("*")
    .eq("household_id", household.id)
    .maybeSingle();
  if (!profile) return { status: "no_profile" };

  const { data } = await supabase.from("products").select("*, producers(name, area_id)");
  const rows = (data ?? []) as unknown as ProductRow[];
  const candidates: Candidate[] = rows.map((r) => {
    const { producers, ...product } = r;
    const p = Array.isArray(producers) ? producers[0] : producers;
    return {
      ...(product as Product),
      producer_name: p?.name ?? "A local farm",
      producer_area_id: p?.area_id ?? null,
    };
  });

  const box = composeBox(profile, candidates, { areaId: household.area_id, today });
  const explanation = await explainBox(box, profile);

  return { status: "ok", box, explanation, profile };
}
