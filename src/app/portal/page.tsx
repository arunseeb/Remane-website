import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PhaseProgress } from "@/components/portal/PhaseProgress";
import { NextSessions } from "@/components/portal/NextSessions";
import {
  formatDate,
  isOverdue,
  sortPhases,
  type ClientPhase,
  type Homework,
  type ScheduledSession,
} from "@/lib/portal";

export default async function PortalHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: phases }, { data: homework }, { data: sessions }] =
    await Promise.all([
      supabase.from("profiles").select("full_name").eq("id", user!.id).single(),
      supabase.from("client_phases").select("*").order("started_at"),
      supabase
        .from("homework")
        .select("*")
        .in("status", ["assigned", "returned"])
        .order("due_date", { ascending: true, nullsFirst: false }),
      supabase
        .from("scheduled_sessions")
        .select("*")
        .eq("status", "scheduled")
        .gt("starts_at", new Date().toISOString())
        .order("starts_at"),
    ]);

  const firstName = (profile?.full_name ?? "").split(" ")[0] || "there";
  const dueHomework = (homework ?? []) as Homework[];

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">
        Welcome back, {firstName}.
      </h1>

      <h2 className="font-display mt-8 text-2xl font-light text-foreground">
        Upcoming sessions
      </h2>
      <div className="mt-4">
        <NextSessions
          sessions={((sessions ?? []) as ScheduledSession[])}
          userId={user!.id}
        />
      </div>

      <h2 className="font-display mt-8 text-2xl font-light text-foreground">Your path</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {sortPhases((phases ?? []) as ClientPhase[]).map((phase) => (
          <div key={phase.id} className="border border-brown/20 bg-surface/50 p-5">
            <PhaseProgress phase={phase} />
          </div>
        ))}
        {(phases ?? []).length === 0 && (
          <p className="text-sm text-muted">Your phases will appear here once assigned.</p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl font-light text-foreground">Homework due</h2>
        <Link
          href="/portal/homework"
          className="link-underline text-xs tracking-[0.2em] text-burgundy uppercase"
        >
          All homework
        </Link>
      </div>
      <div className="mt-4 space-y-3">
        {dueHomework.slice(0, 5).map((hw) => (
          <Link
            key={hw.id}
            href="/portal/homework"
            className="flex flex-wrap items-baseline justify-between gap-2 border border-brown/20 bg-surface/50 px-5 py-4 transition-colors hover:border-burgundy/40"
          >
            <span className="flex items-center gap-2.5 text-foreground">
              {hw.title}
              <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] leading-none tracking-[0.1em] text-background uppercase">
                {hw.status === "returned" ? "Revise & resubmit" : "Not submitted"}
              </span>
            </span>
            <span
              className={`text-sm ${isOverdue(hw.due_date, hw.status) ? "text-burgundy" : "text-muted"}`}
            >
              {hw.due_date ? `Due ${formatDate(hw.due_date)}` : "No due date"}
            </span>
          </Link>
        ))}
        {dueHomework.length === 0 && (
          <p className="text-sm text-muted">Nothing due right now — well done.</p>
        )}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          href="/portal/messages"
          className="border border-brown/20 bg-surface/50 p-5 text-center transition-colors hover:border-burgundy/40"
        >
          <span className="text-xs tracking-[0.25em] text-burgundy uppercase">Message Arun</span>
        </Link>
        <Link
          href="/portal/classrooms"
          className="border border-brown/20 bg-surface/50 p-5 text-center transition-colors hover:border-burgundy/40"
        >
          <span className="text-xs tracking-[0.25em] text-burgundy uppercase">Classrooms</span>
        </Link>
        <Link
          href="/portal/library"
          className="border border-brown/20 bg-surface/50 p-5 text-center transition-colors hover:border-burgundy/40"
        >
          <span className="text-xs tracking-[0.25em] text-burgundy uppercase">Library</span>
        </Link>
      </div>
    </div>
  );
}
