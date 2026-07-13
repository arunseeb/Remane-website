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

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-foreground">Clients</h1>
          <p className="mt-1 text-sm text-muted">
            {clients?.length ?? 0} active {clients?.length === 1 ? "client" : "clients"}
          </p>
        </div>
      </div>

      <AddClientForm />

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {(clients ?? []).map((client: Profile) => (
          <ClientCard key={client.id} client={client} />
        ))}
        {(clients ?? []).length === 0 && (
          <p className="text-sm text-muted">
            No clients yet — add your first client above and they&apos;ll receive an email
            invitation.
          </p>
        )}
      </div>
    </div>
  );
}
