import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Transformations — Remane",
  description: "Real outcomes from the Remane path.",
};

const TRANSFORMATIONS = [
  {
    phase: "I — Recovery",
    before: "Emotionally overwhelmed, unable to sleep, withdrawn from friends and work.",
    after:
      "Steady, clear-headed, and sleeping well within six weeks. Back to full capacity at work within three months.",
  },
  {
    phase: "II — Reconstruction",
    before:
      "Neglected his health and appearance after a long relationship ended. Lost sense of personal identity.",
    after:
      "Lost 14 kg, rebuilt a wardrobe that reflects who he is now, and carries himself with quiet confidence.",
  },
  {
    phase: "III — Re-entry",
    before:
      "Avoided social situations. Anxious in conversation. Unable to meet new people without self-consciousness.",
    after:
      "Comfortable in rooms full of new people. Dates with genuine interest and discernment rather than desperation.",
  },
  {
    phase: "IV — Relationship Mastery",
    before:
      "Repeated the same patterns in every relationship. Gave too much too soon. Lost himself in the process.",
    after:
      "In a grounded, reciprocal relationship. Knows how to love well without losing himself.",
  },
];

export default function TransformationsPage() {
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

        <h1 className="mt-12 font-display text-5xl text-foreground md:text-6xl">
          Transformations
        </h1>

        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-8 text-sm leading-relaxed text-muted">
          These are composites drawn from real engagements. Details have been
          changed to protect client privacy.
        </p>

        <div className="mt-14 space-y-16">
          {TRANSFORMATIONS.map((t, i) => (
            <div key={i}>
              <p className="text-xs tracking-[0.18em] text-burgundy uppercase">
                {t.phase}
              </p>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="border border-brown/15 bg-surface p-6">
                  <p className="text-xs tracking-[0.12em] text-muted uppercase mb-3">Before</p>
                  <p className="text-sm leading-relaxed text-foreground">{t.before}</p>
                </div>
                <div className="border border-gold/30 bg-surface p-6">
                  <p className="text-xs tracking-[0.12em] text-gold-muted uppercase mb-3">After</p>
                  <p className="text-sm leading-relaxed text-foreground">{t.after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Link
            href="/#enquire"
            className="text-xs tracking-[0.25em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Request a private conversation →
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
