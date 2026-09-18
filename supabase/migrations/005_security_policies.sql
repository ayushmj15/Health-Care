-- ============================================================================
-- Health Care — Security policies
-- Fixes three issues surfaced in the security audit:
--   1. Broken "Doctors see own appointments" RLS let ANY authenticated user
--      read every appointment (the `... where true` subquery always matched).
--   2. records bucket had no DELETE policy, and was left fully public.
--   3. report file_url values were stored as full public URLs (no longer valid
--      once the bucket is private) — convert them back to relative paths.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Link doctors to auth users so "own appointments" is enforceable.
-- ----------------------------------------------------------------------------
alter table public.doctors
  add column if not exists user_id uuid references public.users (id) on delete set null;

drop policy if exists "Doctors see own appointments" on public.appointments;

create policy "Doctors see own appointments"
  on public.appointments for select using (
    exists (
      select 1
      from public.doctors d
      where d.id = doctor_id
        and d.user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- 2. Records bucket: private, with a delete policy for owners.
-- ----------------------------------------------------------------------------
update storage.buckets
set public = false
where id = 'records';

create policy "Users delete own records"
  on storage.objects for delete using (
    bucket_id = 'records' and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ----------------------------------------------------------------------------
-- 3. Store report files as relative paths so they resolve via signed/proxy
--    URLs instead of semi-permanent public URLs.
-- ----------------------------------------------------------------------------
update public.reports
set file_url = regexp_replace(
  file_url,
  '^https://uauvrgyuuvzlfkzlxfax.supabase.co/storage/v1/object/public/records/',
  ''
)
where file_url like 'https://uauvrgyuuvzlfkzlxfax.supabase.co/storage/v1/object/public/records/%';