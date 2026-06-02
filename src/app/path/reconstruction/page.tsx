import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Phase II: Reconstruction — Remane",
  description: "Body, style, and social presence — refined. The second phase of the Remane path.",
};

export default function ReconstructionPage() {
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

        <p className="mt-12 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase II</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Reconstruction</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Body, style, and social presence — refined.
        </p>

        <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
          <p>
            Once a man is stable, the question becomes: who is he becoming?
            Phase II is about deliberately shaping the answer. Not performance.
            Not image management. Something more durable — a physical and
            aesthetic expression of the man he is now.
          </p>
          <p>
            We look at the body first. Not to build a gym physique for its own
            sake, but because a man who moves well and feels strong in his body
            carries himself differently in every room he enters. We build
            simple, sustainable habits that compound quickly.
          </p>
          <p>
            Then we look at how he presents. Clothing is not vanity — it is
            communication. A wardrobe rebuilt with intention sends a clear
            signal about who you are and what you value. We approach this with
            restraint and precision, not excess.
          </p>
          <p>
            Finally, we address social presence. How a man speaks, listens,
            and holds himself in conversation. The subtle things that make
            others feel at ease — or unsettled. This is learnable, and it
            changes everything downstream.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/path/recovery"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            ← Phase I: Recovery
          </Link>
          <Link
            href="/path/re-entry"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Phase III: Re-entry →
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

