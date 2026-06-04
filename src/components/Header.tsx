"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MENU_ITEMS, NAV_ITEMS, PHASES } from "@/lib/constants";
import { useHeaderState } from "@/hooks/useHeaderState";

interface SearchResult {
  label: string;
  href: string;
}

export function Header({ hideDesktopNav = false }: { hideDesktopNav?: boolean }) {
  const { atTop } = useHeaderState();
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pathHovered, setPathHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeAll = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setPathHovered(false);
    setSearchQuery("");
    setSearchResults([]);
  };
  const openMenu = () => {
    setMenuOpen(true);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };
  const openSearch = () => {
    setSearchOpen(true);
    setMenuOpen(false);
  };

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    setSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setSearchResults([]);
      setSearching(false);
      return;
    }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
        const data: SearchResult[] = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 120);
  }

  const hasBg = true;
  const showLogo = atTop || searchOpen || menuOpen;
  const showDropdown = searchOpen && searchQuery.trim().length > 0;

  return (
    <>
      {/* Backdrop — behind header (z-40), blurs page content */}
      {(searchOpen || menuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={closeAll}
          aria-hidden
        />
      )}

      {/* Hamburger — own stacking context above drawer */}
      {!searchOpen && (
        <button
          onClick={menuOpen ? closeAll : openMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="fixed left-2 md:left-3 z-[70] flex flex-col justify-center gap-[5px] p-2 text-burgundy transition-all duration-700"
          style={{
            top: 0,
            height: showLogo ? "9rem" : "4rem",
            transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          <span className={`block h-[1.5px] w-6 bg-current transition-all duration-300 ${menuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
          <span className={`block h-[1.5px] w-6 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-[1.5px] w-6 bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
        </button>
      )}

      {/* Left drawer — expands to double width when "The Path" is hovered */}
      <div
        className="fixed top-0 left-0 z-[65] h-full bg-background shadow-2xl flex flex-row overflow-hidden transition-all duration-500"
        style={{
          transform: menuOpen ? "translateX(0)" : "translateX(-100%)",
          width: pathHovered ? "min(36rem, 100vw)" : "min(18rem, 85vw)",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        aria-hidden={!menuOpen}
        onMouseLeave={() => setPathHovered(false)}
      >
        {/* Left panel — primary menu or mobile path sub-menu */}
        <div className="w-full md:w-72 shrink-0 flex flex-col px-10 pt-32 overflow-y-auto">

          {/* Mobile path sub-menu — shown when path panel is open on small screens */}
          <div className={`md:hidden flex-col gap-8 ${pathHovered ? "flex" : "hidden"}`}>
            <button
              onClick={() => setPathHovered(false)}
              className="text-xs tracking-[0.15em] text-muted uppercase transition-colors hover:text-brown"
            >
              ← Back
            </button>
            <p className="mt-2 text-xs tracking-[0.18em] text-muted uppercase">The Path</p>
            {PHASES.map((phase) => (
              <Link
                key={phase.href}
                href={phase.href}
                onClick={closeAll}
                className="font-display text-2xl text-foreground transition-colors duration-300 hover:text-muted"
              >
                {phase.title}
              </Link>
            ))}
          </div>

          {/* Main menu — hidden on mobile when path sub-menu is open */}
          <div className={`flex flex-col gap-10 ${pathHovered ? "hidden md:flex" : ""}`}>
            {/* First item: Our Philosophy */}
            <Link
              href={MENU_ITEMS[0].href}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={() => setPathHovered(false)}
              className={`font-display text-3xl transition-colors duration-300 ${pathname === MENU_ITEMS[0].href ? "text-burgundy" : "text-foreground hover:text-muted"}`}
            >
              {MENU_ITEMS[0].label}
            </Link>

            {/* The Path — hover reveals right panel on desktop; tap toggles inline sub-menu on mobile */}
            <button
              onMouseEnter={() => setPathHovered(true)}
              onClick={() => setPathHovered((prev) => !prev)}
              className={`flex items-center gap-3 text-left font-display text-3xl transition-colors duration-300 hover:text-muted ${pathname.startsWith("/path") ? "text-burgundy" : "text-foreground"}`}
            >
              The Path
              <span
                className="text-gold transition-transform duration-300"
                style={{ transform: pathHovered ? "translateX(4px)" : "translateX(0)" }}
              >
                ›
              </span>
            </button>

            {/* Remaining items: Testimonials, About Arun, FAQ, Enquire */}
            {MENU_ITEMS.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                onMouseEnter={() => setPathHovered(false)}
                className={`font-display text-3xl transition-colors duration-300 ${pathname === item.href ? "text-burgundy" : "text-foreground hover:text-muted"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right panel — phase sub-links, desktop only */}
        <div className="hidden md:flex w-72 shrink-0 flex-col pt-32 px-10 gap-8 border-l border-brown/10">
          <p className="text-xs tracking-[0.18em] text-muted uppercase">The Path</p>
          {PHASES.map((phase) => (
            <Link
              key={phase.href}
              href={phase.href}
              onClick={closeAll}
              className="font-display text-2xl text-foreground transition-colors duration-300 hover:text-muted"
            >
              {phase.title}
            </Link>
          ))}
        </div>
      </div>

      <header
        className="fixed top-0 z-[60] w-full transition-all duration-700"
        style={{
          backgroundColor: hasBg ? "rgba(250,248,245,0.95)" : "transparent",
          backdropFilter: hasBg ? "blur(12px)" : "none",
          borderBottom: hasBg ? "1px solid rgba(139,115,85,0.1)" : "1px solid transparent",
          boxShadow: hasBg ? "0 1px 4px rgba(0,0,0,0.04)" : "none",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* ── Nav row ── */}
        <div
          className={`relative mx-auto flex max-w-6xl items-center pl-2 pr-6 md:pl-3 md:pr-10 transition-all duration-700 ${
            showLogo ? "h-36" : "h-16"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
        >
          {/* Centre: lion + name — visible at top of page, and always while search is open */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            aria-label="Remane home"
          >
            <div
              className="flex flex-col items-center overflow-hidden transition-all duration-700"
              style={{
                maxHeight: showLogo ? "7.5rem" : "0",
                opacity: showLogo ? 1 : 0,
                transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <Image
                src="/brand/logo-red.png"
                alt=""
                width={72}
                height={72}
                className="h-16 w-16 object-contain"
                priority
              />
              <span className="mt-0.5 block font-display text-xl tracking-[0.2em] text-burgundy uppercase md:text-2xl">
                Remane
              </span>
            </div>
          </Link>

          {/* Far right: nav links + search icon — hidden when menu is open */}
          <div className="ml-auto flex items-center gap-5 sm:gap-8 md:gap-10">
            {!menuOpen && searchOpen ? (
              <button
                onClick={closeAll}
                className="text-muted hover:text-burgundy transition-colors duration-300 text-sm tracking-widest uppercase"
              >
                Close
              </button>
            ) : !menuOpen ? (
              <>
                {!hideDesktopNav && (
                  <nav className="hidden md:flex items-center gap-8" aria-label="Main">
                    {NAV_ITEMS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="nav-link text-sm tracking-[0.15em] text-burgundy uppercase transition-colors duration-300"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                )}
                <button
                  onClick={openSearch}
                  aria-label="Open search"
                  className="p-1 text-burgundy transition-opacity hover:opacity-70"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              </>
            ) : null}
          </div>
        </div>

        {/* ── Search row — below the nav row, no extra background (header covers it) ── */}
        {searchOpen && (
          <div className="relative border-t border-brown/10 px-6 py-5 md:px-10">
            <div className="mx-auto max-w-6xl flex items-center gap-4">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-muted/60"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                type="text"
                placeholder="Search pages…"
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 bg-transparent border-b border-brown/30 pb-2 text-foreground placeholder:text-muted/50 focus:border-burgundy focus:outline-none text-base md:text-sm tracking-wide"
                onKeyDown={(e) => e.key === "Escape" && closeAll()}
              />
            </div>

            {/* Results dropdown */}
            {showDropdown && (
              <div className="absolute left-0 right-0 top-full z-10 border-t border-brown/10 bg-background shadow-xl">
                <div className="mx-auto max-w-6xl px-6 md:px-10">
                  {searching ? (
                    <p className="py-4 text-xs tracking-wide text-muted">Searching…</p>
                  ) : searchResults.length > 0 ? (
                    <ul role="listbox">
                      {searchResults.map((result) => (
                        <li key={result.href} role="option">
                          <Link
                            href={result.href}
                            onClick={closeAll}
                            className="flex items-center gap-3 border-b border-brown/5 py-3.5 text-sm text-foreground transition-colors duration-200 last:border-0 hover:text-burgundy"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="shrink-0 text-muted/40"
                            >
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                            {result.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="py-4 text-xs tracking-wide text-muted">
                      No pages found for &ldquo;{searchQuery}&rdquo;.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
