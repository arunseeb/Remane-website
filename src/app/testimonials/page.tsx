import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Testimonials — Remane",
  description: "Words from men who have walked the path.",
};

// Real client words only, added with each man's written permission. While this
// list is empty the page explains why, rather than showing invented quotes —
// fabricated testimonials on a live site are a legal risk and a trust risk.
const TESTIMONIALS: { quote: string; name: string; detail: string }[] = [];

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

        {TESTIMONIALS.length > 0 ? (
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
        ) : (
          <div className="mt-14 border-l border-gold/40 pl-6">
            <p className="font-display text-2xl leading-snug text-foreground md:text-3xl">
              This work is private by design.
            </p>
            <p className="mt-5 text-sm leading-relaxed text-muted">
              Client words appear here only with each man&rsquo;s written
              permission, and never before. If you would like to understand what
              the work involves, the most honest way is a conversation.
            </p>
          </div>
        )}

        <div className="mt-20">
          <Link
            href="/enquire"
            className="inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5"
          >
            Request a private conversation
          </Link>
        </div>
      </div>
    </div>
      </main>
      <Footer />
    </>
  );
}

