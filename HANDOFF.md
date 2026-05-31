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
Without this, the Enquire form renders but the submit button is disabled. Get the ID from formspree.io → your form → the short code in the endpoint URL.

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
| `/our-mission` | `src/app/our-mission/page.tsx` | Brand philosophy |
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
The search API reads this `title` field from the file system at request time — no registration needed. New pages appear in search automatically.

---

## Components

### `Header.tsx` — most complex component
**Layout:** Hamburger (far left) | Lion + "Remane" (centred) | Nav links + Search icon (far right)

**Scroll behaviour** (driven by `useHeaderState`):
- `atTop` (scrollY < 60): transparent background, lion + "Remane" visible, header taller
- `showBg` (scrolling UP past 50vh): solid off-white background with blur
- Otherwise: transparent, no logo

**Search:** Click magnifying glass → hamburger disappears, logo stays centred, search bar expands below nav row, entire header goes solid. Search calls `/api/search?q=` with prefix matching. Escape or "Close" to dismiss.

**Hamburger drawer:** Slides in from left (w-72). Contains:
- Our Mission → `/our-mission`
- Testimonials → `/testimonials`
- Transformations → `/transformations`
- The Path (hover only — no click action) → hover expands drawer to w-[36rem], right panel reveals phase sub-links

**State variables:** `atTop`, `showBg`, `searchOpen`, `menuOpen`, `pathHovered`, `searchQuery`, `searchResults`, `searching`

### `JourneyPhases.tsx` — "The Path" horizontal scroll
- Panels: `h-[min(58vh,440px)]`, `w-[82vw]` mobile / `md:w-[52vw]` / `lg:w-[42vw]` desktop
- Each panel has a white pill button "LEARN MORE" (bottom-right) linking to its phase page
- Button style: `rounded-full bg-white px-6 py-2.5 text-xs text-gold uppercase`
- Active panel tracked by `activeIndex` (dot indicator below)

### `VisualStack.tsx` — Hero panels
- 3 full-screen (`h-[100svh]`) sections stacked vertically
- Each tries to load a local video (`/video/panel-N.mp4`) via HEAD request; falls back to image with Ken Burns animation
- Images from Unsplash (see `VISUAL_PANELS` in constants)

### `Enquiry.tsx` — Contact form
- Controlled by `NEXT_PUBLIC_FORMSPREE_ID` env var
- States: idle → submitting → success | error
- Fields: Name, Email, Message (textarea), Privacy checkbox

---

## Key Data File: `src/lib/constants.ts`

```ts
NAV_ITEMS    // Philosophy, The Path, Enquire — header top nav links
MENU_ITEMS   // Our Mission, Testimonials, Transformations — hamburger drawer
VISUAL_PANELS // 3 hero image/video panels (Unsplash URLs)
PHASES       // 4 journey phases — title, numeral, line, href, image, alt
```

### PHASES images
| Phase | Image |
|---|---|
| Recovery | `/images/recovery.png` (user's own photo) |
| Reconstruction | `/images/reconstruction.png` (user's own photo) |
| Re-entry | `/images/re-entry.png` (user's own photo) |
| Relationship Mastery | Unsplash URL — **user still needs to supply their own image** |

---

## Public Assets

### `public/brand/`
| File | Usage |
|---|---|
| `logo-red.png` | Header nav logo (transparent background) |
| `logo-gold.png` | Footer logo (transparent background) |
| `logo-white.png` | Available — white lion on transparent bg, use on dark backgrounds |
| `remane-lion-*.png` | Old logos — no longer referenced, can delete |

### `public/images/`
User-supplied panel photos. Drop new images here and update `PHASES` in `constants.ts`.

### `public/video/`
Empty (`.gitkeep` only). Drop `panel-1.mp4`, `panel-2.mp4`, `panel-3.mp4` here to enable video in the hero panels. VisualStack checks for these automatically.

---

## Search API (`src/app/api/search/route.ts`)
- Scans `src/app` directory at request time
- Reads `title:` from each `page.tsx` metadata export
- Strips " — Remane" suffix and "Phase X:" prefix for display label
- Prefix-matches on label (e.g. "r" → Recovery, Reconstruction, Re-entry, Relationship Mastery)
- Returns `[]` for empty query (no results shown until user types)
- `export const dynamic = "force-dynamic"` — never cached

---

## Outstanding / To-Do
1. **Formspree ID** — add `NEXT_PUBLIC_FORMSPREE_ID=xxx` to `remane/.env.local`
2. **Relationship Mastery panel image** — user needs to supply a photo; drop in `public/images/relationship-mastery.png` and update `PHASES[3].image` in `constants.ts`
3. **Hero panel videos** — optional; drop `panel-1.mp4`, `panel-2.mp4`, `panel-3.mp4` into `public/video/`
4. **Real content** — testimonials, transformations, and mission pages contain placeholder copy; replace with actual client content
5. **Instagram link** — Footer links to `https://instagram.com` (generic); update to real handle in `src/components/Footer.tsx`

---

## Notes on This Next.js Version
The `AGENTS.md` file (loaded via `CLAUDE.md`) warns this is Next.js 16 with breaking changes. Before adding any Next.js features (routing, image optimisation, middleware, etc.), read the relevant guide in `node_modules/next/dist/docs/`.
