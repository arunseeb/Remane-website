import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Privacy Policy — Remane",
};

export default function PrivacyPage() {
  return (
    <>
      <Header hideDesktopNav />
    <div className="min-h-screen bg-background px-6 pt-32 pb-24 md:px-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
        >
          ← Remane
        </Link>

        <h1 className="mt-12 font-display text-4xl text-foreground">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted">Last updated: May 2026</p>

        <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted">
          <section>
            <h2 className="font-display text-xl text-foreground">Who we are</h2>
            <p className="mt-3">
              Remane (trading as Remane) provides private guidance services. This
              policy explains how we handle personal data when you use our website
              or submit an enquiry.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Data we collect</h2>
            <p className="mt-3">
              When you submit an enquiry, we collect your name, email address, and
              the message you provide. We do not use aggressive tracking or sell
              your data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Legal basis</h2>
            <p className="mt-3">
              We process your data on the basis of legitimate interest (responding
              to your enquiry) and, where applicable, your consent via the privacy
              checkbox on our form.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Retention</h2>
            <p className="mt-3">
              Enquiry data is retained only as long as needed to respond and, if
              relevant, to provide our services. You may request deletion at any
              time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Your rights</h2>
            <p className="mt-3">
              Under UK GDPR you have the right to access, rectify, erase, restrict,
              or object to processing of your personal data, and to lodge a
              complaint with the ICO. Contact us via the enquiry form on our
              website.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-foreground">Third parties</h2>
            <p className="mt-3">
              Form submissions may be processed by Formspree (or a similar provider)
              to deliver your message securely. Their privacy policy applies to
              that processing.
            </p>
          </section>
        </div>
      </div>
    </div>
    </>
  );
}
