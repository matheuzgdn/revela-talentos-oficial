begin;

create extension if not exists pgcrypto;

create or replace function public.libertacademy_normalize_slug(value text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    translate(
      lower(coalesce(value, '')),
      'áàãâäéèêëíìîïóòõôöúùûüçñÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÔÖÚÙÛÜÇÑ',
      'aaaaaeeeeiiiiooooouuuucnaaaaaeeeeiiiiooooouuuucn'
    ),
    '[^a-z0-9]+',
    '-',
    'g'
  ));
$$;

create table if not exists public.libertacademy_schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  city text,
  country text default 'Argentina',
  contact_name text,
  contact_email text,
  contact_phone text,
  access_key text not null unique default encode(gen_random_bytes(24), 'hex'),
  status text not null default 'active' check (status in ('active', 'pending', 'inactive')),
  notes text,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create table if not exists public.libertacademy_registrations (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.libertacademy_schools(id) on delete cascade,
  school_name text not null,
  athlete_full_name text not null,
  birth_date date,
  document_id text,
  category text not null check (category in ('Sub10', 'Sub12', 'Sub14')),
  language text default 'pt',
  source text default 'libertacademy-public-page',
  status text not null default 'registered' check (status in ('registered', 'reviewed', 'cancelled')),
  raw_payload jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create index if not exists libertacademy_registrations_school_id_idx
on public.libertacademy_registrations (school_id);

create index if not exists libertacademy_registrations_submitted_at_idx
on public.libertacademy_registrations (submitted_at desc);

alter table public.libertacademy_schools enable row level security;
alter table public.libertacademy_registrations enable row level security;

drop policy if exists "libertacademy_schools_admin_all" on public.libertacademy_schools;
create policy "libertacademy_schools_admin_all"
on public.libertacademy_schools
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "libertacademy_registrations_admin_all" on public.libertacademy_registrations;
create policy "libertacademy_registrations_admin_all"
on public.libertacademy_registrations
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists libertacademy_schools_updated on public.libertacademy_schools;
create trigger libertacademy_schools_updated
before update on public.libertacademy_schools
for each row execute function public.handle_updated_date();

drop trigger if exists libertacademy_registrations_updated on public.libertacademy_registrations;
create trigger libertacademy_registrations_updated
before update on public.libertacademy_registrations
for each row execute function public.handle_updated_date();

create or replace function public.libertacademy_get_public_school(p_school_slug text)
returns table (
  id uuid,
  name text,
  slug text,
  city text,
  country text,
  status text
)
language sql
security definer
set search_path = public
as $$
  select s.id, s.name, s.slug, s.city, s.country, s.status
  from public.libertacademy_schools s
  where s.slug = public.libertacademy_normalize_slug(p_school_slug)
    and s.status = 'active'
  limit 1;
$$;

create or replace function public.libertacademy_submit_registration(
  p_school_slug text,
  p_school_name text,
  p_athlete_full_name text,
  p_birth_date date,
  p_document_id text,
  p_category text,
  p_language text default 'pt',
  p_contact_name text default null,
  p_contact_email text default null,
  p_contact_phone text default null,
  p_source text default 'libertacademy-public-page'
)
returns table (
  registration_id uuid,
  school_id uuid,
  school_name text,
  school_slug text,
  school_created boolean,
  school_access_key text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_slug text;
  normalized_name text;
  school_row public.libertacademy_schools%rowtype;
  created_school boolean := false;
  inserted_registration public.libertacademy_registrations%rowtype;
begin
  normalized_name := nullif(trim(regexp_replace(coalesce(p_school_name, ''), '\s+', ' ', 'g')), '');
  normalized_slug := nullif(public.libertacademy_normalize_slug(coalesce(p_school_slug, normalized_name)), '');

  if normalized_name is null then
    raise exception 'Nome da escola e obrigatorio.';
  end if;

  if nullif(trim(coalesce(p_athlete_full_name, '')), '') is null then
    raise exception 'Nome do atleta e obrigatorio.';
  end if;

  if p_category not in ('Sub10', 'Sub12', 'Sub14') then
    raise exception 'Categoria invalida.';
  end if;

  if normalized_slug is not null then
    select *
    into school_row
    from public.libertacademy_schools
    where slug = normalized_slug
    limit 1;
  end if;

  if school_row.id is null then
    select *
    into school_row
    from public.libertacademy_schools
    where public.libertacademy_normalize_slug(name) = public.libertacademy_normalize_slug(normalized_name)
    order by created_date asc
    limit 1;
  end if;

  if school_row.id is null then
    insert into public.libertacademy_schools (
      name,
      slug,
      contact_name,
      contact_email,
      contact_phone,
      status
    )
    values (
      normalized_name,
      coalesce(normalized_slug, public.libertacademy_normalize_slug(normalized_name)),
      nullif(trim(coalesce(p_contact_name, '')), ''),
      nullif(lower(trim(coalesce(p_contact_email, ''))), ''),
      nullif(trim(coalesce(p_contact_phone, '')), ''),
      'active'
    )
    returning * into school_row;

    created_school := true;
  elsif school_row.status <> 'active' then
    raise exception 'Escola inativa para cadastro.';
  end if;

  insert into public.libertacademy_registrations (
    school_id,
    school_name,
    athlete_full_name,
    birth_date,
    document_id,
    category,
    language,
    source,
    raw_payload
  )
  values (
    school_row.id,
    school_row.name,
    trim(regexp_replace(coalesce(p_athlete_full_name, ''), '\s+', ' ', 'g')),
    p_birth_date,
    nullif(trim(coalesce(p_document_id, '')), ''),
    p_category,
    coalesce(nullif(trim(p_language), ''), 'pt'),
    coalesce(nullif(trim(p_source), ''), 'libertacademy-public-page'),
    jsonb_build_object(
      'school_slug', school_row.slug,
      'school_name_submitted', normalized_name,
      'contact_name', nullif(trim(coalesce(p_contact_name, '')), ''),
      'contact_email', nullif(lower(trim(coalesce(p_contact_email, ''))), ''),
      'contact_phone', nullif(trim(coalesce(p_contact_phone, '')), '')
    )
  )
  returning * into inserted_registration;

  registration_id := inserted_registration.id;
  school_id := school_row.id;
  school_name := school_row.name;
  school_slug := school_row.slug;
  school_created := created_school;
  school_access_key := case when created_school then school_row.access_key else null end;
  return next;
end;
$$;

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

insert into public.libertacademy_schools (name, slug, city, country, status)
values
  ('palmeiras/ajax', 'palmeiras-ajax', null, 'Brasil', 'active'),
  ('San Lorenzo Escobar', 'san-lorenzo-escobar', 'Escobar', 'Argentina', 'active')
on conflict (slug) do update
set
  name = excluded.name,
  city = excluded.city,
  country = excluded.country,
  status = 'active',
  updated_date = now();

revoke all on public.libertacademy_schools from anon, authenticated;
revoke all on public.libertacademy_registrations from anon, authenticated;

grant execute on function public.libertacademy_get_public_school(text) to anon, authenticated;
grant execute on function public.libertacademy_submit_registration(text, text, text, date, text, text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.libertacademy_get_school_portal(text, text) to anon, authenticated;

commit;
