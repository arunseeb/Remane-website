"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { assignHomework } from "@/app/coach/actions";

export function AssignHomeworkForm({
  clientId,
  clients,
}: {
  clientId?: string;
  clients?: { id: string; full_name: string; email: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const inputClass =
    "w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const cid = String(formData.get("client_id") ?? "");
    const title = String(formData.get("title") ?? "").trim();
    if (!cid) return setError("Choose a client.");
    if (!title) return setError("A title is required.");

    setBusy(true);

    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setBusy(false);
        return setError("That file is too large (max 50 MB).");
      }
      const supabase = createClient();
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      const path = `${cid}/assignments/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("homework")
        .upload(path, file, { contentType: file.type || undefined });
      if (uploadError) {
        setBusy(false);
        return setError(`Attachment upload failed: ${uploadError.message}`);
      }
      formData.set("attachment_path", path);
      formData.set("attachment_name", file.name);
    }

    const result = await assignHomework({ ok: false, error: null }, formData);
    setBusy(false);
    if (result.ok) {
      setOk(true);
      form.reset();
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setError(result.error);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mt-4 space-y-4 border border-brown/20 bg-surface/50 p-5"
    >
      {clientId ? (
        <input type="hidden" name="client_id" value={clientId} />
      ) : (
        <select name="client_id" required defaultValue="" className={inputClass}>
          <option value="" disabled>
            Choose a client…
          </option>
          {(clients ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name || c.email}
            </option>
          ))}
        </select>
      )}
      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <input name="title" required placeholder="Homework title" className={inputClass} />
        <label className="flex items-center gap-3 text-sm text-muted">
          Due
          <input
            name="due_date"
            type="date"
            className="border border-brown/30 bg-transparent px-3 py-2.5 text-base text-foreground focus:border-burgundy focus:outline-none"
          />
        </label>
      </div>
      <textarea
        name="instructions"
        rows={3}
        placeholder="Instructions for the client…"
        className={inputClass}
      />
      <div className="flex flex-wrap items-center gap-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={(e) => {
            setError(null);
            setFile(e.target.files?.[0] ?? null);
          }}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="border border-brown/30 px-4 py-2 text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
        >
          {file ? file.name : "Attach a file (optional)"}
        </button>
        {file && (
          <button
            type="button"
            onClick={() => {
              setFile(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            aria-label="Remove attachment"
            className="text-xs text-muted transition-colors hover:text-burgundy"
          >
            ✕ remove
          </button>
        )}
      </div>
      {error && <p className="text-sm text-burgundy">{error}</p>}
      {ok && <p className="text-sm text-muted">Homework set.</p>}
      <button
        type="submit"
        disabled={busy}
        className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
      >
        {busy ? "Setting…" : "Set homework"}
      </button>
    </form>
  );
}
