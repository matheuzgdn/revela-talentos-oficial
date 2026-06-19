begin;

create or replace function public.libertacademy_update_school_registration(
  p_school_slug text,
  p_access_key text,
  p_registration_id uuid,
  p_birth_date date,
  p_document_id text,
  p_category text
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

  if provided_secret is null then
    raise exception 'Senha da escola obrigatoria.';
  end if;

  if p_registration_id is null then
    raise exception 'Cadastro do atleta obrigatorio.';
  end if;

  if p_birth_date is null then
    raise exception 'Data de nascimento obrigatoria.';
  end if;

  if p_category not in ('Sub10', 'Sub12', 'Sub14') then
    raise exception 'Categoria invalida.';
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

  update public.libertacademy_registrations
  set
    birth_date = p_birth_date,
    document_id = nullif(trim(coalesce(p_document_id, '')), ''),
    category = p_category,
    raw_payload = coalesce(raw_payload, '{}'::jsonb) || jsonb_build_object(
      'school_portal_updated_at', now()
    )
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
    'birth_date', registration_row.birth_date,
    'document_id', registration_row.document_id,
    'category', registration_row.category,
    'status', registration_row.status,
    'submitted_at', registration_row.submitted_at
  );
end;
$$;

revoke all on function public.libertacademy_update_school_registration(text, text, uuid, date, text, text) from public;
grant execute on function public.libertacademy_update_school_registration(text, text, uuid, date, text, text) to anon, authenticated;

commit;
