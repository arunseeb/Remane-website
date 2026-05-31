import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Phase I: Recovery — Remane",
  description: "Emotional steadiness and a clear mind. The first phase of the Remane path.",
};

export default function RecoveryPage() {
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

        <p className="mt-12 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase I</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Recovery</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Emotional steadiness and a clear mind.
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
          <p>
            Every man arrives at this work from a different place. A marriage
            that ended. A loss that left him unrecognisable to himself. A
            creeping numbness that took years to notice. Whatever brought you
            here, Phase I begins with one thing: getting stable.
          </p>
          <p>
            Recovery is not therapy. It is not a process of excavating the
            past indefinitely. It is the deliberate work of returning to
            yourself — sleeping well, thinking clearly, and feeling something
            other than survival.
          </p>
          <p>
            In this phase we address the practical and emotional architecture
            of daily life. Sleep. Nutrition. Movement. The thoughts that loop
            at 2am. The habits that numb rather than restore. We do not rush
            through this. A man who has not recovered has nothing solid to
            build on.
          </p>
          <p>
            Most men are surprised by how quickly things shift when they have
            the right guidance and a clear framework. Steadiness comes sooner
            than expected. The work that follows becomes possible.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/path/reconstruction"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Phase II: Reconstruction →
          </Link>
          <Link
            href="/#enquire"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            Enquire
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
