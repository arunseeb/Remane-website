-- Migration 009 — add the new "reforge" phase (Stage II) everywhere phase is constrained.
--
-- A new coaching stage, Reforge, was inserted as Stage II (between Recovery and
-- Reconstruction). Several tables carry a CHECK constraint that only allows the
-- original four phase slugs; each must now also allow 'reforge'. Existing rows
-- are unaffected — this only widens what is permitted.
--
-- The original CHECK constraints are inline (auto-named), so this migration finds
-- them dynamically by their definition and rebuilds each with 'reforge' added,
-- preserving whether the column is nullable. Apply via supabase/apply_migrations.py.

do $$
declare
  r record;
  newlist constant text := '''recovery'', ''reforge'', ''reconstruction'', ''re-entry'', ''relationship-mastery''';
  body text;
begin
  for r in
    select con.conrelid::regclass                as tbl,
           con.conname                           as name,
           col.attnotnull                        as notnull,
           replace(con.conrelid::regclass::text, 'public.', '') as tblshort
    from pg_constraint con
    join pg_attribute col
      on col.attrelid = con.conrelid
     and col.attname  = 'phase'
    where con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%relationship-mastery%'
  loop
    execute format('alter table %s drop constraint %I', r.tbl, r.name);
    if r.notnull then
      body := format('check (phase in (%s))', newlist);
    else
      body := format('check (phase is null or phase in (%s))', newlist);
    end if;
    execute format('alter table %s add constraint %I %s',
                   r.tbl, r.tblshort || '_phase_check', body);
    raise notice 'rebuilt phase check on %', r.tbl;
  end loop;
end $$;
