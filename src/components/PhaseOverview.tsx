import Link from "next/link";
import { Fragment } from "react";

const phases = [
  { numeral: "I", name: "Recovery", href: "/path/recovery" },
  { numeral: "II", name: "Reconstruction", href: "/path/reconstruction" },
  { numeral: "III", name: "Re-entry", href: "/path/re-entry" },
  { numeral: "IV", name: "Mastery", href: "/path/relationship-mastery" },
];

export function PhasePosition({ current }: { current: number }) {
  return (
    <div className="flex items-start">
      {phases.map((phase, i) => (
        <Fragment key={phase.href}>
          {i > 0 && <span className="mx-3 mt-3 h-px flex-1 bg-gold/30 sm:mx-4" />}
          <Link
            href={phase.href}
            aria-current={i === current ? "page" : undefined}
            className={
              i === current
                ? "text-burgundy"
                : "text-muted/50 transition-colors hover:text-muted"
            }
          >
            <span className="block text-center font-display text-xl leading-none">
              {phase.numeral}
            </span>
            <span className="mt-1.5 hidden text-[10px] tracking-[0.15em] uppercase sm:block">
              {phase.name}
            </span>
          </Link>
        </Fragment>
      ))}
    </div>
  );
}

export type Movement = {
  weeks: string;
  title: string;
  description: string;
  themes: string[];
};

export function MovementTimeline({ movements }: { movements: Movement[] }) {
  return (
    <ol className="border-l border-gold/40">
      {movements.map((movement, i) => (
        <li
          key={movement.title}
          className={`relative pl-8 ${i < movements.length - 1 ? "pb-12" : ""}`}
        >
          <span className="absolute top-1.5 -left-[5.5px] h-2.5 w-2.5 rounded-full border border-gold bg-background" />
          <p className="text-xs tracking-[0.2em] text-gold-muted uppercase">
            {movement.weeks}
          </p>
          <h3 className="mt-1 font-display text-2xl text-foreground">
            {movement.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {movement.description}
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {movement.themes.map((theme) => (
              <li
                key={theme}
                className="border border-gold/30 px-3 py-1 text-[11px] tracking-[0.1em] text-brown uppercase"
              >
                {theme}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

export function Outcomes({ items }: { items: string[] }) {
  return (
    <div>
      <p className="text-xs tracking-[0.2em] text-gold-muted uppercase">
        You leave this phase with
      </p>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-4 text-base leading-relaxed text-muted">
            <span className="mt-3 h-px w-5 shrink-0 bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
