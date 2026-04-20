begin;

create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

create or replace function public.handle_updated_date()
returns trigger
language plpgsql
as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

-- =========================================================
-- STORAGE
-- =========================================================

insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

drop policy if exists "Users can upload files" on storage.objects;
create policy "Users can upload files"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'uploads');

drop policy if exists "Public read access" on storage.objects;
create policy "Public read access"
on storage.objects
for select
to public
using (bucket_id = 'uploads');

drop policy if exists "Users can delete own uploads" on storage.objects;
create policy "Users can delete own uploads"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'uploads'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- =========================================================
-- 1. PROFILES
-- =========================================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text default 'user',
  is_revela_admin boolean default false,
  is_approved boolean default true,
  is_featured boolean default false,
  profile_picture_url text,
  player_cutout_url text,
  has_revela_talentos_access boolean default false,
  has_plano_carreira_access boolean default false,
  has_zona_membros_access boolean default false,
  onboarding_completed boolean default false,
  has_seen_welcome boolean default false,
  invite_status text,
  position text,
  club text,
  current_club_name text,
  current_club_crest_url text,
  nationality text,
  birth_date date,
  height numeric,
  weight numeric,
  jersey_number text,
  language text default 'pt',
  total_points integer default 0,
  career_stats jsonb default '{}'::jsonb,
  fifa_attributes jsonb default '{}'::jsonb,
  achievements text,
  career_highlights text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.profiles enable row level security;

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

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and (role = 'admin' or is_revela_admin = true)
  );
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

drop trigger if exists profiles_updated on public.profiles;
create trigger profiles_updated
before update on public.profiles
for each row execute function public.handle_updated_date();

drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
create policy "Public profiles are viewable by everyone"
on public.profiles
for select
to public
using (true);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Allow insert for new users" on public.profiles;
create policy "Allow insert for new users"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "Admins can do anything" on public.profiles;
create policy "Admins can do anything"
on public.profiles
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- =========================================================
-- 2. ACCESS WHITELIST
-- =========================================================

create table if not exists public.access_whitelist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  is_active boolean default true,
  expires_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.access_whitelist enable row level security;

drop policy if exists "Admins manage whitelist" on public.access_whitelist;
create policy "Admins manage whitelist"
on public.access_whitelist
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated can read whitelist" on public.access_whitelist;
create policy "Authenticated can read whitelist"
on public.access_whitelist
for select
to authenticated
using (true);

drop trigger if exists access_whitelist_updated on public.access_whitelist;
create trigger access_whitelist_updated
before update on public.access_whitelist
for each row execute function public.handle_updated_date();

-- =========================================================
-- 3. PLATFORM SETTINGS
-- =========================================================

