import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AssignHomeworkForm } from "@/components/portal/coach/AssignHomeworkForm";
import { HomeworkReviewCard } from "@/components/portal/coach/HomeworkReviewCard";
import { ClientDossierPanel } from "@/components/portal/coach/ClientDossierPanel";
import { AddNoteForm } from "@/components/portal/coach/AddNoteForm";
import { NoteCard } from "@/components/portal/coach/NoteCard";
import { SessionAdmin } from "@/components/portal/coach/SessionAdmin";
import { PhaseManager } from "@/components/portal/coach/PhaseManager";
import { AccountPendingBadge } from "@/components/portal/coach/AccountPendingBadge";
import {
  PHASE_LABELS,
  formatDate,
  sortPhases,
  type ClientNote,
  type Homework,
  type HomeworkReview,
  type ScheduledSession,
} from "@/lib/portal";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [
    { data: client },
    { data: phases },
    { data: homework },
    { data: reviewRows },
    { data: dmMembership },
    { data: dossier },
    { data: notes },
    { data: sessions },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", id).eq("role", "client").single(),
    supabase.from("client_phases").select("*").eq("client_id", id).order("started_at"),
    supabase
      .from("homework")
      .select("*")
      .eq("client_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("homework_reviews")
      .select("*, homework!inner(client_id)")
      .eq("homework.client_id", id)
      .order("created_at"),
    supabase
      .from("room_members")
      .select("room_id, rooms!inner(type)")
      .eq("user_id", id)
      .eq("rooms.type", "dm"),
    supabase.from("client_dossier").select("*").eq("client_id", id).maybeSingle(),
    supabase
      .from("client_notes")
      .select("*")
      .eq("client_id", id)
      .order("session_date", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("scheduled_sessions")
      .select("*")
      .eq("client_id", id)
      .eq("status", "scheduled")
      .gt("starts_at", new Date().toISOString())
      .order("starts_at"),
  ]);

  if (!client) notFound();

  const clientActivated = Boolean(client.activated_at);

  const fileUrls = new Map<string, string>();
  const assignmentUrls = new Map<string, string>();
  for (const hw of (homework ?? []) as Homework[]) {
    if (hw.submission_file_path) {
      const { data } = await supabase.storage
        .from("homework")
        .createSignedUrl(hw.submission_file_path, 3600);
      if (data) fileUrls.set(hw.id, data.signedUrl);
    }
    if (hw.attachment_path) {
      const { data } = await supabase.storage
        .from("homework")
        .createSignedUrl(hw.attachment_path, 3600);
      if (data) assignmentUrls.set(hw.id, data.signedUrl);
    }
  }

  const reviewsByHw = new Map<string, HomeworkReview[]>();
  for (const review of (reviewRows ?? []) as HomeworkReview[]) {
    const list = reviewsByHw.get(review.homework_id) ?? [];
    list.push(review);
    reviewsByHw.set(review.homework_id, list);
  }

  const dmRoomId = dmMembership?.[0]?.room_id;

  return (
    <div>
      <Link
        href="/coach"
        className="link-underline text-xs tracking-[0.2em] text-muted uppercase"
      >
        ← All clients
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-light text-foreground">
              {client.full_name || client.email}
            </h1>
            {!clientActivated && <AccountPendingBadge />}
          </div>
          <p className="mt-1 text-sm text-muted">
            {client.email} · joined {formatDate(client.created_at)}
          </p>
          <p className="mt-2 text-sm text-foreground">
            {(phases ?? []).length > 0
              ? sortPhases((phases ?? []) as import("@/lib/portal").ClientPhase[])
                  .map((p) => `${PHASE_LABELS[p.phase as keyof typeof PHASE_LABELS]} — week ${p.week}`)
                  .join("  ·  ")
              : "Not in any phase yet."}
          </p>
        </div>
        {dmRoomId && (
          <Link
            href={`/coach/messages/${dmRoomId}`}
            className="border border-burgundy/50 px-5 py-2.5 text-xs tracking-[0.25em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5"
          >
            Message
          </Link>
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-light text-foreground">Conversations</h2>
        <p className="text-xs text-muted/80">Private to you · never visible to the client</p>
      </div>
      <AddNoteForm
        clientId={client.id}
        phases={sortPhases((phases ?? []) as import("@/lib/portal").ClientPhase[])}
      />
      <details className="mt-4 border border-brown/20 bg-surface/50">
        <summary className="cursor-pointer list-none px-5 py-4 text-xs tracking-[0.25em] text-burgundy uppercase select-none [&::-webkit-details-marker]:hidden">
          Conversation bank ({(notes ?? []).length})
        </summary>
        <div className="space-y-4 border-t border-brown/20 p-5">
          {((notes ?? []) as ClientNote[]).map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              phases={sortPhases((phases ?? []) as import("@/lib/portal").ClientPhase[])}
            />
          ))}
          {(notes ?? []).length === 0 && (
            <p className="text-sm text-muted">
              No conversations recorded yet. Paste a transcript above, or dictate straight into
              the field.
            </p>
          )}
        </div>
      </details>

      <div className="mt-10">
        <ClientDossierPanel
          clientId={client.id}
          initialContent={dossier?.content ?? ""}
          updatedAt={dossier?.updated_at ?? null}
        />
      </div>

      <h2 className="font-display mt-10 text-2xl font-light text-foreground">Progress</h2>
      <PhaseManager
        clientId={client.id}
        phases={sortPhases((phases ?? []) as import("@/lib/portal").ClientPhase[])}
      />

      <h2 className="font-display mt-10 text-2xl font-light text-foreground">Set homework</h2>
      <AssignHomeworkForm clientId={client.id} />

      <details className="mt-6 border border-brown/20 bg-surface/50">
        <summary className="flex cursor-pointer list-none items-center gap-2.5 px-5 py-4 text-xs tracking-[0.25em] text-burgundy uppercase select-none [&::-webkit-details-marker]:hidden">
          Homework bank ({(homework ?? []).length})
          {((homework ?? []) as Homework[]).filter((hw) => hw.status === "submitted").length >
            0 && (
            <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] leading-none tracking-[0.1em] text-background normal-case">
              {((homework ?? []) as Homework[]).filter((hw) => hw.status === "submitted").length}{" "}
              to mark
            </span>
          )}
        </summary>
        <div className="space-y-4 border-t border-brown/20 p-5">
          {((homework ?? []) as Homework[]).map((hw) => (
            <HomeworkReviewCard
              key={hw.id}
              homework={hw}
              fileUrl={fileUrls.get(hw.id) ?? null}
              assignmentFileUrl={assignmentUrls.get(hw.id) ?? null}
              reviews={reviewsByHw.get(hw.id) ?? []}
            />
          ))}
          {(homework ?? []).length === 0 && (
            <p className="text-sm text-muted">No homework set yet.</p>
          )}
        </div>
      </details>

      <h2 className="font-display mt-10 text-2xl font-light text-foreground">
        Book next session
      </h2>
      <SessionAdmin
        clientId={client.id}
        clientName={client.full_name || client.email}
        phases={sortPhases((phases ?? []) as import("@/lib/portal").ClientPhase[])}
        sessions={((sessions ?? []) as ScheduledSession[])}
      />
    </div>
  );
}
