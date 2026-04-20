begin;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_invite_id uuid;
  matched_invite_role text;
  has_whitelist_access boolean := false;
  resolved_full_name text;
  resolved_avatar text;
  resolved_role text := 'user';
  resolved_revela_admin boolean := false;
begin
  select id, role
  into matched_invite_id, matched_invite_role
  from public.invites
  where lower(email) = lower(new.email)
  order by created_date desc
  limit 1;

  select exists (
    select 1
    from public.access_whitelist
    where lower(email) = lower(new.email)
      and is_active = true
      and (expires_at is null or expires_at > now())
  )
  into has_whitelist_access;

  resolved_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );

  resolved_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture'
  );

  if matched_invite_id is not null then
    if lower(coalesce(matched_invite_role, '')) = 'admin' then
      resolved_role := 'admin';
    elsif lower(coalesce(matched_invite_role, '')) = 'revela_admin' then
      resolved_revela_admin := true;
    end if;
  end if;

  insert into public.profiles (
    id,
    email,
    full_name,
    profile_picture_url,
    role,
    is_revela_admin,
    has_zona_membros_access,
    onboarding_completed,
    invite_status
  )
  values (
    new.id,
    new.email,
    resolved_full_name,
    resolved_avatar,
    resolved_role,
    resolved_revela_admin,
    has_whitelist_access or matched_invite_id is not null,
    has_whitelist_access or matched_invite_id is not null,
    case when matched_invite_id is not null then 'accepted' else null end
  )
  on conflict (id) do nothing;

  if matched_invite_id is not null then
    update public.invites
    set user_id = new.id,
        status = 'accepted'
    where id = matched_invite_id;
  end if;

  return new;
end;
$$;

create index if not exists access_whitelist_email_lower_idx on public.access_whitelist (lower(email));
create index if not exists invites_email_lower_idx on public.invites (lower(email));

commit;
