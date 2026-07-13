import { createClient } from "@/lib/supabase/server";
import { getRoomForUser } from "@/lib/chat";
import { ChatRoom } from "@/components/portal/ChatRoom";

export default async function PortalMessagesPage() {
  const supabase = await createClient();

  // RLS means this only ever returns rooms the client belongs to
  const { data: rooms } = await supabase
    .from("rooms")
    .select("id")
    .eq("type", "dm")
    .order("created_at")
    .limit(1);

  const roomId = rooms?.[0]?.id;
  const context = roomId ? await getRoomForUser(roomId) : null;

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Messages</h1>
      <p className="mt-1 mb-5 text-sm text-muted">
        A private conversation between you and Arun.
      </p>
      {context ? (
        <ChatRoom
          roomId={context.room.id}
          currentUserId={context.userId}
          memberNames={context.memberNames}
        />
      ) : (
        <p className="text-sm text-muted">
          Your private chat hasn&apos;t been set up yet — it will appear here shortly.
        </p>
      )}
    </div>
  );
}
