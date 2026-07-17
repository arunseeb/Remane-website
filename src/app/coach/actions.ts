"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildSessionInvite, sendCancellationEmails, sendEmail } from "@/lib/email";
import {
  PHASE_KEYS,
  PHASE_LABELS,
  PHASE_NUMERALS,
  formatSessionTimeLong,
  type PhaseKey,
} from "@/lib/portal";

async function requireCoach() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "coach") throw new Error("Not authorised.");
  return { supabase, coachId: user.id };
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

// ---------- Clients ----------

export type AddClientState = { ok: boolean; error: string | null };

export async function addClient(
  _prev: AddClientState,
  formData: FormData
): Promise<AddClientState> {
  const { coachId } = await requireCoach();

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phases = formData.getAll("phases").map(String) as PhaseKey[];

  if (!name || !email) return { ok: false, error: "Name and email are required." };
  if (phases.some((p) => !PHASE_KEYS.includes(p)))
    return { ok: false, error: "Invalid phase selected." };

  const admin = createAdminClient();

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(email, {
    data: { full_name: name, role: "client" },
    redirectTo: `${siteUrl()}/auth/callback`,
  });
  if (inviteError || !invited.user) {
    return { ok: false, error: inviteError?.message ?? "Invitation failed." };
  }
  const clientId = invited.user.id;

  if (phases.length > 0) {
    await admin
      .from("client_phases")
      .insert(phases.map((phase) => ({ client_id: clientId, phase })));
  }

  const { data: room } = await admin
    .from("rooms")
    .insert({ type: "dm" })
    .select("id")
    .single();
  if (room) {
    await admin.from("room_members").insert([
      { room_id: room.id, user_id: coachId },
      { room_id: room.id, user_id: clientId },
    ]);
  }

  revalidatePath("/coach", "layout");
  return { ok: true, error: null };
}

export type RemoveClientState = { ok: boolean; error: string | null };

export async function removeClient(clientId: string): Promise<RemoveClientState> {
  await requireCoach();

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return { ok: false, error: "SUPABASE_SECRET_KEY is missing on the server." };
  }

  // Delete the client's DM rooms (memberships alone would cascade, leaving empty rooms)
  const { data: memberships } = await admin
    .from("room_members")
    .select("room_id, rooms!inner(type)")
    .eq("user_id", clientId)
    .eq("rooms.type", "dm");
  const dmRoomIds = (memberships ?? []).map((m) => m.room_id);
  if (dmRoomIds.length > 0) {
    await admin.from("rooms").delete().in("id", dmRoomIds);
  }

  // Report the failure rather than swallowing it: a wrong secret key silently
  // turned this whole action into a no-op button for days.
  const { error } = await admin.auth.admin.deleteUser(clientId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/coach", "layout");
  return { ok: true, error: null };
}

// ---------- Phases & sessions ----------

export async function addPhase(clientId: string, phase: PhaseKey) {
  const { supabase } = await requireCoach();
  await supabase.from("client_phases").insert({ client_id: clientId, phase });
  revalidatePath("/coach", "layout");
}

export async function removePhase(clientPhaseId: string) {
  const { supabase } = await requireCoach();
  await supabase.from("client_phases").delete().eq("id", clientPhaseId);
  revalidatePath("/coach", "layout");
}

export async function completeSession(clientPhaseId: string) {
  const { supabase } = await requireCoach();
  const { data: row } = await supabase
    .from("client_phases")
    .select("client_id, phase, week")
    .eq("id", clientPhaseId)
    .single();
  if (!row) return;
  await supabase.from("client_phases").update({ week: row.week + 1 }).eq("id", clientPhaseId);
  await supabase.from("sessions").insert({ client_id: row.client_id, phase: row.phase });
  revalidatePath("/coach", "layout");
}

export async function setPhaseLength(clientPhaseId: string, totalWeeks: number) {
  const { supabase } = await requireCoach();
  const weeks = Math.min(104, Math.max(1, Math.round(totalWeeks)));
  await supabase.from("client_phases").update({ total_weeks: weeks }).eq("id", clientPhaseId);
  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
}

export async function adjustWeek(clientPhaseId: string, delta: number) {
  const { supabase } = await requireCoach();
  const { data: row } = await supabase
    .from("client_phases")
    .select("week")
    .eq("id", clientPhaseId)
    .single();
  if (!row) return;
  const week = Math.max(1, row.week + delta);
  await supabase.from("client_phases").update({ week }).eq("id", clientPhaseId);
  revalidatePath("/coach", "layout");
}

// ---------- Private client notes (coach only) ----------

