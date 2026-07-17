-- Attachments for chat messages and homework assignments.
-- Idempotent: safe to re-run via apply_migrations.py.

-- ---------- messages: an optional file/image per message ----------
alter table public.messages
  add column if not exists attachment_path text,
  add column if not exists attachment_name text,
  add column if not exists attachment_type text;

-- A message must carry text, a file, or both — never nothing. (content stays
-- NOT NULL; an attachment-only message is sent with content = '').
alter table public.messages drop constraint if exists messages_has_body;
alter table public.messages add constraint messages_has_body
  check (length(btrim(content)) > 0 or attachment_path is not null);

-- ---------- homework: a file the coach attaches to the assignment ----------
alter table public.homework
  add column if not exists attachment_path text,
  add column if not exists attachment_name text;

-- ---------- storage: private 'chat' bucket ----------
insert into storage.buckets (id, name, public)
values ('chat', 'chat', false)
on conflict (id) do nothing;

-- Safe room-id extraction from an object path ({room_id}/{user_id}/{file}).
-- A non-UUID first segment returns false instead of raising during policy eval.
create or replace function public.chat_path_room_member(p_name text)
returns boolean
language plpgsql stable security definer set search_path = public
as $$
declare
  rid uuid;
begin
  begin
    rid := (storage.foldername(p_name))[1]::uuid;
  exception when others then
    return false;
  end;
  return public.is_room_member(rid);
end;
$$;

drop policy if exists "chat_upload_member" on storage.objects;
drop policy if exists "chat_read_member" on storage.objects;

-- Upload only into a room you belong to, and only under your own user folder.
create policy "chat_upload_member" on storage.objects for insert
  with check (
    bucket_id = 'chat'
    and public.chat_path_room_member(name)
    and (storage.foldername(name))[2] = auth.uid()::text
  );

-- Any member of the room may read its attachments (DM: coach + client).
create policy "chat_read_member" on storage.objects for select
  using (
    bucket_id = 'chat'
    and public.chat_path_room_member(name)
  );

-- ---------- storage: let the coach attach files to the homework bucket ----------
-- (the client's own-folder upload policy already exists in schema.sql)
drop policy if exists "homework_upload_coach" on storage.objects;
create policy "homework_upload_coach" on storage.objects for insert
  with check (bucket_id = 'homework' and public.is_coach());
