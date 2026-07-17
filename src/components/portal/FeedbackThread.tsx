import { formatDate, type HomeworkReview } from "@/lib/portal";

function truncate(text: string, max: number): string {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

/**
 * The saved history of coach feedback for one piece of homework — one entry per
 * review of a submission or resubmission. Shown to both the coach and the client.
 */
export function FeedbackThread({ reviews }: { reviews: HomeworkReview[] }) {
  if (reviews.length === 0) return null;

  return (
    <div className="mt-4">
      <p className="text-xs tracking-[0.2em] text-muted uppercase">
        Feedback history ({reviews.length})
      </p>
      <div className="mt-2 space-y-3">
        {reviews.map((review) => {
          const returned = review.outcome === "returned";
          return (
            <div
              key={review.id}
              className={`border-l-2 bg-background p-4 ${
                returned ? "border-burgundy" : "border-gold"
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p
                  className={`text-xs tracking-[0.2em] uppercase ${
                    returned ? "text-burgundy" : "text-gold-muted"
                  }`}
                >
                  {returned ? "Returned for revision" : "Completed"}
                </p>
                <p className="text-xs text-muted">{formatDate(review.created_at)}</p>
              </div>
              <p className="mt-1.5 text-sm whitespace-pre-wrap text-foreground">
                {review.feedback}
              </p>
              {(review.submission_text || review.submission_file_path) && (
                <p className="mt-2 text-xs text-muted/80">
                  On the submission
                  {review.submission_text
                    ? `: “${truncate(review.submission_text, 90)}”`
                    : " (with a file)"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
