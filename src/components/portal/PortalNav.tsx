"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PortalNav({
  links,
}: {
  links: { label: string; href: string; badge?: number; badgeTitle?: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav className="scrollbar-hide mx-auto flex max-w-6xl gap-6 overflow-x-auto px-6">
      {links.map((link) => {
        // The dashboard tab also owns its detail pages (/coach covers /coach/clients/…),
        // but only when no more specific tab matches.
        const isRoot = link.href === "/coach" || link.href === "/portal";
        const active = isRoot
          ? pathname === link.href ||
            (pathname.startsWith(`${link.href}/`) &&
              !links.some((l) => l.href !== link.href && pathname.startsWith(l.href)))
          : pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 pb-3 text-xs tracking-[0.2em] uppercase transition-colors ${
              active
                ? "border-burgundy text-burgundy"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {link.label}
            {(link.badge ?? 0) > 0 && (
              <span
                title={link.badgeTitle}
                className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] leading-none tracking-normal text-background"
              >
                {link.badge! > 99 ? "99+" : link.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
