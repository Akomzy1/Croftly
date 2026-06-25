import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 "proxy" convention (formerly middleware). Refreshes the Supabase
// auth session on each request; no-op until Supabase is configured.
export function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on all paths except static assets and image optimisation.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