export type NoteState = { ok: boolean; error: string | null };

export async function saveDossier(
  clientId: string,
  content: string
): Promise<NoteState> {
  const { supabase } = await requireCoach();
  const { error } = await supabase
    .from("client_dossier")
    .upsert(
      { client_id: clientId, content, updated_at: new Date().toISOString() },
      { onConflict: "client_id" }
    );
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/coach/clients/${clientId}`);
  return { ok: true, error: null };
}

export async function addNote(_prev: NoteState, formData: FormData): Promise<NoteState> {
  const { supabase } = await requireCoach();

  const clientId = String(formData.get("client_id") ?? "");
  const sessionDate = String(formData.get("session_date") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const transcript = String(formData.get("transcript") ?? "").trim();
  const phaseRaw = String(formData.get("phase") ?? "");
  const phase = PHASE_KEYS.includes(phaseRaw as PhaseKey) ? (phaseRaw as PhaseKey) : null;
  const weekRaw = Number(formData.get("week") ?? 0);
  const week = phase && weekRaw >= 1 && weekRaw <= 104 ? Math.round(weekRaw) : null;

  if (!clientId) return { ok: false, error: "Missing client." };
  if (!summary && !transcript)
    return { ok: false, error: "Add a transcript or a summary before saving." };

  const { error } = await supabase.from("client_notes").insert({
    client_id: clientId,
    session_date: sessionDate || new Date().toISOString().slice(0, 10),
    title,
    summary,
    transcript,
    phase,
    week,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath(`/coach/clients/${clientId}`);
  return { ok: true, error: null };
}

export async function updateNote(
  noteId: string,
  fields: {
    session_date: string;
    title: string;
    summary: string;
    transcript: string;
    phase?: PhaseKey | null;
    week?: number | null;
  }
) {
  const { supabase } = await requireCoach();
  const { data } = await supabase
    .from("client_notes")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", noteId)
    .select("client_id")
    .single();
  if (data) revalidatePath(`/coach/clients/${data.client_id}`);
}

export async function deleteNote(noteId: string) {
  const { supabase } = await requireCoach();
  const { data } = await supabase
    .from("client_notes")
    .delete()
    .eq("id", noteId)
    .select("client_id")
    .single();
  if (data) revalidatePath(`/coach/clients/${data.client_id}`);
}

// ---------- Scheduled sessions ----------

export type ScheduleSessionState = { ok: boolean; error: string | null };

export async function scheduleSession(
  _prev: ScheduleSessionState,
  formData: FormData
): Promise<ScheduleSessionState> {
  const { supabase, coachId } = await requireCoach();

  const clientId = String(formData.get("client_id") ?? "");
  const startsAt = String(formData.get("starts_at") ?? "");
  const duration = Number(formData.get("duration_minutes") ?? 60);
  const location = String(formData.get("location") ?? "").trim();
  const phaseRaw = String(formData.get("phase") ?? "");
  const phase = PHASE_KEYS.includes(phaseRaw as PhaseKey) ? (phaseRaw as PhaseKey) : null;
  const weekRaw = Number(formData.get("week") ?? 0);
  const week = phase && weekRaw >= 1 && weekRaw <= 104 ? Math.round(weekRaw) : null;

  if (!clientId || !startsAt) return { ok: false, error: "Client and time are required." };
  const starts = new Date(startsAt);
  if (Number.isNaN(starts.getTime()) || starts.getTime() < Date.now()) {
    return { ok: false, error: "Pick a time in the future." };
  }

  const { data: session, error } = await supabase
    .from("scheduled_sessions")
    .insert({
      client_id: clientId,
      starts_at: starts.toISOString(),
      duration_minutes: Math.min(480, Math.max(15, Math.round(duration))),
      location,
      phase,
      week,
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  const lessonLabel = phase
    ? `Stage ${PHASE_NUMERALS[phase]} — ${PHASE_LABELS[phase]}${week ? `, Week ${week}` : ""}`
    : "";
  const when = formatSessionTimeLong(starts);

  // Let the client know in chat
  const { data: memberships } = await supabase
    .from("room_members")
    .select("room_id, rooms!inner(type)")
    .eq("user_id", clientId)
    .eq("rooms.type", "dm");
  const roomId = memberships?.[0]?.room_id;
  if (roomId) {
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: coachId,
      content: `Our next session is booked for ${when}.${
        lessonLabel ? `\n${lessonLabel}` : ""
      }${location ? `\n${location}` : ""}`,
    });
  }

  // Confirmation emails with a calendar invite (client + coach)
  const [{ data: clientProfile }, { data: coachProfile }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", clientId).single(),
    supabase.from("profiles").select("full_name, email").eq("id", coachId).single(),
  ]);
  if (clientProfile?.email && coachProfile?.email) {
    const clientName = clientProfile.full_name || clientProfile.email;
    const coachName = coachProfile.full_name || "Arun";
    const summary = `Remane coaching — ${clientName}${lessonLabel ? ` · ${lessonLabel}` : ""}`;
    const description = [
      `Coaching session with ${coachName}.`,
      lessonLabel,
      location && `Where: ${location}`,
    ]
      .filter(Boolean)
      .join("\n");
    const ics = buildSessionInvite({
      uid: session.id,
      start: starts,
      durationMinutes: Math.min(480, Math.max(15, Math.round(duration))),
      summary,
      description,
      location,
      organizerName: coachName,
      organizerEmail: coachProfile.email,
      attendees: [
        { name: clientName, email: clientProfile.email },
        { name: coachName, email: coachProfile.email },
      ],
    });
    const bodyLines = [
      `Your next Remane session is confirmed.`,
      ``,
      `When: ${when}`,
      lessonLabel ? `Lesson: ${lessonLabel}` : null,
      location ? `Where: ${location}` : null,
      ``,
      `The attached invite adds it to your calendar.`,
      `Need to change it? You can cancel up to 48 hours in advance from your portal.`,
    ].filter((line): line is string => line !== null);
    // Send separately so one failure doesn't block the other
    await Promise.allSettled([
      sendEmail({
        to: [clientProfile.email],
        subject: `Session confirmed — ${when}`,
        text: bodyLines.join("\n"),
        ics: { filename: "remane-session.ics", content: ics },
      }),
      sendEmail({
        to: [coachProfile.email],
        subject: `Booked: ${clientName} — ${when}${lessonLabel ? ` (${lessonLabel})` : ""}`,
        text: `Session booked with ${clientName}.\n\nWhen: ${when}\n${lessonLabel ? `Lesson: ${lessonLabel}\n` : ""}${location ? `Where: ${location}\n` : ""}\nThe attached invite adds it to your calendar.`,
        ics: { filename: "remane-session.ics", content: ics },
      }),
    ]);
  }

  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

export async function cancelSessionAsCoach(sessionId: string) {
  const { supabase, coachId } = await requireCoach();

  const { data: session } = await supabase
    .from("scheduled_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("status", "scheduled")
    .single();
  // Already cancelled (e.g. by the client moments earlier) — don't rewrite the
  // cancellation attribution or send a second round of emails.
  if (!session) return;

  await supabase
    .from("scheduled_sessions")
    .update({
      status: "cancelled",
      cancelled_by: coachId,
      cancelled_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("status", "scheduled");

  const start = new Date(session.starts_at);
  const when = formatSessionTimeLong(start);
  const lessonLabel = session.phase
    ? `Stage ${PHASE_NUMERALS[session.phase as PhaseKey]} — ${PHASE_LABELS[session.phase as PhaseKey]}${
        session.week ? `, Week ${session.week}` : ""
      }`
    : null;

  // Tell the client in chat
  const { data: memberships } = await supabase
    .from("room_members")
    .select("room_id, rooms!inner(type)")
    .eq("user_id", session.client_id)
    .eq("rooms.type", "dm");
  const roomId = memberships?.[0]?.room_id;
  if (roomId) {
    await supabase.from("messages").insert({
      room_id: roomId,
      sender_id: coachId,
      content: `I've had to cancel our session on ${when} — I'll be in touch to rearrange.`,
    });
  }

  // Emails + calendar removal for both sides
  const [{ data: clientProfile }, { data: coachProfile }] = await Promise.all([
    supabase.from("profiles").select("full_name, email").eq("id", session.client_id).single(),
    supabase.from("profiles").select("full_name, email").eq("id", coachId).single(),
  ]);
  if (clientProfile?.email && coachProfile?.email) {
    await sendCancellationEmails({
      sessionId: session.id,
      start,
      durationMinutes: session.duration_minutes,
      location: session.location,
      lessonLabel,
      cancelledBy: "coach",
      clientName: clientProfile.full_name || clientProfile.email,
      clientEmail: clientProfile.email,
      coachName: coachProfile.full_name || "Arun",
      coachEmail: coachProfile.email,
    });
  }

  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
}

// ---------- Homework ----------

export type AssignHomeworkState = { ok: boolean; error: string | null };

export async function assignHomework(
  _prev: AssignHomeworkState,
  formData: FormData
): Promise<AssignHomeworkState> {
  const { supabase } = await requireCoach();

  const clientId = String(formData.get("client_id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const instructions = String(formData.get("instructions") ?? "").trim();
  const dueDate = String(formData.get("due_date") ?? "");
  const attachmentPath = String(formData.get("attachment_path") ?? "").trim();
  const attachmentName = String(formData.get("attachment_name") ?? "").trim();

  if (!clientId || !title) return { ok: false, error: "Client and title are required." };

  const { error } = await supabase.from("homework").insert({
    client_id: clientId,
    title,
    instructions,
    due_date: dueDate || null,
    attachment_path: attachmentPath || null,
    attachment_name: attachmentName || null,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

// Save one feedback entry into the history, snapshotting the submission it
// responded to (homework.* is overwritten when the client resubmits).
async function recordReview(
  supabase: Awaited<ReturnType<typeof requireCoach>>["supabase"],
  coachId: string,
  homeworkId: string,
  feedback: string,
  outcome: "returned" | "completed"
) {
  const { data: hw } = await supabase
    .from("homework")
    .select("submission_text, submission_file_path")
    .eq("id", homeworkId)
    .single();
  await supabase.from("homework_reviews").insert({
    homework_id: homeworkId,
    coach_id: coachId,
    feedback,
    outcome,
    submission_text: hw?.submission_text ?? null,
    submission_file_path: hw?.submission_file_path ?? null,
  });
}

export async function returnHomework(
  homeworkId: string,
  feedback: string
): Promise<NoteState> {
  const { supabase, coachId } = await requireCoach();
  await recordReview(supabase, coachId, homeworkId, feedback, "returned");
  const { error } = await supabase
    .from("homework")
    .update({ status: "returned", feedback, returned_at: new Date().toISOString() })
    .eq("id", homeworkId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

export async function completeHomework(
  homeworkId: string,
  feedback?: string
): Promise<NoteState> {
  const { supabase, coachId } = await requireCoach();
  if (feedback) {
    await recordReview(supabase, coachId, homeworkId, feedback, "completed");
  }
  const { error } = await supabase
    .from("homework")
    .update({
      status: "completed",
      ...(feedback ? { feedback, returned_at: new Date().toISOString() } : {}),
    })
    .eq("id", homeworkId);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

export async function deleteHomework(homeworkId: string) {
  const { supabase } = await requireCoach();
  await supabase.from("homework").delete().eq("id", homeworkId);
  revalidatePath("/coach", "layout");
  revalidatePath("/portal", "layout");
}

// ---------- Video bank ----------

export type AddVideoState = { ok: boolean; error: string | null };

function readPhase(formData: FormData): PhaseKey | null {
  const raw = String(formData.get("phase") ?? "");
  return PHASE_KEYS.includes(raw as PhaseKey) ? (raw as PhaseKey) : null;
}

export async function addVideo(_prev: AddVideoState, formData: FormData): Promise<AddVideoState> {
  const { supabase } = await requireCoach();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const youtubeUrl = String(formData.get("youtube_url") ?? "").trim();
  const phase = readPhase(formData);
  const shareWithPhase = formData.get("share_with_phase") === "on" && phase !== null;
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (!title || !youtubeUrl) return { ok: false, error: "Title and YouTube link are required." };

  const { error } = await supabase.from("videos").insert({
    title,
    description,
    youtube_url: youtubeUrl,
    tags,
    phase,
    share_with_phase: shareWithPhase,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/coach/library");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

export async function deleteVideo(videoId: string) {
  const { supabase } = await requireCoach();
  await supabase.from("videos").delete().eq("id", videoId);
  revalidatePath("/coach/library");
  revalidatePath("/portal", "layout");
}

export async function sendVideoToClient(videoId: string, clientId: string, note: string) {
  const { supabase, coachId } = await requireCoach();

  const { data: video } = await supabase
    .from("videos")
    .select("title, youtube_url")
    .eq("id", videoId)
    .single();
  if (!video) throw new Error("Video not found.");

  await supabase
    .from("video_shares")
    .upsert(
      { video_id: videoId, client_id: clientId, note },
      { onConflict: "video_id,client_id" }
    );

  // Drop the video into the client's chat so they see it immediately
  const { data: memberships } = await supabase
    .from("room_members")
    .select("room_id, rooms!inner(type)")
    .eq("user_id", clientId)
    .eq("rooms.type", "dm");
  const roomId = memberships?.[0]?.room_id;
  if (roomId) {
    const content = `I've sent you a video: ${video.title}\n${video.youtube_url}${
      note ? `\n\n${note}` : ""
    }`;
    await supabase.from("messages").insert({ room_id: roomId, sender_id: coachId, content });
  }

  revalidatePath("/coach/library");
  revalidatePath("/portal", "layout");
}

// ---------- Resources (documents & links) ----------

export type AddResourceState = { ok: boolean; error: string | null };

export async function addResource(
  _prev: AddResourceState,
  formData: FormData
): Promise<AddResourceState> {
  const { supabase } = await requireCoach();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const phase = readPhase(formData);
  const shareWithPhase = formData.get("share_with_phase") === "on" && phase !== null;
  const url = String(formData.get("url") ?? "").trim();
  const filePath = String(formData.get("file_path") ?? "").trim();

  if (!title) return { ok: false, error: "Title is required." };
  if (!url && !filePath) return { ok: false, error: "Add a link, or upload a file." };

  const { error } = await supabase.from("resources").insert({
    title,
    description,
    phase,
    kind: filePath ? "file" : "link",
    url: filePath ? null : url,
    file_path: filePath || null,
    share_with_phase: shareWithPhase,
  });
  if (error) return { ok: false, error: error.message };

  revalidatePath("/coach/library");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

export async function deleteResource(resourceId: string) {
  const { supabase } = await requireCoach();
  const { data } = await supabase
    .from("resources")
    .delete()
    .eq("id", resourceId)
    .select("file_path")
    .single();
  if (data?.file_path) {
    await supabase.storage.from("resources").remove([data.file_path]);
  }
  revalidatePath("/coach/library");
  revalidatePath("/portal", "layout");
}

export async function sendResourceToClient(
  resourceId: string,
  clientId: string,
  note: string
) {
  const { supabase, coachId } = await requireCoach();

  const { data: resource } = await supabase
    .from("resources")
    .select("title, kind, url")
    .eq("id", resourceId)
    .single();
  if (!resource) throw new Error("Resource not found.");

  await supabase
    .from("resource_shares")
    .upsert(
      { resource_id: resourceId, client_id: clientId, note },
      { onConflict: "resource_id,client_id" }
    );

  // Tell them in chat, so it doesn't sit unnoticed in the library
  const { data: memberships } = await supabase
    .from("room_members")
    .select("room_id, rooms!inner(type)")
    .eq("user_id", clientId)
    .eq("rooms.type", "dm");
  const roomId = memberships?.[0]?.room_id;
  if (roomId) {
    const link = resource.kind === "link" && resource.url ? `\n${resource.url}` : "";
    const content = `I've added something to your library: ${resource.title}${link}${
      note ? `\n\n${note}` : ""
    }`;
    await supabase.from("messages").insert({ room_id: roomId, sender_id: coachId, content });
  }

  revalidatePath("/coach/library");
  revalidatePath("/portal", "layout");
}

// ---------- Classrooms ----------

export type CreateClassroomState = { ok: boolean; error: string | null };

export async function createClassroom(
  _prev: CreateClassroomState,
  formData: FormData
): Promise<CreateClassroomState> {
  const { supabase, coachId } = await requireCoach();

  const name = String(formData.get("name") ?? "").trim();
  const memberIds = formData.getAll("members").map(String);
  if (!name) return { ok: false, error: "Classroom name is required." };

  const { data: room, error } = await supabase
    .from("rooms")
    .insert({ type: "classroom", name })
    .select("id")
    .single();
  if (error || !room) return { ok: false, error: error?.message ?? "Could not create classroom." };

  const members = [coachId, ...memberIds].map((userId) => ({
    room_id: room.id,
    user_id: userId,
  }));
  await supabase.from("room_members").insert(members);

  revalidatePath("/coach/classrooms");
  revalidatePath("/portal", "layout");
  return { ok: true, error: null };
}

export async function deleteClassroom(roomId: string) {
  const { supabase } = await requireCoach();
  await supabase.from("rooms").delete().eq("id", roomId).eq("type", "classroom");
  revalidatePath("/coach/classrooms");
  revalidatePath("/portal", "layout");
}

export async function addClassroomMember(roomId: string, userId: string) {
  const { supabase } = await requireCoach();
  await supabase.from("room_members").insert({ room_id: roomId, user_id: userId });
  revalidatePath(`/coach/classrooms/${roomId}`);
  revalidatePath("/portal", "layout");
}

export async function removeClassroomMember(roomId: string, userId: string) {
  const { supabase } = await requireCoach();
  await supabase.from("room_members").delete().eq("room_id", roomId).eq("user_id", userId);
  revalidatePath(`/coach/classrooms/${roomId}`);
  revalidatePath("/portal", "layout");
}
