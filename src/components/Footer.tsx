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

        <div className="h-px w-8 bg-gold/40" />

        <div className="flex items-center gap-6">
          <a href="https://www.instagram.com/remaneofficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted transition-colors hover:text-burgundy">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
            </svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=61590226217685" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted transition-colors hover:text-burgundy">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
          <a href="https://www.youtube.com/@RemaneOfficial" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted transition-colors hover:text-burgundy">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
              <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
            </svg>
          </a>
        </div>

        <a
          href="mailto:remaneofficial@gmail.com"
          className="link-underline text-xs tracking-[0.12em] text-muted hover:text-burgundy"
        >
          remaneofficial@gmail.com
        </a>

        <p className="text-xs tracking-[0.12em] text-muted">
          © {new Date().getFullYear()} Remane. Trading as Remane.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs tracking-[0.1em] text-muted uppercase">
          <Link href="/our-mission" className="link-underline hover:text-burgundy">
            Our Philosophy
          </Link>
          <Link href="/testimonials" className="link-underline hover:text-burgundy">
            Testimonials
          </Link>
          <Link href="/about" className="link-underline hover:text-burgundy">
            About Arun
          </Link>
          <Link href="/faq" className="link-underline hover:text-burgundy">
            FAQ
          </Link>
          <Link href="/enquire" className="link-underline hover:text-burgundy">
            Enquire
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs tracking-[0.1em] text-muted uppercase">
          <Link href="/privacy" className="link-underline hover:text-burgundy">
            Privacy
          </Link>
          <Link href="/terms" className="link-underline hover:text-burgundy">
            Terms
          </Link>
          <Link href="/login" className="link-underline hover:text-burgundy">
            Client login
          </Link>
        </div>
      </div>
    </footer>
  );
}
