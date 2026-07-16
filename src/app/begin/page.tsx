import type { Metadata } from "next";
import Image from "next/image";
import { FadeIn } from "@/components/FadeIn";
import { FAQAccordion } from "@/components/FAQAccordion";
import { Vsl } from "@/components/funnel/Vsl";
import { BeginForm } from "@/components/funnel/BeginForm";
import { StickyCta } from "@/components/funnel/StickyCta";

export const metadata: Metadata = {
  title: "Begin — Remane",
  description:
    "A private, structured path for men rebuilding after divorce. Watch the film, then book a private conversation.",
  // Funnel destination for shared links — deliberately kept out of search results
  robots: { index: false, follow: false },
};

// Real, permissioned client quotes only — the section stays hidden while this is empty.
const TESTIMONIALS: { quote: string; attribution: string }[] = [];

const FOR_YOU = [
  "Your marriage has ended, or is ending, and you know “giving it time” isn’t working",
  "You function at work but the rest of your life has gone quiet",
  "You’re willing to do structured, weekly work — not browse for tips",
  "You want to come out of this better than you went in, not just “over it”",
];

const NOT_FOR_YOU = [
  "You want someone to agree that she was the problem",
  "You’re looking for a quick fix, or lines to use on dating apps",
  "You’re in acute crisis — you need a clinician first, and we’ll say so",
  "You want advice, but not change",
];

const STAGES = [
  {
    numeral: "I",
    name: "Recovery",
    line: "Steady the ground. The rumination, the sleep, the anger, the story you’re telling yourself. Most men feel the ground stop moving inside the first month.",
  },
  {
    numeral: "II",
    name: "Reforge",
    line: "Forge the inner man. Self-concept, beliefs, values, standards and the mentalities to meet the world — decided deliberately, before a single outer thing is rebuilt.",
  },
  {
    numeral: "III",
    name: "Reconstruction",
    line: "Rebuild the outer life on that foundation. Body, grooming, style, presence, home and a social world — until the man in the mirror is one you respect.",
  },
  {
    numeral: "IV",
    name: "Re-entry",
    line: "The world again. Social confidence, and meeting women with discernment — knowing your ideal partner and your boundaries before you need them.",
  },
  {
    numeral: "V",
    name: "Relationship mastery",
    line: "Become capable of the relationship you actually want next — and never again outsource your worth to it.",
  },
];

const OBJECTIONS = [
  {
    q: "I should be able to handle this myself.",
    a: "Every capable man thinks this. But look at how you’ve done everything else at a high level — with structure and someone in your corner. A trainer, a mentor, a board. Rebuilding after divorce is the one thing men insist on doing alone, and it’s why it takes them years instead of months.",
  },
  {
    q: "How is this different from therapy?",
    a: "Therapy looks backwards — it processes what happened, and it has real value. This work looks forwards: who you’re building, to what standard, in what order. They’re complementary, and some clients do both.\n\nIf what you need is clinical support, Arun will tell you so directly — on the first call, before any money changes hands.",
  },
  {
    q: "£1,000 a month is a lot.",
    a: "It is, deliberately — this doesn’t work for men who are browsing. But run the other number: what a lost year costs. In your career while you run on empty. In your health. In what your children see when they look at you. In committing to the wrong woman because you were lonely rather than ready.\n\nAgainst any of those, this is the cheapest item on the list.",
  },
  {
    q: "How long before I feel different?",
    a: "Honestly: most men feel the first real shift inside the first month — the ground stops moving, sleep returns, the loop in your head quietens. The full rebuild is measured in months, not weeks. Anyone who promises faster is lying to you.",
  },
  {
    q: "Will anyone know I’m doing this?",
    a: "No. One-to-one sessions, no group calls, no community forum, nothing posted anywhere. Discretion isn’t a feature of this practice — it’s a condition of it. Nobody knows unless you tell them.",
  },
  {
    q: "Is Arun actually qualified to help me?",
    a: "Arun rebuilt from his own divorce — without a map, the long way — and turned what he learned into a written, week-by-week curriculum across five stages. This isn’t improvised advice; every week of the path has a purpose and a piece of work behind it.",
  },
  {
    q: "I’m nowhere near ready to think about dating.",
    a: "Good — that’s the correct instinct, and it’s why the path starts with Recovery, not re-entry. Dating doesn’t appear until Stage four, and only once the ground you’d be standing on is solid. Men who feel “not ready” are usually exactly the men this was built for.",
  },
  {
    q: "What happens on the call — will I be pressured?",
    a: "No script, no countdown timers, no “let me speak to my manager.” It’s a private thirty-minute conversation: where you are, what’s kept you stuck, and whether this path fits. If it fits, Arun will say so. If it doesn’t, he’ll say that too — and you’ll still leave with a clearer next step than you arrived with.",
  },
];

