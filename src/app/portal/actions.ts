"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { sendCancellationEmails } from "@/lib/email";
import {
  PHASE_LABELS,
  PHASE_NUMERALS,
  formatSessionTimeLong,
  type PhaseKey,
} from "@/lib/portal";

export type CancelSessionResult = { ok: boolean; error: string | null };

/** A client cancelling their own session. The database enforces the 48-hour rule. */
export async function cancelMySession(sessionId: string): Promise<CancelSessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: session } = await supabase
    .from("scheduled_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("client_id", user.id)
    .eq("status", "scheduled")
    .single();
  if (!session) return { ok: false, error: "Session not found." };

  const { error: updateError } = await supabase
    .from("scheduled_sessions")
    .update({ status: "cancelled" })
    .eq("id", sessionId);
  if (updateError) {
    return {
      ok: false,
      error: updateError.message.includes("48 hours")
        ? "This session starts within 48 hours, so it can no longer be cancelled here — message Arun instead."
        : `Could not cancel: ${updateError.message}`,
    };
  }

  const start = new Date(session.starts_at);
  const when = formatSessionTimeLong(start);
  const lessonLabel = session.phase
    ? `Stage ${PHASE_NUMERALS[session.phase as PhaseKey]} — ${PHASE_LABELS[session.phase as PhaseKey]}${
        session.week ? `, Week ${session.week}` : ""
      }`
    : null;

  // Tell the coach in chat
  const { data: memberships } = await supabase
    .from("room_members")
    .select("room_id, rooms!inner(type)")
    .eq("user_id", user.id)
    .eq("rooms.type", "dm");
  const roomId = memberships?.[0]?.room_id;
  if (roomId) {
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: user.id,
      content: `I've cancelled our session on ${when}.`,
    });
  }

  // Email both sides + calendar removal
  const [{ data: clientProfile }, { data: coachProfile }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", user.id).single(),
    supabase.from("profiles").select("full_name, email").eq("role", "coach").limit(1).single(),
  ]);
  if (clientProfile?.email && coachProfile?.email) {
    await sendCancellationEmails({
      sessionId: session.id,
      start,
      durationMinutes: session.duration_minutes,
      location: session.location,
      lessonLabel,
      cancelledBy: "client",
      clientName: clientProfile.full_name || clientProfile.email,
      clientEmail: clientProfile.email,
      coachName: coachProfile.full_name || "Arun",
      coachEmail: coachProfile.email,
    });
  }

  revalidatePath("/portal", "layout");
  revalidatePath("/coach", "layout");
  return { ok: true, error: null };
}
