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

## Deployment
- **GitHub:** https://github.com/arunseeb/Remane-website.git
- **Host:** Vercel (connected to GitHub — auto-deploys on push to `main`)
- To deploy: `git add . && git commit -m "message" && git push`

---

## Environment Variables
Set these in Vercel → Project → Settings → Environment Variables, and locally in `remane/.env.local`.

| Variable | Required | Description |
|---|---|---|
| `RESEND_API_KEY` | **Yes** | API key from resend.com — powers the enquiry form email |
| `ENQUIRY_TO_EMAIL` | **Yes** | Email address where enquiries are delivered (Arun's email) |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full production URL (e.g. `https://remane.co.uk`) — used by sitemap and og:image |

**Enquiry form:** Form submissions are proxied through `/api/enquire` (server-side) to Resend's API. The browser never contacts Resend directly. If `RESEND_API_KEY` or `ENQUIRY_TO_EMAIL` are missing, the form returns a server configuration error. The `from` address is `Remane <onboarding@resend.dev>` (Resend's shared sender) — upgrade to a verified custom domain on Resend to send from your own address.

---

## Stack
- **Next.js 16** + React 19 + TypeScript
- **Tailwind CSS v4** (config via `postcss.config.mjs`, no `tailwind.config.js`)
- **Framer Motion** — scroll/fade animations, FAQ accordion
- **Lenis** — smooth scrolling (`src/components/SmoothScroll.tsx`)
- **Resend** — transactional email for enquiry form (free tier: 3,000/month)
- **react-calendly** — inline booking widget shown after form submission

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
- `.grain` — film grain overlay via `::after` pseudo-element
- `.vintage-image` — subtle `saturate(0.92) contrast(1.02)` filter
- `.path-track` — horizontal snap scroll container
- `.path-panel` — individual snap panel

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
| `/api/search` | `src/app/api/search/route.ts` | Page search — auto-discovers pages by scanning titles |
| `/api/enquire` | `src/app/api/enquire/route.ts` | Enquiry form proxy → Resend |

### New Page Convention
Every new page needs:
```tsx
export const metadata = {
  title: "Page Name — Remane",
  description: "...",
};
```
The search API reads this `title` field from the file system — no registration needed.

All detail pages include `<Header hideDesktopNav />` and `<Footer />`. Path pages link back to `/#path` (not `/`) so the user returns to the carousel.

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
- Hero includes a "Begin your enquiry →" CTA link anchored to `#enquire`
- Subtle animated scroll chevron sits above the dot indicators (`opacity-30`, `animate-bounce`)

### `Manifesto.tsx`
1. "How it works" 3-step section — each step and separator animates in left-to-right on scroll (staggered at 0, 0.18, 0.36 s; separators at 0.09, 0.27 s). Uses `FadeIn from="left"`. Fires once only — does not re-animate on scroll.
2. Full-screen Aphrodite panel → links to `/our-mission`
3. JourneyPhases carousel

### `JourneyPhases.tsx` — "The Path" carousel
- Horizontal scroll with `←` / `→` navigation buttons (44px bordered squares)
- Dot indicators are clickable buttons that jump to a specific panel
- Scroll uses `getBoundingClientRect` for accurate position (not `offsetLeft`)
- Active dot synced by `getBoundingClientRect` on scroll

### `FadeIn.tsx` — Scroll-triggered animation wrapper
- Wraps content in a Framer Motion `motion.div` with `viewport: { once: true }` — animates in once, stays visible
- Default: fades up from `y: 12`
- `from="left"` prop: slides in from `x: -20` — used by the "How it works" steps
- `delay` prop: seconds before animation starts
- Reduced-motion aware: renders a plain `div` if `prefers-reduced-motion` is set

### `FAQAccordion.tsx` — FAQ accordion
- `"use client"` component
- Single open item at a time; Framer Motion height animation
- Used by `src/app/faq/page.tsx`

### `Enquiry.tsx` — Contact form
- POSTs to `/api/enquire` (same-origin), which forwards to Resend server-side
- States: idle → submitting → success (Calendly widget) → booked | error
- Calendly triggers: `calendly.event_type_viewed` OR `calendly.profile_page_viewed` (both handled)
- 8-second fallback shows Calendly widget if postMessage never fires
- Loading state: spinning ring animation
- Calendly URL: `https://calendly.com/arun-seeborun/30min`
- Price line shown below description: "An investment of £1,000 / month" (appears on both homepage section and `/enquire` page)

### `Footer.tsx`
Two rows of links:
1. Our Philosophy · Testimonials · About Arun · FAQ · Enquire
2. Privacy · Terms

---

## Key Data File: `src/lib/constants.ts`
```ts
NAV_ITEMS    // The Path, Enquire — header desktop nav
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
- CSP allows: Formspree (connect-src), Calendly scripts + frames + connect, Google Fonts
- Search API: 100-char query cap, in-process cache
- Enquiry API: server-side proxy (browser never contacts Resend directly)
- `robots.ts` blocks `/api/`
- Honeypot on enquiry form (`_gotcha`)

---

## Outstanding / To-Do
1. **Testimonials** — three placeholder quotes currently live. Replace with real anonymised client quotes when available — edit `TESTIMONIALS` array in `src/app/testimonials/page.tsx`.
2. **`NEXT_PUBLIC_SITE_URL`** — set to the live production domain in Vercel environment variables so sitemap and og:image URLs resolve correctly.
3. **Instagram** — no link in footer until an account is created. Add it to `src/components/Footer.tsx` when ready.
4. **Resend sender domain** — currently sends from `onboarding@resend.dev`. Verify a custom domain on resend.com to send from `enquiries@remane.co.uk` or similar.
