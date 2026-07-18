"use client";

import { FormEvent, useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { FadeIn } from "@/components/FadeIn";

type FormStatus = "idle" | "submitting" | "success" | "booked" | "error";

export function Enquiry() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [calendlyReady, setCalendlyReady] = useState(false);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (e.data?.event === "calendly.event_scheduled") {
        setStatus("booked");
      }
      if (
        e.data?.event === "calendly.event_type_viewed" ||
        e.data?.event === "calendly.profile_page_viewed"
      ) {
        setCalendlyReady(true);
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Fallback: show the widget after 8 s if the postMessage never fires
  useEffect(() => {
    if (status !== "success") return;
    const t = setTimeout(() => setCalendlyReady(true), 8000);
    return () => clearTimeout(t);
  }, [status]);

  const [errorDetail, setErrorDetail] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorDetail("");
    const form = e.currentTarget;
    const els = form.elements;

    // Tolerate a full URL being pasted into the env var — take only the bare
    // form id. A value like "https://formspree.io/f/xlgvydll" would otherwise be
    // double-prefixed into "…/f/https://formspree.io/f/xlgvydll" and 404 every lead.
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID?.replace(/^.*\/f\//, "").trim();
    if (!formspreeId) {
      // Otherwise this posts to formspree.io/f/undefined and the lead is lost.
      console.error("NEXT_PUBLIC_FORMSPREE_ID is not set");
      setErrorDetail("The form is not configured.");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name:    (els.namedItem("name")    as HTMLInputElement).value,
          email:   (els.namedItem("email")   as HTMLInputElement).value,
          phone:   (els.namedItem("phone")   as HTMLInputElement).value,
          message: (els.namedItem("message") as HTMLTextAreaElement).value,
          // A record that the privacy policy was accepted, for the GDPR trail
          privacy_consent: (els.namedItem("privacy") as HTMLInputElement).checked,
          _gotcha: (els.namedItem("_gotcha") as HTMLInputElement).value,
        }),
      });

      const data = await res.json().catch(() => ({})) as { errors?: { message: string }[] };

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const errorMsg = data.errors?.[0]?.message ?? `Status ${res.status}`;
        console.error("Enquiry error:", data);
        setErrorDetail(errorMsg);
        setStatus("error");
      }
    } catch (err) {
      console.error("Enquiry fetch failed:", err);
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  return (
    <section
      id="enquire"
      className="scroll-mt-24 border-t border-gold/20 bg-surface px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-lg">
        <FadeIn>
          <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
            Begin your enquiry
          </h2>
          <p className="mt-6 text-center text-sm leading-relaxed text-muted">
            Entirely private and completely free. Each enquiry is considered personally. You will hear back within 24 hours.
          </p>
          <p className="mt-3 text-center text-xs tracking-[0.15em] text-muted/60 uppercase">
            An investment of £1,000 / month
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          {status === "booked" ? (
            <p className="mt-14 text-center font-display text-xl text-foreground">
              Thank you — your call is booked. A confirmation is on its way to your inbox.
            </p>
          ) : status === "success" ? (
            <div className="mt-14">
              <p className="mb-8 text-center text-sm text-muted">
                Enquiry received — now pick a time that suits you.
              </p>
              <div className="relative" style={{ minWidth: "320px", height: "700px" }}>
                {!calendlyReady && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                    <div
                      className="h-7 w-7 rounded-full border-[1.5px] border-gold/20 animate-spin"
                      style={{ borderTopColor: "var(--gold)" }}
                    />
                    <p className="text-xs tracking-[0.2em] text-muted uppercase">Loading calendar…</p>
                  </div>
                )}
                <div className={calendlyReady ? "opacity-100" : "opacity-0"} style={{ height: "700px" }}>
                  <InlineWidget
                    url="https://calendly.com/arun-seeborun/30min"
                    styles={{ minWidth: "320px", height: "700px" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-14 space-y-8">
              {/* Honeypot — hidden from humans, bots fill it, Formspree silently drops the submission */}
              <input type="text" name="_gotcha" tabIndex={-1} aria-hidden="true" className="hidden" />
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Name"
                  className="w-full border-0 border-b border-brown/30 bg-transparent py-3 text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  className="w-full border-0 border-b border-brown/30 bg-transparent py-3 text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  placeholder="Phone number"
                  className="w-full border-0 border-b border-brown/30 bg-transparent py-3 text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tell us, in a few words, what you are looking to change."
                  className="w-full resize-none border-0 border-b border-brown/30 bg-transparent py-3 text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none"
                />
              </div>

              <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  name="privacy"
                  required
                  className="mt-1 accent-burgundy"
                />
                <span>
                  I agree to the{" "}
                  <a href="/privacy" className="link-underline text-burgundy">
                    privacy policy
                  </a>
                  .
                </span>
              </label>

              {status === "error" && (
                <p className="text-center text-sm text-burgundy">
                  Something went wrong. Please try again in a moment.
                  {errorDetail && (
                    <span className="mt-1 block text-xs opacity-60">{errorDetail}</span>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full border border-burgundy/50 py-4 text-xs tracking-[0.25em] text-burgundy uppercase transition-all duration-300 hover:border-burgundy hover:bg-burgundy/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {status === "submitting" ? "Sending…" : "Submit enquiry"}
              </button>
            </form>
          )}
        </FadeIn>


      </div>
    </section>
  );
}
