"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { scheduleSession, type ScheduleSessionState } from "@/app/coach/actions";
import { PHASE_LABELS, PHASE_NUMERALS, type ClientPhase, type PhaseKey } from "@/lib/portal";

const initialState: ScheduleSessionState = { ok: false, error: null };

/**
 * Book the next session for one client.
 * Flow: pick stage (week fills itself) and time → copy the generated Zoom title →
 * create the Zoom meeting with it → paste the join link back → Book.
 */
export function BookSessionForm({
  clientId,
  clientName,
  phases,
}: {
  clientId: string;
  clientName: string;
  phases: ClientPhase[];
}) {
  const [state, formAction, pending] = useActionState(scheduleSession, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>(phases[0]?.phase ?? "");
  const [startsAt, setStartsAt] = useState("");
  const [copied, setCopied] = useState(false);

  // Reset after a successful booking. State is adjusted during render (the pattern
  // React recommends over setState-in-effect); the DOM-only cleanup stays in an effect.
  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state.ok) {
      setSelectedPhase(phases[0]?.phase ?? "");
      setStartsAt("");
      setCopied(false);
    }
  }

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      if (detailsRef.current) detailsRef.current.open = false;
    }
  }, [state]);

  const week = phases.find((p) => p.phase === selectedPhase)?.week ?? null;

  const startsAtDate = startsAt ? new Date(startsAt) : null;
  const startsAtIso =
    startsAtDate && !Number.isNaN(startsAtDate.getTime()) ? startsAtDate.toISOString() : "";

  const zoomTitle = (() => {
    if (!startsAt) return null;
    const start = new Date(startsAt);
    if (Number.isNaN(start.getTime())) return null;
    const when = start.toLocaleString("en-GB", {
      weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
    });
    const lesson =
      selectedPhase && week
        ? ` — Stage ${PHASE_NUMERALS[selectedPhase as PhaseKey]}, Week ${week}`
        : "";
    return `Remane — ${clientName}${lesson} — ${when}`;
  })();

  async function copyTitle() {
    if (!zoomTitle) return;
    await navigator.clipboard.writeText(zoomTitle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const inputClass =
    "border border-brown/30 bg-transparent px-3 py-2 text-sm text-foreground focus:border-burgundy focus:outline-none";

  return (
    <details ref={detailsRef} className="mt-4 border border-brown/15 bg-background">
      <summary className="cursor-pointer px-4 py-3 text-[11px] tracking-[0.2em] text-burgundy uppercase select-none">
        + Book next session
      </summary>
      <form ref={formRef} action={formAction} className="space-y-3 border-t border-brown/15 p-4">
        <input type="hidden" name="client_id" value={clientId} />
        <input type="hidden" name="week" value={week ?? ""} />
        {/* The datetime-local value has no timezone; the server would read it in ITS
            timezone (UTC on Vercel), shifting UK bookings by an hour during BST. The
            browser resolves the coach's wall time to a UTC instant here instead. */}
        <input type="hidden" name="starts_at" value={startsAtIso} />

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-[10px] tracking-[0.15em] text-muted uppercase">
            Stage
            <select
              name="phase"
              value={selectedPhase}
              onChange={(e) => setSelectedPhase(e.target.value)}
              className={inputClass}
            >
              {phases.map((phase) => (
                <option key={phase.phase} value={phase.phase}>
                  {PHASE_LABELS[phase.phase]}
                </option>
              ))}
              {phases.length === 0 && <option value="">No stage assigned</option>}
            </select>
          </label>
          <div className="pb-2 text-sm text-foreground">
            {week ? (
              <>
                Next lesson: <span className="text-burgundy">Week {week}</span>
              </>
            ) : (
              <span className="text-muted">—</span>
            )}
          </div>
          <label className="flex flex-col gap-1 text-[10px] tracking-[0.15em] text-muted uppercase">
            Date & time
            <input
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-[10px] tracking-[0.15em] text-muted uppercase">
            Length
            <select name="duration_minutes" defaultValue="60" className={inputClass}>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </label>
        </div>

        {zoomTitle && (
          <div className="border border-gold/40 bg-surface/60 p-3">
            <p className="text-[10px] tracking-[0.2em] text-muted uppercase">
              1 · Zoom meeting title — copy it, create the meeting in Zoom
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-3">
              <p className="text-sm text-foreground">{zoomTitle}</p>
              <button
                type="button"
                onClick={copyTitle}
                className="border border-brown/30 px-3 py-1 text-[10px] tracking-[0.15em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
              >
                {copied ? "Copied ✓" : "Copy title"}
              </button>
            </div>
          </div>
        )}

        <label className="flex flex-col gap-1 text-[10px] tracking-[0.15em] text-muted uppercase">
          2 · Paste the Zoom join link
          <input
            name="location"
            placeholder="https://zoom.us/j/… (or phone / in person)"
            className={`${inputClass} w-full`}
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="border border-burgundy/50 px-5 py-2 text-[11px] tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
          >
            {pending ? "Booking…" : "3 · Book"}
          </button>
          {state.error && <p className="text-sm text-burgundy">{state.error}</p>}
          {state.ok && (
            <p className="text-sm text-muted">
              Booked — confirmation emails and a calendar invite are on their way.
            </p>
          )}
        </div>
      </form>
    </details>
  );
}
