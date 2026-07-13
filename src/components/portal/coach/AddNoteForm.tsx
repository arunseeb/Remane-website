"use client";

import { useState, useTransition } from "react";
import { addNote } from "@/app/coach/actions";
import { DictatingTextarea } from "./DictatingTextarea";
import { PHASE_LABELS, type ClientPhase } from "@/lib/portal";

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function AddNoteForm({
  clientId,
  phases,
}: {
  clientId: string;
  phases: ClientPhase[];
}) {
  const [open, setOpen] = useState(false);
  const [sessionDate, setSessionDate] = useState(today());
  const [title, setTitle] = useState("");
  const [phase, setPhase] = useState<string>(phases[0]?.phase ?? "");
  const [week, setWeek] = useState<string>(phases[0]?.week ? String(phases[0].week) : "");
  const [summary, setSummary] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function selectPhase(next: string) {
    setPhase(next);
    const current = phases.find((p) => p.phase === next)?.week;
    setWeek(current ? String(current) : "");
  }

  function handleSave() {
    setError(null);
    const formData = new FormData();
    formData.set("client_id", clientId);
    formData.set("session_date", sessionDate);
    formData.set("title", title);
    formData.set("phase", phase);
    formData.set("week", week);
    formData.set("summary", summary);
    formData.set("transcript", transcript);

    startTransition(async () => {
      const result = await addNote({ ok: false, error: null }, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSessionDate(today());
      setTitle("");
      selectPhase(phases[0]?.phase ?? "");
      setSummary("");
      setTranscript("");
      setOpen(false);
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-4 w-full border border-brown/20 bg-surface/50 px-5 py-4 text-xs tracking-[0.25em] text-burgundy uppercase transition-colors hover:border-burgundy/40"
      >
        + Record a conversation
      </button>
    );
  }

  return (
    <div className="mt-4 space-y-4 border border-brown/20 bg-surface/50 p-5">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
          Date
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="border border-brown/30 bg-transparent px-3 py-2 text-base normal-case text-foreground focus:border-burgundy focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
          Stage
          <select
            value={phase}
            onChange={(e) => selectPhase(e.target.value)}
            className="border border-brown/30 bg-transparent px-3 py-2 text-base normal-case tracking-normal text-foreground focus:border-burgundy focus:outline-none"
          >
            {phases.map((p) => (
              <option key={p.phase} value={p.phase}>
                {PHASE_LABELS[p.phase]}
              </option>
            ))}
            {phases.length === 0 && <option value="">No stage</option>}
          </select>
        </label>
        <label className="flex items-center gap-3 text-xs tracking-[0.2em] text-muted uppercase">
          Week
          <input
            type="number"
            min={1}
            max={104}
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            disabled={!phase}
            className="w-20 border border-brown/30 bg-transparent px-3 py-2 text-base normal-case text-foreground focus:border-burgundy focus:outline-none disabled:opacity-40"
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
        placeholder="The memorable points — paste your AI summary here, or dictate it."
      />

      <DictatingTextarea
        label="Full transcript"
        value={transcript}
        onChange={setTranscript}
        rows={10}
        placeholder="Paste the full conversation transcript from your recorder here."
      />

      {error && <p className="text-sm text-burgundy">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleSave}
          disabled={pending}
          className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save conversation"}
        </button>
        <button
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          disabled={pending}
          className="border border-brown/30 px-7 py-3 text-xs tracking-[0.25em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
