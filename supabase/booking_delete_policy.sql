-- Allow signed-in users to delete only their own booking records.
-- Run this once in Supabase Dashboard > SQL Editor.

grant delete on table public.travel_bookings to authenticated;

drop policy if exists "Users can delete their own travel bookings" on public.travel_bookings;
create policy "Users can delete their own travel bookings"
on public.travel_bookings for delete
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
