import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FAQAccordion } from "@/components/FAQAccordion";

export const metadata = {
  title: "FAQ — Remane",
  description: "Frequently asked questions about the Remane programme.",
};

const SECTIONS = [
  {
    heading: "About the Programme",
    items: [
      {
        q: "Who is this for?",
        a: "This is for men who are recently divorced, currently going through divorce, or still carrying the emotional damage of a serious separation from the last few years.\n\nIt is for men who feel lost, hurt, wounded, angry, rejected, or unsure who they are anymore — but who are still willing to take responsibility for rebuilding their life.",
      },
      {
        q: "Who is this not for?",
        a: "This is not for men who only want to feel sorry for themselves.\n\nIt is not for men who refuse to listen, refuse to act, or only want someone to validate their pain without challenging them.\n\nThis is not an echo chamber. This is a place to rebuild.",
      },
      {
        q: "What is the goal of the programme?",
        a: "The goal is to make your divorce the best thing that ever happened to you.\n\nNot because the pain was good. Not because what happened was fair. But because the man who comes out the other side becomes stronger, sharper, healthier, more grounded, and capable of a much better life than before.",
      },
      {
        q: "Is the goal to get my ex back?",
        a: "No.\n\nThe goal is to become a better man who can have another woman, but does not need one.\n\nIf you choose to love again, the aim is for you to attract better, choose better, and love better — until the old relationship becomes small compared to the man and life you have built.",
      },
      {
        q: "What makes this different?",
        a: "This is not passive. This is not vague motivation. This is not sitting around talking forever without change.\n\nThe programme is procedural, practical, and direct. We identify where you are, where you need to go, and what must be done next.\n\nEverything is built around tangible movement.",
      },
      {
        q: "Is this therapy?",
        a: "No.\n\nThis can work alongside therapy, but it is not therapy.\n\nTherapy often focuses on understanding and managing your emotions. This programme focuses on operational reconstruction: what you do, how you think, how you live, how you train, how you dress, how you date, how you love, and how you rebuild your identity.\n\nIt is closer to an intensive reinvention bootcamp.",
      },
      {
        q: "Is this just dating coaching?",
        a: "No.\n\nWomen are not the focus. Dating is only one part of the process. It helps test your confidence, emotional vulnerability, standards, self-worth, and ability to move forward.\n\nThe real focus is the internal war: accepting reality, rebuilding yourself, raising your standards, and becoming the kind of man who is no longer defined by the woman who left.",
      },
    ],
  },
  {
    heading: "How It Works",
    items: [
      {
        q: "How does the programme work?",
        a: "We begin with an interview and assessment.\n\nFrom there, we determine which of the four sections you actually need: Recovery, Reconstruction, Re-entry, and Relationship Mastery.\n\nThere is no point teaching you what you already know. The process is personalised around your actual situation.\n\nYou will have a Zoom session every week. In that session, we review your current situation, identify what needs to change, and set specific tasks for the week ahead.\n\nBetween sessions, you receive daily accountability through WhatsApp, with support, insight, and direction when you get stuck.",
      },
      {
        q: "What does a typical week look like?",
        a: "A typical week includes:\n\n• One deep coaching call\n• Personalised feedback\n• 3–5 clear tasks\n• Homework based on your exact issues\n• Relevant material to read or study\n• Daily accountability\n• Additional guidance if your situation changes\n\nIf something major happens and the plan needs to be reworked, an extra call may be scheduled.",
      },
      {
        q: "How long does the programme take?",
        a: "Each section is designed to take around 12 weeks minimum, but the timeline varies depending on the client.\n\nYou do not move on because a calendar says so. You move on when you have reached a functional level of progress.\n\nThe aim is not perfection. Perfection creates delay. We move when you are around 80% ready, because momentum matters.",
      },
      {
        q: "What does reinvention mean?",
        a: "Reinvention means changing your identity, habits, beliefs, priorities, mindset, emotional state, use of time, and external signals until you become a different man.\n\nThis version of you may always be heartbroken.\n\nSo we build a new man strong enough to carry that pain — and eventually grow so much that the pain becomes small compared to the life he has created.",
      },
    ],
  },
  {
    heading: "Readiness & Mindset",
    items: [
      {
        q: "Will this fix me?",
        a: "No.\n\nYou are not broken in a way that makes you worthless.\n\nBut you may be wounded, misaligned, undisciplined, emotionally overwhelmed, or operating from pain.\n\nThis programme does not promise that you will never hurt again. Some pain may stay with you for a long time. The aim is to build a man strong enough to carry it without being controlled by it.",
      },
      {
        q: "What if I am not ready to date?",
        a: "Then you will not be pushed to date.\n\nDating too early can cause self-sabotage and reinforce the belief that your ex was irreplaceable.\n\nThe process meets you where you are. Recovery comes before re-entry.",
      },
      {
        q: "What if I still love my ex?",
        a: "You probably will for a long time.\n\nWaiting until you stop loving her before you start healing may delay your life for years.\n\nYou do not need to stop loving someone before you begin rebuilding yourself.",
      },
      {
        q: "What if my confidence is completely gone?",
        a: "Then we build it from the ground up.\n\nConfidence is not permanently lost. It is rebuilt through action, evidence, discipline, exposure, and identity change.",
      },
      {
        q: "What if I have been out of the dating market for years?",
        a: "That is fine.\n\nIn many ways, it makes you more coachable. You will be taken through modern dating step by step, without pretending you should already know how everything works.",
      },
      {
        q: "Am I too old for this?",
        a: "No.\n\nYou are not too old for self-improvement, love, discipline, confidence, health, or reinvention.\n\nPeople find love late in life and never regret it. The only real question is what kind of life you believe you still deserve.",
      },
      {
        q: "What if I do not have time?",
        a: "The core commitment is one Zoom call each week, plus the daily work required to change your life.\n\nIf you do not have time to work on the biggest pain in your life, the issue is not time. It is priority.",
      },
      {
        q: "What if I fail?",
        a: "You will fail at points.\n\nThere will be regression, rejection, longing, anger, and difficult days.\n\nThat is part of the process. Reinvention is not clean. If it were easy, you would not need support.",
      },
    ],
  },
  {
    heading: "Practical",
    items: [
      {
        q: "Can I cancel anytime?",
        a: "Yes.\n\nThere is no contract forcing you to stay. At the end of every section, you will have the option to leave if you feel you have received what you need.\n\nThat said, it is strongly advised to commit for at least 12 weeks if you want to see real change.",
      },
      {
        q: "Do you offer refunds?",
        a: "Refunds are not offered for services already provided.\n\nYou are paying for time, attention, coaching, accountability, planning, and personalised support that has already been delivered.",
      },
      {
        q: "Why does it cost £1,000 per month?",
        a: "Because this is not just one service.\n\nIt combines coaching, mentoring, accountability, lifestyle reconstruction, dating guidance, mindset work, personal development, health direction, style guidance, and emotional support.\n\nFor the level of personal involvement provided, £1,000 per month is on the low end.\n\nThe intention is to provide so much value that the client feels like they are getting far more than they paid for.",
      },
      {
        q: "Why should I trust you?",
        a: "Because this work is personal.\n\nI built these systems after being broken by the woman I loved leaving me after my mother died. I had to create a way to survive, rebuild, and become someone stronger.\n\nI do not lead with fast cars, fake status, or empty promises about women.\n\nThis is about becoming the man you should have been before the pain — and then going beyond him.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Header hideDesktopNav />
      <main className="min-h-screen bg-background px-6 pt-44 pb-24 md:px-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
          >
            ← Remane
          </Link>

          <h1 className="mt-12 font-display text-4xl text-foreground md:text-5xl">
            Frequently Asked Questions
          </h1>

          <FAQAccordion sections={SECTIONS} />

          <div className="mt-20 border-t border-brown/10 pt-12">
            <p className="text-sm text-muted">Still have a question?</p>
            <Link
              href="/enquire"
              className="mt-6 inline-block border border-burgundy/50 px-7 py-3 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5"
            >
              Request a conversation
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

