-- ============================================================
-- Remane Portal — Migration 006: session stage/week + reminder tracking
-- ADDITIVE.
-- ============================================================

alter table public.scheduled_sessions
  add column if not exists phase text
  check (phase is null or phase in ('recovery', 'reconstruction', 're-entry', 'relationship-mastery'));

alter table public.scheduled_sessions
  add column if not exists week int
  check (week is null or week between 1 and 104);

alter table public.scheduled_sessions
  add column if not exists reminder_sent_at timestamptz;
