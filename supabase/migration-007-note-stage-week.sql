-- ============================================================
-- Remane Portal — Migration 007: stage + week on coach conversation notes
-- ADDITIVE.
-- ============================================================

alter table public.client_notes
  add column if not exists phase text
  check (phase is null or phase in ('recovery', 'reconstruction', 're-entry', 'relationship-mastery'));

alter table public.client_notes
  add column if not exists week int
  check (week is null or week between 1 and 104);
