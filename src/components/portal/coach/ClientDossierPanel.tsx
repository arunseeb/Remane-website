"use client";

import { useState, useTransition } from "react";
import { saveDossier } from "@/app/coach/actions";
import { DictatingTextarea } from "./DictatingTextarea";
import { formatDateTime } from "@/lib/portal";

export function ClientDossierPanel({
  clientId,
  initialContent,
  updatedAt,
}: {
  clientId: string;
  initialContent: string;
  updatedAt: string | null;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const dirty = content !== initialContent;

  function handleSave() {
    startTransition(async () => {
      const result = await saveDossier(clientId, content);
      if (!result.ok) {
        // These notes are irreplaceable — a silent failure here loses them.
        setSaveError(`Not saved — ${result.error ?? "please try again"}. Your text is still in the box.`);
        return;
      }
      setSaveError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    });
  }

  return (
    <section className="border border-brown/20 bg-surface/50 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-light text-foreground">Profile</h2>
        <p className="text-xs text-muted/80">
          Private to you · never visible to the client
          {updatedAt && ` · last saved ${formatDateTime(updatedAt)}`}
        </p>
      </div>
      <p className="mt-1 mb-4 text-sm text-muted">
        The running picture of this man — background, patterns, what matters to him, what to
        watch for. Add to it as you learn.
      </p>

      <DictatingTextarea
        value={content}
        onChange={setContent}
        rows={10}
        placeholder="Background, family, work, the shape of the divorce, recurring themes, triggers, strengths…"
      />

      <div className="mt-3 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={pending || !dirty}
          className="border border-burgundy/50 px-6 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-40"
        >
          {pending ? "Saving…" : "Save profile"}
        </button>
        {saved && !dirty && <span className="text-xs text-muted">Saved.</span>}
        {saveError && <span className="text-xs text-burgundy">{saveError}</span>}
        {!saveError && dirty && !pending && (
          <span className="text-xs text-burgundy">Unsaved changes</span>
        )}
      </div>
    </section>
  );
}
