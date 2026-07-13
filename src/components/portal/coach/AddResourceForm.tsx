"use client";

import { useRef, useState, useTransition } from "react";
import { addResource } from "@/app/coach/actions";
import { createClient } from "@/lib/supabase/client";
import { PhaseFields } from "./PhaseFields";

export function AddResourceForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const inputClass =
    "w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      if (file) {
        if (file.size > 50 * 1024 * 1024) {
          setError("File is too large (max 50 MB).");
          return;
        }
        const supabase = createClient();
        const safeName = file.name.replace(/[^\w.\-]+/g, "_");
        const path = `${Date.now()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("resources")
          .upload(path, file);
        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`);
          return;
        }
        formData.set("file_path", path);
      }

      const result = await addResource({ ok: false, error: null }, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      formRef.current?.reset();
      setFile(null);
      if (detailsRef.current) detailsRef.current.open = false;
    });
  }

  return (
    <details ref={detailsRef} className="mt-6 border border-brown/20 bg-surface/50">
      <summary className="cursor-pointer px-5 py-4 text-xs tracking-[0.25em] text-burgundy uppercase select-none">
        + Add a document or link
      </summary>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 border-t border-brown/20 p-5"
      >
        <input name="title" required placeholder="Title" className={inputClass} />
        <textarea
          name="description"
          rows={2}
          placeholder="What this is, and when it helps…"
          className={inputClass}
        />

        <PhaseFields />

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            name="url"
            placeholder="Link (article, PDF, worksheet…)"
            disabled={file !== null}
            className={`${inputClass} disabled:opacity-40`}
          />
          <label className="flex cursor-pointer items-center gap-3 text-xs tracking-[0.15em] text-muted uppercase">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <span className="border border-brown/30 px-4 py-2.5 transition-colors hover:border-burgundy hover:text-burgundy">
              {file ? file.name : "…or upload a file"}
            </span>
            {file && (
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-muted transition-colors hover:text-burgundy"
              >
                ×
              </button>
            )}
          </label>
        </div>

        {error && <p className="text-sm text-burgundy">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add to library"}
        </button>
      </form>
    </details>
  );
}
