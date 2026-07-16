import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import {
  PhasePosition,
  MovementTimeline,
  Outcomes,
  type Movement,
} from "@/components/PhaseOverview";

export const metadata = {
  title: "Phase II: Reforge — Remane",
  description:
    "The mind and character to meet the world. The second phase of the Remane path — forging the inner man before rebuilding the outer life.",
};

const movements: Movement[] = [
  {
    weeks: "Modules 1–2 · Foundation",
    title: "The malleable self, and the audit",
    description:
      "Who you are is not a thing to discover but a thing to author. First the premise — the self-image as the master program every result runs from, and the fact that it is re-writable. Then an honest audit of the operating system you're currently running: what you project versus what you are, and the beliefs quietly making your decisions for you.",
    themes: ["Authored, not discovered", "The self-image", "The operating-system audit"],
  },
  {
    weeks: "Modules 3–4 · Belief",
    title: "The belief engine, and clearing the limits",
    description:
      "How a man actually builds a new identity — choosing the belief before the evidence, then acting until the evidence arrives — and the most durable form of it: conviction he has chosen rather than borrowed from results. Then the ground is cleared: 'I can't' is deleted, and the limiting beliefs still running underneath are hunted down and replaced.",
    themes: ["Choose before the evidence", "Chosen conviction", "Eradicating the limits"],
  },
  {
    weeks: "Modules 5–6 · The Code",
    title: "Values, standards, and the hierarchy",
    description:
      "What you actually value — elicited honestly, then filtered for good values over bad. Turned into standards: the non-negotiable lines a man holds in every domain, because surviving is losing and 'okay' is a steppingstone, not a destination. Then ordered into an intentional hierarchy that pre-decides the conflicts before pressure ever arrives.",
    themes: ["Your real values", "Standards for everything", "The intentional hierarchy"],
  },
  {
    weeks: "Modules 7–10 · Mentality",
    title: "The mentalities, installed",
    description:
      "The four inner defaults the rest of life runs on: an abundance mentality in place of scarcity, and the outcome indifference under it; a winning mentality that can hold its posture while it bleeds; radical self-belief built on layers the world cannot take away; and self-permission — the authority to act and take up space, grounded in self-trust rather than approval.",
    themes: ["Abundance", "The winning mentality", "Self-belief & self-permission"],
  },
  {
    weeks: "Module 11 · Character",
    title: "The man you're forging",
    description:
      "Character is the foundation everything else rests on. Courage as the master skill — the willingness to move toward the difficulty rather than around it — and the outward virtues that make a man more than merely hard: genuine warmth, integrity, and a word that holds, to others and first to himself.",
    themes: ["Courage, the master skill", "Warmth & integrity", "Your word"],
  },
  {
    weeks: "Module 12 · Direction",
    title: "Chief aim, and the Code",
    description:
      "Identity built from the future backwards — identifying with the man you're becoming rather than your current limitations — turned into a definite chief aim and concrete goals. The whole stage is assembled into one written Code, the constitution you'll run every stage after on, and the bridge into Reconstruction: now you rebuild the outer life on a foundation worth building on.",
    themes: ["The idea of you", "Chief aim & goals", "The Code"],
  },
];

const outcomes = [
  "A self-image chosen on purpose, and the skill of authoring identity rather than waiting to discover it.",
  "Limiting beliefs found and replaced — and conviction that no longer depends on the world's cooperation.",
  "A written Code: your values, standards, and the hierarchy that pre-decides the hard calls.",
  "The mentalities of an abundant, winning man — and the self-belief and self-permission underneath them.",
  "Character you can stand on, a definite chief aim, and the foundation the whole outer rebuild is built upon.",
];

export default function ReforgePage() {
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

        <div className="mt-12">
          <PhasePosition current={1} />
        </div>

        <p className="mt-14 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase II</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Reforge</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          The mind and character to meet the world.
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
          <p>
            Recovery gives a man back to himself. Reforge is where he decides
            what to make of that self. Before the body, the style and the social
            life are rebuilt, the operating system underneath them is —
            the self-concept, the beliefs, the values, the standards, the
            mentalities and the character a man will run everything else on.
            Rebuild the outside on a broken inside and you get a better-looking
            version of the same collapse.
          </p>
          <p>
            Twelve modules of inner work — from authoring a new self-image and
            eradicating limiting beliefs, through values, standards and the
            winning and abundance mentalities, to self-belief, self-permission,
            character and a definite chief aim — taken at one of two paces: the
            twelve-week standard, or the twenty-four-week intensive that gives
            each module a full fortnight. Every module adds a page to one written
            Code, finished at the end and carried into every stage after. This
            page is the map, not the course.
          </p>
        </div>

        <div className="mt-14">
          <MovementTimeline movements={movements} />
        </div>

        <div className="mt-16 border-t border-gold/30 pt-12">
          <Outcomes items={outcomes} />
        </div>

        <div className="mt-14 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/path/recovery"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            ← Phase I: Recovery
          </Link>
          <Link
            href="/path/reconstruction"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Phase III: Reconstruction →
          </Link>
          <Link
            href="/enquire"
            className="inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5"
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
