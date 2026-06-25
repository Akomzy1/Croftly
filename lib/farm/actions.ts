"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { poundsToPence } from "@/lib/money";
import type { ColdChainClass } from "@/lib/supabase/types";

export type ProductFormState = { error?: string };

const COLD_CHAIN: ColdChainClass[] = ["ambient", "chilled", "highly_perishable"];

function str(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

// Create or update a product listing (the farmer "supply broadcast"). NO LLM —
// this is the deterministic supply layer. Money is parsed to integer pence here.
export async function saveProduct(
  _prev: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const supabase = await createClient();
  if (!supabase) return { error: "Accounts aren't configured yet — connect a Supabase project to list produce." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in to manage your listings." };

  const { data: producer } = await supabase
    .from("producers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!producer) return { error: "We couldn't find your farm profile." };

  const id = str(formData, "id");
  const name = str(formData, "name");
  const category = str(formData, "category");
  const coldChain = str(formData, "cold_chain_class") as ColdChainClass;
  const unit = str(formData, "unit");
  const pricePence = poundsToPence(str(formData, "price"));
  const floorPence = poundsToPence(str(formData, "price_floor"));
  const quantity = Number(str(formData, "quantity") || "0");
  const wMin = str(formData, "variable_weight_min");
  const wMax = str(formData, "variable_weight_max");
  const availableFrom = str(formData, "available_from") || null;
  const availableTo = str(formData, "available_to") || null;
  const isGlut = formData.get("is_glut") != null;
  const glutPence = poundsToPence(str(formData, "glut_clearing_price"));

  // --- Validation (deterministic; mirrors the DB constraints) ---
  if (!name) return { error: "Give your product a name." };
  if (!category) return { error: "Pick a category." };
  if (!COLD_CHAIN.includes(coldChain)) return { error: "Choose how the product needs to be kept." };
  if (!unit) return { error: "Say how you sell it (the unit)." };
  if (pricePence === null) return { error: "Enter a valid price." };
  if (floorPence !== null && floorPence > pricePence) {
    return { error: "Your lowest-you'll-accept price can't be higher than the price." };
  }
  if (!Number.isFinite(quantity) || quantity < 0) return { error: "Enter a valid quantity." };
  if (isGlut) {
    if (glutPence === null) return { error: "Set a clearing price for the glut deal." };
    if (glutPence > pricePence) return { error: "A glut clearing price should be lower than the normal price." };
    if (floorPence !== null && glutPence < floorPence) {
      return { error: "Even on a glut, the clearing price can't go below your floor." };
    }
  }

  const row = {
    producer_id: producer.id,
    name,
    category,
    cold_chain_class: coldChain,
    price_pence: pricePence,
    price_floor_pence: floorPence,
    unit,
    variable_weight_min: wMin ? Number(wMin) : null,
    variable_weight_max: wMax ? Number(wMax) : null,
    available_from: availableFrom,
    available_to: availableTo,
    is_glut: isGlut,
    glut_clearing_price_pence: isGlut ? glutPence : null,
    quantity_available: Math.round(quantity),
  };

  const { error } = id
    ? await supabase.from("products").update(row).eq("id", id)
    : await supabase.from("products").insert(row);

  if (error) return { error: error.message };

  revalidatePath("/farm");
  redirect("/farm");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return;
  const id = (formData.get("id") as string | null)?.trim();
  if (!id) return;
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/farm");
}
