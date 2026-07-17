import { createClient } from "@/lib/supabase/server";
import { AssignHomeworkForm } from "@/components/portal/coach/AssignHomeworkForm";
import { HomeworkReviewCard } from "@/components/portal/coach/HomeworkReviewCard";
import type { Homework, Profile } from "@/lib/portal";

const SECTION_ORDER: { status: Homework["status"]; title: string }[] = [
  { status: "submitted", title: "Needs review" },
  { status: "assigned", title: "Awaiting submission" },
  { status: "returned", title: "Returned to client" },
  { status: "completed", title: "Completed" },
];

export default async function CoachHomeworkPage() {
  const supabase = await createClient();

  const [{ data: homework }, { data: clients }] = await Promise.all([
    supabase.from("homework").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("role", "client").order("full_name"),
  ]);

  const clientNames = new Map(
    ((clients ?? []) as Pick<Profile, "id" | "full_name" | "email">[]).map((c) => [
      c.id,
      c.full_name || c.email,
    ])
  );

  const fileUrls = new Map<string, string>();
  const assignmentUrls = new Map<string, string>();
  for (const hw of (homework ?? []) as Homework[]) {
    if (hw.submission_file_path) {
      const { data } = await supabase.storage
        .from("homework")
        .createSignedUrl(hw.submission_file_path, 3600);
      if (data) fileUrls.set(hw.id, data.signedUrl);
    }
    if (hw.attachment_path) {
      const { data } = await supabase.storage
        .from("homework")
        .createSignedUrl(hw.attachment_path, 3600);
      if (data) assignmentUrls.set(hw.id, data.signedUrl);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Homework</h1>

      <h2 className="font-display mt-6 text-2xl font-light text-foreground">Set new homework</h2>
      <AssignHomeworkForm clients={clients ?? []} />

      {SECTION_ORDER.map(({ status, title }) => {
        const items = ((homework ?? []) as Homework[]).filter((h) => h.status === status);
        if (items.length === 0) return null;
        return (
          <section key={status} className="mt-10">
            <h2 className="font-display text-2xl font-light text-foreground">
              {title} <span className="text-base text-muted">({items.length})</span>
            </h2>
            <div className="mt-4 space-y-4">
              {items.map((hw) => (
                <HomeworkReviewCard
                  key={hw.id}
                  homework={hw}
                  clientName={clientNames.get(hw.client_id)}
                  fileUrl={fileUrls.get(hw.id) ?? null}
                  assignmentFileUrl={assignmentUrls.get(hw.id) ?? null}
                />
              ))}
            </div>
          </section>
        );
      })}

      {(homework ?? []).length === 0 && (
        <p className="mt-8 text-sm text-muted">No homework yet.</p>
      )}
    </div>
  );
}
