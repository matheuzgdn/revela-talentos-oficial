alter table public.content
  add column if not exists content text,
  add column if not exists instructor text,
  add column if not exists is_featured boolean default false,
  add column if not exists is_top_10 boolean default false,
  add column if not exists top_10 boolean default false,
  add column if not exists preview_video_url text,
  add column if not exists live_embed_code text,
  add column if not exists external_link text,
  add column if not exists card_color text default 'blue',
  add column if not exists status text default 'draft';

create or replace function public.sync_content_runtime_compatibility()
returns trigger
language plpgsql
as $$
declare
  normalized_description text;
  normalized_top_10 boolean;
begin
  normalized_description := coalesce(new.description, new.content);
  new.description := normalized_description;
  new.content := normalized_description;

  normalized_top_10 := coalesce(new.is_top_10, new.top_10, false);
  new.is_top_10 := normalized_top_10;
  new.top_10 := normalized_top_10;

  if new.card_color is null or btrim(new.card_color) = '' then
    new.card_color := 'blue';
  end if;

  if new.status is null or btrim(new.status) = '' then
    new.status := case
      when coalesce(new.category, '') = 'live' and coalesce(new.is_published, false) then 'live'
      when coalesce(new.is_published, false) then 'published'
      else 'draft'
    end;
  end if;

  return new;
end;
$$;

drop trigger if exists content_runtime_compatibility on public.content;
create trigger content_runtime_compatibility
before insert or update on public.content
for each row execute function public.sync_content_runtime_compatibility();

update public.content
set
  description = coalesce(description, content),
  content = coalesce(content, description),
  is_top_10 = coalesce(is_top_10, top_10, false),
  top_10 = coalesce(top_10, is_top_10, false),
  card_color = coalesce(nullif(card_color, ''), 'blue'),
  status = coalesce(nullif(status, ''), case
    when coalesce(category, '') = 'live' and coalesce(is_published, false) then 'live'
    when coalesce(is_published, false) then 'published'
    else 'draft'
  end);
