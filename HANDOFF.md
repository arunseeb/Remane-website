# Remane — Project Handoff

## What This Is
A luxury private coaching website for men. The brand is "Remane" — private guidance for men rebuilding after loss (relationship, identity, direction). The four-phase journey: Recovery → Reconstruction → Re-entry → Relationship Mastery. One-to-one coaching by Arun Seeborun, £1,000/month, UK-based.

## How to Run
```
cd C:\Users\cexdq\Desktop\ClaudeCodeTest\remane
npm run dev
```
Then open http://localhost:3000

**Important:** This is Next.js 16 (not 14/15). APIs and conventions differ. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.

---

## Session log — 2026-07-17

All items below are committed and (for the website) auto-deployed via Vercel. Two repos are involved: the **website** (`arunseeb/Remane-website`, this folder) and the **curricula** (`arunseeb/remane-coaching-curricula`, the `Modules and homework/` sub-repo).

**Database migrations applied this session** (run from `supabase/apply_migrations.py`, which now includes them and re-applies all idempotently):
- `migration-010-attachments.sql` — attachment columns on `messages` + `homework`; a private `chat` storage bucket with member-scoped RLS (`chat_path_room_member`); a `homework_upload_coach` storage policy; a `messages_has_body` check.
- `migration-011-homework-reviews.sql` — `homework_reviews` table (feedback history) + RLS (coach writes; coach and owning client read).

**Website changes** (commits newest-first):
- `8acdcfa` **Homework feedback history** — coach feedback is saved per submission/resubmission instead of overwriting `homework.feedback`. New `homework_reviews` rows (with a snapshot of the submission), rendered by the shared `src/components/portal/FeedbackThread.tsx` in both the client's `HomeworkItem` and the coach's `HomeworkReviewCard`. All three homework-rendering pages fetch reviews and pass a per-homework `reviews` array.
- `94f1999` **Three homework-review actions** — `HomeworkReviewCard` now offers: send feedback & ask to resubmit (→ returned), send feedback no resubmit (→ completed with feedback), and mark as complete (→ completed, no feedback). `completeHomework` now returns a `NoteState`.
- `c2486a8` **Attachments in chat + homework** — paperclip in the `ChatRoom` composer uploads a file/image (≤25 MB) to the `chat` bucket; images render inline, other files as download links via signed URLs. The coach can also attach a file when assigning homework (`AssignHomeworkForm` was rewritten from `useActionState` to a manual submit that uploads client-side then calls `assignHomework`). Client homework submission already supported files.
- `5e20951` **Coach next-stage cue** — `PhaseProgress` gained a `coachView` prop; within two weeks of a stage's end (and not the final stage) it shows a gold dot + "Talk to client about next stage", coach-only (the client renders the same component without the flag). Adding/removing stages already existed in `PhaseManager`.
- `2d835f6` **Reforge image** — `public/images/reforge.png` replaced with the new journal/writing shot (also used by the Reforge deck end cards, which read the same file).

**Curricula changes** (commits newest-first):
- `b1c0b25` **Exams** — `Modules and homework/Exams/`: a practice paper and a real exam, 125 MCQs each (25 per book × 5). Every question has four options by design (correct / close-but-wrong / opposes-material-but-defensible / clearly-wrong). The real exam shares exactly 40% (50/125, 10 per stage) with the practice paper, byte-identical. Pipeline: per-book pools `_pool_stageN.json` → `assemble_exams.py` (SEED=20260717) → `render_exams.py` (brand-styled `.docx`). Regenerate without re-running the readers: `python assemble_exams.py && python render_exams.py`.
- `50bb075` / `6a1ba6d` **Stage books as Word docs** — all five stage books rendered to brand-styled `.docx` via `Stage Books/_make_book_docx.py` (`python _make_book_docx.py` rebuilds all five). The Reforge deck end cards were also rebuilt with the new image.

