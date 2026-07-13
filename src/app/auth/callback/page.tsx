import Image from "next/image";
import { redirect } from "next/navigation";
import { supabaseConfigured } from "@/lib/supabase/env";
import { AuthCallback } from "@/components/portal/AuthCallback";

export const metadata = {
  title: "Signing in — Remane",
  description: "Completing sign-in.",
};

export default function AuthCallbackPage() {
  if (!supabaseConfigured()) redirect("/login");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Image src="/brand/logo-red.png" alt="Remane" width={72} height={72} className="mb-10" />
      <AuthCallback />
    </main>
  );
}
