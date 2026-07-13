"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  addClassroomMember,
  deleteClassroom,
  removeClassroomMember,
} from "@/app/coach/actions";

type Person = { id: string; full_name: string; email: string };

export function ClassroomAdminPanel({
  roomId,
  members,
  nonMembers,
}: {
  roomId: string;
  members: Person[];
  nonMembers: Person[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [selected, setSelected] = useState("");

  return (
    <aside className={`border border-brown/20 bg-surface/50 p-5 ${pending ? "opacity-60" : ""}`}>
      <h2 className="text-xs tracking-[0.25em] text-muted uppercase">Members</h2>
      <ul className="mt-3 space-y-2">
        {members.map((member) => (
          <li key={member.id} className="flex items-center justify-between gap-2 text-sm">
            <span className="text-foreground">{member.full_name || member.email}</span>
            <button
              onClick={() => startTransition(() => removeClassroomMember(roomId, member.id))}
              disabled={pending}
              title="Remove from classroom"
              className="text-muted transition-colors hover:text-burgundy"
            >
              ×
            </button>
          </li>
        ))}
        {members.length === 0 && <li className="text-sm text-muted">No clients in here yet.</li>}
      </ul>

      {nonMembers.length > 0 && (
        <div className="mt-4 flex gap-2">
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="min-w-0 flex-1 border border-brown/30 bg-transparent px-2 py-1.5 text-sm text-foreground focus:border-burgundy focus:outline-none"
          >
            <option value="">Add member…</option>
            {nonMembers.map((person) => (
              <option key={person.id} value={person.id}>
                {person.full_name || person.email}
              </option>
            ))}
          </select>
          <button
            onClick={() => {
              if (selected) {
                startTransition(() => addClassroomMember(roomId, selected));
                setSelected("");
              }
            }}
            disabled={pending || !selected}
            className="border border-brown/30 px-3 py-1.5 text-[11px] tracking-[0.15em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy disabled:opacity-40"
          >
            Add
          </button>
        </div>
      )}

      <button
        onClick={() => {
          if (window.confirm("Delete this classroom and its messages?")) {
            startTransition(async () => {
              await deleteClassroom(roomId);
              router.replace("/coach/classrooms");
            });
          }
        }}
        disabled={pending}
        className="mt-6 w-full border border-brown/30 px-4 py-2 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
      >
        Delete classroom
      </button>
    </aside>
  );
}
