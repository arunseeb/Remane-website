import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  PhasePosition,
  MovementTimeline,
  Outcomes,
  type Movement,
} from "@/components/PhaseOverview";

export const metadata = {
  title: "Phase IV: Relationship Mastery — Remane",
  description: "Devotion, care, and love done well. The fourth phase of the Remane path.",
};

const movements: Movement[] = [
  {
    weeks: "Weeks 1–3",
    title: "Understanding the past",
    description:
      "An honest post-mortem of the marriage — the real dynamics beneath the surface story, without blame in either direction. Then the deeper machinery: how your attachment style shapes the way you love, and the patterns that connect every relationship you've had.",
    themes: ["The honest autopsy", "Attachment style", "Recurring patterns"],
  },
  {
    weeks: "Weeks 4–7",
    title: "The emotional skillset",
    description:
      "The skills most men were never taught. Naming and expressing what you feel instead of acting it out. Listening to understand rather than to fix. Conflict handled as repair, not victory. And vulnerability rebuilt — carefully — after a divorce made it feel dangerous.",
    themes: ["Feeling, named", "Real listening", "Repair", "Vulnerability"],
  },
  {
    weeks: "Weeks 8–9",
    title: "Standing grounded",
    description:
      "Steadiness a partner can lean on — presence and direction without dominance, warmth without self-abandonment. Boundaries and standards held calmly: the difference between walls that shut people out and lines that protect what matters.",
    themes: ["Grounded presence", "Boundaries, not walls", "Standards"],
  },
  {
    weeks: "Weeks 10–12",
    title: "Choosing and sustaining",
    description:
      "Compatibility over chemistry — because intense spark is often an old pattern calling. Then the long game: the habits that keep a relationship alive across years, and catching drift early instead of watching love erode on autopilot.",
    themes: ["Choosing well", "Sustaining love", "Graduation"],
  },
];

const outcomes = [
  "A plain understanding of why the marriage ended — and your part in it.",
  "The emotional skills most men were never taught.",
  "Conflict handled as repair, not victory.",
  "Standards held with warmth, not walls.",
  "The judgement to choose well, and the habits to sustain love for the long haul.",
];

export default function RelationshipMasteryPage() {
  return (
    <>
      <Header hideDesktopNav />
    <div className="min-h-screen bg-background px-6 pt-44 pb-24 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/#path"
          className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
        >
          ← Remane
        </Link>

        <div className="mt-12">
          <PhasePosition current={3} />
        </div>

        <p className="mt-14 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase IV</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">
          Relationship Mastery
        </h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Devotion, care, and love done well.
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
          <p>
            A man can heal, rebuild himself, and date confidently — and still
            walk straight back into the same relationship that broke him,
            just with a different face. This phase exists to prevent exactly
            that. It is for the man in a relationship, or approaching one,
            who wants to do it properly: with depth, consistency, and the
            kind of care that makes a partnership a refuge.
          </p>
          <p>
            Twelve weeks, one session and one piece of fieldwork each week.
            This page is the map, not the course.
          </p>
        </div>

        <div className="mt-14">
          <MovementTimeline movements={movements} />
        </div>

        <div className="mt-16 border-t border-gold/30 pt-12">
          <Outcomes items={outcomes} />
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/path/re-entry"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            ← Phase III: Re-entry
          </Link>
          <Link
            href="/enquire"
            className="inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
}
