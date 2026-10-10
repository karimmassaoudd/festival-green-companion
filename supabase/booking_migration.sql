-- Add confirmed travel bookings to an existing Festival Green Companion database.
-- Run this file once in Supabase Dashboard > SQL Editor.

create table if not exists public.travel_bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique
    default ('GF-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  user_id uuid not null references auth.users(id) on delete cascade,
  festival_id uuid not null references public.festivals(id) on delete cascade,
  travel_option_id uuid not null,
  price_gbp numeric(8, 2) not null check (price_gbp >= 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  booked_at timestamptz not null default now(),
  constraint travel_bookings_user_festival_option_key
    unique (user_id, festival_id, travel_option_id),
  constraint travel_bookings_option_fkey
    foreign key (festival_id, travel_option_id)
    references public.travel_options(festival_id, id)
    on delete cascade
);

create index if not exists travel_bookings_user_id_idx
  on public.travel_bookings(user_id);

alter table public.travel_bookings enable row level security;

revoke all on table public.travel_bookings from anon, authenticated;
grant select, insert on table public.travel_bookings to authenticated;

drop policy if exists "Users can read their own travel bookings" on public.travel_bookings;
create policy "Users can read their own travel bookings"
on public.travel_bookings for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

drop policy if exists "Users can create their own travel bookings" on public.travel_bookings;
create policy "Users can create their own travel bookings"
on public.travel_bookings for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
