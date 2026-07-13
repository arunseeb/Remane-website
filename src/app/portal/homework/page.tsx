import { createClient } from "@/lib/supabase/server";
import { HomeworkItem } from "@/components/portal/HomeworkItem";
import type { Homework } from "@/lib/portal";

export default async function PortalHomeworkPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: homework } = await supabase
    .from("homework")
    .select("*")
    .order("created_at", { ascending: false });

  const items = (homework ?? []) as Homework[];

  const fileUrls = new Map<string, string>();
  for (const hw of items.filter((h) => h.submission_file_path)) {
    const { data } = await supabase.storage
      .from("homework")
      .createSignedUrl(hw.submission_file_path!, 3600);
    if (data) fileUrls.set(hw.id, data.signedUrl);
  }

  const open = items.filter((h) => h.status === "assigned" || h.status === "returned");
  const waiting = items.filter((h) => h.status === "submitted");
  const done = items.filter((h) => h.status === "completed");

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Homework</h1>

      <h2 className="font-display mt-6 text-2xl font-light text-foreground">To do</h2>
      <div className="mt-4 space-y-4">
        {open.map((hw) => (
          <HomeworkItem
            key={hw.id}
            homework={hw}
            userId={user!.id}
            fileUrl={fileUrls.get(hw.id) ?? null}
          />
        ))}
        {open.length === 0 && <p className="text-sm text-muted">Nothing to do right now.</p>}
      </div>

      {waiting.length > 0 && (
        <>
          <h2 className="font-display mt-10 text-2xl font-light text-foreground">
            Submitted — awaiting review
          </h2>
          <div className="mt-4 space-y-4">
            {waiting.map((hw) => (
              <HomeworkItem
                key={hw.id}
                homework={hw}
                userId={user!.id}
                fileUrl={fileUrls.get(hw.id) ?? null}
              />
            ))}
          </div>
        </>
      )}

      {done.length > 0 && (
        <>
          <h2 className="font-display mt-10 text-2xl font-light text-foreground">Completed</h2>
          <div className="mt-4 space-y-4">
            {done.map((hw) => (
              <HomeworkItem
                key={hw.id}
                homework={hw}
                userId={user!.id}
                fileUrl={fileUrls.get(hw.id) ?? null}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
