import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Testimonials — Remane",
  description: "Words from men who have walked the path.",
};

const TESTIMONIALS = [
  {
    quote:
      "Three months in I barely recognised myself — my health, my sleep, the way I was thinking. I came in pretty broken. The guidance was honest, sometimes uncomfortable. It was exactly what I needed.",
    name: "Private client",
    detail: "Recovery & Reconstruction",
  },
  {
    quote:
      "Discretion was everything for me. I didn't want someone who would use my story as a case study. Nothing left the sessions. That trust made all the difference.",
    name: "Private client",
    detail: "Re-entry & Relationship Mastery",
  },
  {
    quote:
      "I came in sceptical. Tried therapy, read the books, worked through the podcasts. This was different — no motivation speeches, no vague advice. Just clear tasks and someone who wouldn't let me off the hook.",
    name: "Private client",
    detail: "Full engagement",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Header hideDesktopNav />
      <main>
    <div className="min-h-screen bg-background px-6 pt-44 pb-24 md:px-10">
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
            href="/enquire"
            className="text-xs tracking-[0.25em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Request a private conversation →
          </Link>
        </div>
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
}

