# Remane — Project Handoff

## What This Is
A luxury private coaching website for men. The brand is "Remane" — private guidance for men rebuilding after loss (relationship, identity, direction). The four-phase journey: Recovery → Reconstruction → Re-entry → Relationship Mastery.

## How to Run
```
cd C:\Users\cexdq\Desktop\ClaudeCodeTest\remane
npm run dev
```
Then open http://localhost:3000

**Important:** This is Next.js 16 (not 14/15). APIs and conventions differ. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.

---

## Deployment
- **GitHub:** https://github.com/arunseeb/Remane-website.git
- **Host:** Vercel (connect GitHub repo at vercel.com)
- To redeploy: `git add . && git commit -m "message" && git push`

---

## Stack
- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS v4** (config via `postcss.config.mjs`, no `tailwind.config.js`)
- **Framer Motion** — scroll/fade animations
- **Lenis** — smooth scrolling (`src/components/SmoothScroll.tsx`)
- **Formspree** — contact form backend (needs `.env.local`)

---

## Environment Variables
Create `remane/.env.local` with:
```
NEXT_PUBLIC_FORMSPREE_ID=your_formspree_form_id
```
Also add this in Vercel → Project → Settings → Environment Variables.
Without this, the Enquire form renders but submit is disabled. Get the ID from formspree.io → your form → the short code in the endpoint URL.

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
- `.nav-link` — red text, **gold** underline on hover (used in header nav)
- `.link-underline` — **burgundy** underline on hover (used in footers, back-links)
- `.grain` — film grain overlay via `::after` pseudo-element
- `.vintage-image` — subtle `saturate(0.92) contrast(1.02)` filter
- `.path-track` — horizontal snap scroll container
- `.path-panel` — individual snap panel

---

## Pages & Routes

| Route | File | Notes |
|---|---|---|
| `/` | `src/app/page.tsx` | Home — VisualStack + Manifesto + Enquiry |
| `/privacy` | `src/app/privacy/page.tsx` | Privacy policy |
| `/our-mission` | `src/app/our-mission/page.tsx` | Displayed as "Our Philosophy" — mission text + values zig-zag |
| `/testimonials` | `src/app/testimonials/page.tsx` | 3 anonymised client quotes |
| `/transformations` | `src/app/transformations/page.tsx` | Before/after for each phase |
| `/path/recovery` | `src/app/path/recovery/page.tsx` | Phase I detail page |
| `/path/reconstruction` | `src/app/path/reconstruction/page.tsx` | Phase II detail page |
| `/path/re-entry` | `src/app/path/re-entry/page.tsx` | Phase III detail page |
| `/path/relationship-mastery` | `src/app/path/relationship-mastery/page.tsx` | Phase IV detail page |
| `/api/search` | `src/app/api/search/route.ts` | Search API — auto-discovers pages |

### New Page Convention
Every new page needs:
```tsx
export const metadata = {
  title: "Page Name — Remane",   // "Page Name" is extracted for search
  description: "...",
};
```
The search API reads this `title` field from the file system at request time — no registration needed.

All detail pages (everything except `/`) include `<Header hideDesktopNav />` at the top and use `pt-32` instead of `pt-24` to clear the fixed header.

---

## Components

### `Header.tsx` — most complex component
**Props:** `hideDesktopNav?: boolean` — pass this on all pages except home to hide the desktop nav links (The Path, Enquire).

**Layout:** Hamburger (far left) | Lion + "Remane" (centred) | Nav links + Search icon (far right)

**Sizes (as of last update):**
- Logo: `h-16 w-16` (64px)
- "Remane" wordmark: `text-xl md:text-2xl`, `mt-0.5`
- Hamburger bars: `h-[1.5px] w-6`
- Search icon: `22×22`, `strokeWidth 2.25`
- Nav row height: `h-36` when logo visible, `h-16` when scrolled

