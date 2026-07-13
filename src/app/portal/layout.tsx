import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getHomeworkBadge, getUnreadSummary } from "@/lib/chat";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata = {
  title: "Members — Remane",
  description: "Private members area for Remane clients.",
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  if (!supabaseConfigured()) redirect("/login");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();
  if (profile?.role === "coach") redirect("/coach");

  const [unread, homeworkBadge] = await Promise.all([
    getUnreadSummary(supabase),
    getHomeworkBadge(supabase, "client"),
  ]);

  return (
    <PortalShell
      role="client"
      name={profile?.full_name || "Member"}
      unread={unread}
      homeworkBadge={homeworkBadge}
    >
      {children}
    </PortalShell>
  );
}
