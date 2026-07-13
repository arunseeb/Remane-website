"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleSignOut}
      className="border border-brown/30 px-4 py-2 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
    >
      Sign out
    </button>
  );
}
