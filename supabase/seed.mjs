// Croftly seed script (Prompt 11). Idempotent — safe to re-run.
//
// Seeds: 1 area (Oxfordshire), 2 collection points, 8 producers with varied
// products across cold-chain classes (incl. 2 active gluts + nut-containing items
// to prove the allergen hard-stop), and 2 demo households with contrasting intent
// profiles. One demo farmer login owns "Hartley's Field" so the farmer console,
// orders and payouts can be demoed.
//
// Run:  npm run seed   (loads .env.local; needs NEXT_PUBLIC_SUPABASE_URL +
//                       SUPABASE_SERVICE_ROLE_KEY). Uses the service role —
//                       NEVER ship this key to the client.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Set them in .env.local.");
  process.exit(1);
}
const db = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

const DEMO_PASSWORD = "croftly-demo-1";

async function getOrCreateUser(email, meta) {
  const { data } = await db.auth.admin.createUser({ email, password: DEMO_PASSWORD, email_confirm: true, user_metadata: meta });
  if (data?.user) return data.user;
  // Already registered — find it (paginated).
  for (let page = 1; ; page++) {
    const { data: list } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    const u = list.users.find((x) => x.email === email);
    if (u) return u;
    if (!list || list.users.length < 1000) break;
  }
  throw new Error(`Could not create or find user ${email}`);
}

async function ensureArea(name, region) {
  const { data: existing } = await db.from("areas").select("id").eq("name", name).maybeSingle();
  if (existing) return existing.id;
  const { data, error } = await db.from("areas").insert({ name, region }).select("id").single();
  if (error) throw error;
  return data.id;
}

async function ensureCollectionPoint(areaId, name, address) {
  const { data: existing } = await db.from("collection_points").select("id").eq("area_id", areaId).eq("name", name).maybeSingle();
  if (existing) return existing.id;
  const { error } = await db.from("collection_points").insert({ area_id: areaId, name, address });
  if (error) throw error;
}

async function ensureProducer(areaId, name, { userId = null, story = null, bio = null } = {}) {
  const { data: existing } = await db.from("producers").select("id").eq("name", name).maybeSingle();
  if (existing) {
    await db.from("producers").update({ area_id: areaId }).eq("id", existing.id);
    return existing.id;
  }
  const { data, error } = await db.from("producers").insert({ name, area_id: areaId, user_id: userId, story, bio }).select("id").single();
  if (error) throw error;
  return data.id;
}

async function ensureProduct(producerId, p) {
  const { data: existing } = await db.from("products").select("id").eq("producer_id", producerId).eq("name", p.name).maybeSingle();
  if (existing) return;
  const { error } = await db.from("products").insert({ producer_id: producerId, ...p });
  if (error) throw error;
}

async function ensureIntent(householdId, profile) {
  const { data: existing } = await db.from("intent_profiles").select("id").eq("household_id", householdId).maybeSingle();
  if (existing) {
    await db.from("intent_profiles").update(profile).eq("id", existing.id);
    return;
  }
  const { error } = await db.from("intent_profiles").insert({ household_id: householdId, ...profile });
  if (error) throw error;
}

