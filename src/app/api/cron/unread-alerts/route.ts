import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Called on a schedule by Vercel Cron (see vercel.json). Emails the coach when a
// client's message has sat unread for more than 24 hours. Each message is alerted
// at most once (tracked in room_alerts).

const ALERT_TO = process.env.UNREAD_ALERT_EMAIL ?? "remaneofficial@gmail.com";
const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  // Vercel Cron sends Authorization: Bearer <CRON_SECRET> when the env var is set.
  // Fail closed: in production a missing secret must not leave this open — the alert
  // email contains excerpts of private client messages. Locally it stays callable.
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

  const { data: coaches, error: coachError } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "coach");
  // Distinguish "the query failed" from "there genuinely is no coach". Reporting a
  // failed admin query as `no coach` is what hid a bad SUPABASE_SECRET_KEY in
  // production — every admin-key feature was dead and this route still said ok.
  if (coachError) {
    return NextResponse.json(
      { error: `Could not read profiles: ${coachError.message}` },
      { status: 500 }
    );
  }
  if (!coaches || coaches.length === 0) {
    return NextResponse.json({ ok: true, alerted: 0, reason: "no coach" });
  }
  const coachIds = new Set(coaches.map((coach) => coach.id));

  const cutoff = new Date(Date.now() - DAY_MS).toISOString();

  const [{ data: reads }, { data: alerts }, { data: rooms }, { data: profiles }] =
    await Promise.all([
      admin.from("room_reads").select("room_id, user_id, last_read_at"),
      admin.from("room_alerts").select("room_id, alerted_until"),
      admin.from("rooms").select("id, type"),
      admin.from("profiles").select("id, full_name, email"),
    ]);

  const coachReads = new Map(
    (reads ?? [])
      .filter((read) => coachIds.has(read.user_id))
      .map((read) => [read.room_id, read.last_read_at])
  );
  const alertedUntil = new Map((alerts ?? []).map((a) => [a.room_id, a.alerted_until]));
  const roomType = new Map((rooms ?? []).map((room) => [room.id, room.type]));
  const names = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name || profile.email])
  );

  // Messages from clients, older than 24h, newest first (bounded window)
  const { data: messages } = await admin
    .from("messages")
    .select("id, room_id, sender_id, content, created_at")
    .lt("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(500);

  type RoomAlert = { count: number; oldest: string; latest: string; sample: string; sender: string };
  const perRoom = new Map<string, RoomAlert>();

  for (const message of messages ?? []) {
    if (coachIds.has(message.sender_id)) continue;
    const lastRead = coachReads.get(message.room_id) ?? "1970-01-01T00:00:00Z";
    const alerted = alertedUntil.get(message.room_id) ?? "1970-01-01T00:00:00Z";
    if (message.created_at <= lastRead) continue; // coach has read it
    if (message.created_at <= alerted) continue;  // already emailed about it
    const entry = perRoom.get(message.room_id);
    if (entry) {
      entry.count += 1;
      entry.oldest = message.created_at < entry.oldest ? message.created_at : entry.oldest;
    } else {
      perRoom.set(message.room_id, {
        count: 1,
        oldest: message.created_at,
        latest: message.created_at,
        sample: message.content.slice(0, 120),
        sender: names.get(message.sender_id) ?? "A client",
      });
    }
  }

  if (perRoom.size === 0) {
    return NextResponse.json({ ok: true, alerted: 0 });
  }

  const lines = [...perRoom.entries()].map(([roomId, info]) => {
    const kind = roomType.get(roomId) === "classroom" ? "classroom" : "private chat";
    const hours = Math.floor((Date.now() - new Date(info.oldest).getTime()) / 3600000);
    return `• ${info.sender} (${kind}) — ${info.count} unread message${info.count > 1 ? "s" : ""}, oldest ${hours}h ago\n  “${info.sample}”`;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const body = [
    "Some client messages have been waiting more than 24 hours:",
    "",
    ...lines,
    "",
    `Reply from your dashboard: ${siteUrl}/coach/messages`,
  ].join("\n");

  const emailResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM ?? "Remane <onboarding@resend.dev>",
      to: [ALERT_TO],
      subject: `Remane: ${perRoom.size} conversation${perRoom.size > 1 ? "s" : ""} waiting over 24h`,
      text: body,
    }),
  });
  if (!emailResponse.ok) {
    const detail = await emailResponse.text();
    return NextResponse.json({ error: `Email failed: ${detail}` }, { status: 502 });
  }

  // Record what we've alerted on so the same messages never trigger twice
  await admin.from("room_alerts").upsert(
    [...perRoom.entries()].map(([roomId, info]) => ({
      room_id: roomId,
      alerted_until: info.latest,
    })),
    { onConflict: "room_id" }
  );

  return NextResponse.json({ ok: true, alerted: perRoom.size });
}
