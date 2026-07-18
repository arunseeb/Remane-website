/**
 * Coach-only status pill for a client who has been invited but has not set a
 * password yet (their account is not created). Rendered only inside /coach —
 * never in the client-facing /portal, so the client never sees it.
 */
export function AccountPendingBadge() {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brown/30 bg-background/50 px-2.5 py-1 text-[0.6rem] tracking-[0.15em] text-muted uppercase"
      title="Invited — the client has not set a password yet"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
      Account not created yet
    </span>
  );
}
