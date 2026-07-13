import Link from "next/link";
import Image from "next/image";
import { PortalNav } from "./PortalNav";
import { SignOutButton } from "./SignOutButton";

const COACH_LINKS = [
  { label: "Clients", href: "/coach" },
  { label: "Homework", href: "/coach/homework" },
  { label: "Messages", href: "/coach/messages" },
  { label: "Classrooms", href: "/coach/classrooms" },
  { label: "Library", href: "/coach/library" },
];

const CLIENT_LINKS = [
  { label: "Overview", href: "/portal" },
  { label: "Homework", href: "/portal/homework" },
  { label: "Messages", href: "/portal/messages" },
  { label: "Classrooms", href: "/portal/classrooms" },
  { label: "Library", href: "/portal/library" },
];

export function PortalShell({
  role,
  name,
  unread,
  homeworkBadge = 0,
  children,
}: {
  role: "coach" | "client";
  name: string;
  unread?: { messages: number; classrooms: number };
  homeworkBadge?: number;
  children: React.ReactNode;
}) {
  const base = role === "coach" ? COACH_LINKS : CLIENT_LINKS;
  const links = base.map((link) => ({
    ...link,
    badge:
      link.label === "Messages"
        ? (unread?.messages ?? 0)
        : link.label === "Classrooms"
          ? (unread?.classrooms ?? 0)
          : link.label === "Homework"
            ? homeworkBadge
            : 0,
    badgeTitle:
      link.label === "Homework"
        ? role === "coach"
          ? "Submitted homework waiting to be marked"
          : "Homework still to submit"
        : undefined,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-brown/20">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link href={role === "coach" ? "/coach" : "/portal"} className="flex items-center gap-3">
            <Image src="/brand/logo-red.png" alt="Remane" width={40} height={40} />
            <span className="font-display hidden text-lg text-foreground sm:block">
              Remane {role === "coach" ? "— Coaching" : "— Members"}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-xs tracking-[0.2em] text-muted uppercase md:block">
              {name}
            </span>
            <Link
              href="/account"
              className="border border-brown/30 px-4 py-2 text-xs tracking-[0.2em] text-muted uppercase transition-colors hover:border-burgundy hover:text-burgundy"
            >
              Account
            </Link>
            <SignOutButton />
          </div>
        </div>
        <PortalNav links={links} />
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
    </div>
  );
}
