"use client";

import { useActionState, useEffect, useRef } from "react";
import { assignHomework, type AssignHomeworkState } from "@/app/coach/actions";

const initialState: AssignHomeworkState = { ok: false, error: null };

export function AssignHomeworkForm({
  clientId,
  clients,
}: {
  clientId?: string;
  clients?: { id: string; full_name: string; email: string }[];
}) {
  const [state, formAction, pending] = useActionState(assignHomework, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const inputClass =
    "w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";

  return (
    <form
      ref={formRef}
      action={formAction}
      className="mt-4 space-y-4 border border-brown/20 bg-surface/50 p-5"
    >
      {clientId ? (
        <input type="hidden" name="client_id" value={clientId} />
      ) : (
        <select name="client_id" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose a client…
          </option>
          {(clients ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name || c.email}
            </option>
          ))}
        </select>
      )}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <input name="title" required placeholder="Homework title" className={inputClass} />
        <label className="flex items-center gap-3 text-sm text-muted">
          Due
          <input
            name="due_date"
            type="date"
            className="border border-brown/30 bg-transparent px-3 py-2.5 text-base text-foreground focus:border-burgundy focus:outline-none"
          />
        </label>
      </div>
      <textarea
        name="instructions"
        rows={3}
        placeholder="Instructions for the client…"
        className={inputClass}
      />
      {state.error && <p className="text-sm text-burgundy">{state.error}</p>}
      {state.ok && <p className="text-sm text-muted">Homework set.</p>}
      <button
        type="submit"
        disabled={pending}
        className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
      >
        {pending ? "Setting…" : "Set homework"}
      </button>
    </form>
  );
}
