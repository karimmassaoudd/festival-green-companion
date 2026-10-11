# Supabase setup

## 1. Create the database

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Copy all SQL from `schema.sql` and run it once.
4. Open **Authentication > Sign In / Providers** and make sure **Email** sign-in is enabled.

If the original four-table schema is already installed, run only `booking_migration.sql` to add the Train booking table and its security policies.

If `travel_bookings` already exists, run `booking_delete_policy.sql` once to enable the basket Delete buttons and the booking reset button.

The app has separate Login and Sign Up screens. Supabase Auth stores the email, securely hashed password, account ID, and the name supplied during sign-up. Row Level Security uses the account ID so a user can only access their own saved travel choice.

If **Confirm email** is enabled, a new user must open the confirmation email before logging in. Anonymous sign-in is no longer required and can be disabled.

## 2. Configure the Expo app

Copy `.env.example` to a new `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Find both values in **Supabase Dashboard > Connect**.

Use only the publishable key in the app. Never use a Supabase secret key or legacy `service_role` key in Expo because a mobile application's bundle can be inspected by users.

Restart Expo after changing `.env`:

```bash
npx expo start --clear
```

## Relationships

- One `festival` has many `travel_options`.
- One `festival` has many `arrival_points`.
- One registered user can save one `user_travel_choice` per festival.
- Each `user_travel_choice` belongs to one festival and one travel option from that same festival.
- One registered user can have one `travel_booking` for each festival travel option.
- Each `travel_booking` belongs to one Auth user, one festival, and one option from that festival.
- Deleting a festival removes its options, arrival points, choices, and booking records.
- Deleting a Supabase Auth user removes that user's choices and booking records.

## Security

- Festival, travel-option, and arrival-point records are read-only from the app.
- `user_travel_choices` requires an authenticated session.
- `travel_bookings` requires an authenticated session.
- RLS policies compare `auth.uid()` with `user_id` for every choice and booking read or write.
- Emails and password hashes stay in Supabase's protected `auth.users` table; passwords are never stored in public application tables.
- The publishable key identifies the Supabase project but does not bypass RLS.
- Secret and service-role keys are never used by the mobile client.

## Travel booking data flow

1. The user presses **Book** on Train, Bus, Car, or Bike.
2. The app shows the booking review screen.
3. **Confirm booking** inserts a row into `travel_bookings` and saves that option in `user_travel_choices`.
4. Supabase returns the generated booking ID and reference.
5. The proof screen queries that booking by ID and the logged-in user's ID.
6. The user can delete one booking from the basket or reset all bookings; RLS permits deletion only when the booking belongs to that signed-in user.

The saved fields are the booking reference, Auth user ID, festival ID, travel-option ID, confirmed price, status, and booking time. The proof shown by the app is a portfolio reservation record, not a real rail ticket or payment confirmation.
