"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setBusy(false);
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    window.location.assign(profile?.role === "coach" ? "/coach" : "/portal");
  }

  const inputClass =
    "w-full border border-brown/30 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <input
        type="password"
        required
        autoComplete="new-password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className={inputClass}
      />
      <input
        type="password"
        required
        autoComplete="new-password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className={inputClass}
      />
      {error && <p className="text-sm text-burgundy">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
      >
        {busy ? "Saving…" : "Save and continue"}
      </button>
    </form>
  );
}
