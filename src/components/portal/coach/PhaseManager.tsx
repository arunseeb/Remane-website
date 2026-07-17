"use client";

import { useState, useTransition } from "react";
import {
  addPhase,
  adjustWeek,
  completeSession,
  removePhase,
  setPhaseLength,
} from "@/app/coach/actions";
import { PhaseProgress } from "@/components/portal/PhaseProgress";
import {
  PHASE_KEYS,
  PHASE_LABELS,
  type ClientPhase,
  type PhaseKey,
} from "@/lib/portal";

export function PhaseManager({
  clientId,
  phases,
}: {
  clientId: string;
  phases: ClientPhase[];
}) {
  const [pending, startTransition] = useTransition();
  const [newPhase, setNewPhase] = useState("");

  const availablePhases = PHASE_KEYS.filter((key) => !phases.some((p) => p.phase === key));

  return (
    <div className={`mt-4 border border-brown/20 bg-surface/50 p-5 ${pending ? "opacity-60" : ""}`}>
      <div className="space-y-3">
        {phases.map((phase) => (
          <div key={phase.id} className="border border-brown/15 bg-background px-4 py-3">
            <PhaseProgress phase={phase} compact coachView />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <StageLengthInput
                phase={phase}
                disabled={pending}
                onSave={(weeks) => startTransition(() => setPhaseLength(phase.id, weeks))}
              />

              <div className="flex items-center gap-2">
                <button
                  title="Adjust week down"
                  onClick={() => startTransition(() => adjustWeek(phase.id, -1))}
                  disabled={pending || phase.week <= 1}
                  className="h-7 w-7 border border-brown/30 text-sm text-muted transition-colors hover:border-burgundy hover:text-burgundy disabled:opacity-40"
                >
                  −
                </button>
                <button
                  title="Adjust week up"
                  onClick={() => startTransition(() => adjustWeek(phase.id, 1))}
                  disabled={pending}
                  className="h-7 w-7 border border-brown/30 text-sm text-muted transition-colors hover:border-burgundy hover:text-burgundy"
                >
                  +
                </button>
                <button
                  onClick={() => startTransition(() => completeSession(phase.id))}
                  disabled={pending}
                  className="border border-burgundy/50 px-3 py-1.5 text-[11px] tracking-[0.15em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5"
                >
                  Session complete
                </button>
                <button
                  title="Remove phase"
                  aria-label={`Remove ${PHASE_LABELS[phase.phase]}`}
                  onClick={() => {
                    if (window.confirm(`Remove ${PHASE_LABELS[phase.phase]} from this client?`))
                      startTransition(() => removePhase(phase.id));
                  }}
                  disabled={pending}
                  className="h-7 w-7 text-muted transition-colors hover:text-burgundy"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
        {phases.length === 0 && (
          <p className="text-sm text-muted/80">Not in any phase yet.</p>
        )}
      </div>

      {availablePhases.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <select
            value={newPhase}
            onChange={(e) => setNewPhase(e.target.value)}
            className="border border-brown/30 bg-transparent px-3 py-1.5 text-sm text-foreground focus:border-burgundy focus:outline-none"
          >
            <option value="">Add phase…</option>
            {availablePhases.map((key) => (
              <option key={key} value={key}>
                {PHASE_LABELS[key]}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (newPhase) {
                startTransition(() => addPhase(clientId, newPhase as PhaseKey));
                setNewPhase("");
              }
            }}
            disabled={pending || !newPhase}
            className="border border-brown/30 px-3 py-1.5 text-[11px] tracking-[0.15em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

function StageLengthInput({
  phase,
  disabled,
  onSave,
}: {
  phase: ClientPhase;
  disabled: boolean;
  onSave: (weeks: number) => void;
}) {
  const saved = phase.total_weeks ?? 12;
  const [value, setValue] = useState(String(saved));

  // Resync when the server confirms a new length (adjust-during-render, not an effect).
  const [prevSaved, setPrevSaved] = useState(saved);
  if (saved !== prevSaved) {
    setPrevSaved(saved);
    setValue(String(saved));
  }

  function commit() {
    const weeks = Math.round(Number(value));
    if (Number.isFinite(weeks) && weeks >= 1 && weeks <= 104 && weeks !== saved) {
      onSave(weeks);
    } else {
      setValue(String(saved));
    }
  }

  return (
    <label className="flex items-center gap-2 text-xs text-muted">
      Stage length
      <input
        type="number"
        min={1}
        max={104}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className="w-16 border border-brown/30 bg-transparent px-2 py-1 text-sm text-foreground focus:border-burgundy focus:outline-none disabled:opacity-50"
      />
      weeks
    </label>
  );
}