**Open items / offered follow-ups (not done — awaiting the go-ahead):**
- Returning/completing homework updates status but does **not** notify the client in chat or email (booking a session does). Easy to add if wanted.
- The exam papers are 125 questions each (long, = 25 × 5). Shortening (e.g. 15/book) is a one-number change in `assemble_exams.py`; the 40% overlap is whole-question-identical and could instead be reworded/reshuffled.
- `HANDOFF.md`'s older sections still say "four-phase journey" — the programme is now **five** stages (Reforge was inserted as Stage II); the phase list in `src/lib/constants.ts` / `src/lib/portal.ts` is the source of truth.

---

## Deployment
- **GitHub:** https://github.com/arunseeb/Remane-website.git
- **Host:** Vercel (connected to GitHub — auto-deploys on push to `main`)
- To deploy: `git add . && git commit -m "message" && git push`

---

## Environment Variables
Set these in Vercel → Project → Settings → Environment Variables, and locally in `remane/.env.local`.

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | **Yes** | API key from resend.com — powers **all** email: enquiry form, session confirmations, reminders, cancellations, unread alerts |
| `ENQUIRY_TO_EMAIL` | **Yes** | Email address where enquiries are delivered (Arun's email) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full production URL (e.g. `https://remane.co.uk`) — used by sitemap, og:image and invite emails |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (portal) | Supabase project URL — see `SETUP-PORTAL.md` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes (portal) | Supabase **publishable** key (`sb_publishable_…`). Legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` still accepted as a fallback |
| `SUPABASE_SECRET_KEY` | Yes (portal) | Supabase **secret** key (`sb_secret_…`) — server-only, powers client invite/removal and the cron jobs. Legacy `SUPABASE_SERVICE_ROLE_KEY` accepted as a fallback |
| `SUPABASE_DB_PASSWORD` | Local only | Database password — used by `supabase/apply_migrations.py` to apply migrations from this machine. Never needed in Vercel |
| `UNREAD_ALERT_EMAIL` | Optional | Where the 24h unread-message alert goes (default `remaneofficial@gmail.com`) |
| `CRON_SECRET` | Optional (Vercel) | Any long random string — protects the cron endpoints so only Vercel can trigger them |

> **Key naming:** Supabase renamed `anon` → **publishable** and `service_role` → **secret**. `src/lib/supabase/env.ts` accepts either name and also strips a stray `/rest/v1/` suffix from the project URL (a common copy-paste error that surfaces as "incorrect email or password").

**Enquiry form:** Form submissions are proxied through `/api/enquire` (server-side) to Resend's API. The browser never contacts Resend directly. If `RESEND_API_KEY` or `ENQUIRY_TO_EMAIL` are missing, the form returns a server configuration error. The `from` address is `Remane <onboarding@resend.dev>` (Resend's shared sender), which **only delivers to your own Resend account address** — verify a custom domain on resend.com before real client emails will arrive.

---

## Stack
- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS v4** (config via `postcss.config.mjs`, no `tailwind.config.js`)
- **Supabase** — portal auth, Postgres, realtime chat, file storage (`@supabase/ssr` + `@supabase/supabase-js`)
- **Framer Motion** — scroll/fade animations, FAQ accordion
- **Lenis** — smooth scrolling (`src/components/SmoothScroll.tsx`)
- **Resend** — all transactional email (free tier: 3,000/month)
- **Vercel Cron** (`vercel.json`) — unread alerts (hourly) + session reminders (daily 08:00). Note: Hobby plan limits cron to once daily
- **react-calendly** — inline booking widget shown after form submission
- **Python** (side toolchain, not shipped) — `python-pptx` generates the coaching decks; `psycopg` applies DB migrations

---

## Design System (`src/app/globals.css`)

### Colours
| Token | Hex | Usage |
|---|---|---|
| `--background` | `#faf8f5` | Page background (cream) |
| `--surface` | `#f3efe8` | Slightly darker surface |
| `--foreground` | `#2c2419` | Primary text (dark brown) |
| `--muted` | `#6b5e4f` | Secondary text |
| `--brown` | `#8b7355` | Borders, dividers |
| `--burgundy` | `#6b1c21` | Brand red — nav links, buttons, accents |
| `--gold` | `#d6b687` | Gold accents, hover underlines |
| `--gold-muted` | `#c4a574` | Slightly muted gold |

