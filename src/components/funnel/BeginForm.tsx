"use client";

import { FormEvent, useEffect, useState } from "react";
import { InlineWidget } from "react-calendly";
import { FadeIn } from "@/components/FadeIn";

type FormStatus = "idle" | "submitting" | "success" | "booked" | "error";

// UTM / referrer capture so Formspree submissions show which channel
// (content, forum, word of mouth) the lead came from.
function getTracking(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "ref"]) {
      const value = params.get(key);
      if (value) out[key] = value.slice(0, 100);
    }
    if (document.referrer) out.referrer = document.referrer.slice(0, 200);
  } catch {
    // tracking is best-effort — never block the submission
  }
  return out;
}

export function BeginForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [calendlyReady, setCalendlyReady] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorDetail("");
    const form = e.currentTarget;
    const els = form.elements;

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;
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
          _subject: "New application — Begin funnel",
          source: "begin-funnel",
          name: (els.namedItem("name") as HTMLInputElement).value,
          email: (els.namedItem("email") as HTMLInputElement).value,
          phone: (els.namedItem("phone") as HTMLInputElement).value,
          situation: (els.namedItem("situation") as HTMLSelectElement).value,
          prompt: (els.namedItem("prompt") as HTMLTextAreaElement).value,
          investment: (els.namedItem("investment") as HTMLSelectElement).value,
          // A record that the privacy policy was accepted, for the GDPR trail
          privacy_consent: (els.namedItem("privacy") as HTMLInputElement).checked,
          _gotcha: (els.namedItem("_gotcha") as HTMLInputElement).value,
          ...getTracking(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as { errors?: { message: string }[] };

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        const errorMsg = data.errors?.[0]?.message ?? `Status ${res.status}`;
        console.error("BeginForm error:", data);
        setErrorDetail(errorMsg);
        setStatus("error");
      }
    } catch (err) {
      console.error("BeginForm fetch failed:", err);
      setErrorDetail(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  const fieldClass =
    "w-full border-0 border-b border-brown/30 bg-transparent py-3 text-foreground placeholder:text-muted/60 focus:border-burgundy focus:outline-none";
  const labelClass = "mb-2 block text-xs tracking-[0.2em] text-muted uppercase";

  return (
    <div className="mx-auto max-w-lg">
      <FadeIn>
        {status === "booked" ? (
          <p className="text-center font-display text-xl text-foreground">
            Thank you. Your conversation is booked — Arun will see your answers before you speak.
          </p>
        ) : status === "success" ? (
          <div>
            <p className="mb-8 text-center text-sm text-muted">
              Received. Now choose a time that suits you — the call is private and unhurried.
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
          <form onSubmit={handleSubmit} className="space-y-9">
            {/* Honeypot — hidden from humans, bots fill it, Formspree silently drops the submission */}
            <input type="text" name="_gotcha" tabIndex={-1} aria-hidden="true" className="hidden" />

            <div>
              <label htmlFor="begin-name" className="sr-only">
                Name
              </label>
              <input
                id="begin-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Name"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="begin-email" className="sr-only">
                Email
              </label>
              <input
                id="begin-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="begin-phone" className="sr-only">
                Phone number
              </label>
              <input
                id="begin-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="Phone number"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="begin-situation" className={labelClass}>
                Where are you right now?
              </label>
              <select
                id="begin-situation"
                name="situation"
                required
                defaultValue=""
                className={`${fieldClass} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  Select…
                </option>
                <option value="Separated — divorce not yet started">
                  Separated — divorce not yet started
                </option>
                <option value="Divorce in progress">Divorce in progress</option>
                <option value="Divorced — less than a year">Divorced — less than a year</option>
                <option value="Divorced — more than a year">Divorced — more than a year</option>
              </select>
            </div>

            <div>
              <label htmlFor="begin-prompt" className={labelClass}>
                What has prompted this, now?
              </label>
              <textarea
                id="begin-prompt"
                name="prompt"
                required
                rows={3}
                placeholder="A few honest sentences. This stays between you and Arun."
                className={`${fieldClass} resize-none`}
              />
            </div>

            <div>
              <label htmlFor="begin-investment" className={labelClass}>
                Coaching is an investment of £1,000 / month
              </label>
              <select
                id="begin-investment"
                name="investment"
                required
                defaultValue=""
                className={`${fieldClass} cursor-pointer appearance-none`}
              >
                <option value="" disabled>
                  If the path is right for you, where do you stand?
                </option>
                <option value="Ready to invest">I&apos;m ready to invest</option>
                <option value="Could invest with some planning">
                  I could, with some planning
                </option>
                <option value="Not in a position to invest">
                  I&apos;m not in a position to invest right now
                </option>
              </select>
            </div>

            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
              <input type="checkbox" name="privacy" required className="mt-1 accent-burgundy" />
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
                {errorDetail && <span className="mt-1 block text-xs opacity-60">{errorDetail}</span>}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full border border-burgundy bg-burgundy py-4 text-xs tracking-[0.25em] text-[#faf8f5] uppercase transition-all duration-300 hover:bg-burgundy-hover disabled:cursor-not-allowed disabled:opacity-40"
            >
              {status === "submitting" ? "Sending…" : "Continue to booking"}
            </button>

            <p className="text-center text-xs leading-relaxed text-muted/70">
              Two minutes of questions, then you choose a time. Entirely private. No obligation on
              either side.
            </p>
          </form>
        )}
      </FadeIn>
    </div>
  );
}
