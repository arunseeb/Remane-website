-- A saved history of coach feedback, one row per review of a submission or
-- resubmission (so feedback is no longer overwritten each cycle).
-- Idempotent: safe to re-run via apply_migrations.py.

create table if not exists public.homework_reviews (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework on delete cascade,
  coach_id uuid references public.profiles on delete set null,
  feedback text not null,
  outcome text not null check (outcome in ('returned', 'completed')),
  -- snapshot of the submission this feedback responded to, so the thread stays
  -- meaningful after the client resubmits (which overwrites homework.*).
  submission_text text,
  submission_file_path text,
  created_at timestamptz not null default now()
);

create index if not exists homework_reviews_homework_idx
  on public.homework_reviews (homework_id, created_at);

alter table public.homework_reviews enable row level security;

-- Coach writes; coach and the owning client read.
drop policy if exists "hw_reviews_select" on public.homework_reviews;
create policy "hw_reviews_select" on public.homework_reviews for select
  using (
    public.is_coach()
    or exists (
      select 1 from public.homework h
      where h.id = homework_reviews.homework_id and h.client_id = auth.uid()
    )
  );

drop policy if exists "hw_reviews_write_coach" on public.homework_reviews;
create policy "hw_reviews_write_coach" on public.homework_reviews for all
  using (public.is_coach()) with check (public.is_coach());
