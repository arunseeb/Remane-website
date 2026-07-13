"use client";

import { useState, useTransition } from "react";
import { deleteNote, updateNote } from "@/app/coach/actions";
import { DictatingTextarea } from "./DictatingTextarea";
import {
  PHASE_LABELS,
  formatDate,
  phaseWeekLabel,
  type ClientNote,
  type ClientPhase,
  type PhaseKey,
} from "@/lib/portal";

export function NoteCard({ note, phases }: { note: ClientNote; phases: ClientPhase[] }) {
  const [editing, setEditing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [pending, startTransition] = useTransition();

  const [sessionDate, setSessionDate] = useState(note.session_date);
  const [title, setTitle] = useState(note.title);
  const [phase, setPhase] = useState<string>(note.phase ?? "");
  const [week, setWeek] = useState<string>(note.week ? String(note.week) : "");
  const [summary, setSummary] = useState(note.summary);
  const [transcript, setTranscript] = useState(note.transcript);

  function selectPhase(next: string) {
    setPhase(next);
    const current = phases.find((p) => p.phase === next)?.week;
    setWeek(current ? String(current) : "");
  }

  function handleSave() {
    startTransition(async () => {
      const weekNumber = Math.round(Number(week));
      await updateNote(note.id, {
        session_date: sessionDate,
        title,
        summary,
        transcript,
        phase: phase ? (phase as PhaseKey) : null,
        week: phase && weekNumber >= 1 && weekNumber <= 104 ? weekNumber : null,
      });
      setEditing(false);
    });
  }

  function handleCancel() {
    setSessionDate(note.session_date);
    setTitle(note.title);
    setPhase(note.phase ?? "");
    setWeek(note.week ? String(note.week) : "");
    setSummary(note.summary);
    setTranscript(note.transcript);
    setEditing(false);
  }

  const wordCount = note.transcript.trim() ? note.transcript.trim().split(/\s+/).length : 0;

  return (
    <article className={`border border-brown/20 bg-surface/50 p-5 ${pending ? "opacity-60" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-light text-foreground">
            {note.title || phaseWeekLabel(note.phase, note.week) || "Conversation"}
          </h3>
          <p className="mt-0.5 text-xs tracking-[0.15em] text-muted uppercase">
            {formatDate(note.session_date)}
            {note.title && phaseWeekLabel(note.phase, note.week)
              ? ` · ${phaseWeekLabel(note.phase, note.week)}`
              : ""}
            {wordCount > 0 && ` · ${wordCount.toLocaleString()} words`}
          </p>
        </div>
        {!editing && (
          <div className="flex gap-4">
            <button
              onClick={() => setEditing(true)}
              className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
            >
              Edit
            </button>
            <button
              onClick={() => {
                if (window.confirm("Delete this conversation record permanently?"))
                  startTransition(() => deleteNote(note.id));
              }}
              className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {editing ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
              className="border border-brown/30 bg-transparent px-3 py-2 text-base text-foreground focus:border-burgundy focus:outline-none"
            />
            <select
              value={phase}
              onChange={(e) => selectPhase(e.target.value)}
              className="border border-brown/30 bg-transparent px-3 py-2 text-base text-foreground focus:border-burgundy focus:outline-none"
            >
              <option value="">No stage</option>
              {phases.map((p) => (
                <option key={p.phase} value={p.phase}>
                  {PHASE_LABELS[p.phase]}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-xs tracking-[0.15em] text-muted uppercase">
              Week
              <input
                type="number"
                min={1}
                max={104}
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                disabled={!phase}
                className="w-20 border border-brown/30 bg-transparent px-3 py-2 text-base text-foreground focus:border-burgundy focus:outline-none disabled:opacity-40"
              />
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="min-w-0 flex-1 border border-brown/30 bg-transparent px-4 py-2 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
            />
          </div>
          <DictatingTextarea
            label="Key points / summary"
            value={summary}
            onChange={setSummary}
            rows={5}
          />
          <DictatingTextarea
            label="Full transcript"
            value={transcript}
            onChange={setTranscript}
            rows={10}
          />
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={pending}
              className="border border-burgundy/50 px-6 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Save changes"}
            </button>
            <button
              onClick={handleCancel}
              disabled={pending}
              className="border border-brown/30 px-6 py-2.5 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {note.summary && (
            <div className="mt-3 border-l-2 border-gold pl-4">
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {note.summary}
              </p>
            </div>
          )}

          {note.transcript && (
            <div className="mt-4">
              <button
                onClick={() => setShowTranscript((v) => !v)}
                className="link-underline text-xs tracking-[0.2em] text-burgundy uppercase"
              >
                {showTranscript ? "Hide transcript" : "Read full transcript"}
              </button>
              {showTranscript && (
                <div className="mt-3 max-h-96 overflow-y-auto border border-brown/15 bg-background p-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted">
                    {note.transcript}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
