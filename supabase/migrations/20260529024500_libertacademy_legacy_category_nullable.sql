begin;

alter table public.libertacademy_registrations
  alter column category drop not null;

alter table public.libertacademy_registrations
  drop constraint if exists libertacademy_registrations_category_check;

alter table public.libertacademy_registrations
  add constraint libertacademy_registrations_category_check
  check (category is null or category in ('Sub10', 'Sub12', 'Sub14'));

commit;