### Fonts
- `--font-display` → Cormorant Garamond (headings, pull quotes)
- `--font-sans` → Source Sans 3 (body text)

### CSS Classes
- `.nav-link` — burgundy text, gold underline on hover (header nav)
- `.link-underline` — burgundy underline on hover (footers, back-links)
- `.grain` — film grain overlay via `::after` pseudo-element. Apply to any image container that should have the film feel.
- `.vintage-image` — subtle `saturate(0.92) contrast(1.02)` filter. Always pair with `.grain` on image containers.
- `.path-track` — horizontal snap scroll container
- `.path-panel` — individual snap panel
- `@keyframes softpulse` — fades between `opacity: 0.3` and `0.6` over 2.5 s. Used by scroll chevron.
- `@keyframes kenburns` — slow scale from 1 → 1.06 over 24 s. Used by hero slides.

### CTA Button Convention
All call-to-action buttons (not nav links, not phase navigation) use the bordered rectangle pattern:
```
inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5
```
No arrows. No pills (pills are reserved for dark image overlays — "Learn more", "Explore"). The enquiry submit button uses `w-full` instead of `inline-block`.

---

## Pages & Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Home — VisualStack + Manifesto + Enquiry |
| `/about` | `src/app/about/page.tsx` | Arun's story + headshot |
| `/our-mission` | `src/app/our-mission/page.tsx` | "Our Philosophy" — mission text + 8-value grid |
| `/testimonials` | `src/app/testimonials/page.tsx` | 3 anonymised quotes (placeholder — needs real ones) |
| `/faq` | `src/app/faq/page.tsx` | 19 questions across 4 sections, accordion UI |
| `/enquire` | `src/app/enquire/page.tsx` | Standalone enquiry page |
| `/path/recovery` | `src/app/path/recovery/page.tsx` | Phase I detail |
| `/path/reconstruction` | `src/app/path/reconstruction/page.tsx` | Phase II detail |
| `/path/re-entry` | `src/app/path/re-entry/page.tsx` | Phase III detail |
| `/path/relationship-mastery` | `src/app/path/relationship-mastery/page.tsx` | Phase IV detail |
| `/terms` | `src/app/terms/page.tsx` | 17-section T&Cs |
| `/privacy` | `src/app/privacy/page.tsx` | GDPR privacy policy |
| `/api/search` | `src/app/api/search/route.ts` | Page search — auto-discovers pages by scanning titles. **Excludes private roots** (`PRIVATE_ROOTS`: portal, coach, account, auth, login) |
| `/api/enquire` | `src/app/api/enquire/route.ts` | Enquiry form proxy → Resend |
| `/api/cron/unread-alerts` | `src/app/api/cron/unread-alerts/route.ts` | Hourly (Vercel Cron): emails the coach when a client message has gone unread >24h. Alerts once per message |
| `/api/cron/session-reminders` | `src/app/api/cron/session-reminders/route.ts` | Daily 08:00 (Vercel Cron): emails clients a reminder 3 days before a session |

Portal routes (`/login`, `/auth/*`, `/account`, `/portal/*`, `/coach/*`) are listed in the Client Portal section below.

### New Page Convention
Every new page needs:
```tsx
export const metadata = {
  title: "Page Name — Remane",
  description: "...",
};
```
The search API reads this `title` field from the file system — no registration needed. **Anything added under a private root is excluded automatically**; if you add a new private area, add its folder name to `PRIVATE_ROOTS` in the search route and to `robots.ts`.

All detail pages include `<Header hideDesktopNav />` and `<Footer />`. Path pages link back to `/#path` (not `/`) so the user returns to the carousel.

