import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Phase III: Re-entry — Remane",
  description: "Connection and discernment, on your terms. The third phase of the Remane path.",
};

export default function ReEntryPage() {
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

        <p className="mt-12 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase III</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Re-entry</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Connection and discernment, on your terms.
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
          <p>
            After recovery and reconstruction comes the world. Other people.
            New connections. The possibility of intimacy again. For many men,
            this is the most uncertain phase — not because they lack desire,
            but because they are not sure they trust themselves yet.
          </p>
          <p>
            Phase III is about re-entering social and romantic life from a
            position of groundedness rather than need. The difference is
            visible. A man who is settled within himself attracts differently,
            chooses differently, and behaves differently in the early stages
            of connection.
          </p>
          <p>
            We work on discernment — the ability to recognise quickly whether
            a person is right for you, rather than spending months rationalising
            a poor fit. We work on the early dynamics of connection: how to
            be genuinely present, how to express interest without losing
            composure, how to set the right tone from the start.
          </p>
          <p>
            This is not dating coaching in the conventional sense. There are
            no scripts or tactics. The work is deeper: becoming a man who
            meets someone as an equal, from a full life, with genuine
            curiosity.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/path/reconstruction"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            ← Phase II: Reconstruction
          </Link>
          <Link
            href="/path/relationship-mastery"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Phase IV: Relationship Mastery →
          </Link>
          <Link
            href="/enquire"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
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