const BOOKING_STEPS = [
  {
    step: "01",
    title: "Two minutes of questions",
    line: "A few short answers so the conversation starts ahead of zero. They stay between you and Arun.",
  },
  {
    step: "02",
    title: "A private conversation",
    line: "Thirty minutes with Arun. Where you are, what’s kept you stuck, whether the path fits. No pitch, no pressure.",
  },
  {
    step: "03",
    title: "A clear next step",
    line: "If it’s a fit, you’ll know exactly how to begin. If it isn’t, you’ll leave with more clarity than you came with — either way, the drifting ends.",
  },
];

export default function BeginPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Brand strip — deliberately not a link; this page has one exit: the booking */}
      <div className="flex flex-col items-center gap-3 pt-12">
        <Image
          src="/brand/remane-lion-burgundy.png"
          alt="Remane"
          width={44}
          height={44}
          className="opacity-90"
        />
        <p className="text-xs tracking-[0.4em] text-muted uppercase">Remane</p>
      </div>

      {/* Hero + VSL */}
      <section id="vsl-hero" className="px-6 pt-16 pb-24 md:px-10 md:pt-20">
        <div className="mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-center text-xs tracking-[0.3em] text-burgundy uppercase">
              For men rebuilding after divorce
            </p>
            <h1 className="mt-6 text-center font-display text-4xl leading-tight text-foreground md:text-6xl">
              The papers are signed.
              <br />
              So why doesn&rsquo;t it feel over?
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-center text-base leading-relaxed text-muted">
              Because divorce isn&rsquo;t an event you get over &mdash; it&rsquo;s a demolition, and
              nobody hands you the plans for the rebuild. Watch this before you book.
            </p>
          </FadeIn>

          <FadeIn delay={0.15} className="mt-14">
            <Vsl />
          </FadeIn>

          <FadeIn delay={0.25} className="mt-12">
            <div className="flex flex-col items-center gap-4">
              <a
                href="#book"
                className="border border-burgundy bg-burgundy px-12 py-4 text-xs tracking-[0.25em] text-[#faf8f5] uppercase transition-colors duration-300 hover:bg-burgundy-hover"
              >
                Book a private conversation
              </a>
              <p className="text-xs tracking-[0.15em] text-muted/70 uppercase">
                30 minutes &middot; entirely private &middot; no obligation
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Who this is for / not for */}
      <section className="border-t border-gold/20 bg-surface px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
              This is a serious path, so let&rsquo;s be honest about fit
            </h2>
          </FadeIn>
          <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-12">
            <FadeIn delay={0.1}>
              <p className="mb-8 text-xs tracking-[0.25em] text-burgundy uppercase">
                This is for you if
              </p>
              <ul className="space-y-6">
                {FOR_YOU.map((item) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-foreground">
                    <span className="mt-0.5 text-gold" aria-hidden="true">
                      &mdash;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mb-8 text-xs tracking-[0.25em] text-muted uppercase">
                It is not for you if
              </p>
              <ul className="space-y-6">
                {NOT_FOR_YOU.map((item) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-muted">
                    <span className="mt-0.5 text-brown/40" aria-hidden="true">
                      &mdash;
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* The mechanism — five stages */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <p className="text-center text-xs tracking-[0.3em] text-burgundy uppercase">
              The method
            </p>
            <h2 className="mt-6 text-center font-display text-3xl text-foreground md:text-4xl">
              You rebuild in stages, in order, with structure
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-sm leading-relaxed text-muted">
              Not vague chats. A written week-by-week curriculum: one private session with Arun
              every week, and precise work between sessions. You will never wonder what to do next.
            </p>
          </FadeIn>
          <div className="mt-16 grid gap-px overflow-hidden border border-gold/20 bg-gold/20 md:grid-cols-2">
            {STAGES.map((stage, i) => (
              <FadeIn key={stage.name} delay={0.08 * i}>
                <div className="h-full bg-background p-10">
                  <p className="font-display text-3xl text-gold-muted">{stage.numeral}</p>
                  <h3 className="mt-4 font-display text-2xl text-foreground">{stage.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-muted">{stage.line}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Proof — renders only once real, permissioned quotes exist */}
      {TESTIMONIALS.length > 0 && (
        <section className="border-t border-gold/20 bg-surface px-6 py-24 md:px-10 md:py-32">
          <div className="mx-auto max-w-3xl">
            <FadeIn>
              <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
                In their words
              </h2>
              <p className="mt-6 text-center text-sm text-muted">
                Names withheld. Discretion is a condition of this work, not a marketing angle.
              </p>
            </FadeIn>
            <div className="mt-16 space-y-16">
              {TESTIMONIALS.map((t, i) => (
                <FadeIn key={i} delay={0.1}>
                  <blockquote className="border-l-2 border-gold/40 pl-8">
                    <p className="font-display text-xl leading-relaxed text-foreground italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <footer className="mt-5 text-xs tracking-[0.2em] text-muted uppercase">
                      {t.attribution}
                    </footer>
                  </blockquote>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Objections */}
      <section className="border-t border-gold/20 bg-surface px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-2xl">
          <FadeIn>
            <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
              What you&rsquo;re probably thinking
            </h2>
            <p className="mt-6 text-center text-sm leading-relaxed text-muted">
              You shouldn&rsquo;t have to get on a call to ask the awkward questions. Here they are,
              answered straight.
            </p>
          </FadeIn>
          <FAQAccordion sections={[{ heading: "Answered honestly", items: OBJECTIONS }]} />
        </div>
      </section>

      {/* What happens when you book */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
              What happens when you book
            </h2>
          </FadeIn>
          <div className="mt-16 grid gap-14 md:grid-cols-3 md:gap-10">
            {BOOKING_STEPS.map((item, i) => (
              <FadeIn key={item.step} delay={0.1 * i}>
                <p className="font-display text-2xl text-gold-muted">{item.step}</p>
                <h3 className="mt-4 font-display text-xl text-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.line}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Booking */}
      <section
        id="book"
        className="scroll-mt-12 border-t border-gold/20 bg-surface px-6 py-24 md:px-10 md:py-32"
      >
        <div className="mx-auto max-w-lg">
          <FadeIn>
            <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
              Book a private conversation
            </h2>
            <p className="mt-6 text-center text-sm leading-relaxed text-muted">
              You&rsquo;ve read enough. You&rsquo;ve waited enough. The one thing that hasn&rsquo;t
              happened yet is a decision.
            </p>
            <p className="mt-3 text-center text-xs tracking-[0.15em] text-muted/60 uppercase">
              An investment of &pound;1,000 / month &middot; the conversation is free
            </p>
          </FadeIn>
          <div className="mt-14">
            <BeginForm />
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="px-6 py-10">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-8 text-xs text-muted/60">
          <a href="/privacy" className="link-underline">
            Privacy
          </a>
          <a href="/terms" className="link-underline">
            Terms
          </a>
          <span>&copy; Remane</span>
        </div>
      </footer>

      <StickyCta />
    </main>
  );
}
