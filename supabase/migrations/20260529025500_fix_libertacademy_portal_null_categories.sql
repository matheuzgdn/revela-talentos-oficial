begin;

create or replace function public.libertacademy_get_school_portal(
  p_school_slug text,
  p_access_key text
)
returns table (
  school_id uuid,
  school_name text,
  school_slug text,
  city text,
  country text,
  registration_count bigint,
  category_counts jsonb,
  registrations jsonb
)
language plpgsql
security definer
set search_path = public
as $$
declare
  school_row public.libertacademy_schools%rowtype;
begin
  select *
  into school_row
  from public.libertacademy_schools
  where slug = public.libertacademy_normalize_slug(p_school_slug)
    and access_key = p_access_key
    and status = 'active'
  limit 1;

  if school_row.id is null then
    raise exception 'Acesso da escola invalido.';
  end if;

  school_id := school_row.id;
  school_name := school_row.name;
  school_slug := school_row.slug;
  city := school_row.city;
  country := school_row.country;

  select count(*)
  into registration_count
  from public.libertacademy_registrations r
  where r.school_id = school_row.id
    and r.status <> 'cancelled';

  select coalesce(jsonb_object_agg(category, total), '{}'::jsonb)
  into category_counts
  from (
    select r.category, count(*) as total
    from public.libertacademy_registrations r
    where r.school_id = school_row.id
      and r.status <> 'cancelled'
      and r.category is not null
    group by r.category
    order by r.category
  ) grouped;

  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', r.id,
      'athlete_full_name', r.athlete_full_name,
      'birth_date', r.birth_date,
      'document_id', r.document_id,
      'category', r.category,
      'status', r.status,
      'submitted_at', r.submitted_at
    )
    order by r.submitted_at desc
  ), '[]'::jsonb)
  into registrations
  from public.libertacademy_registrations r
  where r.school_id = school_row.id
    and r.status <> 'cancelled';

  return next;
end;
$$;

grant execute on function public.libertacademy_get_school_portal(text, text) to anon, authenticated;

commit;
