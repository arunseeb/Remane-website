-- ============================================================
-- Remane Portal — Migration 002: private client notes
--
-- ADDITIVE. Run this on top of an existing database.
-- Do NOT re-run schema.sql — that drops and recreates everything.
-- Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- (Don't include any ``` fence lines.)
--
-- Everything here is COACH-ONLY. Clients cannot read these rows, ever:
-- the RLS policies below permit access solely to the coach account.
-- ============================================================

-- ---------- The running profile / dossier (one per client) ----------
create table if not exists public.client_dossier (
  client_id uuid primary key references public.profiles on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now()
);

-- ---------- Session entries (transcript + AI summary, one per conversation) ----------
create table if not exists public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles on delete cascade,
  session_date date not null default current_date,
  title text not null default '',
  summary text not null default '',
  transcript text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists client_notes_client_date_idx
  on public.client_notes (client_id, session_date desc, created_at desc);

-- ---------- Row Level Security: coach only ----------
alter table public.client_dossier enable row level security;
alter table public.client_notes   enable row level security;

drop policy if exists "dossier_coach" on public.client_dossier;
create policy "dossier_coach" on public.client_dossier for all
  using (public.is_coach()) with check (public.is_coach());

drop policy if exists "notes_coach" on public.client_notes;
create policy "notes_coach" on public.client_notes for all
  using (public.is_coach()) with check (public.is_coach());
