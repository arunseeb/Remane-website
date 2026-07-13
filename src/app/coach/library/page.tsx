import { createClient } from "@/lib/supabase/server";
import { AddVideoForm } from "@/components/portal/coach/AddVideoForm";
import { VideoCard } from "@/components/portal/coach/VideoCard";
import { AddResourceForm } from "@/components/portal/coach/AddResourceForm";
import { ResourceCard } from "@/components/portal/coach/ResourceCard";
import type { Resource, Video } from "@/lib/portal";

export default async function CoachLibraryPage() {
  const supabase = await createClient();

  const [
    { data: videos },
    { data: resources },
    { data: clients },
    { data: videoShares },
    { data: resourceShares },
  ] = await Promise.all([
    supabase.from("videos").select("*").order("created_at", { ascending: false }),
    supabase.from("resources").select("*").order("created_at", { ascending: false }),
    supabase.from("profiles").select("id, full_name, email").eq("role", "client").order("full_name"),
    supabase.from("video_shares").select("video_id, client_id"),
    supabase.from("resource_shares").select("resource_id, client_id"),
  ]);

  const videoSharesByVideo = new Map<string, string[]>();
  for (const share of videoShares ?? []) {
    const list = videoSharesByVideo.get(share.video_id) ?? [];
    list.push(share.client_id);
    videoSharesByVideo.set(share.video_id, list);
  }

  const sharesByResource = new Map<string, string[]>();
  for (const share of resourceShares ?? []) {
    const list = sharesByResource.get(share.resource_id) ?? [];
    list.push(share.client_id);
    sharesByResource.set(share.resource_id, list);
  }

  const fileUrls = new Map<string, string>();
  for (const resource of ((resources ?? []) as Resource[]).filter((r) => r.file_path)) {
    const { data } = await supabase.storage
      .from("resources")
      .createSignedUrl(resource.file_path!, 3600);
    if (data) fileUrls.set(resource.id, data.signedUrl);
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Library</h1>
      <p className="mt-1 text-sm text-muted">
        Everything you share with clients. Tag a piece with a stage and tick “give this to
        every client in that stage” and it appears automatically in the library of anyone at
        that point on the path — or send it to one man individually.
      </p>

      <h2 className="font-display mt-10 text-2xl font-light text-foreground">Videos</h2>
      <p className="mt-1 text-sm text-muted">
        Upload to YouTube as <strong>Unlisted</strong> (only people with the link can watch),
        then paste the link here.
      </p>
      <AddVideoForm />
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {((videos ?? []) as Video[]).map((video) => (
          <VideoCard
            key={video.id}
            video={video}
            clients={clients ?? []}
            sharedWith={videoSharesByVideo.get(video.id) ?? []}
          />
        ))}
        {(videos ?? []).length === 0 && (
          <p className="text-sm text-muted">No videos yet.</p>
        )}
      </div>

      <h2 className="font-display mt-12 text-2xl font-light text-foreground">
        Documents & links
      </h2>
      <p className="mt-1 text-sm text-muted">
        Worksheets, reading, exercises — upload a file or paste a link.
      </p>
      <AddResourceForm />
      <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {((resources ?? []) as Resource[]).map((resource) => (
          <ResourceCard
            key={resource.id}
            resource={resource}
            clients={clients ?? []}
            sharedWith={sharesByResource.get(resource.id) ?? []}
            fileUrl={fileUrls.get(resource.id) ?? null}
          />
        ))}
        {(resources ?? []).length === 0 && (
          <p className="text-sm text-muted">No documents or links yet.</p>
        )}
      </div>
    </div>
  );
}
