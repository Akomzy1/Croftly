// Croftly roles. A user is a household (shopper) or a farmer (producer).
// Role is captured at sign-up and stored in auth user metadata; the matching
// households/producers row is provisioned by a DB trigger (see
// supabase/migrations/0003_auth_provisioning.sql).

export type Role = "household" | "farmer";

export function isRole(value: unknown): value is Role {
  return value === "household" || value === "farmer";
}

/** Where to send a user after authenticating, by role. */
export function roleHome(role: Role): "/shop" | "/farm" {
  return role === "farmer" ? "/farm" : "/shop";
}

/** Read the role from a Supabase user's metadata, defaulting to household. */
export function roleFromUser(user: { user_metadata?: { role?: unknown } } | null): Role {
  const r = user?.user_metadata?.role;
  return isRole(r) ? r : "household";
}
