alter table public.athlete_stories
  add column if not exists category text default 'atleta',
  add column if not exists thumbnail_url text,
  add column if not exists description text,
  add column if not exists link_url text,
  add column if not exists is_featured boolean default false,
  add column if not exists athlete_name text,
  add column if not exists position text,
  add column if not exists club_name text,
  add column if not exists club_crest_url text,
  add column if not exists photo_url text,
  add column if not exists video_url text,
  add column if not exists bio text,
  add column if not exists stats jsonb default '{"games": 0, "goals": 0, "assists": 0}'::jsonb;

alter table public.athlete_stories
  alter column media_type set default 'photo';

update public.athlete_stories
set
  title = coalesce(title, athlete_name),
  media_url = coalesce(media_url, photo_url, video_url),
  thumbnail_url = coalesce(thumbnail_url, photo_url, media_url),
  media_type = case
    when coalesce(media_type, '') in ('', 'image') and coalesce(video_url, media_url) is not null and video_url is not null then 'video'
    when coalesce(media_type, '') in ('', 'image') then 'photo'
    else media_type
  end,
  category = coalesce(category, 'atleta'),
  stats = coalesce(stats, '{"games": 0, "goals": 0, "assists": 0}'::jsonb)
where
  title is null
  or media_url is null
  or thumbnail_url is null
  or media_type is null
  or media_type = 'image'
  or category is null
  or stats is null;
