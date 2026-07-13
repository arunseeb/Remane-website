import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getRoomForUser } from "@/lib/chat";
import { ChatRoom } from "@/components/portal/ChatRoom";
import { ClassroomAdminPanel } from "@/components/portal/coach/ClassroomAdminPanel";

export default async function CoachClassroomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  const context = await getRoomForUser(roomId);
  if (!context || context.room.type !== "classroom") notFound();

  const { room, userId, memberNames } = context;

  const supabase = await createClient();
  const { data: clients } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "client")
    .order("full_name");

  const memberIds = Object.keys(memberNames);
  const nonMembers = (clients ?? []).filter((c) => !memberIds.includes(c.id));
  const clientMembers = (clients ?? []).filter((c) => memberIds.includes(c.id));

  return (
    <div>
      <Link
        href="/coach/classrooms"
        className="link-underline text-xs tracking-[0.2em] text-muted uppercase"
      >
        ← All classrooms
      </Link>
      <h1 className="font-display mt-3 mb-5 text-3xl font-light text-foreground">{room.name}</h1>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <ChatRoom roomId={room.id} currentUserId={userId} memberNames={memberNames} isCoach />
        <ClassroomAdminPanel
          roomId={room.id}
          members={clientMembers}
          nonMembers={nonMembers}
        />
      </div>
    </div>
  );
}
