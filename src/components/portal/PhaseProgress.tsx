import { PHASE_LABELS, PHASE_NUMERALS, phaseProgress, type ClientPhase } from "@/lib/portal";

export function PhaseProgress({
  phase,
  compact = false,
}: {
  phase: ClientPhase;
  compact?: boolean;
}) {
  // Falls back to 12 if the database predates the total_weeks column
  const totalWeeks = phase.total_weeks ?? 12;
  const percent = phaseProgress(phase.week, totalWeeks);
  const finished = phase.week > totalWeeks;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <p className={compact ? "text-sm text-foreground" : "font-display text-xl font-light text-foreground"}>
          {!compact && (
            <span className="mr-1.5 text-gold/60">{PHASE_NUMERALS[phase.phase]}</span>
          )}
          {compact && <span className="text-gold-muted">{PHASE_NUMERALS[phase.phase]}· </span>}
          {PHASE_LABELS[phase.phase]}
        </p>
        <p className="shrink-0 text-xs tracking-[0.15em] text-muted uppercase">
          {finished ? "Complete" : `Week ${phase.week} of ${totalWeeks}`}
        </p>
      </div>

      <div
        className="mt-2 h-1.5 w-full overflow-hidden bg-brown/15"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${PHASE_LABELS[phase.phase]} progress`}
      >
        <div
          className="h-full bg-burgundy transition-[width] duration-700 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-1.5 text-xs text-muted">{percent}% through this stage</p>
    </div>
  );
}
