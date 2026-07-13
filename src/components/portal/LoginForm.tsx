"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "invalid-link"
      ? "That link has expired or was already used. Sign in below, or use “Forgotten password” to get a fresh one."
      : null
  );
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Incorrect email or password.");
      setBusy(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    // Only follow same-origin paths — a crafted ?next would otherwise forward a
    // freshly signed-in user to an attacker's site. A plain startsWith("/") check
    // isn't enough: browsers treat "\" as "/", and tab/newline are stripped before
    // parsing, so "/\evil.com" and "/%09/evil.com" both resolve cross-origin. Let
    // the URL parser decide, then insist the origin is ours and keep only the path.
    const next = searchParams.get("next");
    let safeNext: string | null = null;
    if (next) {
      try {
        const url = new URL(next, window.location.origin);
        if (url.origin === window.location.origin) {
          safeNext = url.pathname + url.search + url.hash;
        }
      } catch {
        // not a parseable URL — fall through to the role default
      }
    }
    window.location.assign(safeNext ?? (profile?.role === "coach" ? "/coach" : "/portal"));
  }

  async function handleForgot() {
    if (!email) {
      setError("Enter your email first, then press “Forgotten password”.");
      return;
    }
    setError(null);
    setNotice(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    setBusy(false);
    if (error) {
      // Never claim the mail is on its way when it isn't — Supabase rate-limits
      // password resets, and a false "check your inbox" leaves the user waiting
      // for an email that will never arrive.
      setError(
        error.status === 429
          ? "Too many reset requests. Wait a few minutes and try again."
          : `Could not send the reset email: ${error.message}`
      );
      return;
    }
    // Deliberately does not confirm whether the address has an account.
    setNotice(
      "If that email has an account, a reset link is on its way. It expires in 24 hours — check your spam folder."
    );
  }

  const inputClass =
    "w-full border border-brown/30 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <input
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
      />
      <input
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
      />
      {error && <p className="text-sm text-burgundy">{error}</p>}
      {notice && <p className="text-sm text-muted">{notice}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
      <button
        type="button"
        onClick={handleForgot}
        disabled={busy}
        className="link-underline mx-auto block text-xs tracking-[0.2em] text-muted uppercase"
      >
        Forgotten password
      </button>
    </form>
  );
}
