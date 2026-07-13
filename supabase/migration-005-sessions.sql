-- ============================================================
-- Remane Portal — Migration 005: scheduled sessions
--
-- ADDITIVE. Run on top of your existing database.
-- Paste into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

create table if not exists public.scheduled_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles on delete cascade,
  starts_at timestamptz not null,
  duration_minutes int not null default 60 check (duration_minutes between 15 and 480),
  location text not null default '',
  status text not null default 'scheduled' check (status in ('scheduled', 'cancelled')),
  cancelled_by uuid references public.profiles,
  cancelled_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists scheduled_sessions_client_time_idx
  on public.scheduled_sessions (client_id, starts_at);

alter table public.scheduled_sessions enable row level security;

-- Coach: full control. Clients: see their own; updates restricted by trigger below.
drop policy if exists "sessions_sched_coach" on public.scheduled_sessions;
create policy "sessions_sched_coach" on public.scheduled_sessions for all
  using (public.is_coach()) with check (public.is_coach());

drop policy if exists "sessions_sched_select_own" on public.scheduled_sessions;
create policy "sessions_sched_select_own" on public.scheduled_sessions for select
  using (client_id = auth.uid());

drop policy if exists "sessions_sched_update_own" on public.scheduled_sessions;
create policy "sessions_sched_update_own" on public.scheduled_sessions for update
  using (client_id = auth.uid());

-- Clients may ONLY cancel — and only 48+ hours before the session starts.
create or replace function public.guard_session_update()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if public.is_coach() then
    return new;
  end if;
  if new.client_id        is distinct from old.client_id
    or new.starts_at        is distinct from old.starts_at
    or new.duration_minutes is distinct from old.duration_minutes
    or new.location         is distinct from old.location
    or old.status <> 'scheduled'
    or new.status <> 'cancelled' then
    raise exception 'Not allowed';
  end if;
  if old.starts_at - now() < interval '48 hours' then
    raise exception 'Sessions can only be cancelled at least 48 hours in advance';
  end if;
  new.cancelled_by := auth.uid();
  new.cancelled_at := now();
  return new;
end;
$$;

drop trigger if exists session_client_guard on public.scheduled_sessions;
create trigger session_client_guard
  before update on public.scheduled_sessions
  for each row execute function public.guard_session_update();