**Scroll behaviour** (driven by `useHeaderState`):
- `atTop` (scrollY < 60): transparent background, lion + "Remane" visible, header taller
- `showBg` (scrolling UP past 50vh): solid off-white background with blur
- Otherwise: transparent, no logo

**Search:** Click magnifying glass → search bar expands below nav row. Calls `/api/search?q=` with prefix matching. Escape or "Close" to dismiss.

**Hamburger drawer:** Slides in from left (w-72). Contains:
- Our Philosophy → `/our-mission`
- Testimonials → `/testimonials`
- Transformations → `/transformations`
- The Path (hover only) → expands to w-[36rem], right panel reveals phase sub-links

### `VisualStack.tsx` — Hero slideshow
- Single `h-[100svh]` section (replaces the old 3-panel vertical stack)
- Crossfades between 3 local images every 6 seconds (`lerp: 1200ms`)
- All slides have `priority` to preload and prevent blank frames
- Ken Burns (24s) applied per slide
- Dot indicators at bottom — clickable to jump to any slide
- Auto-advance pauses if user prefers reduced motion
- Images in `public/hero/`: `running.png`, `dressing.png`, `wine.png`

### `Manifesto.tsx` — Philosophy section
Restructured into three parts:
1. **Text block** — "A bespoke path…" heading + "Private guidance…" subtitle, padded section
2. **Aphrodite panel** — full-screen `h-[100svh]` image (`/images/aphrodite.png`) with grain, gradient, and a bottom-right overlay: "Our Philosophy" in display font + white pill button linking to `/our-mission`
3. **Journey phases** — JourneyPhases component with bottom padding

### `JourneyPhases.tsx` — "The Path" horizontal scroll
- Panels: `h-[min(58vh,440px)]`, `w-[82vw]` mobile / `md:w-[52vw]` / `lg:w-[42vw]` desktop
- Each panel has a white pill "LEARN MORE" button (bottom-right) linking to its phase page
- Active panel tracked by `activeIndex` (dot indicator below)

### `Enquiry.tsx` — Contact form
- Controlled by `NEXT_PUBLIC_FORMSPREE_ID` env var
- States: idle → submitting → success | error
- Fields: Name, Email, Message (textarea), Privacy checkbox

---

## Key Data File: `src/lib/constants.ts`

```ts
NAV_ITEMS    // The Path, Enquire — header desktop nav (Philosophy removed)
MENU_ITEMS   // Our Philosophy, Testimonials, Transformations — hamburger drawer
PHASES       // 4 journey phases — title, numeral, line, href, image, alt
```

Note: `VISUAL_PANELS` was removed — hero images are now hardcoded in `VisualStack.tsx`.

### PHASES images — all user-supplied
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

### `public/hero/`
Hero slideshow images (local, user-supplied):
- `running.png`
- `dressing.png`
- `wine.png`

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
8 images for the Our Philosophy values zig-zag:
`truth.png`, `confidentiality.png`, `excellence.png`, `freedom.png`, `brotherhood.png`, `resilience.png`, `compassion.png`, `reinvention.png`

To replace a value image: drop a new file at the same path — no code change needed.

### `public/video/`
Empty (`.gitkeep` only). Not currently used — the old video fallback logic was in the previous VisualStack and has been removed.

---

## Search API (`src/app/api/search/route.ts`)
- Scans `src/app` at request time, reads `title:` from each `page.tsx`
- Strips " — Remane" suffix for display label
- Prefix-matches on label
- `export const dynamic = "force-dynamic"` — never cached

---

## Outstanding / To-Do
1. **Formspree ID** — add `NEXT_PUBLIC_FORMSPREE_ID=xxx` to `.env.local` and Vercel environment variables
2. **Instagram link** — Footer links to `https://instagram.com` (generic); update to real handle in `src/components/Footer.tsx`
3. **Real content** — testimonials, transformations, and phase pages contain placeholder copy
