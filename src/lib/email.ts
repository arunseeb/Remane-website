import "server-only";

import { formatSessionTimeLong } from "@/lib/portal";

// Resend's shared onboarding address only delivers to the account owner's own
// email — real client mail needs a verified domain and EMAIL_FROM set to it,
// e.g. "Remane <sessions@remane.co.uk>".
const EMAIL_FROM = process.env.EMAIL_FROM ?? "Remane <onboarding@resend.dev>";

/** Send an email through Resend, optionally attaching a calendar invite. */
export async function sendEmail({
  to,
  subject,
  text,
  ics,
}: {
  to: string[];
  subject: string;
  text: string;
  ics?: { filename: string; content: string; method?: "REQUEST" | "CANCEL" };
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY not configured" };

  const payload: Record<string, unknown> = {
    from: EMAIL_FROM,
    to,
    subject,
    text,
  };
  if (ics) {
    payload.attachments = [
      {
        filename: ics.filename,
        content: Buffer.from(ics.content, "utf-8").toString("base64"),
        content_type: `text/calendar; method=${ics.method ?? "REQUEST"}`,
      },
    ];
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) return { ok: false, error: await response.text() };
  return { ok: true };
}

/** Emails both parties that a session is off, with a calendar CANCEL that removes the event. */
export async function sendCancellationEmails({
  sessionId,
  start,
  durationMinutes,
  location,
  lessonLabel,
  cancelledBy,
  clientName,
  clientEmail,
  coachName,
  coachEmail,
}: {
  sessionId: string;
  start: Date;
  durationMinutes: number;
  location: string;
  lessonLabel: string | null;
  cancelledBy: "client" | "coach";
  clientName: string;
  clientEmail: string;
  coachName: string;
  coachEmail: string;
}) {
  const when = formatSessionTimeLong(start);
  const summary = `Remane coaching — ${clientName}${lessonLabel ? ` · ${lessonLabel}` : ""}`;
  const ics = buildSessionInvite({
    uid: sessionId,
    start,
    durationMinutes,
    summary,
    description: `This session has been cancelled${cancelledBy === "client" ? ` by ${clientName}` : ""}.`,
    location,
    organizerName: coachName,
    organizerEmail: coachEmail,
    attendees: [
      { name: clientName, email: clientEmail },
      { name: coachName, email: coachEmail },
    ],
    method: "CANCEL",
  });
  const attachment = { filename: "remane-session-cancelled.ics", content: ics, method: "CANCEL" as const };

  const coachText = [
    cancelledBy === "client"
      ? `${clientName} has cancelled their session.`
      : `You cancelled this session.`,
    ``,
    `When it was: ${when}`,
    lessonLabel ? `Lesson: ${lessonLabel}` : null,
    ``,
    `The attached file removes it from your calendar automatically.`,
  ].filter((line): line is string => line !== null);

  const clientText = [
    cancelledBy === "client"
      ? `You've cancelled your session — this confirms it's off.`
      : `${coachName} has had to cancel your session. He'll be in touch to rearrange.`,
    ``,
    `When it was: ${when}`,
    lessonLabel ? `Lesson: ${lessonLabel}` : null,
    ``,
    `The attached file removes it from your calendar automatically.`,
  ].filter((line): line is string => line !== null);

  await Promise.allSettled([
    sendEmail({
      to: [coachEmail],
      subject: `Cancelled: ${clientName} — ${when}`,
      text: coachText.join("\n"),
      ics: attachment,
    }),
    sendEmail({
      to: [clientEmail],
      subject: `Session cancelled — ${when}`,
      text: clientText.join("\n"),
      ics: attachment,
    }),
  ]);
}

function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/**
 * A calendar invite (iCalendar). METHOD REQUEST adds the event in
 * Gmail/Outlook/Apple; METHOD CANCEL (same uid) removes it again.
 */
export function buildSessionInvite({
  uid,
  start,
  durationMinutes,
  summary,
  description,
  location,
  organizerName,
  organizerEmail,
  attendees,
  method = "REQUEST",
}: {
  uid: string;
  start: Date;
  durationMinutes: number;
  summary: string;
  description: string;
  location: string;
  organizerName: string;
  organizerEmail: string;
  attendees: { name: string; email: string }[];
  method?: "REQUEST" | "CANCEL";
}): string {
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const cancelled = method === "CANCEL";
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Remane//Portal//EN",
    `METHOD:${method}`,
    "BEGIN:VEVENT",
    `UID:${uid}@remane`,
    `SEQUENCE:${cancelled ? 1 : 0}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(cancelled ? `Cancelled: ${summary}` : summary)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    location ? `LOCATION:${icsEscape(location)}` : null,
    `ORGANIZER;CN=${icsEscape(organizerName)}:mailto:${organizerEmail}`,
    ...attendees.map(
      (attendee) =>
        `ATTENDEE;CN=${icsEscape(attendee.name)};ROLE=REQ-PARTICIPANT;PARTSTAT=${
          cancelled ? "DECLINED" : "NEEDS-ACTION"
        };RSVP=TRUE:mailto:${attendee.email}`
    ),
    cancelled ? "STATUS:CANCELLED" : "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean) as string[];
  return lines.join("\r\n");
}
