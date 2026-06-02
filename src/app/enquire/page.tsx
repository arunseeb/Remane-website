import Link from "next/link";
import { Header } from "@/components/Header";
import { Enquiry } from "@/components/Enquiry";
import { Footer } from "@/components/Footer";

export const metadata = {
  title: "Enquire — Remane",
  description: "Request a private conversation with Remane.",
};

export default function EnquirePage() {
  return (
    <>
      <Header hideDesktopNav />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-6 pt-44 md:px-10">
          <Link
            href="/"
            className="link-underline text-xs tracking-[0.15em] text-burgundy uppercase"
          >
            ← Remane
          </Link>
        </div>
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
