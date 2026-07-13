-- ============================================================
-- Remane Portal — Migration 004: unread tracking + message flags
--
-- ADDITIVE. Run on top of your existing database (after 002 + 003).
-- Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- ---------- Read tracking: when did each member last read each room ----------
create table if not exists public.room_reads (
  room_id uuid not null references public.rooms on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  last_read_at timestamptz not null default now(),
  primary key (room_id, user_id)
);

alter table public.room_reads enable row level security;

drop policy if exists "reads_own" on public.room_reads;
create policy "reads_own" on public.room_reads for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and public.is_room_member(room_id));

-- ---------- Coach-only flags on messages (invisible to members) ----------
create table if not exists public.message_flags (
  message_id uuid primary key references public.messages on delete cascade,
  flagged_by uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.message_flags enable row level security;

drop policy if exists "flags_coach_only" on public.message_flags;
create policy "flags_coach_only" on public.message_flags for all
  using (public.is_coach()) with check (public.is_coach());

-- ---------- Unread counts per room, for the signed-in user ----------
create or replace function public.unread_counts()
returns table (room_id uuid, unread bigint)
language sql stable
as $$
  select m.room_id, count(*)
  from public.messages m
  join public.room_members rm
    on rm.room_id = m.room_id and rm.user_id = auth.uid()
  left join public.room_reads r
    on r.room_id = m.room_id and r.user_id = auth.uid()
  where m.sender_id <> auth.uid()
    and m.created_at > coalesce(r.last_read_at, 'epoch'::timestamptz)
  group by m.room_id;
$$;

-- ---------- Bookkeeping for the 24-hour unread email alert ----------
-- No policies: with RLS enabled and none granted, only the server
-- (service/secret key) can touch this table.
create table if not exists public.room_alerts (
  room_id uuid primary key references public.rooms on delete cascade,
  alerted_until timestamptz not null default 'epoch'::timestamptz
);

alter table public.room_alerts enable row level security;
