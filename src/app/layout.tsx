import type { Metadata } from "next";
import { Cormorant_Garamond, Source_Sans_3 } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Remane — Private guidance for men rebuilding with intention",
  description:
    "A bespoke path from recovery to mastery. Private coaching for emotional recovery, refinement, connection, and relationship mastery.",
  openGraph: {
    title: "Remane",
    description:
      "A bespoke path from recovery to mastery. Private guidance for men rebuilding with intention.",
    type: "website",
  },
  icons: {
    icon: "/brand/logo-red.png",
    apple: "/brand/logo-red.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className={`${cormorant.variable} ${sourceSans.variable} h-full`}>
      <body className="min-h-full antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
