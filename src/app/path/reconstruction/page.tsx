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
  title: "Phase III: Reconstruction — Remane",
  description: "Body, style, and social presence — refined. The third phase of the Remane path.",
};

const movements: Movement[] = [
  {
    weeks: "Module 1 · Baseline",
    title: "The audit and the blueprint",
    description:
      "An honest inventory across the eight fronts of the outer rebuild — body, face, grooming, style, presence, environment, social life, and purpose. Not just scores: the blockage behind each one, named. Then the plan — the highest-leverage fronts first, and a six-month vision of the man in the mirror.",
    themes: ["The eight fronts", "Blockages, named", "The blueprint"],
  },
  {
    weeks: "Modules 2–3 · Body",
    title: "Fuel, sleep, and training",
    description:
      "The foundations of energy first — real food, real hydration, and sleep rebuilt as the master lever for mood and a face that looks alive. Then training matched to your actual level, logged and accountable, with visible progress and daily proof that you keep your word to yourself.",
    themes: ["Fuel & sleep", "Training, at your level", "Kept promises"],
  },
  {
    weeks: "Modules 4–6 · Image",
    title: "Grooming, the face, and style",
    description:
      "The daily standard of a man who takes care of himself — then the face itself, improved through the levers you genuinely control, health-based and kept firmly non-obsessive. Finally a style defined in your own words, a ruthless wardrobe audit, and outfits built for every context of your life.",
    themes: ["Grooming, deliberate", "The face — state, not trait", "A style that's yours"],
  },
  {
    weeks: "Module 7 · Presence",
    title: "How you carry yourself",
    description:
      "The frame that wears all of it. Posture rebuilt from the grief-hunch to standing tall, entering rooms deliberately, steady eye contact and an unhurried voice — until face, grooming, clothes and manner read as one coherent thing: a man who has himself together.",
    themes: ["Posture", "Voice & eye contact", "One coherent read"],
  },
  {
    weeks: "Modules 8–9 · Systems",
    title: "The home and the week, engineered",
    description:
      "A home reclaimed as yours rather than a reminder of loss — then engineered so good habits are the easy path and the numbing ones have to fight for access. Keystone habits installed as identity, and a weekly plan that fills the dangerous empty hours on purpose.",
    themes: ["The one-room reset", "Friction engineering", "Keystone habits & the weekly plan"],
  },
  {
    weeks: "Modules 10–11 · Social",
    title: "The feed, and the circle",
    description:
      "The digital life reset — every tie that keeps the wound open, cut; the footprint brought up to date; the scroll put on your terms. Then the real thing: dormant friendships revived, new circles built through your interests, and the conversational ease of married years deliberately restored.",
    themes: ["The feed, cleaned", "Old friends, revived", "New circles"],
  },
  {
    weeks: "Module 12 · Purpose",
    title: "Direction, and the bridge",
    description:
      "A new answer to what it's all for — direction that is yours alone, written as the charter for the next chapter. Then the honest before-and-after against the Module 1 audit, and the readiness gate for re-entering the world of connection: from abundance, never from need.",
    themes: ["The next-chapter charter", "Before & after", "The readiness gate"],
  },
];

const outcomes = [
  "A food, sleep and training foundation measured in months — and a body and face that show it.",
  "Grooming, style and presence that match the man you are becoming.",
  "A home and weekly structure engineered to carry you on the days motivation doesn't.",
  "A social world rebuilt — the feed cleaned, old friendships back, new circles opening.",
  "A written direction for the next chapter, and an honest readiness check for re-entry.",
];

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

        <div className="mt-12">
          <PhasePosition current={2} />
        </div>

        <p className="mt-14 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase III</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Reconstruction</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Body, style, and social presence — refined.
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
          <p>
            Once a man is stable, the question becomes: who is he becoming?
            If Recovery was about feeling, Reconstruction is about doing —
            rebuilding the outer man so that when he looks in the mirror and
            walks into a room, he respects who he sees. Action creates
            confidence; confidence creates more action.
          </p>
          <p>
            Twelve modules across eight fronts — body, face, grooming, style,
            presence, environment, social life, and purpose — taken at one of
            two paces: the twelve-week standard, or the twenty-four-week
            intensive that gives each module a full fortnight. One session and
            one piece of fieldwork each week. This page is the map, not the
            course.
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
            href="/path/reforge"
            className="text-xs tracking-[0.2em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            ← Phase II: Reforge
          </Link>
          <Link
            href="/path/re-entry"
            className="text-xs tracking-[0.2em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            Phase IV: Re-entry →
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
