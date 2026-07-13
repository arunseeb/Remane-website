"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cancelMySession } from "@/app/portal/actions";
import {
  canClientCancel,
  formatSessionTime,
  sessionLessonLabel,
  type ScheduledSession,
} from "@/lib/portal";

export function NextSessions({
  sessions,
}: {
  sessions: ScheduledSession[];
  userId?: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function cancelSession(session: ScheduledSession) {
    if (
      !window.confirm(
        `Cancel your session on ${formatSessionTime(session.starts_at)}? Arun will be notified.`
      )
    ) {
      return;
    }
    setError(null);
    setBusyId(session.id);
    const result = await cancelMySession(session.id);
    if (!result.ok) {
      setError(result.error);
      setBusyId(null);
      return;
    }
    router.refresh();
  }

  if (sessions.length === 0) {
    return (
      <p className="text-sm text-muted">
        No sessions booked yet — Arun will arrange your next one with you.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-burgundy">{error}</p>}
      {sessions.map((session) => {
        const cancellable = canClientCancel(session);
        return (
          <div
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-brown/20 bg-surface/50 px-5 py-4"
          >
            <div>
              <p className="text-foreground">{formatSessionTime(session.starts_at)}</p>
              <p className="mt-0.5 text-xs text-muted">
                {sessionLessonLabel(session) && `${sessionLessonLabel(session)} · `}
                {session.duration_minutes} min
                {session.location && ` · ${session.location}`}
              </p>
            </div>
            {cancellable ? (
              <button
                onClick={() => cancelSession(session)}
                disabled={busyId === session.id}
                className="border border-brown/30 px-4 py-2 text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy disabled:opacity-50"
              >
                {busyId === session.id ? "Cancelling…" : "Cancel"}
              </button>
            ) : (
              <span className="text-xs tracking-[0.1em] text-muted/80 uppercase">
                Starts within 48h — contact Arun to change
              </span>
            )}
          </div>
        );
      })}
      <p className="text-xs text-muted/80">
        Sessions can be cancelled up to 48 hours before they begin.
      </p>
    </div>
  );
}
