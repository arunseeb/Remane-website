"use client";

import { useActionState, useEffect, useRef } from "react";
import { createClassroom, type CreateClassroomState } from "@/app/coach/actions";

const initialState: CreateClassroomState = { ok: false, error: null };

export function CreateClassroomForm({
  clients,
}: {
  clients: { id: string; full_name: string; email: string }[];
}) {
  const [state, formAction, pending] = useActionState(createClassroom, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      if (detailsRef.current) detailsRef.current.open = false;
    }
  }, [state]);

  return (
    <details ref={detailsRef} className="mt-6 border border-brown/20 bg-surface/50">
      <summary className="cursor-pointer px-5 py-4 text-xs tracking-[0.25em] text-burgundy uppercase select-none">
        + Create a classroom
      </summary>
      <form ref={formRef} action={formAction} className="space-y-4 border-t border-brown/20 p-5">
        <input
          name="name"
          required
          placeholder="Classroom name (e.g. Recovery Circle)"
          className="w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
        />
        <fieldset>
          <legend className="mb-2 text-xs tracking-[0.2em] text-muted uppercase">Members</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {clients.map((client) => (
              <label key={client.id} className="flex items-center gap-2 text-sm text-foreground">
                <input type="checkbox" name="members" value={client.id} className="accent-burgundy" />
                {client.full_name || client.email}
              </label>
            ))}
          </div>
          {clients.length === 0 && (
            <p className="text-sm text-muted">Add clients first, then create a classroom.</p>
          )}
        </fieldset>
        {state.error && <p className="text-sm text-burgundy">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
        >
          {pending ? "Creating…" : "Create classroom"}
        </button>
      </form>
    </details>
  );
}
