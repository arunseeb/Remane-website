# Remane

Private, minimalist landing page for Remane — a bespoke programme for men rebuilding with intention.

## Stack

- Next.js 16 (App Router)
- Tailwind CSS v4
- Framer Motion (section fades)
- Lenis (smooth scroll; disabled when `prefers-reduced-motion`)

## Getting started

```bash
cd remane
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Copy `.env.example` to `.env.local` and set your Formspree form ID:

```
NEXT_PUBLIC_FORMSPREE_ID=your_form_id
```

## Hero videos

Place looped, muted clips at:

- `public/video/panel-1.mp4`
- `public/video/panel-2.mp4`
- `public/video/panel-3.mp4`

Until then, each full-screen panel uses a cinematic still (Ken Burns on panel 1–3 when motion is allowed).

## Brand assets

Logos live in `public/brand/`:

- `remane-lion-gold.png` — header over hero
- `remane-lion-burgundy.png` — header after scroll, footer

## Deploy

Recommended: [Vercel](https://vercel.com) with your custom domain when ready.

Update the Instagram link in `src/components/Footer.tsx` when your profile URL is set.
