-- Track exactly when a client first sets a password (completes their invite).
-- Until that moment they are a "potential client" in the coach portal; the
-- instant the password is saved they become an active client.
--
-- Driven by a trigger on auth.users so the stamp is exact and does not depend on
-- any client-side code running after the password is set. Idempotent / re-runnable.

alter table public.profiles
  add column if not exists activated_at timestamptz;

-- Stamp activated_at the first time a user gains a password. Invited users are
-- created with a null encrypted_password; it becomes non-null when they set one.
create or replace function public.mark_profile_activated()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.encrypted_password is not null and new.encrypted_password <> ''
     and (old.encrypted_password is null or old.encrypted_password = '') then
    update public.profiles
      set activated_at = coalesce(activated_at, now())
      where id = new.id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_password_set on auth.users;
create trigger on_auth_user_password_set
  after update of encrypted_password on auth.users
  for each row execute function public.mark_profile_activated();

-- Backfill: anyone who already has a password counts as activated. Prefer their
-- first sign-in time; fall back to account creation time.
update public.profiles p
set activated_at = coalesce(u.last_sign_in_at, u.created_at, now())
from auth.users u
where u.id = p.id
  and p.activated_at is null
  and u.encrypted_password is not null
  and u.encrypted_password <> '';
