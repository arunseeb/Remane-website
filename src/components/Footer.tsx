import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-brown/10 bg-background px-6 py-16 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <Image
          src="/brand/logo-gold.png"
          alt=""
          width={36}
          height={36}
          className="h-9 w-9 object-contain opacity-90"
        />

        <p className="text-xs tracking-[0.12em] text-muted">
          © {new Date().getFullYear()} Remane. Trading as Remane.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs tracking-[0.1em] text-muted uppercase">
          <Link href="/privacy" className="link-underline hover:text-burgundy">
            Privacy
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline hover:text-burgundy"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
}