async function main() {
  console.log("Seeding Croftly demo data…");

  const areaId = await ensureArea("Oxfordshire", "South East England");
  await ensureCollectionPoint(areaId, "Cowley Road Hub", "112 Cowley Road, Oxford OX4 1JE");
  await ensureCollectionPoint(areaId, "Summertown Pantry", "5 South Parade, Oxford OX2 7JL");

  // Demo farmer login — owns Hartley's Field (the trigger creates the producer row).
  const farmer = await getOrCreateUser("farmer@croftly.test", { role: "farmer", name: "Hartley's Field", area_id: areaId });
  const { data: hartleys } = await db.from("producers").select("id").eq("user_id", farmer.id).maybeSingle();
  const hartleysId = hartleys?.id ?? (await ensureProducer(areaId, "Hartley's Field", { userId: farmer.id }));
  await db.from("producers").update({ area_id: areaId, story: "A family market garden near Wheatley." }).eq("id", hartleysId);

  // Products keyed by producer. Money in PENCE; allergens tag what each contains.
  const A = "ambient", C = "chilled", H = "highly_perishable";
  const catalogue = [
    ["Hartley's Field", hartleysId, [
      { name: "Rainbow chard", category: "Vegetables", cold_chain_class: C, price_pence: 280, unit: "per bunch", quantity_available: 20 },
      { name: "Curly kale", category: "Vegetables", cold_chain_class: C, price_pence: 250, unit: "per bunch", quantity_available: 18 },
      { name: "Maris Piper potatoes", category: "Vegetables", cold_chain_class: A, price_pence: 180, price_floor_pence: 150, unit: "per kg", quantity_available: 40 },
      { name: "Courgettes (glut)", category: "Vegetables", cold_chain_class: C, price_pence: 220, is_glut: true, glut_clearing_price_pence: 120, unit: "per kg", quantity_available: 30 },
    ]],
    ["Lower Brook Eggs", null, [
      { name: "Free-range eggs", category: "Eggs & dairy", cold_chain_class: C, price_pence: 320, unit: "per dozen", quantity_available: 25, allergens: ["egg"] },
    ]],
    ["Oakwell Market Garden", null, [
      { name: "Mixed salad leaves", category: "Salad & leaves", cold_chain_class: H, price_pence: 240, unit: "per bag", quantity_available: 15 },
      { name: "Spring onions", category: "Vegetables", cold_chain_class: H, price_pence: 120, unit: "per bunch", quantity_available: 20 },
      { name: "Fresh parsley", category: "Herbs", cold_chain_class: H, price_pence: 150, unit: "per bunch", quantity_available: 12 },
    ]],
    ["Two Acre Orchard", null, [
      { name: "Cox apples", category: "Fruit", cold_chain_class: A, price_pence: 260, unit: "per kg", quantity_available: 30 },
      { name: "Bramley apples (glut)", category: "Fruit", cold_chain_class: A, price_pence: 240, is_glut: true, glut_clearing_price_pence: 130, unit: "per kg", quantity_available: 50 },
    ]],
    ["Meadowsweet Dairy", null, [
      { name: "Whole milk", category: "Eggs & dairy", cold_chain_class: C, price_pence: 140, unit: "per litre", quantity_available: 30, allergens: ["milk"] },
      { name: "Salted butter", category: "Eggs & dairy", cold_chain_class: C, price_pence: 320, unit: "per 250g", quantity_available: 20, allergens: ["milk"] },
    ]],
    ["Stone Mill Bakery", null, [
      { name: "Sourdough loaf", category: "Bakery", cold_chain_class: A, price_pence: 380, unit: "per loaf", quantity_available: 15, allergens: ["gluten", "wheat"] },
      { name: "Walnut & honey loaf", category: "Bakery", cold_chain_class: A, price_pence: 420, unit: "per loaf", quantity_available: 10, allergens: ["nuts", "gluten", "wheat"] },
    ]],
    ["Pegg's Pantry", null, [
      { name: "Basil pesto", category: "Pantry & preserves", cold_chain_class: A, price_pence: 450, unit: "per jar", quantity_available: 12, allergens: ["nuts", "milk"] },
      { name: "Bramble jam", category: "Pantry & preserves", cold_chain_class: A, price_pence: 380, unit: "per jar", quantity_available: 18 },
    ]],
    ["Greenfield Growers", null, [
      { name: "Vine tomatoes", category: "Vegetables", cold_chain_class: C, price_pence: 300, unit: "per 500g", quantity_available: 25 },
      { name: "Carrots", category: "Vegetables", cold_chain_class: A, price_pence: 160, unit: "per kg", quantity_available: 35 },
    ]],
  ];

  for (const [name, presetId, products] of catalogue) {
    const producerId = presetId ?? (await ensureProducer(areaId, name));
    for (const p of products) await ensureProduct(producerId, { allergens: [], is_glut: false, ...p });
  }

  // Demo households + contrasting intent profiles.
  const family = await getOrCreateUser("family@croftly.test", { role: "household", name: "The Okonkwo family", area_id: areaId });
  const { data: familyHh } = await db.from("households").select("id").eq("user_id", family.id).maybeSingle();
  if (familyHh) {
    await db.from("households").update({ area_id: areaId }).eq("id", familyHh.id);
    await ensureIntent(familyHh.id, {
      budget_pence: 3500,
      cadence: "weekly",
      household_size: 4,
      likes: ["kale", "chard", "eggs", "potatoes", "apples", "tomatoes", "salad"],
      dislikes: ["aubergine"],
      hard_allergens: ["nuts"], // walnut loaf + pesto must never be matched in
      adventurousness: "surprise",
      priority_preference: "freshest_closest",
      substitution_rule: "within_category",
      fulfilment_pref: "collection",
    });
  }

  const sam = await getOrCreateUser("exact@croftly.test", { role: "household", name: "Sam Rivera", area_id: areaId });
  const { data: samHh } = await db.from("households").select("id").eq("user_id", sam.id).maybeSingle();
  if (samHh) {
    await db.from("households").update({ area_id: areaId }).eq("id", samHh.id);
    await ensureIntent(samHh.id, {
      budget_pence: 2000,
      cadence: "weekly",
      household_size: 1,
      likes: ["tomatoes", "carrots", "salad"],
      dislikes: [],
      hard_allergens: [],
      adventurousness: "exact",
      priority_preference: "best_value",
      substitution_rule: "never",
      fulfilment_pref: "courier",
    });
  }

  console.log("\nDone. Demo logins (password: %s):", DEMO_PASSWORD);
  console.log("  farmer@croftly.test   → /farm  (Hartley's Field; has a glut)");
  console.log("  family@croftly.test   → /shop  (surprise me, NUT allergy)");
  console.log("  exact@croftly.test    → /shop  (exact list, best value)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
