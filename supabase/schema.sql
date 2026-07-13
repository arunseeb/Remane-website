-- ============================================================
-- Remane Portal — Supabase schema
-- Run this whole file once in: Supabase Dashboard → SQL Editor
-- Safe to re-run: it drops and recreates the portal objects.
-- (It does NOT touch auth.users — your accounts survive a re-run.)
-- ============================================================

-- ---------- Clean slate (so this file can be re-run) ----------
drop trigger if exists on_auth_user_created on auth.users;
drop table if exists public.messages      cascade;
drop table if exists public.room_members  cascade;
drop table if exists public.rooms         cascade;
drop table if exists public.video_shares  cascade;
drop table if exists public.videos        cascade;
drop table if exists public.homework       cascade;
drop table if exists public.sessions       cascade;
drop table if exists public.client_notes   cascade;
drop table if exists public.client_dossier cascade;
drop table if exists public.client_phases  cascade;
drop table if exists public.profiles       cascade;
drop function if exists public.handle_new_user()       cascade;
drop function if exists public.guard_homework_update() cascade;
drop function if exists public.is_coach()              cascade;
drop function if exists public.is_room_member(uuid)    cascade;
drop function if exists public.shares_room_with(uuid)  cascade;

-- ============================================================
-- TABLES
-- ============================================================

-- ---------- Profiles ----------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'client' check (role in ('coach', 'client')),
  full_name text not null default '',
  email text not null default '',
  created_at timestamptz not null default now()
);

-- ---------- Client phases (a client can be in several at once) ----------
create table public.client_phases (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles on delete cascade,
  phase text not null check (phase in ('recovery', 'reconstruction', 're-entry', 'relationship-mastery')),
  week int not null default 1 check (week >= 1),
  started_at timestamptz not null default now(),
  unique (client_id, phase)
);

-- ---------- Session log (each "session complete" advances the week) ----------
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles on delete cascade,
  phase text not null,
  completed_at timestamptz not null default now()
);

-- ---------- Private coach notes (clients can never read these) ----------
create table public.client_dossier (
  client_id uuid primary key references public.profiles on delete cascade,
  content text not null default '',
  updated_at timestamptz not null default now()
);

create table public.client_notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles on delete cascade,
  session_date date not null default current_date,
  title text not null default '',
  summary text not null default '',
  transcript text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index client_notes_client_date_idx
  on public.client_notes (client_id, session_date desc, created_at desc);

-- ---------- Homework ----------
create table public.homework (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles on delete cascade,
  title text not null,
  instructions text not null default '',
  due_date date,
  status text not null default 'assigned' check (status in ('assigned', 'submitted', 'returned', 'completed')),
  submission_text text,
  submission_file_path text,
  submitted_at timestamptz,
  feedback text,
  returned_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- Video bank ----------
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  youtube_url text not null,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table public.video_shares (
  id uuid primary key default gen_random_uuid(),
  video_id uuid not null references public.videos on delete cascade,
  client_id uuid not null references public.profiles on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (video_id, client_id)
);

-- ---------- Chat: DMs and classrooms ----------
create table public.rooms (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('dm', 'classroom')),
  name text,
  created_at timestamptz not null default now()
);

create table public.room_members (
  room_id uuid not null references public.rooms on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  primary key (room_id, user_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms on delete cascade,
  sender_id uuid not null references public.profiles on delete cascade,
  content text not null,
  created_at timestamptz not null default now()
);

create index messages_room_created_idx on public.messages (room_id, created_at);

-- ============================================================
-- FUNCTIONS & TRIGGERS  (defined after the tables they reference)
-- ============================================================

-- Auto-create a profile row whenever an auth user is created (e.g. via invite).
-- The role is ALWAYS 'client': signup metadata is caller-controlled, so honouring a
-- role from it would let a self-registered user become coach. Promote the coach by
-- hand with the SQL at the bottom of this file.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    'client',
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper functions (security definer avoids RLS recursion)
create function public.is_coach()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'coach');
$$;

create function public.is_room_member(p_room_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.room_members
    where room_id = p_room_id and user_id = auth.uid()
  );
$$;

create function public.shares_room_with(p_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1
    from public.room_members a
    join public.room_members b using (room_id)
    where a.user_id = auth.uid() and b.user_id = p_user_id
  );
$$;

-- Clients may only fill in their submission — never touch feedback or ownership
create function public.guard_homework_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if public.is_coach() then
    return new;
  end if;
  if new.client_id      is distinct from old.client_id
    or new.title        is distinct from old.title
    or new.instructions is distinct from old.instructions
    or new.due_date     is distinct from old.due_date
    or new.feedback     is distinct from old.feedback
    or new.returned_at  is distinct from old.returned_at
    or new.status not in ('submitted') then
    raise exception 'Not allowed';
  end if;
  return new;
end;
$$;

create trigger homework_client_guard
  before update on public.homework
  for each row execute function public.guard_homework_update();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles       enable row level security;
