import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getUnreadSummary } from "@/lib/chat";
import { CreateClassroomForm } from "@/components/portal/coach/CreateClassroomForm";

export default async function CoachClassroomsPage() {
  const supabase = await createClient();

  const [{ data: rooms }, { data: clients }, unread] = await Promise.all([
    supabase
      .from("rooms")
      .select("id, name, created_at, room_members(user_id)")
      .eq("type", "classroom")
      .order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("role", "client").order("full_name"),
    getUnreadSummary(supabase),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Classrooms</h1>
      <p className="mt-1 text-sm text-muted">
        Group spaces where several clients and you can talk together.
      </p>

      <CreateClassroomForm clients={clients ?? []} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(rooms ?? []).map((room) => (
          <Link
            key={room.id}
            href={`/coach/classrooms/${room.id}`}
            className="border border-brown/20 bg-surface/50 p-5 transition-colors hover:border-burgundy/40"
          >
            <h2 className="font-display flex items-center gap-2 text-xl font-light text-foreground">
              {room.name}
              {(unread.byRoom.get(room.id) ?? 0) > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1.5 text-[11px] leading-none text-background">
                  {unread.byRoom.get(room.id)}
                </span>
              )}
            </h2>
            <p className="mt-1 text-xs tracking-[0.15em] text-muted uppercase">
              {(room.room_members as unknown as unknown[]).length} members
            </p>
          </Link>
        ))}
        {(rooms ?? []).length === 0 && (
          <p className="text-sm text-muted">No classrooms yet — create one above.</p>
        )}
      </div>
    </div>
  );
}
