@AGENTS.md

# Remane — Project Handoff

## What this is
A premium private coaching website for men rebuilding after divorce. One-to-one coaching by Arun Seeborun. High-ticket (£1,000/month), UK-based, positioned as established and discreet.

## The programme — five stages
The coaching path is five stages. **Reforge (II) was inserted between Recovery and Reconstruction**, and everything downstream renumbered — this cascade touched the website, the deck/curriculum system, and the database.

| # | Stage | What it does |
|---|---|---|
| I | Recovery | The honest ground floor — stabilise after the divorce. |
| II | **Reforge** | Build the inner character/mentality: abundant & winner's mentality, radical self-belief, self-permission, values, standards, an internal hierarchy, moral character, purpose, chief aim. Through-line artifact: a written personal "Code." |
| III | Reconstruction | The **outer** rebuild — body, grooming, style, presence, environment, social world. Also carries Arun's "Social Magnetism" outward-deployment material. |
| IV | Re-entry | Back into the world (incl. dating) honestly. |
| V | Relationship Mastery | Built to last. |

**Inner vs outer split (deliberate):** Reforge is inner drivers only. Arun's "Social Magnetism" (frame control, pre-social ritual, entering as the host, loving-from-above/King mentality, making people feel special, story banking & calibration) was routed **out** of Reforge into Reconstruction, because it's outward deployment that only works once the Reforge self-concept is real underneath it.

## Stack
- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS** with a custom design system
- **Formspree** (`mykayqjo`) for form submissions
- **react-calendly** for inline booking widget
- **Framer Motion** for fade-in animations
- **Lenis** for smooth scrolling

## Environment variables
```
NEXT_PUBLIC_FORMSPREE_ID=mykayqjo
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # set to production domain on deploy
```

## Design system
- **Fonts**: Cormorant Garamond (display, `font-display`), Source Sans 3 (body)
- **Colours**: burgundy, gold, brown, muted, foreground, surface, background — all defined as CSS variables in `globals.css`
- **Tone**: sparse, premium, no emoji, sentence case headings, thin uppercase tracking on labels

## Pages
| Route | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Hero → How it works → Philosophy panel → The Path → Enquiry form |
| `/our-mission` | `app/our-mission/page.tsx` | Philosophy text + 2×4 zigzag values grid |
| `/about` | `app/about/page.tsx` | Arun's story, photo at `/public/about/arun.png` |
| `/testimonials` | `app/testimonials/page.tsx` | Currently placeholder — replace with real quotes ASAP |
| `/faq` | `app/faq/page.tsx` | 4 sections, full copy already written |
| `/enquire` | `app/enquire/page.tsx` | Standalone enquiry page with back link |
| `/begin` | `app/begin/page.tsx` | VSL sales funnel — standalone (no Header/Footer), noindex, off sitemap. VSL script in `VSL-SCRIPT.md`; set video ID in `components/funnel/Vsl.tsx` once recorded. Qualifying form (`components/funnel/BeginForm.tsx`) posts to Formspree with UTM/referrer capture, then shows Calendly. Testimonials section hidden until `TESTIMONIALS` array in page is filled with real quotes. |
| `/path/recovery` | `app/path/recovery/page.tsx` | Phase I |
| `/path/reforge` | `app/path/reforge/page.tsx` | Phase II — added in the Reforge cascade (cloned from reconstruction) |
| `/path/reconstruction` | `app/path/reconstruction/page.tsx` | Phase III |
| `/path/re-entry` | `app/path/re-entry/page.tsx` | Phase IV |
| `/path/relationship-mastery` | `app/path/relationship-mastery/page.tsx` | Phase V |
| `/privacy` | `app/privacy/page.tsx` | GDPR-compliant |
| `/terms` | `app/terms/page.tsx` | 17-section T&Cs |
| `/faq` | `app/faq/page.tsx` | |

## Key components
- **`Header.tsx`** — Fixed navbar with hamburger drawer. Hamburger is a standalone `fixed` element at `z-[70]` (above drawer at `z-[65]`, above header at `z-[60]`). Logo shows when `atTop` or `menuOpen`. Nav links (The Path, Enquire) disappear when menu opens. Active page highlighted in burgundy via `usePathname`.
- **`Enquiry.tsx`** — Posts directly to Formspree (`NEXT_PUBLIC_FORMSPREE_ID`) as JSON with `Accept: application/json`. On success shows Calendly `InlineWidget` → on `calendly.event_scheduled` postMessage shows thank you. Has honeypot field (`_gotcha`). Calendly has loading skeleton until `calendly.profile_page_viewed` fires. (The old unused `/api/enquire` Resend route has been deleted — it was an unauthenticated email relay with an HTML-injection hole.)
- **`Footer.tsx`** — Social icons for Instagram (`remaneofficial`), Facebook (`61590226217685`), YouTube (`@RemaneOfficial`). Icons are inline SVG, muted by default, burgundy on hover.
- **`VisualStack.tsx`** — Hero slideshow with Ken Burns effect. Height is `calc(100svh - 9rem)` with `mt-36` to clear the navbar.
- **`Manifesto.tsx`** — "How it works" 3-step section + full-screen Philosophy panel + JourneyPhases scroll.
- **`JourneyPhases.tsx`** — Horizontal scroll carousel of the 5 phases with active indicator.

## Side panel menu order
Our Philosophy → The Path (expandable) → Testimonials → About Arun → FAQ → Enquire

