"use client";

import { useState, useTransition } from "react";
import { deleteResource, sendResourceToClient } from "@/app/coach/actions";
import { PHASE_LABELS, type Resource } from "@/lib/portal";

type Person = { id: string; full_name: string; email: string };

export function ResourceCard({
  resource,
  clients,
  sharedWith,
  fileUrl,
}: {
  resource: Resource;
  clients: Person[];
  sharedWith: string[];
  fileUrl: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [clientId, setClientId] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const href = resource.kind === "file" ? fileUrl : resource.url;
  const sharedNames = clients
    .filter((c) => sharedWith.includes(c.id))
    .map((c) => c.full_name || c.email);

  function handleSend() {
    if (!clientId) return;
    const target = clients.find((c) => c.id === clientId);
    startTransition(async () => {
      await sendResourceToClient(resource.id, clientId, note.trim());
      setSent(target ? target.full_name || target.email : "client");
      setClientId("");
      setNote("");
    });
  }

  return (
    <div
      className={`flex flex-col border border-brown/20 bg-surface/50 p-5 ${
        pending ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-light text-foreground">{resource.title}</h3>
          <p className="mt-0.5 text-xs tracking-[0.15em] text-muted uppercase">
            {resource.kind === "file" ? "Document" : "Link"}
            {resource.phase && ` · ${PHASE_LABELS[resource.phase]}`}
            {resource.share_with_phase && " · whole stage"}
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Remove this from the library?"))
              startTransition(() => deleteResource(resource.id));
          }}
          disabled={pending}
          className="shrink-0 text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
        >
          Delete
        </button>
      </div>

      {resource.description && (
        <p className="mt-2 text-sm text-muted">{resource.description}</p>
      )}

      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline mt-2 inline-block self-start text-xs tracking-[0.2em] text-burgundy uppercase"
        >
          {resource.kind === "file" ? "Open document" : "Open link"}
        </a>
      )}

      {sharedNames.length > 0 && (
        <p className="mt-2 text-xs text-muted/80">Sent to: {sharedNames.join(", ")}</p>
      )}

      <div className="mt-auto space-y-2 pt-4">
        <div className="flex gap-2">
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="min-w-0 flex-1 border border-brown/30 bg-transparent px-2 py-2 text-sm text-foreground focus:border-burgundy focus:outline-none"
          >
            <option value="">Send to client…</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.full_name || client.email}
              </option>
            ))}
          </select>
          <button
            onClick={handleSend}
            disabled={pending || !clientId}
            className="border border-burgundy/50 px-4 py-2 text-[11px] tracking-[0.15em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-40"
          >
            Send
          </button>
        </div>
        {clientId && (
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note to go with it…"
            className="w-full border border-brown/30 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
          />
        )}
        {sent && !pending && (
          <p className="text-xs text-muted">Sent to {sent} — it&apos;s in their library.</p>
        )}
      </div>
    </div>
  );
}
