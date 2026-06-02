import Link from "next/link";
import { Header } from "@/components/Header";

export const metadata = {
  title: "Terms & Conditions — Remane",
};

export default function TermsPage() {
  return (
    <>
      <Header hideDesktopNav />
      <div className="min-h-screen bg-background px-6 pt-44 pb-24 md:px-10">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
          >
            ← Remane
          </Link>

          <h1 className="mt-12 font-display text-4xl text-foreground">Terms &amp; Conditions</h1>
          <p className="mt-4 text-sm text-muted">Last updated: June 2026</p>

          <div className="mt-12 space-y-8 text-sm leading-relaxed text-muted">

            <section>
              <h2 className="font-display text-xl text-foreground">1. Introduction</h2>
              <p className="mt-3">
                These Terms &amp; Conditions govern the use of our website, services, coaching
                programmes, consultations, and communications.
              </p>
              <p className="mt-3">
                By booking a consultation, purchasing a programme, or using this website, you
                agree to these Terms &amp; Conditions.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">2. Coaching Disclaimer</h2>
              <p className="mt-3">
                Our services provide coaching, education, guidance, accountability, and personal
                development support.
              </p>
              <p className="mt-3">We do not provide:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Psychological therapy</li>
                <li>Counselling</li>
                <li>Medical advice</li>
                <li>Psychiatric treatment</li>
                <li>Legal advice</li>
                <li>Financial advice</li>
              </ul>
              <p className="mt-3">
                Participation in our programmes is not a substitute for professional medical,
                psychological, legal, or financial services.
              </p>
              <p className="mt-3">
                If you are experiencing a mental health crisis, please seek assistance from a
                qualified healthcare professional or emergency services immediately.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">3. Eligibility</h2>
              <p className="mt-3">Clients must be at least 18 years of age.</p>
              <p className="mt-3">
                By engaging our services, you confirm that all information you provide is
                accurate and truthful.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">4. Results Disclaimer</h2>
              <p className="mt-3">Individual results vary.</p>
              <p className="mt-3">
                While our goal is to help clients improve their confidence, wellbeing,
                relationships, dating success, and personal development, we cannot guarantee any
                specific outcome, including:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Dating success</li>
                <li>Relationship outcomes</li>
                <li>Reconciliation with an ex-partner</li>
                <li>Marriage</li>
                <li>Income increases</li>
                <li>Emotional recovery timelines</li>
              </ul>
              <p className="mt-3">
                Success depends on numerous factors including effort, consistency, personal
                circumstances, and implementation.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">5. Client Responsibility</h2>
              <p className="mt-3">
                Clients accept full responsibility for their decisions, actions, behaviours, and
                outcomes.
              </p>
              <p className="mt-3">Clients agree that they remain solely responsible for:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Personal decisions</li>
                <li>Relationship decisions</li>
                <li>Dating decisions</li>
                <li>Financial decisions</li>
                <li>Health decisions</li>
                <li>Legal decisions</li>
              </ul>
              <p className="mt-3">We provide guidance only.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">6. Confidentiality</h2>
              <p className="mt-3">Client information will be treated confidentially.</p>
              <p className="mt-3">Information may only be disclosed:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>When required by law</li>
                <li>To protect the safety of an individual</li>
                <li>With the client&apos;s written consent</li>
              </ul>
              <p className="mt-3">
                We will never intentionally share private coaching conversations for marketing
                purposes without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">7. Payments</h2>
              <p className="mt-3">All fees are stated in GBP unless otherwise specified.</p>
              <p className="mt-3">Payment must be received before coaching services commence.</p>
              <p className="mt-3">
                Failure to complete payment may result in suspension or cancellation of services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">8. Refund Policy</h2>
              <p className="mt-3">
                Due to the nature of coaching services, all payments are non-refundable unless
                otherwise required by applicable law.
              </p>
              <p className="mt-3">Refund requests will be reviewed on a case-by-case basis.</p>
              <p className="mt-3">Completed coaching sessions are never refundable.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">9. Rescheduling &amp; Cancellation</h2>
              <p className="mt-3">
                Clients may reschedule a session with at least 24 hours&apos; notice.
              </p>
              <p className="mt-3">
                Sessions cancelled with less than 24 hours&apos; notice may be forfeited.
              </p>
              <p className="mt-3">
                Failure to attend a scheduled session without notice may result in the session
                being counted as used.
              </p>
              <p className="mt-3">We reserve the right to reschedule appointments when necessary.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">10. Communication</h2>
              <p className="mt-3">
                Communication between sessions may be provided where included in the purchased
                programme.
              </p>
              <p className="mt-3">Response times are not guaranteed.</p>
              <p className="mt-3">Coaching support is not an emergency service.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">11. Intellectual Property</h2>
              <p className="mt-3">
                All programme materials, worksheets, videos, documents, frameworks, and
                educational content remain the intellectual property of the company.
              </p>
              <p className="mt-3">Clients may not:</p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Reproduce materials</li>
                <li>Resell materials</li>
                <li>Share materials publicly</li>
                <li>Distribute materials to third parties</li>
              </ul>
              <p className="mt-3">Without prior written permission.</p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">12. Website Use</h2>
              <p className="mt-3">
                You agree not to misuse this website, interfere with its operation, or attempt
                to gain unauthorised access to systems, data, or accounts.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">13. Limitation of Liability</h2>
              <p className="mt-3">
                To the fullest extent permitted by law, the company shall not be liable for any
                indirect, incidental, special, consequential, or punitive damages arising from
                participation in coaching services.
              </p>
              <p className="mt-3">
                Total liability shall not exceed the amount paid by the client for services
                during the preceding twelve months.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">14. Right to Refuse Service</h2>
              <p className="mt-3">
                We reserve the right to refuse or terminate services where a client:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Engages in abusive behaviour</li>
                <li>Harasses staff or other clients</li>
                <li>Acts unlawfully</li>
                <li>Repeatedly violates programme agreements</li>
                <li>Demonstrates behaviour that prevents productive coaching</li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">15. Privacy</h2>
              <p className="mt-3">
                Personal information is handled in accordance with our{" "}
                <Link href="/privacy" className="link-underline text-burgundy">
                  Privacy Policy
                </Link>
                .
              </p>
              <p className="mt-3">
                By using our services, you consent to the collection and processing of
                information necessary to provide those services.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">16. Governing Law</h2>
              <p className="mt-3">
                These Terms &amp; Conditions shall be governed by and interpreted in accordance
                with the laws of England and Wales.
              </p>
              <p className="mt-3">
                Any disputes arising under these Terms shall be subject to the exclusive
                jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="font-display text-xl text-foreground">17. Contact</h2>
              <p className="mt-3">
                For questions regarding these Terms &amp; Conditions, please contact us through
                the contact details provided on this website.
              </p>
            </section>

          </div>
        </div>
      </div>
    </>
  );
}

