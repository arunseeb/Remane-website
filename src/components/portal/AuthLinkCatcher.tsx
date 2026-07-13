"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Supabase auth emails don't always land on /auth/callback — invites sent from the
 * Supabase dashboard redirect to the Site URL (the homepage) instead, arriving with the
 * sign-in token in the URL. Without this, those links appear to do nothing.
 *
 * This runs on every page: if it spots auth credentials in the URL, it forwards them to
 * the callback page, which knows how to complete the sign-in.
 */
export function AuthLinkCatcher() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/auth/")) return;

    const hash = window.location.hash;
    const search = window.location.search;

    const hasTokenInHash = /(?:^|[#&])(access_token|error_description)=/.test(hash);
    const hasExplicitToken = /(?:^|[?&])(token_hash|error_description)=/.test(search);
    // ?code= also appears on unrelated links (ad/affiliate/discount URLs). Supabase
    // auth codes are UUIDs, so only a UUID-shaped code counts — ?code=SUMMER10 must
    // not hijack a visitor to the auth callback.
    const hasSupabaseCode =
      /(?:^|[?&])code=[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}(?:&|$)/i.test(
        search
      );
    if (!hasTokenInHash && !hasExplicitToken && !hasSupabaseCode) return;

    router.replace(`/auth/callback${search}${hash}`);
  }, [pathname, router]);

  return null;
}
