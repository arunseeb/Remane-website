import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUnreadSummary } from "@/lib/chat";
import { formatDateTime } from "@/lib/portal";

export default async function CoachMessagesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: rooms }, unread] = await Promise.all([
    supabase
      .from("rooms")
      .select("id, type, room_members(user_id, profiles!inner(full_name, email))")
      .eq("type", "dm"),
    getUnreadSummary(supabase),
  ]);

  const roomIds = (rooms ?? []).map((r) => r.id);
  const lastMessages = new Map<string, { content: string; created_at: string }>();
  if (roomIds.length > 0) {
    const { data: messages } = await supabase
      .from("messages")
      .select("room_id, content, created_at")
      .in("room_id", roomIds)
      .order("created_at", { ascending: false });
    for (const message of messages ?? []) {
      if (!lastMessages.has(message.room_id)) lastMessages.set(message.room_id, message);
    }
  }

  const conversations = (rooms ?? [])
    .map((room) => {
      const other = (room.room_members as unknown as {
        user_id: string;
        profiles: { full_name: string; email: string };
      }[]).find((m) => m.user_id !== user?.id);
      return {
        id: room.id,
        name: other ? other.profiles.full_name || other.profiles.email : "(no client)",
        last: lastMessages.get(room.id) ?? null,
        unread: unread.byRoom.get(room.id) ?? 0,
      };
    })
    .sort(
      (a, b) =>
        b.unread - a.unread ||
        (b.last?.created_at ?? "").localeCompare(a.last?.created_at ?? "")
    );

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Messages</h1>
      <div className="mt-6 divide-y divide-brown/15 border border-brown/20 bg-surface/50">
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/coach/messages/${conversation.id}`}
            className="flex items-baseline justify-between gap-4 px-5 py-4 transition-colors hover:bg-burgundy/5"
          >
            <div className="min-w-0">
              <p className={conversation.unread > 0 ? "font-semibold text-foreground" : "text-foreground"}>
                {conversation.name}
                {conversation.unread > 0 && (
                  <span className="ml-2 inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-burgundy px-1.5 text-[11px] leading-none text-background">
                    {conversation.unread}
                  </span>
                )}
              </p>
              {conversation.last && (
                <p className="mt-0.5 truncate text-sm text-muted">{conversation.last.content}</p>
              )}
            </div>
            {conversation.last && (
              <span className="shrink-0 text-xs text-muted/70">
                {formatDateTime(conversation.last.created_at)}
              </span>
            )}
          </Link>
        ))}
        {conversations.length === 0 && (
          <p className="px-5 py-4 text-sm text-muted">
            No conversations yet — a private chat is created automatically when you add a client.
          </p>
        )}
      </div>
    </div>
  );
}
