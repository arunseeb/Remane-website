-- ============================================================
-- Remane Portal — Migration 003: stage progress + resource library
--
-- ADDITIVE. Run on top of your existing database.
-- Do NOT re-run schema.sql — that drops and recreates everything.
-- Paste this whole file into: Supabase Dashboard → SQL Editor → Run
-- (Don't include any ``` fence lines.)
-- ============================================================

-- ---------- 1. Give each phase a length, so progress can be shown ----------
-- 12 weeks is the default; change it per client from the coach dashboard.
alter table public.client_phases
  add column if not exists total_weeks int not null default 12
  check (total_weeks between 1 and 104);

-- ---------- 2. Videos can belong to a stage, and be shared stage-wide ----------
alter table public.videos
  add column if not exists phase text
  check (phase is null or phase in ('recovery', 'reconstruction', 're-entry', 'relationship-mastery'));

alter table public.videos
  add column if not exists share_with_phase boolean not null default false;

-- ---------- 3. Resources: documents and links, per stage ----------
create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  phase text check (phase is null or phase in ('recovery', 'reconstruction', 're-entry', 'relationship-mastery')),
  kind text not null check (kind in ('link', 'file')),
  url text,                 -- when kind = 'link'
  file_path text,           -- when kind = 'file' (storage bucket 'resources')
  share_with_phase boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.resource_shares (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources on delete cascade,
  client_id uuid not null references public.profiles on delete cascade,
  note text not null default '',
  created_at timestamptz not null default now(),
  unique (resource_id, client_id)
);

-- ---------- 4. Helper: is the signed-in client currently in this phase? ----------
create or replace function public.in_phase(p_phase text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.client_phases
    where client_id = auth.uid() and phase = p_phase
  );
$$;

-- ---------- 5. Row Level Security ----------
alter table public.resources       enable row level security;
alter table public.resource_shares enable row level security;

drop policy if exists "resources_coach" on public.resources;
create policy "resources_coach" on public.resources for all
  using (public.is_coach()) with check (public.is_coach());

-- A client sees a resource if it was sent to them, OR it's published to their stage.
drop policy if exists "resources_select_visible" on public.resources;
create policy "resources_select_visible" on public.resources for select
  using (
    exists (
      select 1 from public.resource_shares rs
      where rs.resource_id = resources.id and rs.client_id = auth.uid()
    )
    or (share_with_phase and phase is not null and public.in_phase(phase))
  );

drop policy if exists "resource_shares_coach" on public.resource_shares;
create policy "resource_shares_coach" on public.resource_shares for all
  using (public.is_coach()) with check (public.is_coach());

drop policy if exists "resource_shares_select_own" on public.resource_shares;
create policy "resource_shares_select_own" on public.resource_shares for select
  using (client_id = auth.uid());

-- Videos: same rule — sent directly, or published to the client's stage.
drop policy if exists "videos_select_shared" on public.videos;
create policy "videos_select_shared" on public.videos for select
  using (
    exists (
      select 1 from public.video_shares vs
      where vs.video_id = videos.id and vs.client_id = auth.uid()
    )
    or (share_with_phase and phase is not null and public.in_phase(phase))
  );

-- ---------- 6. Storage bucket for resource files ----------
insert into storage.buckets (id, name, public)
values ('resources', 'resources', false)
on conflict (id) do nothing;

-- Only the coach can add or remove files.
drop policy if exists "resources_write_coach" on storage.objects;
create policy "resources_write_coach" on storage.objects for insert
  with check (bucket_id = 'resources' and public.is_coach());

drop policy if exists "resources_delete_coach" on storage.objects;
create policy "resources_delete_coach" on storage.objects for delete
  using (bucket_id = 'resources' and public.is_coach());

-- Signed-in members may read resource files. The bucket is private: files are only
-- reachable through time-limited signed links, which the portal hands out solely for
-- materials the client is entitled to see.
drop policy if exists "resources_read_members" on storage.objects;
create policy "resources_read_members" on storage.objects for select
  using (bucket_id = 'resources' and auth.role() = 'authenticated');