alter table public.client_phases  enable row level security;
alter table public.client_dossier enable row level security;
alter table public.client_notes   enable row level security;
alter table public.sessions       enable row level security;
alter table public.homework      enable row level security;
alter table public.videos        enable row level security;
alter table public.video_shares  enable row level security;
alter table public.rooms         enable row level security;
alter table public.room_members  enable row level security;
alter table public.messages      enable row level security;

-- profiles: read yourself, the coach reads everyone, room-mates see each other's names
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or public.is_coach() or public.shares_room_with(id));
create policy "profiles_update_coach" on public.profiles for update
  using (public.is_coach());

-- client_phases: clients read their own; only the coach writes
create policy "phases_select" on public.client_phases for select
  using (client_id = auth.uid() or public.is_coach());
create policy "phases_write" on public.client_phases for all
  using (public.is_coach()) with check (public.is_coach());

-- private coach notes: coach only — clients have no read path to these at all
create policy "dossier_coach" on public.client_dossier for all
  using (public.is_coach()) with check (public.is_coach());
create policy "notes_coach" on public.client_notes for all
  using (public.is_coach()) with check (public.is_coach());

-- sessions: coach only
create policy "sessions_coach" on public.sessions for all
  using (public.is_coach()) with check (public.is_coach());

-- homework: clients see their own and may update it (trigger restricts columns)
create policy "homework_select" on public.homework for select
  using (client_id = auth.uid() or public.is_coach());
create policy "homework_insert_coach" on public.homework for insert
  with check (public.is_coach());
create policy "homework_delete_coach" on public.homework for delete
  using (public.is_coach());
create policy "homework_update" on public.homework for update
  using (client_id = auth.uid() or public.is_coach());

-- videos: coach full control; clients see only videos shared with them
create policy "videos_coach" on public.videos for all
  using (public.is_coach()) with check (public.is_coach());
create policy "videos_select_shared" on public.videos for select
  using (exists (
    select 1 from public.video_shares vs
    where vs.video_id = videos.id and vs.client_id = auth.uid()
  ));

-- video_shares: coach full control; clients read their own
create policy "shares_coach" on public.video_shares for all
  using (public.is_coach()) with check (public.is_coach());
create policy "shares_select_own" on public.video_shares for select
  using (client_id = auth.uid());

-- rooms / members: members can see; only the coach manages
create policy "rooms_select" on public.rooms for select
  using (public.is_room_member(id) or public.is_coach());
create policy "rooms_write_coach" on public.rooms for all
  using (public.is_coach()) with check (public.is_coach());

create policy "members_select" on public.room_members for select
  using (public.is_room_member(room_id) or public.is_coach());
create policy "members_write_coach" on public.room_members for all
  using (public.is_coach()) with check (public.is_coach());

-- messages: members read and write in their own rooms
create policy "messages_select" on public.messages for select
  using (public.is_room_member(room_id));
create policy "messages_insert" on public.messages for insert
  with check (public.is_room_member(room_id) and sender_id = auth.uid());

-- ============================================================
-- REALTIME (for chat)
-- ============================================================
alter publication supabase_realtime add table public.messages;

-- ============================================================
-- STORAGE: homework submissions
-- ============================================================
insert into storage.buckets (id, name, public)
values ('homework', 'homework', false)
on conflict (id) do nothing;

drop policy if exists "homework_upload_own_folder" on storage.objects;
drop policy if exists "homework_read" on storage.objects;

create policy "homework_upload_own_folder" on storage.objects for insert
  with check (
    bucket_id = 'homework'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "homework_read" on storage.objects for select
  using (
    bucket_id = 'homework'
    and ((storage.foldername(name))[1] = auth.uid()::text or public.is_coach())
  );

-- ============================================================
-- BACKFILL: give any existing auth users a profile row
-- (harmless on a fresh project; needed if you re-run this file)
-- ============================================================
insert into public.profiles (id, role, full_name, email)
select
  u.id,
  'client',
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.email, '')
from auth.users u
on conflict (id) do nothing;
-- NOTE: a re-run resets everyone to 'client' — re-promote the coach afterwards
-- (step 1 below).

-- ============================================================
-- LATER MIGRATIONS
-- A fresh project must also run, in order:
--   supabase/migration-002-client-notes.sql          (private coach notes)
--   supabase/migration-003-progress-and-library.sql  (stage progress + resource library)
--   supabase/migration-004-unread-and-flags.sql      (unread tracking + message flags)
--   supabase/migration-005-sessions.sql              (scheduled sessions + 48h rule)
--   supabase/migration-006-session-details.sql       (session stage/week + reminders)
--   supabase/migration-007-note-stage-week.sql       (stage + week on coach notes)
--   supabase/migration-008-security-hardening.sql    (role lockdown + storage reads)
-- They are additive and safe on an existing database; this file is NOT (it drops tables).
-- ============================================================

-- ============================================================
-- AFTER RUNNING THIS FILE:
-- 1. Authentication → Users → "Add user" → create the coach account
--    (your email + a password, tick Auto Confirm User), then run:
--       update public.profiles set role = 'coach' where email = 'YOUR_EMAIL';
-- 2. See SETUP-PORTAL.md for the email template + env var steps.
-- ============================================================
