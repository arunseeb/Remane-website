import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";

// Landing point for Supabase email links (invitations + password resets).
export async function GET(request: NextRequest) {
  if (!supabaseConfigured()) redirect("/login");
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (tokenHash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      if (type === "invite" || type === "recovery") {
        redirect("/auth/set-password");
      }
      redirect("/portal");
    }
  }

  redirect("/login?error=invalid-link");
}
