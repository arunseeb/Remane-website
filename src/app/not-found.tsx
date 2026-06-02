import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header hideDesktopNav />
      <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <Image
          src="/brand/logo-red.png"
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 object-contain opacity-60"
        />
        <p className="mt-8 text-xs tracking-[0.25em] text-muted uppercase">404</p>
        <h1 className="mt-4 font-display text-4xl text-foreground md:text-5xl">
          Page not found
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="text-xs tracking-[0.25em] text-burgundy uppercase transition-opacity hover:opacity-70"
          >
            ← Return home
          </Link>
          <span className="hidden text-brown/30 sm:block">·</span>
          <Link
            href="/enquire"
            className="text-xs tracking-[0.25em] text-muted uppercase transition-opacity hover:opacity-70"
          >
            Enquire
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
