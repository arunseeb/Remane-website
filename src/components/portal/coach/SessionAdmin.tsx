"use client";

import { useTransition } from "react";
import { cancelSessionAsCoach } from "@/app/coach/actions";
import { BookSessionForm } from "./BookSessionForm";
import {
  formatSessionTime,
  sessionLessonLabel,
  type ClientPhase,
  type ScheduledSession,
} from "@/lib/portal";

export function SessionAdmin({
  clientId,
  clientName,
  phases,
  sessions,
}: {
  clientId: string;
  clientName: string;
  phases: ClientPhase[];
  sessions: ScheduledSession[];
}) {
  const [cancelling, startTransition] = useTransition();

  return (
    <div className="mt-4 border border-brown/20 bg-surface/50 p-5">
      <BookSessionForm clientId={clientId} clientName={clientName} phases={phases} />

      <div className="mt-5 space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex flex-wrap items-center justify-between gap-3 border border-brown/15 bg-background px-4 py-3"
          >
            <div>
              <p className="text-sm text-foreground">{formatSessionTime(session.starts_at)}</p>
              <p className="text-xs text-muted">
                {sessionLessonLabel(session) && `${sessionLessonLabel(session)} · `}
                {session.duration_minutes} min{session.location && ` · ${session.location}`}
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm("Cancel this session?"))
                  startTransition(() => cancelSessionAsCoach(session.id));
              }}
              disabled={cancelling}
              className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
            >
              Cancel
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <p className="text-sm text-muted">No upcoming sessions booked.</p>
        )}
      </div>
    </div>
  );
}
