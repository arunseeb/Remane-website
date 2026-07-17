"use client";

import { useState, useTransition } from "react";
import { completeHomework, deleteHomework, returnHomework } from "@/app/coach/actions";
import { formatDate, isOverdue, type Homework, type HomeworkReview } from "@/lib/portal";
import { FeedbackThread } from "@/components/portal/FeedbackThread";

const STATUS_LABELS: Record<Homework["status"], string> = {
  assigned: "Awaiting submission",
  submitted: "Submitted — needs review",
  returned: "Returned with feedback",
  completed: "Completed",
};

export function HomeworkReviewCard({
  homework,
  clientName,
  fileUrl,
  assignmentFileUrl,
  reviews = [],
}: {
  homework: Homework;
  clientName?: string;
  fileUrl: string | null;
  assignmentFileUrl?: string | null;
  reviews?: HomeworkReview[];
}) {
  const [feedback, setFeedback] = useState(homework.feedback ?? "");
  const [actionError, setActionError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const overdue = isOverdue(homework.due_date, homework.status);
  const needsReview = homework.status === "submitted";

  return (
    <div
      className={`border bg-surface/50 p-5 ${
        needsReview ? "border-burgundy/40" : "border-brown/20"
      } ${pending ? "opacity-60" : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display flex items-center gap-2.5 text-xl font-light text-foreground">
            {homework.title}
            {needsReview && (
              <span className="rounded-full bg-burgundy px-2 py-0.5 text-[10px] leading-none tracking-[0.1em] text-background uppercase">
                Needs marking
              </span>
            )}
          </h3>
          <p className="mt-0.5 text-xs tracking-[0.15em] text-muted uppercase">
            {clientName ? `${clientName} · ` : ""}
            {STATUS_LABELS[homework.status]}
            {homework.due_date && ` · due ${formatDate(homework.due_date)}`}
            {overdue && <span className="text-burgundy"> · overdue</span>}
          </p>
        </div>
        <button
          onClick={() => {
            if (window.confirm("Delete this homework?"))
              startTransition(() => deleteHomework(homework.id));
          }}
          disabled={pending}
          className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-burgundy"
        >
          Delete
        </button>
      </div>

      {homework.instructions && (
        <p className="mt-3 text-sm whitespace-pre-wrap text-muted">{homework.instructions}</p>
      )}

      {assignmentFileUrl && (
        <a
          href={assignmentFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          download={homework.attachment_name ?? undefined}
          className="link-underline mt-3 inline-flex items-center gap-2 text-xs tracking-[0.15em] text-muted uppercase"
        >
          <span aria-hidden>📎</span>
          {homework.attachment_name ?? "Attached file"}
        </a>
      )}

      {(homework.submission_text || fileUrl) && (
        <div className="mt-4 border border-brown/15 bg-background p-4">
          <p className="text-xs tracking-[0.2em] text-muted uppercase">
            Submission {homework.submitted_at && `· ${formatDate(homework.submitted_at)}`}
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
              Download attached file
            </a>
          )}
        </div>
      )}

      <FeedbackThread reviews={reviews} />

      {(needsReview || homework.status === "returned") && (
        <div className="mt-4">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
            placeholder="Feedback for the client…"
            className="w-full border border-brown/30 bg-transparent px-4 py-2.5 text-base text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
          />
          <p className="mt-2 text-xs text-muted/80">
            The two feedback options send what you write above; “Mark as complete” closes it off
            without feedback.
          </p>
          <div className="mt-2 flex flex-wrap gap-3">
            <button
              onClick={() =>
                startTransition(async () => {
                  const result = await returnHomework(homework.id, feedback);
                  setActionError(
                    result.ok ? null : `Not sent — ${result.error ?? "please try again"}.`
                  );
                })
              }
              disabled={pending || !feedback.trim()}
              title="Client revises and submits again"
              className="border border-burgundy/50 px-5 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
            >
              Send feedback &amp; ask to resubmit
            </button>
            <button
              onClick={() =>
                startTransition(async () => {
                  const result = await completeHomework(homework.id, feedback);
                  setActionError(
                    result.ok ? null : `Not sent — ${result.error ?? "please try again"}.`
                  );
                })
              }
              disabled={pending || !feedback.trim()}
              title="Completes the homework and sends your feedback — no resubmission"
              className="border border-burgundy/50 px-5 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5 disabled:opacity-50"
            >
              Send feedback, no resubmit
            </button>
            <button
              onClick={() =>
                startTransition(async () => {
                  const result = await completeHomework(homework.id);
                  setActionError(
                    result.ok ? null : `Not saved — ${result.error ?? "please try again"}.`
                  );
                })
              }
              disabled={pending}
              title="Completes the homework without sending feedback"
              className="border border-brown/30 px-5 py-2.5 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
            >
              Mark as complete
            </button>
          </div>
          {actionError && <p className="mt-2 text-xs text-burgundy">{actionError}</p>}
        </div>
      )}

      {/* Legacy fallback: feedback recorded before the history existed. */}
      {reviews.length === 0 && homework.status === "completed" && homework.feedback && (
        <p className="mt-3 text-sm text-muted">
          <span className="text-xs tracking-[0.2em] uppercase">Feedback given:</span>{" "}
          {homework.feedback}
        </p>
      )}
    </div>
  );
}
