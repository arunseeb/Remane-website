import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoomForUser } from "@/lib/chat";
import { ChatRoom } from "@/components/portal/ChatRoom";

export default async function CoachChatPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const context = await getRoomForUser(roomId);
  if (!context) notFound();

  const { room, userId, memberNames } = context;
  const title =
    room.type === "classroom"
      ? room.name ?? "Classroom"
      : Object.entries(memberNames).find(([id]) => id !== userId)?.[1] ?? "Conversation";

  return (
    <div>
      <Link
        href="/coach/messages"
        className="link-underline text-xs tracking-[0.2em] text-muted uppercase"
      >
        ← All messages
      </Link>
      <h1 className="font-display mt-3 mb-5 text-3xl font-light text-foreground">{title}</h1>
      <ChatRoom roomId={room.id} currentUserId={userId} memberNames={memberNames} isCoach />
    </div>
  );
}
