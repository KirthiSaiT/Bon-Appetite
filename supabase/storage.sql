-- Bon Appetit · workshop image uploads
-- Run once in Supabase → SQL Editor → New query → paste → Run (after setup.sql).
-- Creates a public bucket: anyone can view images, only the admin can upload or delete.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'workshop-images',
  'workshop-images',
  true,
  5242880, -- 5 MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "workshop images uploaded by admin" on storage.objects;
create policy "workshop images uploaded by admin" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'workshop-images' and public.is_admin());

drop policy if exists "workshop images updated by admin" on storage.objects;
create policy "workshop images updated by admin" on storage.objects
  for update to authenticated
  using (bucket_id = 'workshop-images' and public.is_admin())
  with check (bucket_id = 'workshop-images' and public.is_admin());

drop policy if exists "workshop images deleted by admin" on storage.objects;
create policy "workshop images deleted by admin" on storage.objects
  for delete to authenticated
  using (bucket_id = 'workshop-images' and public.is_admin());
