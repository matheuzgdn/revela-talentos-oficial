begin;

create or replace function public.libertacademy_delete_school_registration(
  p_school_slug text,
  p_access_key text,
  p_registration_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  school_row public.libertacademy_schools%rowtype;
  registration_row public.libertacademy_registrations%rowtype;
  normalized_slug text;
  provided_secret text;
begin
  normalized_slug := nullif(public.libertacademy_normalize_slug(p_school_slug), '');
  provided_secret := nullif(trim(coalesce(p_access_key, '')), '');

  if normalized_slug is null or provided_secret is null or p_registration_id is null then
    raise exception 'Dados de acesso da escola invalidos.';
  end if;

  select *
  into school_row
  from public.libertacademy_schools
  where slug = normalized_slug
    and status = 'active'
    and (access_key = provided_secret or upper(portal_password) = upper(provided_secret))
  limit 1;

  if school_row.id is null then
    raise exception 'Acesso da escola invalido.';
  end if;

  update public.libertacademy_registrations
  set
    status = 'cancelled',
    raw_payload = coalesce(raw_payload, '{}'::jsonb) || jsonb_build_object('school_portal_deleted_at', now())
  where id = p_registration_id
    and school_id = school_row.id
    and status <> 'cancelled'
  returning * into registration_row;

  if registration_row.id is null then
    raise exception 'Atleta nao encontrado para esta escola.';
  end if;

  return jsonb_build_object(
    'id', registration_row.id,
    'athlete_full_name', registration_row.athlete_full_name,
    'status', registration_row.status
  );
end;
$$;

revoke all on function public.libertacademy_delete_school_registration(text, text, uuid) from public;
grant execute on function public.libertacademy_delete_school_registration(text, text, uuid) to anon, authenticated;

commit;