### Path pages content
The four `/path/*` pages mirror the real curricula (`Modules and homework/`). Reconstruction is **8 fronts / 12 modules** at two paces (12-week standard or 24-week intensive); Re-entry includes the ideal-partner + channel-briefing week and the closing sexuality-acceptance week. Keep these pages in sync when a curriculum changes.

---

## Components

### `Header.tsx`
**Props:** `hideDesktopNav?: boolean` — pass on all pages except home.

**Hamburger drawer:** Slides in from left. On desktop, "The Path" hover expands a right panel with phase sub-links. On mobile/touch, tapping "The Path" swaps the left panel to an inline sub-menu with a "← Back" button — the right panel is hidden on mobile.

**Search input:** Uses `text-base` on mobile (16px) to prevent iOS auto-zoom.

**Drawer width:** `min(36rem, 100vw)` when expanded — never overflows the screen.

### `VisualStack.tsx` — Hero slideshow
- Crossfades between 3 local images every 6 s
- Ken Burns (24s) per slide, dot indicators, reduced-motion aware
- Images: `public/hero/running.png`, `dressing.png`, `wine.png`
- **Hero text stagger:** headline, subtitle, and CTA are Framer Motion `motion` elements with `animate` (fires on mount, not scroll). Delays: 0.4 s / 0.9 s / 1.3 s, duration 1.5 s, easing `[0.22, 1, 0.36, 1]`. Reduced-motion aware.
- Hero h1: `leading-[1.15]` on mobile, `leading-tight` from `md:` up
- CTA is a plain text link with `border-b border-gold/50` underline and `tracking-[0.32em]` — no arrow, no pill
- Scroll chevron uses `animate-[softpulse_2.5s_ease-in-out_infinite]` (defined in `globals.css`) instead of `animate-bounce`

### `Manifesto.tsx`
1. "How it works" 3-step section — each step and separator animates in left-to-right on scroll (staggered at 0, 0.18, 0.36 s; separators at 0.09, 0.27 s). Uses `FadeIn from="left"`. Fires once only — does not re-animate on scroll.
   - Step numbers: `text-gold/40`
   - Step layout order: numeral → title → icon → gold divider → body text
   - Desktop separators between steps: line·dot·line motif (`h-px w-6 bg-gold/30` + `h-1 w-1 rounded-full bg-gold/40` + `h-px w-6 bg-gold/30`)
2. Full-screen Aphrodite panel → links to `/our-mission`
3. JourneyPhases carousel

### `JourneyPhases.tsx` — "The Path" carousel
- Horizontal scroll with `←` / `→` navigation buttons (44px bordered squares)
- Dot indicators are clickable buttons that jump to a specific panel
- Scroll uses `getBoundingClientRect` for accurate position (not `offsetLeft`)
- Active dot synced by `getBoundingClientRect` on scroll
- Phase numerals: `text-gold/40`
- "Learn more" button lives **inside** the text `div` (not independently absolute-positioned) so it flows below the text on mobile and cannot overlap it

### `FadeIn.tsx` — Scroll-triggered animation wrapper
- Wraps content in a Framer Motion `motion.div` with `viewport: { once: true }` — animates in once, stays visible
- Default: fades up from `y: 12`
- `from="left"` prop: slides in from `x: -20` — used by the "How it works" steps
- `delay` prop: seconds before animation starts
- Reduced-motion aware: renders a plain `div` if `prefers-reduced-motion` is set

### `FAQAccordion.tsx` — FAQ accordion
- `"use client"` component
- Single open item at a time; Framer Motion height animation
- Open/close indicator: 16px SVG chevron that rotates 180° on open (`transition-transform duration-300`)
- Used by `src/app/faq/page.tsx`

