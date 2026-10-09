-- Festival Green Companion database schema
-- Run this file in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.festivals (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  start_date date not null,
  end_date date not null,
  origin_name text not null,
  destination_name text not null,
  created_at timestamptz not null default now(),
  constraint festivals_date_order check (end_date >= start_date)
);

create table if not exists public.travel_options (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  code text not null,
  name text not null,
  detail text not null,
  icon_name text not null,
  duration_label text not null,
  duration_minutes integer not null check (duration_minutes > 0),
  price_gbp numeric(8, 2) not null check (price_gbp >= 0),
  co2_kg numeric(8, 2) not null check (co2_kg >= 0),
  convenience text not null check (convenience in ('Low', 'Medium', 'High')),
  sustainability_note text,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint travel_options_festival_code_key unique (festival_id, code),
  constraint travel_options_festival_id_id_key unique (festival_id, id)
);

create table if not exists public.arrival_points (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  code text not null,
  name text not null,
  icon_name text not null,
  walk_minutes integer not null check (walk_minutes >= 0),
  map_x numeric(5, 2) not null check (map_x between 0 and 100),
  map_y numeric(5, 2) not null check (map_y between 0 and 100),
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  constraint arrival_points_festival_code_key unique (festival_id, code)
);

create table if not exists public.user_travel_choices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  festival_id uuid not null references public.festivals(id) on delete cascade,
  travel_option_id uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_travel_choices_user_festival_key unique (user_id, festival_id),
  constraint user_travel_choices_option_fkey
    foreign key (festival_id, travel_option_id)
    references public.travel_options(festival_id, id)
    on delete cascade
);

create index if not exists travel_options_festival_id_idx
  on public.travel_options(festival_id);

create index if not exists arrival_points_festival_id_idx
  on public.arrival_points(festival_id);

create index if not exists user_travel_choices_user_id_idx
  on public.user_travel_choices(user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_travel_choices_updated_at on public.user_travel_choices;
create trigger set_user_travel_choices_updated_at
before update on public.user_travel_choices
for each row execute function public.set_updated_at();

-- Public catalog tables can be read from the app, but cannot be changed by it.
alter table public.festivals enable row level security;
alter table public.travel_options enable row level security;
alter table public.arrival_points enable row level security;
alter table public.user_travel_choices enable row level security;

revoke all on table public.festivals from anon, authenticated;
revoke all on table public.travel_options from anon, authenticated;
revoke all on table public.arrival_points from anon, authenticated;
revoke all on table public.user_travel_choices from anon, authenticated;

grant select on table public.festivals to anon, authenticated;
grant select on table public.travel_options to anon, authenticated;
grant select on table public.arrival_points to anon, authenticated;
grant select, insert, update on table public.user_travel_choices to authenticated;

drop policy if exists "Festival catalog is readable" on public.festivals;
create policy "Festival catalog is readable"
on public.festivals for select
to anon, authenticated
using (true);

drop policy if exists "Travel options are readable" on public.travel_options;
create policy "Travel options are readable"
on public.travel_options for select
to anon, authenticated
using (true);

drop policy if exists "Arrival points are readable" on public.arrival_points;
create policy "Arrival points are readable"
on public.arrival_points for select
to anon, authenticated
using (true);

drop policy if exists "Users can read their own travel choice" on public.user_travel_choices;
create policy "Users can read their own travel choice"
on public.user_travel_choices for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can create their own travel choice" on public.user_travel_choices;
create policy "Users can create their own travel choice"
on public.user_travel_choices for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can update their own travel choice" on public.user_travel_choices;
create policy "Users can update their own travel choice"
on public.user_travel_choices for update
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

-- Seed the festival shown by the current design.
insert into public.festivals (
  id, slug, name, start_date, end_date, origin_name, destination_name
)
values (
  '00000000-0000-0000-0000-000000000001',
  'greenfield-festival',
  'Greenfield Festival',
  '2027-08-16',
  '2027-08-18',
  'Manchester',
  'Willow Park'
)
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  start_date = excluded.start_date,
  end_date = excluded.end_date,
  origin_name = excluded.origin_name,
  destination_name = excluded.destination_name;

insert into public.travel_options (
  id, festival_id, code, name, detail, icon_name, duration_label,
  duration_minutes, price_gbp, co2_kg, convenience,
  sustainability_note, display_order
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    '00000000-0000-0000-0000-000000000001',
    'train', 'Train', 'Direct to the festival shuttle stop', 'train-outline',
    '1 hr 20', 80, 18, 4, 'High',
    'Good travel time with much lower CO₂ than driving.', 1
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    '00000000-0000-0000-0000-000000000001',
    'bus', 'Bus', 'One change in the town centre', 'bus-outline',
    '2 hrs 05', 125, 8, 7, 'Medium', null, 2
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    '00000000-0000-0000-0000-000000000001',
    'car', 'Car', 'Parking is available near the site', 'car-outline',
    '1 hr 05', 65, 32, 35, 'High', null, 3
  ),
  (
    '00000000-0000-0000-0000-000000000104',
    '00000000-0000-0000-0000-000000000001',
    'bike', 'Bike', 'Cycle parking is available onsite', 'bicycle-outline',
    '2 hrs 40', 160, 0, 0, 'Low', null, 4
  )
on conflict (id) do update set
  festival_id = excluded.festival_id,
  code = excluded.code,
  name = excluded.name,
  detail = excluded.detail,
  icon_name = excluded.icon_name,
  duration_label = excluded.duration_label,
  duration_minutes = excluded.duration_minutes,
  price_gbp = excluded.price_gbp,
  co2_kg = excluded.co2_kg,
  convenience = excluded.convenience,
  sustainability_note = excluded.sustainability_note,
  display_order = excluded.display_order;

insert into public.arrival_points (
  id, festival_id, code, name, icon_name, walk_minutes, map_x, map_y, display_order
)
values
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'shuttle', 'Shuttle drop-off', 'bus-outline', 6, 15, 20, 1),
  ('00000000-0000-0000-0000-000000000202', '00000000-0000-0000-0000-000000000001', 'bus', 'Bus stop', 'bus-outline', 4, 72, 28, 2),
  ('00000000-0000-0000-0000-000000000203', '00000000-0000-0000-0000-000000000001', 'main', 'Main entrance', 'enter-outline', 2, 50, 58, 3),
  ('00000000-0000-0000-0000-000000000204', '00000000-0000-0000-0000-000000000001', 'bike', 'Bike parking', 'bicycle-outline', 5, 15, 75, 4),
  ('00000000-0000-0000-0000-000000000205', '00000000-0000-0000-0000-000000000001', 'car', 'Car park', 'car-outline', 8, 72, 76, 5)
on conflict (id) do update set
  festival_id = excluded.festival_id,
  code = excluded.code,
  name = excluded.name,
  icon_name = excluded.icon_name,
  walk_minutes = excluded.walk_minutes,
  map_x = excluded.map_x,
  map_y = excluded.map_y,
  display_order = excluded.display_order;
