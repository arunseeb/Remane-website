import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getHomeworkBadge, getUnreadSummary } from "@/lib/chat";
import { PortalShell } from "@/components/portal/PortalShell";
import { ChangePasswordForm } from "@/components/portal/ChangePasswordForm";
import { formatDate } from "@/lib/portal";

export const metadata = {
  title: "Account — Remane",
  description: "Manage your Remane account.",
};

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  if (!supabaseConfigured()) redirect("/login");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, email, created_at")
    .eq("id", user.id)
    .single();

  const role = profile?.role === "coach" ? "coach" : "client";

  // Same badges as the coach/portal layouts — without them, visiting Account makes
  // every nav count read zero and pending work looks handled.
  const [unread, homeworkBadge] = await Promise.all([
    getUnreadSummary(supabase),
    getHomeworkBadge(supabase, role),
  ]);

  return (
    <PortalShell
      role={role}
      name={profile?.full_name || "Member"}
      unread={unread}
      homeworkBadge={homeworkBadge}
    >
      <h1 className="font-display text-3xl font-light text-foreground">Account</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border border-brown/20 bg-surface/50 p-6">
          <h2 className="text-xs tracking-[0.25em] text-muted uppercase">Your details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div>
              <dt className="text-xs tracking-[0.15em] text-muted uppercase">Name</dt>
              <dd className="mt-0.5 text-foreground">{profile?.full_name || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.15em] text-muted uppercase">Email</dt>
              <dd className="mt-0.5 text-foreground">{profile?.email || user.email}</dd>
            </div>
            <div>
              <dt className="text-xs tracking-[0.15em] text-muted uppercase">Member since</dt>
              <dd className="mt-0.5 text-foreground">
                {profile?.created_at ? formatDate(profile.created_at) : "—"}
              </dd>
            </div>
          </dl>
        </section>

        <section className="border border-brown/20 bg-surface/50 p-6">
          <h2 className="text-xs tracking-[0.25em] text-muted uppercase">Change password</h2>
          <ChangePasswordForm />
        </section>
      </div>
    </PortalShell>
  );
}
