begin;

alter table public.user_progress
  add column if not exists last_watched timestamptz default now(),
  add column if not exists watch_time_seconds integer default 0,
  add column if not exists last_position_seconds integer default 0;

update public.user_progress
set
  last_watched = coalesce(last_watched, updated_date, created_date, now()),
  watch_time_seconds = coalesce(watch_time_seconds, last_position_seconds, 0),
  last_position_seconds = coalesce(last_position_seconds, watch_time_seconds, 0)
where
  last_watched is null
  or watch_time_seconds is null
  or last_position_seconds is null;

create index if not exists user_progress_user_content_idx
on public.user_progress (user_id, content_id, updated_date desc);

create index if not exists user_progress_user_last_watched_idx
on public.user_progress (user_id, last_watched desc);

commit;