### `Enquiry.tsx` — Contact form
- POSTs to `/api/enquire` (same-origin), which forwards to Resend server-side
- States: idle → submitting → success (Calendly widget) → booked | error
- Calendly triggers: `calendly.event_type_viewed` OR `calendly.profile_page_viewed` (both handled)
- 8-second fallback shows Calendly widget if postMessage never fires
- Loading state: spinning ring animation
- Calendly URL: `https://calendly.com/arun-seeborun/30min`
- Price line shown below description: "An investment of £1,000 / month" (appears on both homepage section and `/enquire` page)
- Section top border: `border-t border-gold/20`
- Submit button uses the bordered rectangle convention (full-width variant)

### `Footer.tsx`
- Gold logo → thin gold rule (`h-px w-8 bg-gold/40`) → copyright → nav links → legal links
- Two rows of links:
  1. Our Philosophy · Testimonials · About Arun · FAQ · Enquire
  2. Privacy · Terms

---

## Key Data File: `src/lib/constants.ts`
```ts
NAV_ITEMS    // Login, Enquire — header desktop nav ("The Path" moved to the hamburger)
MENU_ITEMS   // Our Philosophy, Testimonials, About Arun, FAQ, Enquire — hamburger
PHASES       // 4 journey phases — title, numeral, line, href, image, alt
```

### PHASES images (all user-supplied)
| Phase | Image |
|---|---|
| Recovery | `/images/recovery.png` |
| Reconstruction | `/images/reconstruction.png` |
| Re-entry | `/images/re-entry.png` |
| Relationship Mastery | `/images/relationship-mastery.png` |

---

## Public Assets

### `public/brand/`
| File | Usage |
|---|---|
| `logo-red.png` | Header nav logo |
| `logo-gold.png` | Footer logo |
| `logo-white.png` | Use on dark backgrounds |

