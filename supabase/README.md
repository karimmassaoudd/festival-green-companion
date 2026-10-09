# Supabase setup

## 1. Create the database

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Copy all SQL from `schema.sql` and run it once.
4. Open **Authentication > Sign In / Providers** and make sure **Email** sign-in is enabled.

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
- Deleting a festival removes its options, arrival points, and saved choices.
- Deleting a Supabase Auth user removes that user's saved choices.

## Security

- Festival, travel-option, and arrival-point records are read-only from the app.
- `user_travel_choices` requires an authenticated session.
- RLS policies compare `auth.uid()` with `user_id` for every choice read or write.
- Emails and password hashes stay in Supabase's protected `auth.users` table; passwords are never stored in public application tables.
- The publishable key identifies the Supabase project but does not bypass RLS.
- Secret and service-role keys are never used by the mobile client.
