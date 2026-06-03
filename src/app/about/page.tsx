import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "About Arun — Remane",
  description: "The story behind Remane and the man who built it.",
};

export default function AboutPage() {
  return (
    <>
      <Header hideDesktopNav />
      <main className="min-h-screen bg-background">

        {/* Back link */}
        <div className="mx-auto max-w-6xl px-6 pt-44 md:px-10">
          <Link
            href="/"
            className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
          >
            ← Remane
          </Link>
        </div>

        {/* Hero — photo + name */}
        <section className="mx-auto mt-12 max-w-6xl px-6 md:px-10">
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:items-start">

            {/* Photo */}
            <div className="grain vintage-image relative aspect-[3/4] w-full overflow-hidden bg-[#1a1612]">
              <Image
                src="/about/arun.png"
                alt="Arun Seeborun"
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center py-4 md:py-12">
              <p className="text-xs tracking-[0.2em] text-muted uppercase">Founder</p>
              <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
                Arun Seeborun
              </h1>

              <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted">
                <p>
                  I didn&apos;t start this work because I was divorced.
                </p>
                <p>
                  I started it because I know what it feels like when a relationship
                  ends and takes a piece of your identity with it.
                </p>
                <p>
                  I found myself facing the same questions many men eventually face.
                  Who am I without this relationship? How do I stop replaying the
                  past? How do I trust again? How do I move forward when part of me
                  doesn&apos;t want to let go?
                </p>
                <p>
                  What began as a search for answers became an obsession with
                  understanding people, relationships, attraction, emotional recovery,
                  and what it truly means to rebuild your life after loss. I studied
                  psychology, mindset, personal development, dating, social dynamics,
                  masculinity, and emotional resilience. More importantly, I applied
                  those lessons to my own life.
                </p>
                <p>
                  I rebuilt my confidence. My body. My purpose. My social life.
                </p>
                <p>
                  And I learned that recovery isn&apos;t about becoming the person you
                  were before. It&apos;s about becoming someone stronger than you ever were.
                </p>
              </div>

              <blockquote className="mt-10 border-l border-burgundy/70 pl-6">
                <p className="font-display text-xl text-foreground leading-snug">
                  &ldquo;The end of a relationship doesn&apos;t have to be the end of
                  your story. Sometimes it&apos;s where your real story begins.&rdquo;
                </p>
              </blockquote>

              <div className="mt-10 h-px w-12 bg-brown/20" />

              <div className="mt-10 space-y-5 text-sm leading-relaxed text-muted">
                <p>
                  Today, I help men navigate that same transformation. Not by offering
                  quick fixes, empty motivation, or manipulative dating tactics. But by
                  helping them recover from the past, rebuild themselves, re-enter the
                  dating world with confidence, and ultimately learn how to create
                  healthy, fulfilling relationships.
                </p>
                <p className="font-display text-lg text-foreground">
                  My mission is simple.
                </p>
                <p>
                  To help men turn one of the worst chapters of their lives into the
                  beginning of something better.
                </p>
              </div>

              <div className="mt-12 pb-28">
                <Link
                  href="/enquire"
                  className="inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5"
                >
                  Request a conversation
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
