import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigured } from "@/lib/supabase/env";
import { getHomeworkBadge, getUnreadSummary } from "@/lib/chat";
import { PortalShell } from "@/components/portal/PortalShell";

export const metadata = {
  title: "Coaching — Remane",
  description: "Remane coaching dashboard.",
};

export default async function CoachLayout({ children }: { children: React.ReactNode }) {
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
  if (profile?.role !== "coach") redirect("/portal");

  const [unread, homeworkBadge] = await Promise.all([
    getUnreadSummary(supabase),
    getHomeworkBadge(supabase, "coach"),
  ]);

  return (
    <PortalShell
      role="coach"
      name={profile.full_name || "Coach"}
      unread={unread}
      homeworkBadge={homeworkBadge}
    >
      {children}
    </PortalShell>
  );
}
