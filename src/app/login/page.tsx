import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { LoginForm } from "@/components/portal/LoginForm";

export const metadata = {
  title: "Client Login — Remane",
  description: "Private access for Remane clients.",
};

// Always render per-request — it reads the session cookie.
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!supabaseConfigured()) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
        <Image src="/brand/logo-red.png" alt="Remane" width={72} height={72} className="mb-10" />
        <div className="max-w-md text-center">
          <h1 className="font-display text-3xl font-light text-foreground">
            The members area isn&apos;t open yet
          </h1>
          <p className="mt-3 text-sm text-muted">
            The portal hasn&apos;t been connected to its database. If you run this site, follow
            the steps in <code>SETUP-PORTAL.md</code> to finish setup.
          </p>
          <Link
            href="/"
            className="link-underline mt-8 inline-block text-xs tracking-[0.2em] text-burgundy uppercase"
          >
            Back to remane.co.uk
          </Link>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    redirect(profile?.role === "coach" ? "/coach" : "/portal");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <Link href="/" className="mb-10">
        <Image src="/brand/logo-red.png" alt="Remane" width={72} height={72} />
      </Link>
      <div className="w-full max-w-sm">
        <h1 className="font-display text-center text-3xl font-light text-foreground">
          Private access
        </h1>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in with the details from your invitation.
        </p>
        <Suspense>
          <LoginForm />
        </Suspense>
        <p className="mt-8 text-center">
          <Link href="/" className="link-underline text-xs tracking-[0.2em] text-muted uppercase">
            Back to remane.co.uk
          </Link>
        </p>
      </div>
    </main>
  );
}
