import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Room } from "@/lib/portal";

export type UnreadSummary = {
  byRoom: Map<string, number>;
  messages: number;   // unread across direct chats
  classrooms: number; // unread across classrooms
};

/**
 * Homework needing attention.
 * Coach: submissions waiting to be marked. Client: homework still to submit
 * (assigned, or returned for revision).
 */
export async function getHomeworkBadge(
  supabase: SupabaseClient,
  role: "coach" | "client"
): Promise<number> {
  const statuses = role === "coach" ? ["submitted"] : ["assigned", "returned"];
  const { count, error } = await supabase
    .from("homework")
    .select("id", { count: "exact", head: true })
    .in("status", statuses);
  return error ? 0 : (count ?? 0);
}

/** Unread message counts for the signed-in user, grouped by room type. */
export async function getUnreadSummary(supabase: SupabaseClient): Promise<UnreadSummary> {
  const empty: UnreadSummary = { byRoom: new Map(), messages: 0, classrooms: 0 };
  const [{ data: counts, error }, { data: rooms }] = await Promise.all([
    supabase.rpc("unread_counts"),
    supabase.from("rooms").select("id, type"),
  ]);
  // rpc missing (migration not run yet) — degrade to no badges
  if (error || !counts) return empty;

  const typeByRoom = new Map((rooms ?? []).map((room) => [room.id, room.type]));
  const summary: UnreadSummary = { byRoom: new Map(), messages: 0, classrooms: 0 };
  for (const row of counts as { room_id: string; unread: number }[]) {
    const unread = Number(row.unread);
    if (!unread) continue;
    summary.byRoom.set(row.room_id, unread);
    if (typeByRoom.get(row.room_id) === "classroom") summary.classrooms += unread;
    else summary.messages += unread;
  }
  return summary;
}

export type RoomContext = {
  room: Room;
  userId: string;
  memberNames: Record<string, string>;
};

/** Load a room the current user belongs to (RLS hides everything else). */
export async function getRoomForUser(roomId: string): Promise<RoomContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: room } = await supabase.from("rooms").select("*").eq("id", roomId).single();
  if (!room) return null;

  const { data: members } = await supabase
    .from("room_members")
    .select("user_id, profiles!inner(full_name, email)")
    .eq("room_id", roomId);

  const memberNames: Record<string, string> = {};
  for (const member of members ?? []) {
    const profile = member.profiles as unknown as { full_name: string; email: string };
    memberNames[member.user_id] = profile.full_name || profile.email;
  }

  return { room: room as Room, userId: user.id, memberNames };
}
