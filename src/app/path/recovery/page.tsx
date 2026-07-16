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
  title: "Phase I: Recovery — Remane",
  description: "Emotional steadiness and a clear mind. The first phase of the Remane path.",
};

const movements: Movement[] = [
  {
    weeks: "Weeks 1–3 · Excavate",
    title: "Name what happened",
    description:
      "The work begins by arriving honestly. We map the full scope of the loss — not just the marriage, but everything that went with it — and recover the man who existed before it. Nothing is rushed, and nothing is performed.",
    themes: ["The arrival", "Grief, mapped", "The man before the marriage"],
  },
  {
    weeks: "Weeks 4–6 · Recalibrate",
    title: "Reset the compass",
    description:
      "With the ground cleared, we re-examine what you actually believe. Your own values, separated from everyone else's. Boundaries drawn and held. The inner critic named, and quietly removed from the driver's seat.",
    themes: ["Core values", "Boundaries", "The inner critic"],
  },
  {
    weeks: "Weeks 7–9 · Rebuild",
    title: "Decide who you are becoming",
    description:
      "This is where the energy shifts from heavy to generative. Not recovering the old life — building a new identity that is actually yours, a vision worth orienting toward, and the daily self-leadership to move on it.",
    themes: ["New identity", "The north star", "Leading yourself"],
  },
  {
    weeks: "Weeks 10–12 · Launch",
    title: "Say it out loud",
    description:
      "Commitment made real. You declare the next chapter to someone who matters, build the ninety-day bridge into it, and close this phase as a man who is measurably not the same one who began it.",
    themes: ["The commitment", "The 90-day bridge", "The arrival"],
  },
];

const outcomes = [
  "A steady baseline — sleep, energy, and a mind no longer running on survival.",
  "The full story of what happened, named plainly and no longer in charge.",
  "Your values and boundaries, defined and practised in real situations.",
  "A clear statement of who you are becoming, and a ninety-day plan to begin.",
];

export default function RecoveryPage() {
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
          <PhasePosition current={0} />
        </div>

        <p className="mt-14 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase I</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Recovery</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Emotional steadiness and a clear mind.
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
          <p>
            Every man arrives at this work from a different place — a marriage
            that ended, a loss that left him unrecognisable to himself.
            Whatever brought you here, Phase I begins with one thing: getting
            stable. Not excavating the past indefinitely, but deliberately
            returning to yourself.
          </p>
          <p>
            Twelve weeks, one session each week, one piece of fieldwork
            between them. The phase moves through four movements — this page
            is the map, not the course.
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
            href="/path/reforge"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Phase II: Reforge →
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
