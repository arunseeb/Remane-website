import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";
import {
  PHASE_LABELS,
  PHASE_NUMERALS,
  formatSessionTimeLong,
  type PhaseKey,
} from "@/lib/portal";

// Called on a schedule by Vercel Cron. Emails clients a reminder when their
// session is within 3 days (sent once per session; only for sessions that were
// booked more than 3 days ahead, since recent bookings just got a confirmation).

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  // Fail closed: in production a missing CRON_SECRET must not leave this open —
  // anyone could trigger reminder emails to clients. Locally (no secret) it stays
  // callable for testing.
  const secret = process.env.CRON_SECRET;
  const authorized = secret
    ? request.headers.get("authorization") === `Bearer ${secret}`
    : process.env.NODE_ENV !== "production";
  if (!authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  }

  const admin = createAdminClient();
  const now = Date.now();

  const { data: sessions } = await admin
    .from("scheduled_sessions")
    .select("id, client_id, starts_at, duration_minutes, location, phase, week, created_at")
    .eq("status", "scheduled")
    .is("reminder_sent_at", null)
    .gt("starts_at", new Date(now).toISOString())
    .lte("starts_at", new Date(now + 3 * DAY_MS).toISOString());

  let sent = 0;
  for (const session of sessions ?? []) {
    // Booked less than 3 days out — the confirmation email already covered it
    if (new Date(session.starts_at).getTime() - new Date(session.created_at).getTime() < 3 * DAY_MS) {
      await admin
        .from("scheduled_sessions")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", session.id);
      continue;
    }

    const { data: client } = await admin
      .from("profiles")
      .select("full_name, email")
      .eq("id", session.client_id)
      .single();
    if (!client?.email) continue;

    const when = formatSessionTimeLong(new Date(session.starts_at));
    const lesson = session.phase
      ? `Stage ${PHASE_NUMERALS[session.phase as PhaseKey]} — ${PHASE_LABELS[session.phase as PhaseKey]}${
          session.week ? `, Week ${session.week}` : ""
        }`
      : null;

    const result = await sendEmail({
      to: [client.email],
      subject: `Reminder: your Remane session — ${when}`,
      text: [
        `A reminder that your next session is coming up.`,
        ``,
        `When: ${when}`,
        lesson && `Lesson: ${lesson}`,
        session.location && `Where: ${session.location}`,
        ``,
        `Need to change it? Sessions can be cancelled up to 48 hours in advance from your portal.`,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (result.ok) {
      sent += 1;
      await admin
        .from("scheduled_sessions")
        .update({ reminder_sent_at: new Date().toISOString() })
        .eq("id", session.id);
    }
  }

  return NextResponse.json({ ok: true, reminders_sent: sent });
}
