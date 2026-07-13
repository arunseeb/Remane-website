"use client";

import { useState, useTransition } from "react";
import { deleteVideo, sendVideoToClient } from "@/app/coach/actions";
import { PHASE_LABELS, youtubeId, type Video } from "@/lib/portal";

type Person = { id: string; full_name: string; email: string };

export function VideoCard({
  video,
  clients,
  sharedWith,
}: {
  video: Video;
  clients: Person[];
  sharedWith: string[];
}) {
  const [pending, startTransition] = useTransition();
  const [clientId, setClientId] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState<string | null>(null);

  const id = youtubeId(video.youtube_url);
  const sharedNames = clients
    .filter((c) => sharedWith.includes(c.id))
    .map((c) => c.full_name || c.email);

  function handleSend() {
    if (!clientId) return;
    const target = clients.find((c) => c.id === clientId);
    startTransition(async () => {
      await sendVideoToClient(video.id, clientId, note.trim());
      setSent(target ? target.full_name || target.email : "client");
      setClientId("");
      setNote("");
    });
  }

  return (
    <div className={`flex flex-col border border-brown/20 bg-surface/50 ${pending ? "opacity-60" : ""}`}>
      {id ? (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-background text-sm text-muted">
          Invalid YouTube link
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-light text-foreground">{video.title}</h3>
          <button
            onClick={() => {
              if (window.confirm("Remove this video from the bank?"))
                startTransition(() => deleteVideo(video.id));
            }}
            disabled={pending}
            className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
          >
            Delete
          </button>
        </div>
        {(video.phase || video.share_with_phase) && (
          <p className="mt-0.5 text-xs tracking-[0.15em] text-muted uppercase">
            {video.phase && PHASE_LABELS[video.phase]}
            {video.share_with_phase && " · whole stage"}
          </p>
        )}
        {video.description && <p className="mt-1 text-sm text-muted">{video.description}</p>}
        {video.tags.length > 0 && (
          <p className="mt-2 text-xs tracking-[0.1em] text-gold-muted uppercase">
            {video.tags.join(" · ")}
          </p>
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
          {sent && !pending && <p className="text-xs text-muted">Sent to {sent} — it&apos;s in their chat.</p>}
        </div>
      </div>
    </div>
  );
}
