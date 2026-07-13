"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { removeClient } from "@/app/coach/actions";
import { formatDate, type Profile } from "@/lib/portal";

export function ClientCard({ client }: { client: Profile }) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleRemoveClient() {
    if (
      window.confirm(
        `Remove ${client.full_name || client.email}? This deletes their account, homework and messages permanently.`
      )
    ) {
      startTransition(async () => {
        const result = await removeClient(client.id);
        setError(result.ok ? null : `Could not remove: ${result.error ?? "unknown error"}`);
      });
    }
  }

  return (
    <details
      className={`border border-brown/20 bg-surface/50 ${pending ? "opacity-60" : ""}`}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 select-none [&::-webkit-details-marker]:hidden">
        <h2 className="font-display text-2xl font-light text-foreground">
          {client.full_name || client.email}
        </h2>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 text-muted transition-transform duration-300 [details[open]>summary>&]:rotate-180"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>

      <div className="px-6 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-brown/15 pt-4">
          <div>
            <p className="text-sm text-muted">{client.email}</p>
            <p className="mt-0.5 text-xs text-muted/70">Joined {formatDate(client.created_at)}</p>
          </div>
          <div className="flex items-center gap-5">
            <Link
              href={`/coach/clients/${client.id}`}
              className="link-underline text-xs tracking-[0.2em] text-burgundy uppercase"
            >
              Profile, notes & homework
            </Link>
            <button
              onClick={handleRemoveClient}
              disabled={pending}
              className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
            >
              {pending ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
        {error && <p className="mt-3 text-sm text-burgundy">{error}</p>}
      </div>
    </details>
  );
}
