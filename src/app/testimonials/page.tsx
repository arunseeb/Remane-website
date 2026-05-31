import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Testimonials — Remane",
  description: "Words from men who have walked the path.",
};

const TESTIMONIALS = [
  {
    quote:
      "I came to Remane in pieces. Within three months I had rebuilt my health, my confidence, and my sense of who I am. The guidance was honest, practical, and unlike anything I had experienced before.",
    name: "Private client",
    detail: "Recovery & Reconstruction",
  },
  {
    quote:
      "What I valued most was the discretion. I didn't want a coach who would share my story. Everything stayed between us, and the progress was real.",
    name: "Private client",
    detail: "Re-entry & Relationship Mastery",
  },
  {
    quote:
      "I was sceptical. I had tried therapy, books, podcasts. This was different. There was no fluff — just clear direction and genuine accountability.",
    name: "Private client",
    detail: "Full engagement",
  },
];

export default function TestimonialsPage() {
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
          Testimonials
        </h1>

        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-8 text-sm leading-relaxed text-muted">
          Names and identifying details are withheld to protect the privacy of
          every client.
        </p>

        <div className="mt-14 space-y-14">
          {TESTIMONIALS.map((t, i) => (
            <blockquote key={i} className="border-l border-gold/40 pl-6">
              <p className="font-display text-2xl leading-snug text-foreground md:text-3xl">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-5">
                <p className="text-xs tracking-[0.12em] text-burgundy uppercase">
                  {t.name}
                </p>
                <p className="mt-1 text-xs tracking-[0.1em] text-muted">
                  {t.detail}
                </p>
              </footer>
            </blockquote>
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
