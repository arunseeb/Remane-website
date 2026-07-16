export const PHASE_KEYS = [
  "recovery",
  "reforge",
  "reconstruction",
  "re-entry",
  "relationship-mastery",
] as const;

export type PhaseKey = (typeof PHASE_KEYS)[number];

export const PHASE_LABELS: Record<PhaseKey, string> = {
  recovery: "Recovery",
  reforge: "Reforge",
  reconstruction: "Reconstruction",
  "re-entry": "Re-entry",
  "relationship-mastery": "Relationship Mastery",
};

export const PHASE_NUMERALS: Record<PhaseKey, string> = {
  recovery: "I",
  reforge: "II",
  reconstruction: "III",
  "re-entry": "IV",
  "relationship-mastery": "V",
};

export type Profile = {
  id: string;
  role: "coach" | "client";
  full_name: string;
  email: string;
  created_at: string;
};

export type ClientPhase = {
  id: string;
  client_id: string;
  phase: PhaseKey;
  week: number;
  total_weeks: number;
  started_at: string;
};

/** Canonical stage order: I Recovery → II Reforge → III Reconstruction → IV Re-entry → V Mastery. */
export function sortPhases<T extends { phase: PhaseKey }>(phases: T[]): T[] {
  return [...phases].sort(
    (a, b) => PHASE_KEYS.indexOf(a.phase) - PHASE_KEYS.indexOf(b.phase)
  );
}

/**
 * How far through a phase a client is, as a percentage.
 * Week 1 of 12 means the first week is under way, not that nothing has happened —
 * so completed weeks are counted as (week - 1), and the bar fills as weeks finish.
 */
export function phaseProgress(week: number, totalWeeks: number): number {
  if (totalWeeks <= 0) return 0;
  const completed = Math.max(0, week - 1);
  return Math.min(100, Math.round((completed / totalWeeks) * 100));
}

export type HomeworkStatus = "assigned" | "submitted" | "returned" | "completed";

export type Homework = {
  id: string;
  client_id: string;
  title: string;
  instructions: string;
  due_date: string | null;
  status: HomeworkStatus;
  submission_text: string | null;
  submission_file_path: string | null;
  submitted_at: string | null;
  feedback: string | null;
  returned_at: string | null;
  created_at: string;
};

/** Coach-only. Never rendered anywhere in /portal. */
export type ClientDossier = {
  client_id: string;
  content: string;
  updated_at: string;
};

/** Coach-only. One entry per recorded conversation. */
export type ClientNote = {
  id: string;
  client_id: string;
  session_date: string;
  title: string;
  summary: string;
  transcript: string;
  phase: PhaseKey | null;
  week: number | null;
  created_at: string;
  updated_at: string;
};

export function phaseWeekLabel(phase: PhaseKey | null, week: number | null): string | null {
  if (!phase) return null;
  return `Stage ${PHASE_NUMERALS[phase]} — ${PHASE_LABELS[phase]}${week ? `, Week ${week}` : ""}`;
}

export type Video = {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  tags: string[];
  phase: PhaseKey | null;
  share_with_phase: boolean;
  created_at: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  phase: PhaseKey | null;
  kind: "link" | "file";
  url: string | null;
  file_path: string | null;
  share_with_phase: boolean;
  created_at: string;
};

export type Room = {
  id: string;
  type: "dm" | "classroom";
  name: string | null;
  created_at: string;
};

export type ScheduledSession = {
  id: string;
  client_id: string;
  starts_at: string;
  duration_minutes: number;
  location: string;
  status: "scheduled" | "cancelled";
  cancelled_by: string | null;
  cancelled_at: string | null;
  created_at: string;
  phase: PhaseKey | null;
  week: number | null;
  reminder_sent_at: string | null;
};

export function sessionLessonLabel(session: ScheduledSession): string | null {
  if (!session.phase) return null;
  return `Stage ${PHASE_NUMERALS[session.phase]} — ${PHASE_LABELS[session.phase]}${
    session.week ? `, Week ${session.week}` : ""
  }`;
}

export const CANCEL_WINDOW_MS = 48 * 60 * 60 * 1000;

export function canClientCancel(session: ScheduledSession): boolean {
  return (
    session.status === "scheduled" &&
    new Date(session.starts_at).getTime() - Date.now() >= CANCEL_WINDOW_MS
  );
}

// All times render in UK time regardless of where the code runs: the server
// (typically UTC) and the browser must produce identical strings or React
// reports a hydration mismatch — and during BST the server's wall time is
// simply wrong for a UK audience.
const UK_TZ = "Europe/London";

export function formatSessionTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: UK_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Long form for emails and chat notices: "Monday 20 July, 14:00". */
export function formatSessionTimeLong(date: Date): string {
  return date.toLocaleString("en-GB", {
    timeZone: UK_TZ,
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type Message = {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

/** Extract the YouTube video id from any common YouTube URL form. */
export function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    timeZone: UK_TZ,
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    timeZone: UK_TZ,
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isOverdue(dueDate: string | null, status: HomeworkStatus): boolean {
  if (!dueDate || status === "submitted" || status === "completed") return false;
  // due_date is a plain YYYY-MM-DD; compare against today's date in the UK,
  // not wherever the server or viewer happens to be.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: UK_TZ });
  return dueDate.slice(0, 10) < today;
}