create table if not exists public.platform_settings (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  setting_value text,
  setting_type text,
  description text,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.platform_settings enable row level security;

drop policy if exists "Anyone can read settings" on public.platform_settings;
create policy "Anyone can read settings"
on public.platform_settings
for select
to public
using (true);

drop policy if exists "Admins manage settings" on public.platform_settings;
create policy "Admins manage settings"
on public.platform_settings
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists platform_settings_updated on public.platform_settings;
create trigger platform_settings_updated
before update on public.platform_settings
for each row execute function public.handle_updated_date();

insert into public.platform_settings (setting_key, setting_value)
values
  ('is_platform_restricted', 'false'),
  ('is_live', 'false')
on conflict (setting_key) do nothing;

-- =========================================================
-- 4. CONTENT
-- =========================================================

create table if not exists public.content (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  thumbnail_url text,
  video_url text,
  hls_url text,
  category text,
  access_level text default 'free',
  is_published boolean default false,
  display_order integer default 0,
  duration text,
  tags jsonb default '[]'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.content enable row level security;

drop policy if exists "Published content readable by all" on public.content;
create policy "Published content readable by all"
on public.content
for select
to public
using (is_published = true);

drop policy if exists "Admins manage content" on public.content;
create policy "Admins manage content"
on public.content
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists content_updated on public.content;
create trigger content_updated
before update on public.content
for each row execute function public.handle_updated_date();

-- =========================================================
-- 5. COMMENTS
-- =========================================================

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  content_id uuid references public.content(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  comment_text text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.comments enable row level security;

drop policy if exists "Anyone can read comments" on public.comments;
create policy "Anyone can read comments"
on public.comments
for select
to public
using (true);

drop policy if exists "Auth users can create comments" on public.comments;
create policy "Auth users can create comments"
on public.comments
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users update own comments" on public.comments;
create policy "Users update own comments"
on public.comments
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage comments" on public.comments;
create policy "Admins manage comments"
on public.comments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists comments_updated on public.comments;
create trigger comments_updated
before update on public.comments
for each row execute function public.handle_updated_date();

-- =========================================================
-- 6. USER PROGRESS
-- =========================================================

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  content_id uuid references public.content(id) on delete cascade,
  progress_percent numeric default 0,
  completed boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_progress enable row level security;

drop policy if exists "Users own progress" on public.user_progress;
create policy "Users own progress"
on public.user_progress
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins see all progress" on public.user_progress;
create policy "Admins see all progress"
on public.user_progress
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists user_progress_updated on public.user_progress;
create trigger user_progress_updated
before update on public.user_progress
for each row execute function public.handle_updated_date();

-- =========================================================
-- 7. STORIES
-- =========================================================

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  title text,
  media_url text,
  media_type text default 'image',
  "order" integer default 0,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.stories enable row level security;

drop policy if exists "Anyone can read stories" on public.stories;
create policy "Anyone can read stories"
on public.stories
for select
to public
using (is_active = true);

drop policy if exists "Admins manage stories" on public.stories;
create policy "Admins manage stories"
on public.stories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists stories_updated on public.stories;
create trigger stories_updated
before update on public.stories
for each row execute function public.handle_updated_date();

-- =========================================================
-- 8. ATHLETE STORIES
-- =========================================================

create table if not exists public.athlete_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  media_url text,
  media_type text default 'image',
  display_order integer default 0,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_stories enable row level security;

drop policy if exists "Anyone reads athlete stories" on public.athlete_stories;
create policy "Anyone reads athlete stories"
on public.athlete_stories
for select
to public
using (is_active = true);

drop policy if exists "Admins manage athlete stories" on public.athlete_stories;
create policy "Admins manage athlete stories"
on public.athlete_stories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists athlete_stories_updated on public.athlete_stories;
create trigger athlete_stories_updated
before update on public.athlete_stories
for each row execute function public.handle_updated_date();

-- =========================================================
-- 9. TESTIMONIALS
-- =========================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text,
  role text,
  text text,
  avatar_url text,
  video_url text,
  is_active boolean default true,
  display_order integer default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Anyone reads testimonials" on public.testimonials;
create policy "Anyone reads testimonials"
on public.testimonials
for select
to public
using (is_active = true);

drop policy if exists "Admins manage testimonials" on public.testimonials;
create policy "Admins manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists testimonials_updated on public.testimonials;
create trigger testimonials_updated
before update on public.testimonials
for each row execute function public.handle_updated_date();

-- =========================================================
-- 10. SERVICE HIGHLIGHTS
-- =========================================================

create table if not exists public.service_highlights (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  icon text,
  display_order integer default 0,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.service_highlights enable row level security;

drop policy if exists "Anyone reads highlights" on public.service_highlights;
create policy "Anyone reads highlights"
on public.service_highlights
for select
to public
using (is_active = true);

drop policy if exists "Admins manage highlights" on public.service_highlights;
create policy "Admins manage highlights"
on public.service_highlights
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists service_highlights_updated on public.service_highlights;
create trigger service_highlights_updated
before update on public.service_highlights
for each row execute function public.handle_updated_date();

-- =========================================================
-- 11. ATHLETE UPLOADS
-- =========================================================

create table if not exists public.athlete_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  file_url text,
  file_type text,
  file_name text,
  processing_status text default 'pending',
  is_featured boolean default false,
  analysis_result text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_uploads enable row level security;

drop policy if exists "Users own uploads" on public.athlete_uploads;
create policy "Users own uploads"
on public.athlete_uploads
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage uploads" on public.athlete_uploads;
create policy "Admins manage uploads"
on public.athlete_uploads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists athlete_uploads_updated on public.athlete_uploads;
create trigger athlete_uploads_updated
before update on public.athlete_uploads
for each row execute function public.handle_updated_date();

-- =========================================================
-- 12. ATHLETE VIDEOS
-- =========================================================

create table if not exists public.athlete_videos (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid references public.profiles(id) on delete set null,
  user_id uuid references public.profiles(id) on delete set null,
  title text,
  video_url text,
  thumbnail_url text,
  status text default 'pending',
  description text,
  sport text,
  position text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_videos enable row level security;

drop policy if exists "Approved videos public" on public.athlete_videos;
create policy "Approved videos public"
on public.athlete_videos
for select
to public
using (status = 'approved');

drop policy if exists "Users see own videos" on public.athlete_videos;
create policy "Users see own videos"
on public.athlete_videos
for select
to authenticated
using (user_id = auth.uid() or athlete_id = auth.uid());

drop policy if exists "Users create videos" on public.athlete_videos;
create policy "Users create videos"
on public.athlete_videos
for insert
to authenticated
with check (user_id = auth.uid() or athlete_id = auth.uid() or created_by = auth.uid());

drop policy if exists "Users update own videos" on public.athlete_videos;
create policy "Users update own videos"
on public.athlete_videos
for update
to authenticated
using (user_id = auth.uid() or athlete_id = auth.uid() or created_by = auth.uid())
with check (user_id = auth.uid() or athlete_id = auth.uid() or created_by = auth.uid());

drop policy if exists "Admins manage videos" on public.athlete_videos;
create policy "Admins manage videos"
on public.athlete_videos
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists athlete_videos_updated on public.athlete_videos;
create trigger athlete_videos_updated
before update on public.athlete_videos
for each row execute function public.handle_updated_date();

-- =========================================================
-- 13. PERFORMANCE DATA
-- =========================================================

create table if not exists public.performance_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  game_date date,
  opponent text,
  minutes_played integer default 0,
  goals integer default 0,
  assists integer default 0,
  rating numeric default 0,
  status text default 'pending_analysis',
  analyst_notes text,
  athlete_feeling text,
  athlete_weekly_summary text,
  associated_video_url text,
  extra_data jsonb default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.performance_data enable row level security;

drop policy if exists "Users own performance" on public.performance_data;
create policy "Users own performance"
on public.performance_data
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage performance" on public.performance_data;
create policy "Admins manage performance"
on public.performance_data
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists performance_data_updated on public.performance_data;
create trigger performance_data_updated
before update on public.performance_data
for each row execute function public.handle_updated_date();

-- =========================================================
-- 14. DAILY CHECKINS
-- =========================================================

create table if not exists public.daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  checkin_date date default current_date,
  mood text,
  sleep_quality integer,
  energy_level integer,
  notes text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.daily_checkins enable row level security;

drop policy if exists "Users own checkins" on public.daily_checkins;
create policy "Users own checkins"
on public.daily_checkins
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins see checkins" on public.daily_checkins;
create policy "Admins see checkins"
on public.daily_checkins
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists daily_checkins_updated on public.daily_checkins;
create trigger daily_checkins_updated
before update on public.daily_checkins
for each row execute function public.handle_updated_date();

-- =========================================================
-- 15. WEEKLY ASSESSMENTS
-- =========================================================

create table if not exists public.weekly_assessments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  week_start_date date,
  summary text,
  goals_met jsonb default '[]'::jsonb,
  ai_feedback text,
  score numeric,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.weekly_assessments enable row level security;

drop policy if exists "Users own assessments" on public.weekly_assessments;
create policy "Users own assessments"
on public.weekly_assessments
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins see assessments" on public.weekly_assessments;
create policy "Admins see assessments"
on public.weekly_assessments
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists weekly_assessments_updated on public.weekly_assessments;
create trigger weekly_assessments_updated
before update on public.weekly_assessments
for each row execute function public.handle_updated_date();

-- =========================================================
-- 16. ATHLETE TASKS
-- =========================================================

create table if not exists public.athlete_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  description text,
  status text default 'pending',
  due_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_tasks enable row level security;

drop policy if exists "Users own tasks" on public.athlete_tasks;
create policy "Users own tasks"
on public.athlete_tasks
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage tasks" on public.athlete_tasks;
create policy "Admins manage tasks"
on public.athlete_tasks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists athlete_tasks_updated on public.athlete_tasks;
create trigger athlete_tasks_updated
before update on public.athlete_tasks
for each row execute function public.handle_updated_date();

-- =========================================================
-- 17. ATHLETE TROPHIES
-- =========================================================

create table if not exists public.athlete_trophies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  description text,
  icon text,
  earned_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_trophies enable row level security;

drop policy if exists "Users see own trophies" on public.athlete_trophies;
create policy "Users see own trophies"
on public.athlete_trophies
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users manage own trophies" on public.athlete_trophies;
create policy "Users manage own trophies"
on public.athlete_trophies
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage trophies" on public.athlete_trophies;
create policy "Admins manage trophies"
on public.athlete_trophies
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists athlete_trophies_updated on public.athlete_trophies;
create trigger athlete_trophies_updated
before update on public.athlete_trophies
for each row execute function public.handle_updated_date();

-- =========================================================
-- 18. CHAT MESSAGES
-- =========================================================

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id text,
  receiver_id text,
  conversation_id text,
  content text,
  message_type text default 'text',
  read boolean default false,
  user_id uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.chat_messages enable row level security;

drop policy if exists "Auth users can read messages" on public.chat_messages;
create policy "Auth users can read messages"
on public.chat_messages
for select
to authenticated
using (true);

drop policy if exists "Auth users can create messages" on public.chat_messages;
create policy "Auth users can create messages"
on public.chat_messages
for insert
to authenticated
with check (true);

drop policy if exists "Auth users can update messages" on public.chat_messages;
create policy "Auth users can update messages"
on public.chat_messages
for update
to authenticated
using (true)
with check (true);

drop trigger if exists chat_messages_updated on public.chat_messages;
create trigger chat_messages_updated
before update on public.chat_messages
for each row execute function public.handle_updated_date();

-- =========================================================
-- 19. NOTIFICATIONS
-- =========================================================

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  message text,
  type text default 'general',
  priority text default 'medium',
  is_read boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.notifications enable row level security;

drop policy if exists "Users see own notifications" on public.notifications;
create policy "Users see own notifications"
on public.notifications
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users update own notifications" on public.notifications;
create policy "Users update own notifications"
on public.notifications
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Auth users create notifications" on public.notifications;
create policy "Auth users create notifications"
on public.notifications
for insert
to authenticated
with check (true);

drop policy if exists "Admins manage notifications" on public.notifications;
create policy "Admins manage notifications"
on public.notifications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists notifications_updated on public.notifications;
create trigger notifications_updated
before update on public.notifications
for each row execute function public.handle_updated_date();

-- =========================================================
-- 20. ADMIN NOTIFICATIONS
-- =========================================================

create table if not exists public.admin_notifications (
  id uuid primary key default gen_random_uuid(),
  title text,
  message text,
  type text,
  related_user_id uuid references public.profiles(id) on delete set null,
  is_read boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.admin_notifications enable row level security;

drop policy if exists "Admins see admin notifications" on public.admin_notifications;
create policy "Admins see admin notifications"
on public.admin_notifications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists admin_notifications_updated on public.admin_notifications;
create trigger admin_notifications_updated
before update on public.admin_notifications
for each row execute function public.handle_updated_date();

-- =========================================================
-- 21. USER NOTIFICATIONS
-- =========================================================

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  message text,
  type text,
  is_read boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_notifications enable row level security;

drop policy if exists "Users see own user_notifications" on public.user_notifications;
create policy "Users see own user_notifications"
on public.user_notifications
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage user_notifications" on public.user_notifications;
create policy "Admins manage user_notifications"
on public.user_notifications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists user_notifications_updated on public.user_notifications;
create trigger user_notifications_updated
before update on public.user_notifications
for each row execute function public.handle_updated_date();

-- =========================================================
-- 22. LEADS
-- =========================================================

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  age text,
  plan text,
  source text,
  status text default 'new',
  notes text,
  vendor_id text,
  extra_data jsonb default '{}'::jsonb,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.leads enable row level security;

drop policy if exists "Public can create leads" on public.leads;
create policy "Public can create leads"
on public.leads
for insert
to public
with check (true);

drop policy if exists "Admins manage leads" on public.leads;
create policy "Admins manage leads"
on public.leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists leads_updated on public.leads;
create trigger leads_updated
before update on public.leads
for each row execute function public.handle_updated_date();

-- =========================================================
-- 23. INTERNATIONAL LEADS
-- =========================================================

create table if not exists public.international_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  country text,
  sport text,
  plan text,
  message text,
  status text default 'new',
  extra_data jsonb default '{}'::jsonb,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.international_leads enable row level security;

drop policy if exists "Public can create int leads" on public.international_leads;
create policy "Public can create int leads"
on public.international_leads
for insert
to public
with check (true);

drop policy if exists "Admins manage int leads" on public.international_leads;
create policy "Admins manage int leads"
on public.international_leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists international_leads_updated on public.international_leads;
create trigger international_leads_updated
before update on public.international_leads
for each row execute function public.handle_updated_date();

-- =========================================================
-- 24. LEAD INTERACTIONS
-- =========================================================

create table if not exists public.lead_interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid,
  lead_type text,
  interaction_type text,
  notes text,
  performed_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.lead_interactions enable row level security;

drop policy if exists "Admins manage interactions" on public.lead_interactions;
create policy "Admins manage interactions"
on public.lead_interactions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists lead_interactions_updated on public.lead_interactions;
create trigger lead_interactions_updated
before update on public.lead_interactions
for each row execute function public.handle_updated_date();

-- =========================================================
-- 25. LEAD PAGES
-- =========================================================

create table if not exists public.lead_pages (
  id uuid primary key default gen_random_uuid(),
  title text,
  url_slug text unique,
  content jsonb default '{}'::jsonb,
  target_entity text,
  is_active boolean default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.lead_pages enable row level security;

drop policy if exists "Anyone reads active pages" on public.lead_pages;
create policy "Anyone reads active pages"
on public.lead_pages
for select
to public
using (is_active = true);

drop policy if exists "Admins manage pages" on public.lead_pages;
create policy "Admins manage pages"
on public.lead_pages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists lead_pages_updated on public.lead_pages;
create trigger lead_pages_updated
before update on public.lead_pages
for each row execute function public.handle_updated_date();

-- =========================================================
-- 26. CRM LEADS
-- =========================================================

create table if not exists public.crm_leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  sales_rep_id uuid references public.profiles(id) on delete set null,
  current_stage text,
  source text,
  notes text,
  value numeric,
  extra_data jsonb default '{}'::jsonb,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.crm_leads enable row level security;

drop policy if exists "Admins manage crm leads" on public.crm_leads;
create policy "Admins manage crm leads"
on public.crm_leads
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists crm_leads_updated on public.crm_leads;
create trigger crm_leads_updated
before update on public.crm_leads
for each row execute function public.handle_updated_date();

-- =========================================================
-- 27. CRM PIPELINES
-- =========================================================

create table if not exists public.crm_pipelines (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  color text default 'blue',
  stages jsonb default '[]'::jsonb,
  sales_rep_id uuid references public.profiles(id) on delete set null,
  is_active boolean default true,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.crm_pipelines enable row level security;

drop policy if exists "Admins manage pipelines" on public.crm_pipelines;
create policy "Admins manage pipelines"
on public.crm_pipelines
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists crm_pipelines_updated on public.crm_pipelines;
create trigger crm_pipelines_updated
before update on public.crm_pipelines
for each row execute function public.handle_updated_date();

-- =========================================================
-- 28. PIPELINES
-- =========================================================

create table if not exists public.pipelines (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  color text default 'blue',
  stages jsonb default '[]'::jsonb,
  is_active boolean default true,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.pipelines enable row level security;

drop policy if exists "Admins manage pipelines2" on public.pipelines;
create policy "Admins manage pipelines2"
on public.pipelines
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists pipelines_updated on public.pipelines;
create trigger pipelines_updated
before update on public.pipelines
for each row execute function public.handle_updated_date();

-- =========================================================
-- 29. USER PIPELINES
-- =========================================================

create table if not exists public.user_pipelines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  pipeline_id uuid references public.pipelines(id) on delete cascade,
  current_stage text,
  created_date timestamptz default now(),
  updated_date timestamptz default now(),
  unique (user_id, pipeline_id)
);

alter table public.user_pipelines enable row level security;

drop policy if exists "Users own user pipelines" on public.user_pipelines;
create policy "Users own user pipelines"
on public.user_pipelines
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage user pipelines" on public.user_pipelines;
create policy "Admins manage user pipelines"
on public.user_pipelines
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists user_pipelines_updated on public.user_pipelines;
create trigger user_pipelines_updated
before update on public.user_pipelines
for each row execute function public.handle_updated_date();

-- =========================================================
-- 30. CUSTOM TASKS
-- =========================================================

create table if not exists public.custom_tasks (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text default 'pending',
  related_lead_id uuid,
  related_lead_type text,
  assigned_user_id uuid references public.profiles(id) on delete set null,
  due_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.custom_tasks enable row level security;

drop policy if exists "Assigned users own custom tasks" on public.custom_tasks;
create policy "Assigned users own custom tasks"
on public.custom_tasks
for select
to authenticated
using (assigned_user_id = auth.uid());

drop policy if exists "Admins manage custom tasks" on public.custom_tasks;
create policy "Admins manage custom tasks"
on public.custom_tasks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists custom_tasks_updated on public.custom_tasks;
create trigger custom_tasks_updated
before update on public.custom_tasks
for each row execute function public.handle_updated_date();

-- =========================================================
-- 31. SALES MATERIALS
-- =========================================================

create table if not exists public.sales_materials (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  file_url text,
  file_type text,
  category text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.sales_materials enable row level security;

drop policy if exists "Admins manage sales materials" on public.sales_materials;
create policy "Admins manage sales materials"
on public.sales_materials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists sales_materials_updated on public.sales_materials;
create trigger sales_materials_updated
before update on public.sales_materials
for each row execute function public.handle_updated_date();

-- =========================================================
-- 32. MARKETING
-- =========================================================

create table if not exists public.marketing (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text,
  description text,
  file_url text,
  status text default 'pending',
  type text,
  feedback text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing enable row level security;

drop policy if exists "Users own marketing" on public.marketing;
create policy "Users own marketing"
on public.marketing
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage marketing" on public.marketing;
create policy "Admins manage marketing"
on public.marketing
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists marketing_updated on public.marketing;
create trigger marketing_updated
before update on public.marketing
for each row execute function public.handle_updated_date();

-- =========================================================
-- 33. MARKETING CAMPAIGNS
-- =========================================================

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  status text default 'draft',
  start_date date,
  end_date date,
  budget numeric,
  results jsonb default '{}'::jsonb,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing_campaigns enable row level security;

drop policy if exists "Admins manage campaigns" on public.marketing_campaigns;
create policy "Admins manage campaigns"
on public.marketing_campaigns
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists marketing_campaigns_updated on public.marketing_campaigns;
create trigger marketing_campaigns_updated
before update on public.marketing_campaigns
for each row execute function public.handle_updated_date();

-- =========================================================
-- 34. MARKETING MATERIALS
-- =========================================================

create table if not exists public.marketing_materials (
  id uuid primary key default gen_random_uuid(),
  title text,
  file_url text,
  file_type text,
  category text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing_materials enable row level security;

drop policy if exists "Auth read marketing materials" on public.marketing_materials;
create policy "Auth read marketing materials"
on public.marketing_materials
for select
to authenticated
using (true);

drop policy if exists "Admins manage marketing materials" on public.marketing_materials;
create policy "Admins manage marketing materials"
on public.marketing_materials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists marketing_materials_updated on public.marketing_materials;
create trigger marketing_materials_updated
before update on public.marketing_materials
for each row execute function public.handle_updated_date();

-- =========================================================
-- 35. MARKETING TASKS
-- =========================================================

create table if not exists public.marketing_tasks (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text default 'pending',
  assigned_to uuid references public.profiles(id) on delete set null,
  due_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing_tasks enable row level security;

drop policy if exists "Assigned users read marketing tasks" on public.marketing_tasks;
create policy "Assigned users read marketing tasks"
on public.marketing_tasks
for select
to authenticated
using (assigned_to = auth.uid());

drop policy if exists "Admins manage marketing tasks" on public.marketing_tasks;
create policy "Admins manage marketing tasks"
on public.marketing_tasks
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists marketing_tasks_updated on public.marketing_tasks;
create trigger marketing_tasks_updated
before update on public.marketing_tasks
for each row execute function public.handle_updated_date();

-- =========================================================
-- 36. CONTENT IDEAS
-- =========================================================

create table if not exists public.content_ideas (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  status text default 'idea',
  category text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.content_ideas enable row level security;

drop policy if exists "Admins manage content ideas" on public.content_ideas;
create policy "Admins manage content ideas"
on public.content_ideas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists content_ideas_updated on public.content_ideas;
create trigger content_ideas_updated
before update on public.content_ideas
for each row execute function public.handle_updated_date();

-- =========================================================
-- 37. SOCIAL MEDIA POSTS
-- =========================================================

create table if not exists public.social_media_posts (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  platform text,
  scheduled_date timestamptz,
  status text default 'draft',
  media_url text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.social_media_posts enable row level security;

drop policy if exists "Admins manage social posts" on public.social_media_posts;
create policy "Admins manage social posts"
on public.social_media_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists social_media_posts_updated on public.social_media_posts;
create trigger social_media_posts_updated
before update on public.social_media_posts
for each row execute function public.handle_updated_date();

-- =========================================================
-- 38. EVENTS
-- =========================================================

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  location text,
  image_url text,
  target_users text,
  is_active boolean default true,
  max_participants integer,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.events enable row level security;

drop policy if exists "Anyone reads events" on public.events;
create policy "Anyone reads events"
on public.events
for select
to public
using (is_active = true);

drop policy if exists "Admins manage events" on public.events;
create policy "Admins manage events"
on public.events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists events_updated on public.events;
create trigger events_updated
before update on public.events
for each row execute function public.handle_updated_date();

-- =========================================================
-- 39. GAME SCHEDULES
-- =========================================================

create table if not exists public.game_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  game_date date,
  opponent text,
  location text,
  competition text,
  notes text,
  result text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.game_schedules enable row level security;

drop policy if exists "Users own schedules" on public.game_schedules;
create policy "Users own schedules"
on public.game_schedules
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage schedules" on public.game_schedules;
create policy "Admins manage schedules"
on public.game_schedules
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists game_schedules_updated on public.game_schedules;
create trigger game_schedules_updated
before update on public.game_schedules
for each row execute function public.handle_updated_date();

-- =========================================================
-- 40. SELETIVAS
-- =========================================================

create table if not exists public.seletivas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  event_name text,
  notes text,
  status text default 'pending',
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.seletivas enable row level security;

drop policy if exists "Users own seletivas" on public.seletivas;
create policy "Users own seletivas"
on public.seletivas
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage seletivas" on public.seletivas;
create policy "Admins manage seletivas"
on public.seletivas
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists seletivas_updated on public.seletivas;
create trigger seletivas_updated
before update on public.seletivas
for each row execute function public.handle_updated_date();

-- =========================================================
-- 41. SELETIVA EVENTS
-- =========================================================

create table if not exists public.seletiva_events (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  date timestamptz,
  location text,
  is_published boolean default false,
  status text default 'open',
  max_participants integer,
  image_url text,
  requirements text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.seletiva_events enable row level security;

drop policy if exists "Anyone reads published seletiva events" on public.seletiva_events;
create policy "Anyone reads published seletiva events"
on public.seletiva_events
for select
to public
using (is_published = true);

drop policy if exists "Admins manage seletiva events" on public.seletiva_events;
create policy "Admins manage seletiva events"
on public.seletiva_events
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists seletiva_events_updated on public.seletiva_events;
create trigger seletiva_events_updated
before update on public.seletiva_events
for each row execute function public.handle_updated_date();

-- =========================================================
-- 42. SELETIVA APPLICATIONS
-- =========================================================

create table if not exists public.seletiva_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  seletiva_event_id uuid references public.seletiva_events(id) on delete cascade,
  status text default 'pending',
  notes text,
  video_url text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.seletiva_applications enable row level security;

drop policy if exists "Users see own applications" on public.seletiva_applications;
create policy "Users see own applications"
on public.seletiva_applications
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage applications" on public.seletiva_applications;
create policy "Admins manage applications"
on public.seletiva_applications
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists seletiva_applications_updated on public.seletiva_applications;
create trigger seletiva_applications_updated
before update on public.seletiva_applications
for each row execute function public.handle_updated_date();

-- =========================================================
-- 43. SUBSCRIPTION PACKAGES
-- =========================================================

create table if not exists public.subscription_packages (
  id uuid primary key default gen_random_uuid(),
  name text,
  description text,
  price numeric,
  currency text default 'BRL',
  features jsonb default '[]'::jsonb,
  is_active boolean default true,
  stripe_price_id text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.subscription_packages enable row level security;

drop policy if exists "Anyone reads packages" on public.subscription_packages;
create policy "Anyone reads packages"
on public.subscription_packages
for select
to public
using (is_active = true);

drop policy if exists "Admins manage packages" on public.subscription_packages;
create policy "Admins manage packages"
on public.subscription_packages
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists subscription_packages_updated on public.subscription_packages;
create trigger subscription_packages_updated
before update on public.subscription_packages
for each row execute function public.handle_updated_date();

-- =========================================================
-- 44. USER SUBSCRIPTIONS
-- =========================================================

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  package_id uuid references public.subscription_packages(id) on delete set null,
  status text default 'active',
  renewal_date date,
  stripe_subscription_id text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_subscriptions enable row level security;

drop policy if exists "Users see own subscriptions" on public.user_subscriptions;
create policy "Users see own subscriptions"
on public.user_subscriptions
for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Admins manage subscriptions" on public.user_subscriptions;
create policy "Admins manage subscriptions"
on public.user_subscriptions
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists user_subscriptions_updated on public.user_subscriptions;
create trigger user_subscriptions_updated
before update on public.user_subscriptions
for each row execute function public.handle_updated_date();

-- =========================================================
-- 45. INTERNATIONAL PLANS
-- =========================================================

create table if not exists public.international_plans (
  id uuid primary key default gen_random_uuid(),
  title text,
  description text,
  features jsonb default '[]'::jsonb,
  price numeric,
  currency text default 'USD',
  "order" integer default 0,
  is_active boolean default true,
  image_url text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.international_plans enable row level security;

drop policy if exists "Anyone reads int plans" on public.international_plans;
create policy "Anyone reads int plans"
on public.international_plans
for select
to public
using (is_active = true);

drop policy if exists "Admins manage int plans" on public.international_plans;
create policy "Admins manage int plans"
on public.international_plans
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists international_plans_updated on public.international_plans;
create trigger international_plans_updated
before update on public.international_plans
for each row execute function public.handle_updated_date();

-- =========================================================
-- 46. ACTIVITY LOGS
-- =========================================================

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  action text,
  entity_type text,
  entity_id text,
  details jsonb default '{}'::jsonb,
  created_date timestamptz default now()
);

alter table public.activity_logs enable row level security;

drop policy if exists "Admins see activity logs" on public.activity_logs;
create policy "Admins see activity logs"
on public.activity_logs
for select
to authenticated
using (public.is_admin());

drop policy if exists "System creates logs" on public.activity_logs;
create policy "System creates logs"
on public.activity_logs
for insert
to authenticated
with check (true);

-- =========================================================
-- 47. CAREER POSTS
-- =========================================================

create table if not exists public.career_posts (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  image_url text,
  author text,
  is_active boolean default true,
  category text,
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.career_posts enable row level security;

drop policy if exists "Anyone reads career posts" on public.career_posts;
create policy "Anyone reads career posts"
on public.career_posts
for select
to public
using (is_active = true);

drop policy if exists "Admins manage career posts" on public.career_posts;
create policy "Admins manage career posts"
on public.career_posts
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists career_posts_updated on public.career_posts;
create trigger career_posts_updated
before update on public.career_posts
for each row execute function public.handle_updated_date();

-- =========================================================
-- 48. APP LOGS
-- =========================================================

create table if not exists public.app_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  page_name text,
  created_date timestamptz default now()
);

alter table public.app_logs enable row level security;

drop policy if exists "Auth users create app logs" on public.app_logs;
create policy "Auth users create app logs"
on public.app_logs
for insert
to authenticated
with check (true);

drop policy if exists "Admins see app logs" on public.app_logs;
create policy "Admins see app logs"
on public.app_logs
for select
to authenticated
using (public.is_admin());

-- =========================================================
-- 49. LIVE PLAYBACK LOGS
-- =========================================================

create table if not exists public.live_playback_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  session_id text,
  duration_seconds integer,
  created_date timestamptz default now()
);

alter table public.live_playback_logs enable row level security;

drop policy if exists "Auth create playback logs" on public.live_playback_logs;
create policy "Auth create playback logs"
on public.live_playback_logs
for insert
to authenticated
with check (true);

drop policy if exists "Admins see playback logs" on public.live_playback_logs;
create policy "Admins see playback logs"
on public.live_playback_logs
for select
to authenticated
using (public.is_admin());

-- =========================================================
-- 50. INVITES
-- =========================================================

create table if not exists public.invites (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  role text default 'user',
  invite_code text,
  user_id uuid references public.profiles(id) on delete set null,
  status text default 'pending',
  created_by uuid references public.profiles(id) on delete set null,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.invites enable row level security;

drop policy if exists "Admins manage invites" on public.invites;
create policy "Admins manage invites"
on public.invites
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop trigger if exists invites_updated on public.invites;
create trigger invites_updated
before update on public.invites
for each row execute function public.handle_updated_date();

create index if not exists access_whitelist_email_lower_idx on public.access_whitelist (lower(email));
create index if not exists invites_email_lower_idx on public.invites (lower(email));

-- =========================================================
-- RUNTIME COMPATIBILITY EXTENSIONS
-- =========================================================

alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists state text;
alter table public.profiles add column if not exists age integer;
alter table public.profiles add column if not exists foot text;
alter table public.profiles add column if not exists preferred_foot text;
alter table public.profiles add column if not exists playing_style text;
alter table public.profiles add column if not exists career_objectives text;
alter table public.profiles add column if not exists strengths jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists areas_improvement jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists responsible_full_name text;
alter table public.profiles add column if not exists responsible_phone text;
alter table public.profiles add column if not exists responsible_email text;
alter table public.profiles add column if not exists responsible_relation text;
alter table public.profiles add column if not exists last_weekly_assessment timestamptz;
alter table public.profiles add column if not exists career_level text;
alter table public.profiles add column if not exists contract_status text;
alter table public.profiles add column if not exists availability_date date;
alter table public.profiles add column if not exists market_value numeric;
alter table public.profiles add column if not exists club_history jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists injury_history jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists education text;
alter table public.profiles add column if not exists languages jsonb default '[]'::jsonb;
alter table public.profiles add column if not exists social_media jsonb default '{}'::jsonb;
alter table public.profiles add column if not exists agent_name text;
alter table public.profiles add column if not exists agent_contact text;

alter table public.athlete_uploads add column if not exists category text;
alter table public.athlete_uploads add column if not exists description text;
alter table public.athlete_uploads add column if not exists file_size bigint;

alter table public.athlete_videos add column if not exists category text;
alter table public.athlete_videos add column if not exists admin_feedback text;
alter table public.athlete_videos add column if not exists ai_analysis jsonb default '{}'::jsonb;
alter table public.athlete_videos add column if not exists athlete_name text;

alter table public.daily_checkins add column if not exists sleep_hours numeric;
alter table public.daily_checkins add column if not exists hydration_liters numeric;
alter table public.daily_checkins add column if not exists trained_today boolean default false;
alter table public.daily_checkins add column if not exists streak_days integer default 0;

alter table public.weekly_assessments add column if not exists had_game boolean default false;
alter table public.weekly_assessments add column if not exists goals integer default 0;
alter table public.weekly_assessments add column if not exists assists integer default 0;
alter table public.weekly_assessments add column if not exists minutes_played integer default 0;
alter table public.weekly_assessments add column if not exists training_sessions integer default 0;
alter table public.weekly_assessments add column if not exists self_rating integer;
alter table public.weekly_assessments add column if not exists physical_condition text;
alter table public.weekly_assessments add column if not exists notes text;
alter table public.weekly_assessments add column if not exists admin_feedback text;
alter table public.weekly_assessments add column if not exists points_earned integer default 0;

alter table public.marketing add column if not exists request_type text;
alter table public.marketing add column if not exists photo_urls jsonb default '[]'::jsonb;
alter table public.marketing add column if not exists video_urls jsonb default '[]'::jsonb;
alter table public.marketing add column if not exists flyer_title text;
alter table public.marketing add column if not exists flyer_subtitle text;
alter table public.marketing add column if not exists additional_info text;

alter table public.marketing_campaigns add column if not exists campaign_name text;
alter table public.marketing_campaigns add column if not exists platform text;
alter table public.marketing_campaigns add column if not exists campaign_type text;
alter table public.marketing_campaigns add column if not exists service_target text;
alter table public.marketing_campaigns add column if not exists budget_total numeric;
alter table public.marketing_campaigns add column if not exists metrics jsonb default '{}'::jsonb;

alter table public.marketing_materials add column if not exists description text;
alter table public.marketing_materials add column if not exists service_related text;
alter table public.marketing_materials add column if not exists usage_count integer default 0;

alter table public.social_media_posts add column if not exists caption text;
alter table public.social_media_posts add column if not exists content_type text;
alter table public.social_media_posts add column if not exists post_status text default 'draft';
alter table public.social_media_posts add column if not exists content_pillar text;

alter table public.content_ideas add column if not exists content_type text;
alter table public.content_ideas add column if not exists platform text;
alter table public.content_ideas add column if not exists content_pillar text;
alter table public.content_ideas add column if not exists priority text default 'medium';

alter table public.activity_logs add column if not exists action_type text;
alter table public.activity_logs add column if not exists user_name text;

alter table public.game_schedules add column if not exists venue text;
alter table public.game_schedules add column if not exists status text default 'scheduled';
alter table public.game_schedules add column if not exists home_away text default 'home';
alter table public.game_schedules add column if not exists importance text default 'medium';
alter table public.game_schedules add column if not exists preparation_notes text;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'game_schedules'
      and column_name = 'game_date'
      and data_type = 'date'
  ) then
    alter table public.game_schedules
      alter column game_date type timestamptz
      using case when game_date is null then null else game_date::timestamptz end;
  end if;
end $$;

update public.game_schedules
set venue = location
where venue is null
  and location is not null;

alter table public.seletivas add column if not exists full_name text;
alter table public.seletivas add column if not exists birth_date date;
alter table public.seletivas add column if not exists position text;
alter table public.seletivas add column if not exists height numeric;
alter table public.seletivas add column if not exists weight numeric;
alter table public.seletivas add column if not exists preferred_foot text;
alter table public.seletivas add column if not exists video_url_game text;
alter table public.seletivas add column if not exists video_url_drills text;
alter table public.seletivas add column if not exists self_assessment text;
alter table public.seletivas add column if not exists nationality text;
alter table public.seletivas add column if not exists city text;
alter table public.seletivas add column if not exists state text;
alter table public.seletivas add column if not exists current_club text;
alter table public.seletivas add column if not exists career_objectives text;
alter table public.seletivas add column if not exists playing_style text;
alter table public.seletivas add column if not exists strengths jsonb default '[]'::jsonb;
alter table public.seletivas add column if not exists areas_improvement jsonb default '[]'::jsonb;
alter table public.seletivas add column if not exists lgpd_consent boolean default false;
alter table public.seletivas add column if not exists responsible_full_name text;
alter table public.seletivas add column if not exists responsible_phone text;
alter table public.seletivas add column if not exists responsible_email text;
alter table public.seletivas add column if not exists responsible_relation text;

alter table public.seletiva_events add column if not exists thumbnail_url text;
alter table public.seletiva_events add column if not exists start_date timestamptz;
alter table public.seletiva_events add column if not exists end_date timestamptz;
alter table public.seletiva_events add column if not exists event_type text;
alter table public.seletiva_events add column if not exists club_name text;
alter table public.seletiva_events add column if not exists current_participants integer default 0;
alter table public.seletiva_events add column if not exists criteria jsonb default '{}'::jsonb;
alter table public.seletiva_events add column if not exists benefits jsonb default '[]'::jsonb;
alter table public.seletiva_events add column if not exists is_featured boolean default false;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'seletiva_events'
      and column_name = 'requirements'
      and udt_name <> 'jsonb'
  ) then
    alter table public.seletiva_events
      alter column requirements type jsonb
      using case
        when requirements is null then '[]'::jsonb
        when btrim(requirements) = '' then '[]'::jsonb
        when left(btrim(requirements), 1) = '[' then requirements::jsonb
        else to_jsonb(array_remove(regexp_split_to_array(replace(requirements, E'\r', ''), E'\n+'), ''))
      end;
  end if;
end $$;

alter table public.seletiva_events alter column requirements set default '[]'::jsonb;

update public.seletiva_events
set thumbnail_url = image_url
where thumbnail_url is null
  and image_url is not null;

update public.seletiva_events
set start_date = coalesce(start_date, date),
    end_date = coalesce(end_date, date)
where date is not null;

alter table public.seletiva_applications add column if not exists event_id uuid;
alter table public.seletiva_applications add column if not exists full_name text;
alter table public.seletiva_applications add column if not exists birth_date date;
alter table public.seletiva_applications add column if not exists position text;
alter table public.seletiva_applications add column if not exists city text;
alter table public.seletiva_applications add column if not exists state text;
alter table public.seletiva_applications add column if not exists phone text;
alter table public.seletiva_applications add column if not exists additional_videos jsonb default '[]'::jsonb;
alter table public.seletiva_applications add column if not exists height numeric;
alter table public.seletiva_applications add column if not exists weight numeric;
alter table public.seletiva_applications add column if not exists preferred_foot text;
alter table public.seletiva_applications add column if not exists current_club text;
alter table public.seletiva_applications add column if not exists why_participate text;
alter table public.seletiva_applications add column if not exists analyst_notes text;
alter table public.seletiva_applications add column if not exists rating integer;
alter table public.seletiva_applications add column if not exists feedback text;

update public.seletiva_applications
set event_id = seletiva_event_id
where event_id is null
  and seletiva_event_id is not null;

commit;
