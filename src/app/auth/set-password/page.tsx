import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { SetPasswordForm } from "@/components/portal/SetPasswordForm";

export const metadata = {
  title: "Set your password — Remane",
  description: "Choose a password for your Remane account.",
};

// Always render per-request — it reads the session cookie.
export const dynamic = "force-dynamic";

export default async function SetPasswordPage() {
  if (!supabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?error=invalid-link");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Image src="/brand/logo-red.png" alt="Remane" width={72} height={72} className="mb-10" />
      <div className="w-full max-w-sm">
        <h1 className="font-display text-center text-3xl font-light text-foreground">
          Choose a password
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          You&apos;ll use this to sign in from now on.
        </p>
        <SetPasswordForm />
      </div>
    </main>
  );
}
