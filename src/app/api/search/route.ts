import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 100;

// The public pages, by hand. A previous version scanned src/app with fs at request
// time, which only works in `next dev` — deployed servers don't ship the source tree,
// so production search silently returned nothing. Keep this list in step with
// src/app/sitemap.ts when pages are added. /begin (unlisted funnel), the portal and
// auth pages are deliberately absent.
const PAGES = [
  { label: "Home", href: "/" },
  { label: "Our Philosophy", href: "/our-mission" },
  { label: "About the Founder", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Enquire", href: "/enquire" },
  { label: "Recovery", href: "/path/recovery" },
  { label: "Reforge", href: "/path/reforge" },
  { label: "Reconstruction", href: "/path/reconstruction" },
  { label: "Re-entry", href: "/path/re-entry" },
  { label: "Relationship Mastery", href: "/path/relationship-mastery" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
];

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("q") ?? "";

  if (raw.length > MAX_QUERY_LENGTH) {
    return NextResponse.json([], { status: 400 });
  }

  const q = raw.toLowerCase().trim();
  if (!q) return NextResponse.json([]);

  const filtered = PAGES.filter((p) =>
    p.label.toLowerCase().split(/\s+/).some((word) => word.startsWith(q))
  );

  return NextResponse.json(filtered);
}
