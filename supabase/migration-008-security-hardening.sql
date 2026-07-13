-- ============================================================
-- Remane Portal — Migration 008: security hardening
--
-- ADDITIVE. Run on top of your existing database.
-- Paste into: Supabase Dashboard → SQL Editor → Run
--
-- Fixes two issues:
--   1. New accounts could name their own role via signup metadata.
--      If public signups were ever enabled, anyone could register as
--      'coach' and read every client's messages, notes and dossiers.
--      New accounts are now always 'client'; promote the coach by hand:
--        update public.profiles set role = 'coach' where email = 'YOUR_EMAIL';
--   2. Any signed-in client could read ANY file in the 'resources'
--      storage bucket, not just materials shared with them. Reads are
--      now limited to the coach and clients entitled to the resource.
-- ============================================================

-- ---------- 1. New users are always clients ----------
create or replace function public.handle_new_user()
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

-- ---------- 2. Resource files: entitled readers only ----------
drop policy if exists "resources_read_members" on storage.objects;
create policy "resources_read_members" on storage.objects for select
  using (
    bucket_id = 'resources'
    and (
      public.is_coach()
      or exists (
        select 1 from public.resources r
        where r.file_path = storage.objects.name
          and (
            exists (
              select 1 from public.resource_shares rs
              where rs.resource_id = r.id and rs.client_id = auth.uid()
            )
            or (r.share_with_phase and r.phase is not null and public.in_phase(r.phase))
          )
      )
    )
  );