## Security
- HTTP security headers set in `next.config.ts` (CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy)
- CSP explicitly allows Formspree and Calendly
- Search API (`/api/search`) serves a hardcoded list of public pages (100-char query cap). Keep the list in step with `sitemap.ts` — it must NOT scan the filesystem, which breaks on deployed servers
- Honeypot on enquiry form
- `robots.ts` blocks `/api/`
- `sitemap.ts` lists all 13 public pages (add `/path/reforge` kept in step)
- `.env.local` is gitignored via `.env*` pattern
- 2 moderate npm vulnerabilities exist in Next.js's internal PostCSS — cannot be fixed without downgrading Next.js to v9. Not a runtime risk.

## Cron schedules (vercel.json)
Vercel's Hobby plan allows at most **one run per day per cron job**, so both schedules
must stay daily — an hourly expression makes the deploy fail outright. On Pro,
`/api/cron/unread-alerts` is better hourly (`0 * * * *`): it reports client messages
left unanswered for 24h, and a daily run can leave one waiting up to ~48h.

## Curriculum & deck system (separate repo: "Modules and homework")
The teaching materials live **outside this website repo**, in `Modules and homework/` (its own git repo → `arunseeb/remane-coaching-curricula`). Generated `*.pptx`/`*.docx` are gitignored/regenerable — only the source scripts and markdown are committed.

- **`curriculum/`** — the skeleton (module/week markdown) each stage's decks are built from. Reforge: `Stage-2-Reforge-24-Week-Curriculum.md` + `Stage-2-Reforge-12-Week-Curriculum.md` (dual track, like Reconstruction).
- **`Book Concepts/Stage-N-Book-Concepts.md`** — the source-book distillation per stage. `Stage-2` = Reforge (Arun's framework as the spine + Maltz/Covey/Musashi/Marcus/Manson reinforcement). `Stage-3` includes Arun's "Social Magnetism" section.
- **`Presentations/`** — python-pptx deck builders. Generic builder `_stage2_builder.py` consumed via `configure()`; `_deck_kit.py` gives standard cards + `set_notes()`. Each stage has a `_*_make.py` + week-spec files:
  - Reforge: `python _reforge_make.py` (24-wk) / `python _reforge_make.py std` (12-wk). Specs in `_reforge_weeks_a.py` (W1–12), `_reforge_weeks_b.py` (W13–24), `_reforge_std_weeks.py`.
  - **Heads-up — script filenames are historical:** `_stage2_*.py` now builds **Stage III Reconstruction** (not Reforge). Output folders are correct (`Stage 2 - Reforge`, `Stage 3 - Reconstruction`, …); the `_stageN_` in a filename is one behind the real stage number after the cascade.
- **`_homework_sheets.py`** — one `.docx` per track (now includes both Reforge tracks). Regenerates all sheets; will error if a target `.docx` is open in Word (file lock, not a code fault).
- **Handling rule:** slides stay Remane-voiced; book/framework attribution lives ONLY in speaker notes. Arun's framework leads, books reinforce.

## Reforge cascade — files touched (for future edits)
- **Website:** `src/lib/constants.ts` (PHASES), `src/lib/portal.ts` (PHASE_KEYS/LABELS/NUMERALS), `src/components/PhaseOverview.tsx`, all `src/app/path/*/page.tsx` (new `reforge/`, renumbered prev/next + "Phase N"), `src/app/sitemap.ts`, `src/app/api/search/route.ts`, `src/app/begin/page.tsx` (STAGES, "five stages"), `src/app/faq/page.tsx` (five sections). `npx tsc --noEmit` passes.
- **Database:** `supabase/migration-009-reforge-phase.sql` — DO block that drops each `phase` CHECK constraint and re-adds it including `'reforge'`, preserving nullability. **Not yet applied** (see gaps).

## Known gaps / next priorities
1. **Testimonials** — the invented placeholder quotes have been removed (fabricated reviews are a CAP Code / consumer-protection breach on a live site); the page now shows an honest "private by design" interim state. Add real quotes (with written permission) to the `TESTIMONIALS` array in `app/testimonials/page.tsx` and they render automatically.
2. **Production deploy** — update `NEXT_PUBLIC_SITE_URL` to the live domain so og:image and sitemap URLs resolve correctly.
3. **Arun's photo** — current image is a placeholder headshot. Replace `/public/about/arun.png` when a professional photo is ready.
4. **Sidebar hover effect** — attempted `hover:text-muted` via Tailwind v4 and plain CSS; both compiled correctly but effect wasn't visible in browser. Reverted. Needs further investigation.

### Reforge cascade — outstanding
5. **Apply DB migration** — run `supabase/migration-009-reforge-phase.sql` via `apply_migrations.py`. Until applied, the DB CHECK constraints reject `phase = 'reforge'`.
6. **`reforge.png`** — `public/images/reforge.png` is a placeholder copied from `reconstruction.png`. Replace with real art (used on the homepage carousel, side menu, and `/path/reforge`).
7. **Consultation deck** — `Presentations/_consultation_make.py` still needs a Reforge insert (~3 slides of layout work); left undone to avoid guessing the layout.
8. **Commits** — the Reforge work is uncommitted in **both** repos (website + curricula). Website `tsc` is clean.

## Encoding note
Several page files were corrupted by an early PowerShell operation. All have since been fixed at the byte level. If you ever use PowerShell to modify `.tsx` files, use `[System.IO.File]::ReadAllText` / `WriteAllText` with `[System.Text.UTF8Encoding]::new($false)` (UTF-8 without BOM) to avoid re-introducing corruption.
