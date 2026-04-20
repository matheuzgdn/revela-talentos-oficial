begin;

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
