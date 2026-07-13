"use client";

import { useActionState, useEffect, useRef } from "react";
import { addClient, type AddClientState } from "@/app/coach/actions";
import { PHASE_KEYS, PHASE_LABELS } from "@/lib/portal";

const initialState: AddClientState = { ok: false, error: null };

export function AddClientForm() {
  const [state, formAction, pending] = useActionState(addClient, initialState);
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
        + Add a new client
      </summary>
      <form ref={formRef} action={formAction} className="space-y-4 border-t border-brown/20 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <input name="name" required placeholder="Full name" className={inputClass} />
          <input name="email" type="email" required placeholder="Email" className={inputClass} />
        </div>
        <fieldset>
          <legend className="mb-2 text-xs tracking-[0.2em] text-muted uppercase">
            Starting phase(s)
          </legend>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {PHASE_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" name="phases" value={key} className="accent-burgundy" />
                {PHASE_LABELS[key]}
              </label>
            ))}
          </div>
        </fieldset>
        {state.error && <p className="text-sm text-burgundy">{state.error}</p>}
        {state.ok && (
          <p className="text-sm text-muted">Client added — an invitation email has been sent.</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
        >
          {pending ? "Sending invitation…" : "Add client & send invitation"}
        </button>
      </form>
    </details>
  );
}
