"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { parseIntent, type ParsedIntent } from "@/lib/ai/parseIntent";
import { poundsToPence } from "@/lib/money";
import type {
  Adventurousness,
  Cadence,
  FulfilmentType,
  PriorityPreference,
  SubstitutionRule,
} from "@/lib/supabase/types";

// Server action wrapper around the (LLM) intent parser. Returns suggestions for
// the client to pre-fill; the user confirms every field before saving.
export async function parseIntentAction(text: string): Promise<ParsedIntent | null> {
  return parseIntent(text);
}

export type SaveIntentState = { error?: string };

function str(fd: FormData, k: string): string {
  return (fd.get(k) as string | null)?.trim() ?? "";
}

function csv(fd: FormData, k: string): string[] {
  return str(fd, k)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// Persist the household's intent_profile (deterministic; no LLM here). Hard
// allergens are stored as an explicit field — the matching engine enforces them
// deterministically later (CLAUDE.md rule 3). Defaults to freshest_closest,
// NEVER best_value (CLAUDE.md / Prompt 5).
export async function saveIntent(_prev: SaveIntentState, fd: FormData): Promise<SaveIntentState> {
  const supabase = await createClient();
  if (!supabase) return { error: "Accounts aren't configured yet — connect Supabase to save your preferences." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/sign-up?role=household");

  const { data: household } = await supabase
    .from("households")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!household) return { error: "We couldn't find your household profile." };

  const budgetPence = poundsToPence(str(fd, "budget"));
  if (budgetPence === null) return { error: "Enter a valid weekly budget." };

  const cadence = (str(fd, "cadence") || "weekly") as Cadence;
  const adventurousness = (str(fd, "adventurousness") || "balanced") as Adventurousness;
  const priority = (str(fd, "priority_preference") || "freshest_closest") as PriorityPreference;
  const substitution = (str(fd, "substitution_rule") || "within_category") as SubstitutionRule;
  const fulfilment = (str(fd, "fulfilment_pref") || "collection") as FulfilmentType;
  const householdSize = Math.max(1, Math.round(Number(str(fd, "household_size") || "1")));

  const row = {
    household_id: household.id,
    budget_pence: budgetPence,
    cadence,
    household_size: householdSize,
    likes: csv(fd, "likes"),
    dislikes: csv(fd, "dislikes"),
    hard_allergens: csv(fd, "hard_allergens"),
    adventurousness,
    priority_preference: priority,
    substitution_rule: substitution,
    fulfilment_pref: fulfilment,
  };

  // One profile per household: update if present, else insert.
  const { data: existing } = await supabase
    .from("intent_profiles")
    .select("id")
    .eq("household_id", household.id)
    .maybeSingle();

  const { error } = existing
    ? await supabase.from("intent_profiles").update(row).eq("id", existing.id)
    : await supabase.from("intent_profiles").insert(row);

  if (error) return { error: error.message };

  // PRODUCTION: route to /shop/box (the matched box) once the engine (Prompt 6) lands.
  redirect("/shop");
}
