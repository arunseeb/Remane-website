@AGENTS.md

# Remane — Project Handoff

## What this is
A premium private coaching website for men rebuilding after divorce. One-to-one coaching by Arun Seeborun. High-ticket (£1,000/month), UK-based, positioned as established and discreet.

## Stack
- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS** with a custom design system
- **Formspree** (`xlgvydll`) for form submissions
- **react-calendly** for inline booking widget
- **Framer Motion** for fade-in animations
- **Lenis** for smooth scrolling

## Environment variables
```
NEXT_PUBLIC_FORMSPREE_ID=xlgvydll
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
| `/path/recovery` | `app/path/recovery/page.tsx` | Phase I |
| `/path/reconstruction` | `app/path/reconstruction/page.tsx` | Phase II |
| `/path/re-entry` | `app/path/re-entry/page.tsx` | Phase III |
| `/path/relationship-mastery` | `app/path/relationship-mastery/page.tsx` | Phase IV |
| `/privacy` | `app/privacy/page.tsx` | GDPR-compliant |
| `/terms` | `app/terms/page.tsx` | 17-section T&Cs |
| `/faq` | `app/faq/page.tsx` | |

## Key components
- **`Header.tsx`** — Fixed navbar with hamburger drawer. Hamburger is a standalone `fixed` element at `z-[70]` (above drawer at `z-[65]`, above header at `z-[60]`). Logo shows when `atTop` or `menuOpen`. Nav links (The Path, Enquire) disappear when menu opens. Active page highlighted in burgundy via `usePathname`.
- **`Enquiry.tsx`** — Formspree form → on success shows Calendly `InlineWidget` → on `calendly.event_scheduled` postMessage shows thank you. Has honeypot field (`_gotcha`). Calendly has loading skeleton until `calendly.profile_page_viewed` fires.
- **`VisualStack.tsx`** — Hero slideshow with Ken Burns effect. Height is `calc(100svh - 9rem)` with `mt-36` to clear the navbar.
- **`Manifesto.tsx`** — "How it works" 3-step section + full-screen Philosophy panel + JourneyPhases scroll.
- **`JourneyPhases.tsx`** — Horizontal scroll carousel of the 4 phases with active indicator.

## Side panel menu order
Our Philosophy → The Path (expandable) → Testimonials → About Arun → FAQ → Enquire

## Security
- HTTP security headers set in `next.config.ts` (CSP, HSTS, X-Frame-Options, Permissions-Policy, Referrer-Policy)
- CSP explicitly allows Formspree and Calendly
- Search API (`/api/search`) has 100-char query cap and in-process cache
- Honeypot on enquiry form
- `robots.ts` blocks `/api/`
- `sitemap.ts` lists all 12 public pages
- `.env.local` is gitignored via `.env*` pattern
- 2 moderate npm vulnerabilities exist in Next.js's internal PostCSS — cannot be fixed without downgrading Next.js to v9. Not a runtime risk.

## Known gaps / next priorities
1. **Testimonials** — page exists but has placeholder content. Real quotes needed urgently for conversion.
2. **Production deploy** — update `NEXT_PUBLIC_SITE_URL` to the live domain so og:image and sitemap URLs resolve correctly.
3. **Instagram** — link removed from footer until an account exists.
4. **Arun's photo** — current image is a placeholder headshot. Replace `/public/about/arun.png` when a professional photo is ready.

## Encoding note
Several page files were corrupted by an early PowerShell operation. All have since been fixed at the byte level. If you ever use PowerShell to modify `.tsx` files, use `[System.IO.File]::ReadAllText` / `WriteAllText` with `[System.Text.UTF8Encoding]::new($false)` (UTF-8 without BOM) to avoid re-introducing corruption.
