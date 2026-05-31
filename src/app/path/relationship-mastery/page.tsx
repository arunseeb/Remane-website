import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Phase IV: Relationship Mastery — Remane",
  description: "Devotion, care, and love done well. The fourth phase of the Remane path.",
};

export default function RelationshipMasteryPage() {
  return (
    <>
      <Header hideDesktopNav />
    <div className="min-h-screen bg-background px-6 pt-32 pb-24 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
        >
          ← Remane
        </Link>

        <p className="mt-12 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase IV</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">
          Relationship Mastery
        </h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Devotion, care, and love done well.
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
          <p>
            Most men are not taught how to love well. They are taught to
            provide, to protect, to persist. These are not nothing. But they
            are not enough, and most men know it — often too late, and
            usually through loss.
          </p>
          <p>
            Phase IV is for the man who is in a relationship, or approaching
            one, and wants to do it properly. Not perfectly — that is not the
            aim. But with depth, consistency, and the kind of care that makes
            a partnership feel like a refuge rather than an obligation.
          </p>
          <p>
            We look at how a man shows up day to day. How he handles conflict
            — not the dramatic moments, but the small frictions that erode
            trust over time if mishandled. How he maintains his sense of self
            while being genuinely devoted to another person. How he sustains
            attraction, connection, and mutual respect across years, not just
            months.
          </p>
          <p>
            This is the phase most men want to reach quickly. The honest
            answer is that it requires everything that comes before it. A man
            who has done the recovery, the reconstruction, and the re-entry
            work arrives here with something real to offer.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/path/re-entry"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            ← Phase III: Re-entry
          </Link>
          <Link
            href="/#enquire"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
