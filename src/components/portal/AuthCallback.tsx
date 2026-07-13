"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "@/lib/supabase/env";

/**
 * Landing page for Supabase's invitation and password-reset emails.
 *
 * The link can hand us the credentials in three different shapes depending on how the
 * email was generated, so we read the URL ourselves and handle each explicitly:
 *   #access_token / #refresh_token  — admin invites (implicit flow)
 *   ?code=…                         — PKCE flow (e.g. a reset the user began in-browser)
 *   ?token_hash=…&type=…            — custom email templates
 *
 * `detectSessionInUrl` is switched off so the client doesn't race us and consume the
 * one-time token first.
 */
export function AuthCallback() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Read the URL before anything can rewrite it.
    const url = new URL(window.location.href);
    const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
    const query = url.searchParams;

    const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
      auth: { detectSessionInUrl: false },
    });

    async function establishSession(): Promise<string | null> {
      const emailed = hash.get("error_description") ?? query.get("error_description");
      if (emailed) return emailed;

      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const code = query.get("code");
      const tokenHash = query.get("token_hash");
      const type = query.get("type") as EmailOtpType | null;

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        return error?.message ?? null;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        return error?.message ?? null;
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
        return error?.message ?? null;
      }

      // No credentials in the URL — maybe they're already signed in.
      const { data } = await supabase.auth.getSession();
      return data.session ? null : "This link is missing its sign-in token.";
    }

    let cancelled = false;
    establishSession()
      .then((failure) => {
        if (cancelled) return;
        if (failure) {
          setError(failure);
          return;
        }
        // Hard navigation: strips the one-time token from the URL and guarantees
        // the server sees the freshly-set session cookies.
        window.location.assign("/auth/set-password");
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Sign-in failed.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl font-light text-foreground">
          This link didn&apos;t work
        </h1>
        <p className="mt-3 text-sm text-muted">
          Invitation and reset links can only be used once, and expire after 24 hours. Ask
          Arun to send a fresh invitation, or reset your password from the login page.
        </p>
        <p className="mt-3 text-xs text-muted/70">{error}</p>
        <Link
          href="/login"
          className="mt-8 inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return <p className="text-sm tracking-[0.2em] text-muted uppercase">Signing you in…</p>;
}
