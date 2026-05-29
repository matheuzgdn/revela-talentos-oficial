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
  normalized_slug text;
  provided_secret text;
begin
  normalized_slug := nullif(public.libertacademy_normalize_slug(p_school_slug), '');
  provided_secret := nullif(trim(coalesce(p_access_key, '')), '');

  if provided_secret is null then
    raise exception 'Senha da escola obrigatoria.';
  end if;

  select *
  into school_row
  from public.libertacademy_schools
  where status = 'active'
    and (normalized_slug is null or slug = normalized_slug)
    and (
      access_key = provided_secret
      or upper(portal_password) = upper(provided_secret)
    )
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

create or replace function public.libertacademy_get_admin_portal()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Acesso admin necessario.';
  end if;

  return jsonb_build_object(
    'total_schools',
      (
        select count(*)
        from public.libertacademy_schools s
        where s.status = 'active'
      ),
    'total_registrations',
      (
        select count(*)
        from public.libertacademy_registrations r
        where r.status <> 'cancelled'
      ),
    'schools',
      (
        select coalesce(jsonb_agg(
          jsonb_build_object(
            'id', s.id,
            'name', s.name,
            'slug', s.slug,
            'city', s.city,
            'country', s.country,
            'contact_name', s.contact_name,
            'contact_email', s.contact_email,
            'contact_phone', s.contact_phone,
            'portal_password', s.portal_password,
            'status', s.status,
            'created_date', s.created_date,
            'registration_count',
              (
                select count(*)
                from public.libertacademy_registrations r
                where r.school_id = s.id
                  and r.status <> 'cancelled'
              ),
            'latest_submission',
              (
                select max(r.submitted_at)
                from public.libertacademy_registrations r
                where r.school_id = s.id
                  and r.status <> 'cancelled'
              ),
            'category_counts',
              (
                select coalesce(jsonb_object_agg(category, total), '{}'::jsonb)
                from (
                  select r.category, count(*) as total
                  from public.libertacademy_registrations r
                  where r.school_id = s.id
                    and r.status <> 'cancelled'
                    and r.category is not null
                  group by r.category
                ) category_totals
              ),
            'registrations',
              (
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
                from public.libertacademy_registrations r
                where r.school_id = s.id
                  and r.status <> 'cancelled'
              )
          )
          order by lower(s.name)
        ), '[]'::jsonb)
        from public.libertacademy_schools s
        where s.status = 'active'
      )
  );
end;
$$;

grant execute on function public.libertacademy_get_school_portal(text, text) to anon, authenticated;
revoke all on function public.libertacademy_get_admin_portal() from public, anon;
grant execute on function public.libertacademy_get_admin_portal() to authenticated;

commit;
