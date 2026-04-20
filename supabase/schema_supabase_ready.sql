-- ============================================================
-- REVELA TALENTOS — SCHEMA COMPLETO PARA SUPABASE
-- Cole TUDO no SQL Editor do Supabase e clique RUN
-- ============================================================

-- ===================== EXTENSOES =====================
create extension if not exists "uuid-ossp";

-- ===================== FUNCAO AUXILIAR =====================
create or replace function public.handle_updated_date()
returns trigger as $$
begin
  new.updated_date = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- 1. PROFILES (estende auth.users)
-- ============================================================
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
  career_stats jsonb default '{}',
  fifa_attributes jsonb default '{}',
  achievements text,
  career_highlights text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_public"
  on public.profiles for select to public using (true);

create policy "profiles_insert_own"
  on public.profiles for insert to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update to authenticated
  using (auth.uid() = id);

create policy "profiles_admin_all"
  on public.profiles for all to authenticated
  using (
    (select role from public.profiles where id = auth.uid()) = 'admin'
    or
    (select is_revela_admin from public.profiles where id = auth.uid()) = true
  );

-- Trigger para criar perfil quando user faz signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated
  before update on public.profiles
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 2. ACCESS WHITELIST
-- ============================================================
create table if not exists public.access_whitelist (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  is_active boolean default true,
  expires_at timestamptz,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.access_whitelist enable row level security;

create policy "access_whitelist_admin" on public.access_whitelist for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create policy "access_whitelist_read" on public.access_whitelist for select to authenticated using (true);

create trigger access_whitelist_updated before update on public.access_whitelist
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 3. PLATFORM SETTINGS
-- ============================================================
create table if not exists public.platform_settings (
  id uuid primary key default uuid_generate_v4(),
  setting_key text not null,
  setting_value text,
  setting_type text,
  description text,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.platform_settings enable row level security;

create policy "platform_settings_read" on public.platform_settings for select to public using (true);

create policy "platform_settings_admin" on public.platform_settings for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger platform_settings_updated before update on public.platform_settings
  for each row execute function public.handle_updated_date();

insert into public.platform_settings (setting_key, setting_value) values
  ('is_platform_restricted', 'false'),
  ('is_live', 'false')
on conflict do nothing;

-- ============================================================
-- 4. CONTENT
-- ============================================================
create table if not exists public.content (
  id uuid primary key default uuid_generate_v4(),
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
  tags jsonb default '[]',
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.content enable row level security;

create policy "content_read" on public.content for select to public using (true);

create policy "content_admin" on public.content for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger content_updated before update on public.content
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 5. COMMENTS
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  content_id uuid references public.content(id) on delete cascade,
  user_id uuid references public.profiles(id),
  comment_text text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.comments enable row level security;

create policy "comments_read" on public.comments for select to public using (true);

create policy "comments_create" on public.comments for insert to authenticated with check (true);

create trigger comments_updated before update on public.comments
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 6. USER PROGRESS
-- ============================================================
create table if not exists public.user_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  content_id uuid references public.content(id),
  progress_percent numeric default 0,
  completed boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_progress enable row level security;

create policy "user_progress_own_read" on public.user_progress for select to authenticated using (user_id = auth.uid());

create policy "user_progress_own_create" on public.user_progress for insert to authenticated with check (user_id = auth.uid());

create policy "user_progress_own_update" on public.user_progress for update to authenticated using (user_id = auth.uid());

create policy "user_progress_admin_read" on public.user_progress for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger user_progress_updated before update on public.user_progress
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 7. STORIES
-- ============================================================
create table if not exists public.stories (
  id uuid primary key default uuid_generate_v4(),
  title text,
  media_url text,
  media_type text default 'image',
  display_order integer default 0,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.stories enable row level security;

create policy "stories_read" on public.stories for select to public using (true);

create policy "stories_admin" on public.stories for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger stories_updated before update on public.stories
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 8. ATHLETE STORIES
-- ============================================================
create table if not exists public.athlete_stories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  title text,
  media_url text,
  media_type text default 'image',
  display_order integer default 0,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_stories enable row level security;

create policy "athlete_stories_read" on public.athlete_stories for select to public using (true);

create policy "athlete_stories_admin" on public.athlete_stories for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger athlete_stories_updated before update on public.athlete_stories
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 9. TESTIMONIALS
-- ============================================================
create table if not exists public.testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text,
  role text,
  text text,
  avatar_url text,
  video_url text,
  is_active boolean default true,
  display_order integer default 0,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.testimonials enable row level security;

create policy "testimonials_read" on public.testimonials for select to public using (true);

create policy "testimonials_admin" on public.testimonials for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger testimonials_updated before update on public.testimonials
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 10. SERVICE HIGHLIGHTS
-- ============================================================
create table if not exists public.service_highlights (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  icon text,
  display_order integer default 0,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.service_highlights enable row level security;

create policy "highlights_read" on public.service_highlights for select to public using (true);

create policy "highlights_admin" on public.service_highlights for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger service_highlights_updated before update on public.service_highlights
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 11. ATHLETE UPLOADS
-- ============================================================
create table if not exists public.athlete_uploads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  file_url text,
  file_type text,
  file_name text,
  processing_status text default 'pending',
  is_featured boolean default false,
  analysis_result text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_uploads enable row level security;

create policy "uploads_own_read" on public.athlete_uploads for select to authenticated using (user_id = auth.uid());

create policy "uploads_own_create" on public.athlete_uploads for insert to authenticated with check (user_id = auth.uid());

create policy "uploads_own_update" on public.athlete_uploads for update to authenticated using (user_id = auth.uid());

create policy "uploads_admin" on public.athlete_uploads for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger athlete_uploads_updated before update on public.athlete_uploads
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 12. ATHLETE VIDEOS
-- ============================================================
create table if not exists public.athlete_videos (
  id uuid primary key default uuid_generate_v4(),
  athlete_id uuid references public.profiles(id),
  user_id uuid references public.profiles(id),
  title text,
  video_url text,
  thumbnail_url text,
  status text default 'pending',
  description text,
  sport text,
  position text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_videos enable row level security;

create policy "videos_approved_public" on public.athlete_videos for select to public using (status = 'approved');

create policy "videos_own_read" on public.athlete_videos for select to authenticated using (user_id = auth.uid() or athlete_id = auth.uid());

create policy "videos_create" on public.athlete_videos for insert to authenticated with check (true);

create policy "videos_admin" on public.athlete_videos for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger athlete_videos_updated before update on public.athlete_videos
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 13. PERFORMANCE DATA
-- ============================================================
create table if not exists public.performance_data (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
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
  extra_data jsonb default '{}',
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.performance_data enable row level security;

create policy "perf_own_read" on public.performance_data for select to authenticated using (user_id = auth.uid());

create policy "perf_own_create" on public.performance_data for insert to authenticated with check (user_id = auth.uid());

create policy "perf_own_update" on public.performance_data for update to authenticated using (user_id = auth.uid());

create policy "perf_admin" on public.performance_data for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger performance_data_updated before update on public.performance_data
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 14. DAILY CHECKINS
-- ============================================================
create table if not exists public.daily_checkins (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  checkin_date date default current_date,
  mood text,
  sleep_quality integer,
  energy_level integer,
  notes text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.daily_checkins enable row level security;

create policy "checkins_own" on public.daily_checkins for all to authenticated using (user_id = auth.uid());

create policy "checkins_admin_read" on public.daily_checkins for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger daily_checkins_updated before update on public.daily_checkins
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 15. WEEKLY ASSESSMENTS
-- ============================================================
create table if not exists public.weekly_assessments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  week_start_date date,
  summary text,
  goals_met jsonb default '[]',
  ai_feedback text,
  score numeric,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.weekly_assessments enable row level security;

create policy "assessments_own" on public.weekly_assessments for all to authenticated using (user_id = auth.uid());

create policy "assessments_admin_read" on public.weekly_assessments for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger weekly_assessments_updated before update on public.weekly_assessments
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 16. ATHLETE TASKS
-- ============================================================
create table if not exists public.athlete_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  title text,
  description text,
  status text default 'pending',
  due_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_tasks enable row level security;

create policy "tasks_own" on public.athlete_tasks for all to authenticated using (user_id = auth.uid());

create policy "tasks_admin" on public.athlete_tasks for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger athlete_tasks_updated before update on public.athlete_tasks
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 17. ATHLETE TROPHIES
-- ============================================================
create table if not exists public.athlete_trophies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  title text,
  description text,
  icon text,
  earned_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.athlete_trophies enable row level security;

create policy "trophies_own_read" on public.athlete_trophies for select to authenticated using (user_id = auth.uid());

create policy "trophies_admin" on public.athlete_trophies for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger athlete_trophies_updated before update on public.athlete_trophies
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 18. CHAT MESSAGES
-- ============================================================
create table if not exists public.chat_messages (
  id uuid primary key default uuid_generate_v4(),
  sender_id text,
  receiver_id text,
  conversation_id text,
  content text,
  message_type text default 'text',
  read boolean default false,
  user_id uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.chat_messages enable row level security;

create policy "messages_read" on public.chat_messages for select to authenticated using (true);

create policy "messages_create" on public.chat_messages for insert to authenticated with check (true);

create policy "messages_update" on public.chat_messages for update to authenticated using (true);

create trigger chat_messages_updated before update on public.chat_messages
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 19. NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  title text,
  message text,
  type text default 'general',
  priority text default 'medium',
  is_read boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "notif_own_read" on public.notifications for select to authenticated using (user_id = auth.uid());

create policy "notif_own_update" on public.notifications for update to authenticated using (user_id = auth.uid());

create policy "notif_create" on public.notifications for insert to authenticated with check (true);

create policy "notif_admin" on public.notifications for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger notifications_updated before update on public.notifications
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 20. ADMIN NOTIFICATIONS
-- ============================================================
create table if not exists public.admin_notifications (
  id uuid primary key default uuid_generate_v4(),
  title text,
  message text,
  type text,
  related_user_id uuid references public.profiles(id),
  is_read boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.admin_notifications enable row level security;

create policy "admin_notif_admin" on public.admin_notifications for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger admin_notifications_updated before update on public.admin_notifications
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 21. USER NOTIFICATIONS
-- ============================================================
create table if not exists public.user_notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  title text,
  message text,
  type text,
  is_read boolean default false,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_notifications enable row level security;

create policy "user_notif_own_read" on public.user_notifications for select to authenticated using (user_id = auth.uid());

create policy "user_notif_create" on public.user_notifications for insert to authenticated with check (true);

create trigger user_notifications_updated before update on public.user_notifications
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 22. LEADS
-- ============================================================
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  phone text,
  age text,
  plan text,
  source text,
  status text default 'new',
  notes text,
  vendor_id text,
  extra_data jsonb default '{}',
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.leads enable row level security;

create policy "leads_public_create" on public.leads for insert to anon with check (true);

create policy "leads_auth_create" on public.leads for insert to authenticated with check (true);

create policy "leads_admin" on public.leads for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger leads_updated before update on public.leads
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 23. INTERNATIONAL LEADS
-- ============================================================
create table if not exists public.international_leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  phone text,
  country text,
  sport text,
  plan text,
  message text,
  status text default 'new',
  extra_data jsonb default '{}',
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.international_leads enable row level security;

create policy "int_leads_public_create" on public.international_leads for insert to anon with check (true);

create policy "int_leads_auth_create" on public.international_leads for insert to authenticated with check (true);

create policy "int_leads_admin" on public.international_leads for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger international_leads_updated before update on public.international_leads
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 24. LEAD INTERACTIONS
-- ============================================================
create table if not exists public.lead_interactions (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid,
  lead_type text,
  interaction_type text,
  notes text,
  performed_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.lead_interactions enable row level security;

create policy "lead_interactions_admin" on public.lead_interactions for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger lead_interactions_updated before update on public.lead_interactions
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 25. LEAD PAGES
-- ============================================================
create table if not exists public.lead_pages (
  id uuid primary key default uuid_generate_v4(),
  title text,
  url_slug text,
  content jsonb default '{}',
  target_entity text,
  is_active boolean default true,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.lead_pages enable row level security;

create policy "lead_pages_read" on public.lead_pages for select to public using (true);

create policy "lead_pages_admin" on public.lead_pages for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger lead_pages_updated before update on public.lead_pages
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 26. CRM LEADS
-- ============================================================
create table if not exists public.crm_leads (
  id uuid primary key default uuid_generate_v4(),
  name text,
  email text,
  phone text,
  sales_rep_id uuid references public.profiles(id),
  current_stage text,
  source text,
  notes text,
  value numeric,
  extra_data jsonb default '{}',
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.crm_leads enable row level security;

create policy "crm_leads_admin" on public.crm_leads for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger crm_leads_updated before update on public.crm_leads
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 27. CRM PIPELINES
-- ============================================================
create table if not exists public.crm_pipelines (
  id uuid primary key default uuid_generate_v4(),
  name text,
  description text,
  color text default 'blue',
  stages jsonb default '[]',
  sales_rep_id uuid references public.profiles(id),
  is_active boolean default true,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.crm_pipelines enable row level security;

create policy "crm_pipelines_admin" on public.crm_pipelines for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger crm_pipelines_updated before update on public.crm_pipelines
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 28. PIPELINES
-- ============================================================
create table if not exists public.pipelines (
  id uuid primary key default uuid_generate_v4(),
  name text,
  description text,
  color text default 'blue',
  stages jsonb default '[]',
  is_active boolean default true,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.pipelines enable row level security;

create policy "pipelines_admin" on public.pipelines for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger pipelines_updated before update on public.pipelines
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 29. USER PIPELINES
-- ============================================================
create table if not exists public.user_pipelines (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  pipeline_id uuid references public.pipelines(id),
  current_stage text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_pipelines enable row level security;

create policy "user_pipelines_admin" on public.user_pipelines for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger user_pipelines_updated before update on public.user_pipelines
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 30. CUSTOM TASKS
-- ============================================================
create table if not exists public.custom_tasks (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  status text default 'pending',
  related_lead_id uuid,
  related_lead_type text,
  assigned_user_id uuid references public.profiles(id),
  due_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.custom_tasks enable row level security;

create policy "custom_tasks_admin" on public.custom_tasks for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger custom_tasks_updated before update on public.custom_tasks
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 31. SALES MATERIALS
-- ============================================================
create table if not exists public.sales_materials (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  file_url text,
  file_type text,
  category text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.sales_materials enable row level security;

create policy "sales_materials_admin" on public.sales_materials for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger sales_materials_updated before update on public.sales_materials
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 32. MARKETING
-- ============================================================
create table if not exists public.marketing (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
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

create policy "marketing_own_read" on public.marketing for select to authenticated using (user_id = auth.uid());

create policy "marketing_own_create" on public.marketing for insert to authenticated with check (user_id = auth.uid());

create policy "marketing_admin" on public.marketing for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger marketing_updated before update on public.marketing
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 33. MARKETING CAMPAIGNS
-- ============================================================
create table if not exists public.marketing_campaigns (
  id uuid primary key default uuid_generate_v4(),
  name text,
  description text,
  status text default 'draft',
  start_date date,
  end_date date,
  budget numeric,
  results jsonb default '{}',
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing_campaigns enable row level security;

create policy "campaigns_admin" on public.marketing_campaigns for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger marketing_campaigns_updated before update on public.marketing_campaigns
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 34. MARKETING MATERIALS
-- ============================================================
create table if not exists public.marketing_materials (
  id uuid primary key default uuid_generate_v4(),
  title text,
  file_url text,
  file_type text,
  category text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing_materials enable row level security;

create policy "mkt_materials_read" on public.marketing_materials for select to authenticated using (true);

create policy "mkt_materials_admin" on public.marketing_materials for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger marketing_materials_updated before update on public.marketing_materials
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 35. MARKETING TASKS
-- ============================================================
create table if not exists public.marketing_tasks (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  status text default 'pending',
  assigned_to uuid references public.profiles(id),
  due_date date,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.marketing_tasks enable row level security;

create policy "mkt_tasks_admin" on public.marketing_tasks for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger marketing_tasks_updated before update on public.marketing_tasks
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 36. CONTENT IDEAS
-- ============================================================
create table if not exists public.content_ideas (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  status text default 'idea',
  category text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.content_ideas enable row level security;

create policy "content_ideas_admin" on public.content_ideas for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger content_ideas_updated before update on public.content_ideas
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 37. SOCIAL MEDIA POSTS
-- ============================================================
create table if not exists public.social_media_posts (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  platform text,
  scheduled_date timestamptz,
  status text default 'draft',
  media_url text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.social_media_posts enable row level security;

create policy "social_posts_admin" on public.social_media_posts for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger social_media_posts_updated before update on public.social_media_posts
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 38. EVENTS
-- ============================================================
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  start_date timestamptz,
  end_date timestamptz,
  location text,
  image_url text,
  target_users text,
  is_active boolean default true,
  max_participants integer,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.events enable row level security;

create policy "events_read" on public.events for select to public using (true);

create policy "events_admin" on public.events for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger events_updated before update on public.events
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 39. GAME SCHEDULES
-- ============================================================
create table if not exists public.game_schedules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  game_date date,
  opponent text,
  location text,
  competition text,
  notes text,
  result text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.game_schedules enable row level security;

create policy "schedules_own_read" on public.game_schedules for select to authenticated using (user_id = auth.uid());

create policy "schedules_own_create" on public.game_schedules for insert to authenticated with check (user_id = auth.uid());

create policy "schedules_admin" on public.game_schedules for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger game_schedules_updated before update on public.game_schedules
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 40. SELETIVAS
-- ============================================================
create table if not exists public.seletivas (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  event_name text,
  notes text,
  status text default 'pending',
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.seletivas enable row level security;

create policy "seletivas_own_read" on public.seletivas for select to authenticated using (user_id = auth.uid());

create policy "seletivas_create" on public.seletivas for insert to authenticated with check (true);

create policy "seletivas_admin" on public.seletivas for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger seletivas_updated before update on public.seletivas
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 41. SELETIVA EVENTS
-- ============================================================
create table if not exists public.seletiva_events (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  event_date timestamptz,
  location text,
  is_published boolean default false,
  status text default 'open',
  max_participants integer,
  image_url text,
  requirements text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.seletiva_events enable row level security;

create policy "seletiva_events_read" on public.seletiva_events for select to public using (true);

create policy "seletiva_events_admin" on public.seletiva_events for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger seletiva_events_updated before update on public.seletiva_events
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 42. SELETIVA APPLICATIONS
-- ============================================================
create table if not exists public.seletiva_applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  seletiva_event_id uuid references public.seletiva_events(id),
  status text default 'pending',
  notes text,
  video_url text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.seletiva_applications enable row level security;

create policy "applications_own_read" on public.seletiva_applications for select to authenticated using (user_id = auth.uid());

create policy "applications_own_create" on public.seletiva_applications for insert to authenticated with check (user_id = auth.uid());

create policy "applications_admin" on public.seletiva_applications for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger seletiva_applications_updated before update on public.seletiva_applications
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 43. SUBSCRIPTION PACKAGES
-- ============================================================
create table if not exists public.subscription_packages (
  id uuid primary key default uuid_generate_v4(),
  name text,
  description text,
  price numeric,
  currency text default 'BRL',
  features jsonb default '[]',
  is_active boolean default true,
  stripe_price_id text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.subscription_packages enable row level security;

create policy "packages_read" on public.subscription_packages for select to public using (true);

create policy "packages_admin" on public.subscription_packages for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger subscription_packages_updated before update on public.subscription_packages
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 44. USER SUBSCRIPTIONS
-- ============================================================
create table if not exists public.user_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  package_id uuid references public.subscription_packages(id),
  status text default 'active',
  renewal_date date,
  stripe_subscription_id text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.user_subscriptions enable row level security;

create policy "subscriptions_own_read" on public.user_subscriptions for select to authenticated using (user_id = auth.uid());

create policy "subscriptions_admin" on public.user_subscriptions for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger user_subscriptions_updated before update on public.user_subscriptions
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 45. INTERNATIONAL PLANS
-- ============================================================
create table if not exists public.international_plans (
  id uuid primary key default uuid_generate_v4(),
  title text,
  description text,
  features jsonb default '[]',
  price numeric,
  currency text default 'USD',
  display_order integer default 0,
  is_active boolean default true,
  image_url text,
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.international_plans enable row level security;

create policy "int_plans_read" on public.international_plans for select to public using (true);

create policy "int_plans_admin" on public.international_plans for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger international_plans_updated before update on public.international_plans
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 46. ACTIVITY LOGS
-- ============================================================
create table if not exists public.activity_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  action text,
  entity_type text,
  entity_id text,
  details jsonb default '{}',
  created_date timestamptz default now()
);

alter table public.activity_logs enable row level security;

create policy "activity_logs_admin_read" on public.activity_logs for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create policy "activity_logs_create" on public.activity_logs for insert to authenticated with check (true);

-- ============================================================
-- 47. CAREER POSTS
-- ============================================================
create table if not exists public.career_posts (
  id uuid primary key default uuid_generate_v4(),
  title text,
  content text,
  image_url text,
  author text,
  is_active boolean default true,
  category text,
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.career_posts enable row level security;

create policy "career_posts_read" on public.career_posts for select to public using (true);

create policy "career_posts_admin" on public.career_posts for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger career_posts_updated before update on public.career_posts
  for each row execute function public.handle_updated_date();

-- ============================================================
-- 48. APP LOGS
-- ============================================================
create table if not exists public.app_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  page_name text,
  created_date timestamptz default now()
);

alter table public.app_logs enable row level security;

create policy "app_logs_create" on public.app_logs for insert to authenticated with check (true);

create policy "app_logs_admin_read" on public.app_logs for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

-- ============================================================
-- 49. LIVE PLAYBACK LOGS
-- ============================================================
create table if not exists public.live_playback_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id),
  session_id text,
  duration_seconds integer,
  created_date timestamptz default now()
);

alter table public.live_playback_logs enable row level security;

create policy "playback_logs_create" on public.live_playback_logs for insert to authenticated with check (true);

create policy "playback_logs_admin_read" on public.live_playback_logs for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

-- ============================================================
-- 50. INVITES
-- ============================================================
create table if not exists public.invites (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  role text default 'user',
  invite_code text,
  user_id uuid references public.profiles(id),
  status text default 'pending',
  created_by uuid references public.profiles(id),
  created_date timestamptz default now(),
  updated_date timestamptz default now()
);

alter table public.invites enable row level security;

create policy "invites_admin" on public.invites for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and (role = 'admin' or is_revela_admin = true)));

create trigger invites_updated before update on public.invites
  for each row execute function public.handle_updated_date();

-- ============================================================
-- DONE! 50 tabelas criadas com RLS + triggers.
-- ============================================================
