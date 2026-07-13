"use client";

import { useActionState, useEffect, useRef } from "react";
import { addVideo, type AddVideoState } from "@/app/coach/actions";
import { PhaseFields } from "./PhaseFields";

const initialState: AddVideoState = { ok: false, error: null };

export function AddVideoForm() {
  const [state, formAction, pending] = useActionState(addVideo, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      if (detailsRef.current) detailsRef.current.open = false;
    }
  }, [state]);

  const inputClass =
    "w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";

  return (
    <details ref={detailsRef} className="mt-6 border border-brown/20 bg-surface/50">
      <summary className="cursor-pointer px-5 py-4 text-xs tracking-[0.25em] text-burgundy uppercase select-none">
        + Add a video
      </summary>
      <form ref={formRef} action={formAction} className="space-y-4 border-t border-brown/20 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="title" required placeholder="Title" className={inputClass} />
          <input
            name="youtube_url"
            required
            placeholder="YouTube link (unlisted)"
            className={inputClass}
          />
        </div>
        <textarea
          name="description"
          rows={2}
          placeholder="What this video covers…"
          className={inputClass}
        />
        <PhaseFields />
        <input
          name="tags"
          placeholder="Tags, separated by commas (e.g. confidence, dating, mindset)"
          className={inputClass}
        />
        {state.error && <p className="text-sm text-burgundy">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add to bank"}
        </button>
      </form>
    </details>
  );
}
