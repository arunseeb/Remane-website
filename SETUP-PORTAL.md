# Remane Portal — One-Time Setup Guide

The portal code is complete, but it needs a (free) Supabase project behind it for logins,
data, chat and file uploads. Follow these steps once — about 15 minutes.

---

## 1. Create the Supabase project

1. Go to https://supabase.com → **Start your project** → sign up (GitHub login is easiest).
2. **New project** → name it `remane` → choose a strong database password (save it somewhere)
   → region **West EU (London)** → **Create project**. Wait ~2 minutes for it to provision.

## 2. Create the database

1. In the Supabase dashboard, open **SQL Editor** (left sidebar).
2. Open the file `supabase/schema.sql` in this project, copy **the entire file**, paste it
   into the SQL editor, and press **Run**.
3. You should see "Success. No rows returned".

## 3. Create your coach account

> **Pasting SQL:** the ``` lines in this guide are just fences that mark where a code
> block begins and ends — they are **not** part of the command. Copy only the lines
> *between* them, and clear the SQL editor (Ctrl+A, Delete) before each paste.

1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter your email and a password. Tick **Auto Confirm User**. Create it.
   (This must happen *before* step 3 — the profile row is created automatically with the user.)
3. Back in **SQL Editor**, run this, with your real email — it should report **1 row** updated:
   ```sql
   update public.profiles set role = 'coach', full_name = 'Arun Seeborun'
   where email = 'your-email@example.com';
   ```
   If it says `0 rows`, the user from step 2 doesn't exist (check the email matches).
   If it says `relation "public.profiles" does not exist`, step 2 of this guide
   (running `supabase/schema.sql`) hasn't succeeded yet — go back and do that first.

## 4. Point the email links at your site

Supabase sends the invitation and password-reset emails. **You do not need to edit the
email templates** (that's a paid feature) — the portal works with Supabase's default
emails. You only need to tell Supabase which site to send people back to:

1. Go to **Authentication → URL Configuration**.
2. **Site URL**: your production domain (e.g. `https://remane.co.uk`).
   While testing locally, set this to `http://localhost:3000`.
3. **Redirect URLs**: add **both** of these (the invite link bounces back here):
   ```
   http://localhost:3000/**
   https://YOUR-DOMAIN/**
   ```

That's it. The default email's button sends the client to Supabase, which verifies them
and returns them to `/auth/callback` on your site, which drops them on the
"Choose a password" screen.

> **Optional, if you ever upgrade:** with a paid plan you can rewrite the template text
> so the email reads in Remane's voice rather than Supabase's default wording. Purely
> cosmetic — nothing breaks without it.

> **Email limits (important before real clients):** Supabase's built-in mailer only sends
> a couple of emails per hour, and they often land in spam. Connect your existing Resend
> account instead — this is **free**: **Authentication → Emails → SMTP Settings** → enable
> custom SMTP with host `smtp.resend.com`, port `465`, username `resend`, password = your
> Resend API key, sender = an address on a domain you've verified in Resend.

## 5. Add the keys to the website

Supabase renamed its API keys. The old `anon` and `service_role` keys are now called
**publishable** and **secret** — same jobs, new names.

1. In Supabase, go to **Settings → API Keys**, and copy three values:
   - **Project URL** — under Settings → **Data API**, looks like `https://abcdefgh.supabase.co`
   - **Publishable key** — starts `sb_publishable_…` (safe in the browser)
   - **Secret key** — starts `sb_secret_…`. Press **Create new secret key** if there isn't
     one, then reveal and copy it. **Treat this like a password** — it can read and write
     everything. Never paste it into code, a chat, or a public repo.
2. Locally: paste them into `.env.local` (the empty lines are already there for you):
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   ```
3. On Vercel: **Project → Settings → Environment Variables** → add the same three,
   then redeploy.
4. Restart the dev server (`Ctrl+C`, then `npm run dev`) — env changes are only picked up
   on boot.

> Older Supabase projects show legacy `anon` / `service_role` JWT keys instead (they start
> `eyJ…`). Those still work — put them in `NEXT_PUBLIC_SUPABASE_ANON_KEY` and
> `SUPABASE_SERVICE_ROLE_KEY`, which the code also accepts.

## 6. Try it

```
npm run dev
```

- Open http://localhost:3000/login and sign in with your coach account → you land on
  the coaching dashboard.
- Add a test client (use a second email address you own) → the invitation email arrives →
  set a password → you're in the members area.

---

## How it works day-to-day

**Your side (`/coach`):**
- **Clients** — every client with their phases and week counters. After a session, press
  **Session complete** on that phase and the week advances automatically. +/− buttons fix
  mistakes. Add/remove phases and clients here too; removing a client deletes their
  account and data permanently.
- **Homework** — set homework with a due date (from here or from a client's page).
  Submitted work appears at the top under *Needs review*; write feedback and either
  **Send back with feedback** (client revises and resubmits) or **Mark complete**.
- **Messages** — a private chat with each client, created automatically when you add them.
- **Classrooms** — group chats: create one, tick the members, everyone can talk. Manage
  members from inside the classroom.
- **Video bank** — upload videos to YouTube as **Unlisted** (Visibility → Unlisted — only
  people with the link can watch), then add the link here with tags. **Send to client**
  drops the video straight into their private chat and their *Videos* page.

**Client side (`/portal`):**
- Overview of their phases/weeks and homework due.
- Homework list with due dates; they submit text and/or a file (up to 50 MB), see your
  feedback, and resubmit if you send it back.
- Private chat with you, classroom chats, and every video you've sent them.

**Security notes:**
- There is no public sign-up — only accounts you invite can log in.
- Database rules (row-level security) guarantee clients can only ever see their own data
  and rooms, even if someone tampers with the app.
- The `service_role` key must only ever live in `.env.local` / Vercel env vars — never in
  code or the browser.
