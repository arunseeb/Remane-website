import type { Metadata } from "next";
import { Enquiry } from "@/components/Enquiry";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Manifesto } from "@/components/Manifesto";
import { VisualStack } from "@/components/VisualStack";

export const metadata: Metadata = {
  title: "Remane — Private guidance for men rebuilding after divorce",
  description:
    "The divorce happened for you, not to you. A structured system helping successful men rebuild their confidence, identity, relationships, and future.",
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <VisualStack />
        <Manifesto />
        <Enquiry />
      </main>
      <Footer />
    </>
  );
}
