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
  title: "Phase III: Re-entry — Remane",
  description: "Connection and discernment, on your terms. The third phase of the Remane path.",
};

const movements: Movement[] = [
  {
    weeks: "Weeks 1–2",
    title: "Readiness and standards",
    description:
      "The gate everything else depends on. Are you dating to add to a good life, or to fix a painful one? Only the first is ready. Then clarity on what you actually want this time, the standards you won't drift below out of loneliness — and the quieter work of genuinely liking women as people, neither guarded nor worshipful.",
    themes: ["The readiness gate", "What you want", "Liking women as people"],
  },
  {
    weeks: "Weeks 3–4",
    title: "The landscape, and who you're looking for",
    description:
      "For a man who last dated fifteen or twenty years ago, the terrain has changed entirely. We separate fact from fear — then get radical clarity on your ideal partner: traits written down, boundaries set in three tiers, and a direct briefing on the apps, channels and communities that actually fit your age and goals.",
    themes: ["Fact versus fear", "Your ideal partner", "The channel briefing"],
  },
  {
    weeks: "Weeks 5–6",
    title: "How you show up online",
    description:
      "Photos that honestly show the rebuilt man at his best, a bio with warmth and personality, and texting held lightly — logistics toward an actual meeting, not a pen-pal spiral.",
    themes: ["Photos", "The bio", "Texting, held lightly"],
  },
  {
    weeks: "Weeks 7–8",
    title: "How you show up in person",
    description:
      "Presence applied to connection. Starting natural conversations, genuine curiosity and warmth, playfulness rediscovered — and interest expressed cleanly rather than hidden in ambiguity. No scripts, no tactics: the signature practice here is real openness in conversation, not performance.",
    themes: ["Presence", "Conversation", "Openness, practised"],
  },
  {
    weeks: "Weeks 9–10",
    title: "Dates and intimacy",
    description:
      "Planning and leading an enjoyable first date without treating it as an audition. Then the loaded territory of intimacy again — pacing, attunement, and respect, with the nerves of a long marriage's aftermath named and normalised.",
    themes: ["The first date", "Gentle leading", "Attunement & respect"],
  },
  {
    weeks: "Weeks 11–12",
    title: "Resilience, and yourself made whole",
    description:
      "Rejection made survivable — impersonal, informative, and no longer a verdict on your worth. Then the closing work few programmes touch: accepting your own sexuality as an ordinary, good part of being human — without shame and without overcorrection — before the bridge into Mastery.",
    themes: ["The rejection reframe", "Sexuality, owned", "The bridge to Mastery"],
  },
];

const outcomes = [
  "Certainty that you are dating from a full life, not a void.",
  "Written clarity on who you're looking for — and a mapped route to finding her.",
  "A presence — online and in person — that honestly shows who you've become.",
  "A settled relationship with rejection, and peace with your own sexuality.",
  "The self-awareness to catch an old pattern before it chooses for you.",
];

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

        <div className="mt-12">
          <PhasePosition current={2} />
        </div>

        <p className="mt-14 text-xs tracking-[0.2em] text-gold-muted uppercase">Phase III</p>
        <h1 className="mt-2 font-display text-5xl text-foreground md:text-6xl">Re-entry</h1>
        <div className="mt-3 h-px w-10 bg-gold" />

        <p className="mt-10 font-display text-2xl leading-snug text-foreground md:text-3xl">
          Connection and discernment, on your terms.
        </p>

        <div className="mt-8 space-y-6 text-base leading-relaxed text-muted">
          <p>
            After recovery and reconstruction comes the world — new
            connections, and the possibility of intimacy again. This is not
            dating coaching in the conventional sense. There are no scripts
            or tactics. The work is re-entering romantic life from
            groundedness rather than need, because a man who dates from
            strength gets to choose well.
          </p>
          <p>
            Twelve weeks, one session and one real-world rep each week. This
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
