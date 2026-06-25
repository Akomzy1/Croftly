import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { roleFromUser, roleHome } from "@/lib/auth/roles";

// Email-confirmation / OAuth callback: exchange the code for a session, then
// route the user to their role home (or an explicit ?next).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  const supabase = await createClient();
  if (supabase && code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const dest = next ?? roleHome(roleFromUser(user));
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/sign-in?error=auth`);
}
