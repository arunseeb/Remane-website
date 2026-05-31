import { Enquiry } from "@/components/Enquiry";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Manifesto } from "@/components/Manifesto";
import { VisualStack } from "@/components/VisualStack";

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
