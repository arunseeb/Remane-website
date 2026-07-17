"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate, isOverdue, type Homework } from "@/lib/portal";

export function HomeworkItem({
  homework,
  userId,
  fileUrl,
  assignmentFileUrl,
}: {
  homework: Homework;
  userId: string;
  fileUrl: string | null;
  assignmentFileUrl?: string | null;
}) {
  const router = useRouter();
  const [text, setText] = useState(homework.submission_text ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = homework.status === "assigned" || homework.status === "returned";
  const overdue = isOverdue(homework.due_date, homework.status);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() && !file) {
      setError("Write something or attach a file before submitting.");
      return;
    }
    setError(null);
    setBusy(true);
    const supabase = createClient();

    let filePath = homework.submission_file_path;
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File is too large (max 50 MB).");
        setBusy(false);
        return;
      }
      const safeName = file.name.replace(/[^\w.\-]+/g, "_");
      filePath = `${userId}/${homework.id}/${Date.now()}-${safeName}`;
      const { error: uploadError } = await supabase.storage
        .from("homework")
        .upload(filePath, file);
      if (uploadError) {
        setError(`Upload failed: ${uploadError.message}`);
        setBusy(false);
        return;
      }
    }

    const { error: updateError } = await supabase
      .from("homework")
      .update({
        submission_text: text.trim() || null,
        submission_file_path: filePath,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", homework.id);

    if (updateError) {
      setError(`Could not submit: ${updateError.message}`);
      setBusy(false);
      return;
    }
    router.refresh();
  }

  return (
    <div className="border border-brown/20 bg-surface/50 p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display flex items-center gap-2.5 text-xl font-light text-foreground">
          {homework.title}
          {canSubmit && (
            <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] leading-none tracking-[0.1em] text-background uppercase">
              {homework.status === "returned" ? "Revise & resubmit" : "Not submitted"}
            </span>
          )}
        </h3>
        <span className={`text-sm ${overdue ? "text-burgundy" : "text-muted"}`}>
          {homework.due_date ? `Due ${formatDate(homework.due_date)}` : "No due date"}
          {overdue && " · overdue"}
        </span>
      </div>

      {homework.instructions && (
        <p className="mt-2 text-sm whitespace-pre-wrap text-muted">{homework.instructions}</p>
      )}

      {assignmentFileUrl && (
        <a
          href={assignmentFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={homework.attachment_name ?? undefined}
          className="link-underline mt-3 inline-flex items-center gap-2 text-xs tracking-[0.15em] text-burgundy uppercase"
        >
          <span aria-hidden>📎</span>
          {homework.attachment_name ?? "Attached file"}
        </a>
      )}

      {homework.status === "returned" && homework.feedback && (
        <div className="mt-4 border-l-2 border-burgundy bg-background p-4">
          <p className="text-xs tracking-[0.2em] text-burgundy uppercase">Feedback from Arun</p>
          <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">{homework.feedback}</p>
          <p className="mt-2 text-xs text-muted">
            Revise your work below and submit it again when you&apos;re ready.
          </p>
        </div>
      )}

      {homework.status === "completed" && (
        <div className="mt-4 border-l-2 border-gold bg-background p-4">
          <p className="text-xs tracking-[0.2em] text-gold-muted uppercase">Completed</p>
          {homework.feedback && (
            <p className="mt-1 text-sm whitespace-pre-wrap text-foreground">{homework.feedback}</p>
          )}
        </div>
      )}

      {(homework.submission_text || fileUrl) && homework.status !== "assigned" && (
        <div className="mt-4 border border-brown/15 bg-background p-4">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">
            Your submission {homework.submitted_at && `· ${formatDate(homework.submitted_at)}`}
          </p>
          {homework.submission_text && (
            <p className="mt-2 text-sm whitespace-pre-wrap text-foreground">
              {homework.submission_text}
            </p>
          )}
          {fileUrl && (
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-2 inline-block text-xs tracking-[0.2em] text-burgundy uppercase"
            >
              Your attached file
            </a>
          )}
        </div>
      )}

      {canSubmit && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Write your homework here…"
            className="w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-4">
            <label className="cursor-pointer text-xs tracking-[0.15em] text-muted uppercase">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                className="hidden"
              />
              <span className="border border-brown/30 px-4 py-2 transition-colors hover:border-burgundy hover:text-burgundy">
                {file ? file.name : "Attach a file (optional)"}
              </span>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="border border-burgundy/50 px-6 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
            >
              {busy
                ? "Submitting…"
                : homework.status === "returned"
                  ? "Resubmit homework"
                  : "Submit homework"}
            </button>
          </div>
          {error && <p className="text-sm text-burgundy">{error}</p>}
        </form>
      )}

      {homework.status === "submitted" && (
        <p className="mt-3 text-xs tracking-[0.15em] text-muted uppercase">
          Submitted — Arun will review it soon.
        </p>
      )}
    </div>
  );
}
