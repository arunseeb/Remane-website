import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoomForUser } from "@/lib/chat";
import { ChatRoom } from "@/components/portal/ChatRoom";

export default async function PortalClassroomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const context = await getRoomForUser(roomId);
  if (!context || context.room.type !== "classroom") notFound();

  const { room, userId, memberNames } = context;
  const others = Object.entries(memberNames)
    .filter(([id]) => id !== userId)
    .map(([, name]) => name);

  return (
    <div>
      <Link
        href="/portal/classrooms"
        className="link-underline text-xs tracking-[0.2em] text-muted uppercase"
      >
        ← All classrooms
      </Link>
      <h1 className="font-display mt-3 text-3xl font-light text-foreground">{room.name}</h1>
      <p className="mt-1 mb-5 text-sm text-muted">With {others.join(", ")}</p>
      <ChatRoom roomId={room.id} currentUserId={userId} memberNames={memberNames} />
    </div>
  );
}