### `public/about/`
| File | Usage |
|---|---|
| `arun.png` | About page portrait (real headshot — Arun's professional photo) |

### `public/hero/`
`running.png`, `dressing.png`, `wine.png` — hero slideshow images.
To add/remove slides: edit the `SLIDES` array in `src/components/VisualStack.tsx`.

### `public/images/`
| File | Usage |
|---|---|
| `aphrodite.png` | Full-screen panel in Manifesto |
| `recovery.png` | Phase I card |
| `reconstruction.png` | Phase II card |
| `re-entry.png` | Phase III card |
| `relationship-mastery.png` | Phase IV card |

### `public/images/values/`
8 images for the Our Philosophy values grid:
`truth.png`, `confidentiality.png`, `excellence.png`, `freedom.png`, `brotherhood.png`, `resilience.png`, `compassion.png`, `reinvention.png`

---

## Browser Icon (Favicon)
`src/app/favicon.ico` and `src/app/icon.png` — generated from the source image with the black corner background flood-filled transparent, leaving the cream circle with burgundy lion. The `icons` field has been removed from `layout.tsx` metadata so Next.js uses the app-directory file convention automatically. The original source image is at `C:\Users\cexdq\Pictures\Remane\browser icon\browser icon lion 2.png`.

---

## Security (`next.config.ts`)
- CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy headers on all routes
- CSP allows: Formspree + Calendly + Google Fonts, plus **Supabase** (`https://*.supabase.co`, `wss://*.supabase.co`) and **YouTube** embeds (`youtube-nocookie.com`) for the portal
- `Permissions-Policy`: `microphone=(self)` — needed for coach dictation in Conversations; camera and geolocation stay blocked
- Search API: 100-char query cap, in-process cache, **private roots excluded** (`PRIVATE_ROOTS`)
- Enquiry API: server-side proxy (browser never contacts Resend directly)
- `robots.ts` blocks `/api/`, `/portal`, `/coach`, `/account`, `/auth/`, `/login`
- Honeypot on enquiry form (`_gotcha`)
- Portal security is enforced in the **database** (RLS + triggers), not just the UI — see the Client Portal section

---

## Client Portal (July 2026)

A full coaching portal on **Supabase** (auth + Postgres + realtime + storage).
Setup: `SETUP-PORTAL.md`. Schema: `supabase/schema.sql` + `migration-002…007`.

### Routes
| Route | Who | Notes |
|---|---|---|
| `/login` | public | Sign in; "Forgotten password" sends a reset. Linked from the **nav bar** (replaced "The Path", still in the hamburger) and the footer |
| `/auth/callback` | public | Lands invite/reset emails. Reads the URL itself (hash tokens, `?code`, or `token_hash`) — see gotcha below |
| `/auth/set-password` | signed-in | Choose a password after an invite/reset |
| `/account` | signed-in | Details + change password. Reachable from the portal header (both roles) |
| `/coach`, `/coach/*` | coach | Clients, homework, messages, classrooms, library |
| `/portal`, `/portal/*` | client | Overview, homework, messages, classrooms, library |

### Coach area
- **Clients** (`/coach`) — collapsible cards, name-only when collapsed. Add client (admin invite + auto-created DM room), remove client.
- **Client detail** (`/coach/clients/[id]`) — order: **Conversations → Profile → Progress → Homework → Book next session**.
  - *Conversations*: coach-only session notes with **stage + week dropdown** (week auto-fills from the client's current week, editable), summary + transcript fields with **browser dictation**, past notes in a collapsed "Conversation bank".
  - *Profile*: the running dossier (`client_dossier`).
  - *Progress*: phase progress bars, week +/−, **"Session complete"** (advances the week), editable **stage length**, add/remove phase.
  - *Homework*: assign with due date; history in a collapsed "Homework bank" with a "N to mark" badge.
  - *Book next session*: stage dropdown → week auto-filled → date/time → **generated Zoom title to copy** → paste the Zoom link → Book.
- **Library** (`/coach/library`) — videos (unlisted YouTube) + documents/links. Each can be tagged to a stage and **published to everyone in that stage**, or sent to one client (posts into their chat).
- **Messages / Classrooms** — DMs and group rooms; per-client unread counts, unread rooms sort first.

### Client area
- Overview: **upcoming sessions** (cancel allowed only ≥48h before start — enforced by a DB trigger), phase progress bars, homework due.
- Homework: submit text + file (private `homework` bucket, path `{userId}/{homeworkId}/…`), see feedback, resubmit.
- Messages, Classrooms, Library (everything shared with them or published to their stage).

### Cross-cutting
- **Unread indicators**: `unread_counts()` RPC + `room_reads`. Badges on Messages/Classrooms nav for both roles; opening a chat marks it read and calls `router.refresh()` so the badge clears immediately.
- **Homework badges**: nav shows *submissions to mark* (coach) / *homework still to submit* (client), with per-item tags.
- **Message flags**: coach-only ⚑ on any message (`message_flags`, coach-only RLS — invisible to clients even via the API).
- **Emails** (all via Resend, `src/lib/email.ts`): session confirmation + **calendar invite (.ics)**, 3-day reminder, cancellation notice + **calendar CANCEL** (removes the event), 24h unread alert.

### Key files
`src/lib/supabase/{client,server,admin,env}.ts` · `src/lib/portal.ts` (types, `sortPhases`, `phaseProgress`, `canClientCancel`) · `src/lib/chat.ts` (`getUnreadSummary`, `getHomeworkBadge`) · `src/lib/email.ts` · `src/app/coach/actions.ts` (every action calls `requireCoach()`) · `src/app/portal/actions.ts` (client cancellation) · `src/proxy.ts` (session refresh + route gating; no-ops when Supabase env is absent).

### Security
All tables have RLS. Clients can only ever read their own rows/rooms. Coach-only tables (`client_notes`, `client_dossier`, `message_flags`) have **no client-facing policy at all**. DB triggers stop clients tampering with homework columns and enforce the 48-hour cancellation rule. Portal routes are blocked in `robots.ts` and excluded from `/api/search`. CSP allows `*.supabase.co` (https+wss) and YouTube embeds; `Permissions-Policy` allows `microphone=(self)` for coach dictation.

### Database migrations
**Apply them from this machine — don't hand-paste into the SQL editor:**
```
cd remane/supabase && python apply_migrations.py
```
It connects with `SUPABASE_DB_PASSWORD` (from `.env.local`) to `db.<ref>.supabase.co` — the regional poolers reject this tenant — applies every migration in order, and verifies the tables exist. Add new migrations to the `MIGRATIONS` list in that script. All migrations are additive and safe to re-run; `schema.sql` is **not** (it drops tables).

### Gotchas (all previously hit)
- **`schema.sql` drops everything.** Only for a fresh project. Use the migration files for changes.
- **Auth email links must land on `/auth/callback`.** Supabase's default template redirects to the Site URL, so `AuthLinkCatcher` (in `Providers`) forwards any page carrying an auth token to the callback. Auth transitions use **hard navigations** (`window.location.assign`) — soft ones raced each other and left users stuck on "Signing you in…".
- **Invite/reset links are single-use** and burnt by Supabase before your site sees them. Re-clicking always fails; send a fresh invite.
- **Supabase's built-in mailer** sends ~2 emails/hour and often lands in spam. Connect Resend SMTP (Authentication → Emails → SMTP Settings) before inviting real clients.
- **Stage ordering**: always render phases through `sortPhases()` — sorting by `started_at` re-shuffles on every update because phases added together share a timestamp.

---

## Coaching Material (`Modules and homework/`)

**Its own private git repo** — pushed to `github.com/arunseeb/remane-coaching-curricula` (**private**). The website repo's `.gitignore` excludes the folder, so the licensed Stage 1 manual and the curricula can never be published with the site. Commit + push after any curriculum or generator change.

- **Curricula** (markdown): Stage 2 Reconstruct (12-week standard + 24-week intensive), Stage 3 Re-entry, Stage 4 Romantic Mastery. Stage 1 Recovery is a licensed third-party PDF (Frascona).
- **Presentations/** — 72 branded decks + the consultation deck, all generated by Python:
  - `_deck_kit.py` — brand constants and the standard cards (title, "One breath", progress strip, teaching, statement, lens, divider, reflection, verbatim homework, closing).
  - `_stage2_builder.py` — spec-driven builder with extra layouts (contrast, funnel, formula, steps, then/now); `configure()` repoints it at any stage.
  - Week specs: `_stage1_week*.py`, `_stage2_weeks_a/_b.py`, `_stage2std_weeks.py`, `_stage3_weeks.py`, `_stage4_weeks.py`. Runners: `_stage2_make.py`, `_stage2std_make.py`, `_stage3_make.py`, `_stage4_make.py`, `_consultation_make.py`.
  - Decks (`*.pptx`) are **git-ignored** — regenerate with the runners. Fonts (Cormorant Garamond, Source Sans 3) are installed per-user on this PC; install them elsewhere or export to PDF, or the typography falls back silently.
- Editing a deck = edit the spec file, rerun the runner. Homework text on slides is quoted **verbatim** from the curricula — keep it that way.

---

## Outstanding / To-Do
1. **Deploy the portal** — everything below is built and green locally but **not yet pushed**: the portal, nav Login link, updated path pages, search exclusion. Push when ready (auto-deploys via Vercel).
2. **Vercel env vars** — add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (and optionally `CRON_SECRET`). `RESEND_API_KEY` is already there. The cron jobs only run once deployed.
3. **Resend sender domain** — still `onboarding@resend.dev`, which **only delivers to Arun's own address**. Verify a domain on resend.com so client emails (invites, session confirmations, reminders) actually arrive. Then update the `from` address in `src/lib/email.ts` and `src/app/api/cron/unread-alerts/route.ts`.
4. **Testimonials** — three placeholder quotes live. Replace with real anonymised ones — `TESTIMONIALS` in `src/app/testimonials/page.tsx`.
5. **`NEXT_PUBLIC_SITE_URL`** — set to the live domain in Vercel so sitemap, og:image and invite links resolve.
6. **Instagram** — footer link pending an account.
7. **Stage 4 curriculum** — the decks were built from the original file; if it gets edited, rerun `_stage4_make.py`.
