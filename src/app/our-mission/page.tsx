import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Our Philosophy — Remane",
  description: "The purpose behind Remane and what drives our private guidance.",
};

const VALUES = [
  { label: "Truth",           image: "/images/values/truth.png",           alt: "Truth" },
  { label: "Confidentiality", image: "/images/values/confidentiality.png", alt: "Confidentiality" },
  { label: "Excellence",      image: "/images/values/excellence.png",      alt: "Excellence" },
  { label: "Freedom",         image: "/images/values/freedom.png",         alt: "Freedom" },
  { label: "Brotherhood",     image: "/images/values/brotherhood.png",     alt: "Brotherhood" },
  { label: "Resilience",      image: "/images/values/resilience.png",      alt: "Resilience" },
  { label: "Compassion",      image: "/images/values/compassion.png",      alt: "Compassion" },
  { label: "Reinvention",     image: "/images/values/reinvention.png",     alt: "Reinvention" },
] as const;

export default function OurMissionPage() {
  return (
    <>
      <Header hideDesktopNav />
      <div className="bg-background px-6 pt-32 pb-32 md:px-10">

        {/* Mission statement */}
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
          >
            ← Remane
          </Link>

          <h1 className="mt-12 font-display text-5xl text-foreground md:text-6xl">
            Our Philosophy
          </h1>

          <div className="mt-3 h-px w-10 bg-gold" />

          <div className="mt-12 space-y-8 text-base leading-relaxed text-muted">
            <p>
              Remane exists for the man who refuses to let the hardest chapter of
              his life define the rest of it. We believe that rebuilding after
              loss — of a relationship, of identity, of direction — is not a
              setback. It is the beginning of something more considered.
            </p>
            <p>
              Our mission is to offer a bespoke path from recovery to mastery.
              Not a programme. Not a group. A private, one-to-one engagement with
              a man who has done the work himself and knows how to guide others
              through it with precision and discretion.
            </p>
            <p>
              We work with a small number of men at any one time. Each engagement
              is personal, unhurried, and built around what you actually need —
              not a framework designed for someone else.
            </p>
            <p>
              If this resonates, we invite you to enquire.
            </p>
          </div>

          <div className="mt-16">
            <Link
              href="/#enquire"
              className="text-xs tracking-[0.25em] text-burgundy uppercase transition-opacity hover:opacity-70"
            >
              Request a private conversation →
            </Link>
          </div>
        </div>

        {/* Our Values */}
        <div className="mx-auto mt-28 max-w-2xl">
          <h2 className="font-display text-4xl text-foreground md:text-5xl">
            Our Values
          </h2>
          <div className="mt-3 h-px w-10 bg-gold" />
          <p className="mt-6 text-sm leading-relaxed text-muted">
            The principles that guide every engagement, without exception.
          </p>

          <div className="mt-16 space-y-16">
            {VALUES.map((value, i) => (
              <div
                key={value.label}
                className={`flex flex-col md:flex-row md:items-center ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <div className="relative aspect-[4/5] w-full flex-shrink-0 overflow-hidden md:w-[55%]">
                  <Image
                    src={value.image}
                    alt={value.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                {/* Value name — floats in open space beside the image */}
                <div className="flex flex-1 items-center justify-center px-6 py-8 md:py-0 md:px-8">
                  <div>
                    <p className="text-xs tracking-[0.25em] text-gold-muted uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-3 font-display text-3xl leading-none text-foreground md:text-4xl">
                      {value.label}
                    </h3>
                    <div className="mt-4 h-px w-6 bg-gold/50" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
