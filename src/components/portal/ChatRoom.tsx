"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDateTime, youtubeId, type Message } from "@/lib/portal";

/** Renders message text, turning URLs into links and YouTube links into embeds. */
function MessageBody({ content }: { content: string }) {
  const parts = content.split(/(https?:\/\/\S+)/g);
  const firstVideo = parts
    .map((p) => (p.startsWith("http") ? youtubeId(p) : null))
    .find(Boolean);

  return (
    <div>
      <p className="text-sm break-words whitespace-pre-wrap">
        {parts.map((part, i) =>
          part.startsWith("http") ? (
            <a
              key={i}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2"
            >
              {part}
            </a>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </p>
      {firstVideo && (
        <div className="mt-2 aspect-video w-full max-w-md overflow-hidden">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${firstVideo}`}
            title="Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      )}
    </div>
  );
}

export function ChatRoom({
  roomId,
  currentUserId,
  memberNames,
  isCoach = false,
}: {
  roomId: string;
  currentUserId: string;
  memberNames: Record<string, string>;
  isCoach?: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [flagError, setFlagError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [loaded, setLoaded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  // Whether the user is at (or near) the bottom — only then do new messages auto-scroll,
  // so someone re-reading older advice isn't yanked down mid-read.
  const stickToBottomRef = useRef(true);
  const supabaseRef = useRef(createClient());

  function markRead(refreshBadges = false) {
    // A backgrounded tab must not mark messages read — the whole point of the unread
    // badge (and the coach's 24h alert email) is messages nobody has actually seen.
    if (document.visibilityState !== "visible") return;
    supabaseRef.current
      .from("room_reads")
      .upsert(
        { room_id: roomId, user_id: currentUserId, last_read_at: new Date().toISOString() },
        { onConflict: "room_id,user_id" }
      )
      .then(({ error }) => {
        // Re-render the server-side chrome (nav badges) now that this room is read
        if (!error && refreshBadges) router.refresh();
      });
  }

  useEffect(() => {
    const supabase = supabaseRef.current;
    let cancelled = false;

    // Newest 500, shown oldest-first. Merging (rather than replacing) keeps any
    // message that arrived over realtime while a fetch was in flight.
    async function loadHistory() {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(500);
      if (cancelled || !data) return;
      setMessages((prev) => {
        const byId = new Map<string, Message>();
        for (const message of [...data, ...prev]) byId.set(message.id, message);
        return [...byId.values()].sort((a, b) => a.created_at.localeCompare(b.created_at));
      });
      setLoaded(true);
      markRead(true);
    }

    loadHistory();

    if (isCoach) {
      supabase
        .from("message_flags")
        .select("message_id")
        .then(({ data }) => {
          if (!cancelled && data) {
            setFlagged(new Set(data.map((f) => f.message_id)));
          }
        });
    }

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
        (payload) => {
          const message = payload.new as Message;
          setMessages((prev) =>
            prev.some((m) => m.id === message.id) ? prev : [...prev, message]
          );
          markRead(); // the room is open and visible, so incoming messages count as seen
        }
      )
      .subscribe((status) => {
        // Fires on every (re)join. Refetching here closes the two delivery gaps:
        // messages inserted between the history snapshot and the join, and messages
        // missed while the websocket was down (laptop sleep, network blip).
        if (status === "SUBSCRIBED") loadHistory();
      });

    // Catching up after the tab comes back into view counts as reading it.
    const onVisibilityChange = () => markRead(true);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, isCoach]);

  async function toggleFlag(messageId: string) {
    const supabase = supabaseRef.current;
    const isFlagged = flagged.has(messageId);
    setFlagError(null);
    setFlagged((prev) => {
      const next = new Set(prev);
      if (isFlagged) next.delete(messageId);
      else next.add(messageId);
      return next;
    });
    const { error } = isFlagged
      ? await supabase.from("message_flags").delete().eq("message_id", messageId)
      : await supabase
          .from("message_flags")
          .upsert({ message_id: messageId, flagged_by: currentUserId });
    if (error) {
      // Revert the optimistic update — the flag was NOT saved
      setFlagged((prev) => {
        const next = new Set(prev);
        if (isFlagged) next.add(messageId);
        else next.delete(messageId);
        return next;
      });
      setFlagError(
        "Couldn't save the flag — the database is missing the message_flags table (run the pending migration)."
      );
    }
  }

  // Scroll the message pane only (scrollIntoView would drag the whole page down),
  // and only when the user was already at the bottom.
  useEffect(() => {
    const list = listRef.current;
    if (list && stickToBottomRef.current) list.scrollTop = list.scrollHeight;
  }, [messages]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;
    setDraft("");
    setSendError(null);
    stickToBottomRef.current = true;
    const supabase = supabaseRef.current;
    const { data, error } = await supabase
      .from("messages")
      .insert({ room_id: roomId, sender_id: currentUserId, content })
      .select()
      .single();
    if (error) {
      setDraft(content);
      setSendError("That message didn't send — check your connection and try again.");
      return;
    }
    if (data) {
      setMessages((prev) => (prev.some((m) => m.id === data.id) ? prev : [...prev, data]));
    }
  }

  return (
    <div className="flex h-[65vh] flex-col border border-brown/20 bg-surface/50">
      {flagError && (
        <p className="border-b border-burgundy/30 bg-burgundy/5 px-4 py-2 text-xs text-burgundy">
          {flagError}
        </p>
      )}
      <div
        ref={listRef}
        onScroll={() => {
          const list = listRef.current;
          if (!list) return;
          stickToBottomRef.current =
            list.scrollHeight - list.scrollTop - list.clientHeight < 80;
        }}
        className="flex-1 space-y-4 overflow-y-auto p-4"
      >
        {!loaded && <p className="text-sm text-muted">Loading conversation…</p>}
        {loaded && messages.length === 0 && (
          <p className="text-sm text-muted">No messages yet. Say hello.</p>
        )}
        {loaded && messages.length >= 500 && (
          <p className="text-center text-xs text-muted/70">
            Showing the most recent 500 messages.
          </p>
        )}
        {messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          const isFlagged = flagged.has(message.id);
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`group relative max-w-[85%] px-4 py-3 sm:max-w-[70%] ${
                  mine
                    ? "bg-burgundy text-background"
                    : "border border-brown/20 bg-background text-foreground"
                } ${isCoach && isFlagged ? "ring-1 ring-gold" : ""}`}
              >
                {!mine && (
                  <p className="mb-1 text-[11px] tracking-[0.15em] text-muted uppercase">
                    {memberNames[message.sender_id] ?? "Member"}
                  </p>
                )}
                <MessageBody content={message.content} />
                <p className={`mt-1 text-[10px] ${mine ? "text-background/60" : "text-muted/70"}`}>
                  {formatDateTime(message.created_at)}
                  {isCoach && isFlagged && <span className="ml-2 text-gold-muted">⚑ flagged</span>}
                </p>
                {isCoach && (
                  <button
                    onClick={() => toggleFlag(message.id)}
                    aria-label={isFlagged ? "Remove flag" : "Flag as important"}
                    title={isFlagged ? "Remove flag" : "Flag as important (only you see this)"}
                    className={`absolute -top-2.5 ${mine ? "-left-2.5" : "-right-2.5"} h-6 w-6 border text-[12px] leading-none transition-all ${
                      isFlagged
                        ? "border-gold bg-gold text-background opacity-100"
                        : "border-brown/30 bg-background text-muted opacity-0 group-hover:opacity-100 focus-visible:opacity-100 hover:border-burgundy hover:text-burgundy"
                    }`}
                  >
                    ⚑
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {sendError && (
        <p className="border-t border-burgundy/30 bg-burgundy/5 px-4 py-2 text-xs text-burgundy">
          {sendError}
        </p>
      )}
      <form onSubmit={send} className="flex gap-2 border-t border-brown/20 bg-background p-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          aria-label="Message"
          className="flex-1 border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
        />
        <button
          type="submit"
          className="border border-burgundy/50 px-5 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5"
        >
          Send
        </button>
      </form>
    </div>
  );
}
