import { createClient } from "@/lib/supabase/server";
import { AddClientForm } from "@/components/portal/coach/AddClientForm";
import { ClientCard } from "@/components/portal/coach/ClientCard";
import type { Profile } from "@/lib/portal";

export default async function CoachClientsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "client")
    .order("full_name");

  const allClients = (clients ?? []) as Profile[];

  // activated_at is stamped the instant a client sets a password (see
  // migration-012). Until then they are a "potential client"; the moment they
  // sign up they move into Clients on the next load.
  const activeClients = allClients.filter((c) => c.activated_at);
  const potentialClients = allClients.filter((c) => !c.activated_at);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            {activeClients.length} active {activeClients.length === 1 ? "client" : "clients"}
          </p>
        </div>
      </div>

      <AddClientForm />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {activeClients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
        {activeClients.length === 0 && (
          <p className="text-sm text-muted">
            {potentialClients.length > 0
              ? "No active clients yet — those you've invited appear under Potential clients below until they set a password."
              : "No clients yet — add your first client above and they'll receive an email invitation."}
          </p>
        )}
      </div>

      {potentialClients.length > 0 && (
        <div className="mt-14">
          <div className="border-t border-brown/15 pt-8">
            <h2 className="font-display text-2xl font-light text-foreground">
              Potential clients
            </h2>
            <p className="mt-1 text-sm text-muted">
              {potentialClients.length} invited — awaiting sign-up. They move up to Clients once
              they set a password.
            </p>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {potentialClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
