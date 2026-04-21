create or replace function public.sync_content_runtime_compatibility()
returns trigger
language plpgsql
as $$
declare
  normalized_description text;
  normalized_top_10 boolean;
begin
  if tg_op = 'UPDATE' then
    if new.content is distinct from old.content and new.description is not distinct from old.description then
      normalized_description := new.content;
    elsif new.description is distinct from old.description and new.content is not distinct from old.content then
      normalized_description := new.description;
    else
      normalized_description := coalesce(new.description, new.content, old.description, old.content);
    end if;
  else
    normalized_description := coalesce(new.description, new.content);
  end if;

  new.description := normalized_description;
  new.content := normalized_description;

  if tg_op = 'UPDATE' then
    if new.top_10 is distinct from old.top_10 and new.is_top_10 is not distinct from old.is_top_10 then
      normalized_top_10 := coalesce(new.top_10, false);
    elsif new.is_top_10 is distinct from old.is_top_10 and new.top_10 is not distinct from old.top_10 then
      normalized_top_10 := coalesce(new.is_top_10, false);
    else
      normalized_top_10 := coalesce(new.is_top_10, new.top_10, old.is_top_10, old.top_10, false);
    end if;
  elsif new.top_10 is distinct from false and coalesce(new.is_top_10, false) = false then
    normalized_top_10 := coalesce(new.top_10, false);
  else
    normalized_top_10 := coalesce(new.is_top_10, new.top_10, false);
  end if;

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
