"use client";

import { FormEvent, useState } from "react";
import { FadeIn } from "@/components/FadeIn";

type FormStatus = "idle" | "submitting" | "success" | "error";

export function Enquiry() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formspreeId) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
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
            Request a private conversation
          </h2>
          <p className="mt-6 text-center text-sm leading-relaxed text-muted">
            Entirely private. Each enquiry is considered personally.
          </p>
        </FadeIn>

        <FadeIn delay={0.12}>
          {status === "success" ? (
            <p className="mt-14 text-center font-display text-xl text-foreground">
              Thank you. We will be in touch if there is a fit.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-14 space-y-8">
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
