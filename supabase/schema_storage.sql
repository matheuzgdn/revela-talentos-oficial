-- ============================================================
-- STORAGE BUCKET + POLICIES
-- Rode DEPOIS do schema principal ter executado com sucesso
-- ============================================================

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

create policy "storage_upload_auth"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'uploads');

create policy "storage_read_public"
  on storage.objects for select
  to public
  using (bucket_id = 'uploads');

create policy "storage_delete_auth"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'uploads');

create policy "storage_update_auth"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'uploads');
