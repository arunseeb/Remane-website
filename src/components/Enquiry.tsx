"use client";

import { FormEvent, useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { FadeIn } from "@/components/FadeIn";

type FormStatus = "idle" | "submitting" | "success" | "booked" | "error";

export function Enquiry() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [calendlyReady, setCalendlyReady] = useState(false);
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID ?? "xlgvydll";

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
    const payload: Record<string, string> = {
      name:    (els.namedItem("name")    as HTMLInputElement).value,
      email:   (els.namedItem("email")   as HTMLInputElement).value,
      phone:   (els.namedItem("phone")   as HTMLInputElement).value,
      message: (els.namedItem("message") as HTMLTextAreaElement).value,
    };
    const gotcha = (els.namedItem("_gotcha") as HTMLInputElement)?.value;
    if (gotcha) payload._gotcha = gotcha;

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const body = await res.json().catch(() => null);
        const detail = body?.error ?? body?.errors?.[0]?.message ?? `Status ${res.status}`;
        console.error("Formspree error:", res.status, body);
        setErrorDetail(detail);
        setStatus("error");
      }
    } catch (err) {
      console.error("Formspree fetch failed:", err);
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  return (
    <section
      id="enquire"
      className="scroll-mt-24 border-t border-brown/10 bg-surface px-6 py-28 md:px-10 md:py-40"
    >
      <div className="mx-auto max-w-lg">
        <FadeIn>
          <h2 className="text-center font-display text-3xl text-foreground md:text-4xl">
            Begin your enquiry
          </h2>
          <p className="mt-6 text-center text-sm leading-relaxed text-muted">
            Entirely private. Each enquiry is considered personally. You will hear back within 24 hours.
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          {status === "booked" ? (
            <p className="mt-14 text-center font-display text-xl text-foreground">
              Thank you. We will be in touch if there is a fit.
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

              {!formspreeId && status !== "submitting" && (
                <p className="text-center text-xs text-muted">
                  Formspree is not configured yet. Add{" "}
                  <code className="text-brown-dark">NEXT_PUBLIC_FORMSPREE_ID</code>{" "}
                  to <code className="text-brown-dark">.env.local</code>.
                </p>
              )}

              {status === "error" && (
                <p className="text-center text-sm text-burgundy">
                  Something went wrong. Please try again or contact us directly.
                  {errorDetail && (
                    <span className="mt-1 block text-xs opacity-60">{errorDetail}</span>
                  )}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting" || !formspreeId}
                className="w-full py-4 text-xs tracking-[0.25em] text-burgundy uppercase transition-opacity hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-40"
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
