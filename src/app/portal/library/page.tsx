import { createClient } from "@/lib/supabase/server";
import {
  PHASE_KEYS,
  PHASE_LABELS,
  PHASE_NUMERALS,
  formatDate,
  youtubeId,
  type PhaseKey,
  type Resource,
  type Video,
} from "@/lib/portal";

type Item =
  | { kind: "video"; id: string; phase: PhaseKey | null; date: string; note: string; video: Video }
  | {
      kind: "resource";
      id: string;
      phase: PhaseKey | null;
      date: string;
      note: string;
      resource: Resource;
      href: string | null;
    };

export default async function PortalLibraryPage() {
  const supabase = await createClient();

  // RLS returns exactly what this client may see: sent to them, or published to their stage.
  const [{ data: videos }, { data: resources }, { data: videoShares }, { data: resourceShares }] =
    await Promise.all([
      supabase.from("videos").select("*").order("created_at", { ascending: false }),
      supabase.from("resources").select("*").order("created_at", { ascending: false }),
      supabase.from("video_shares").select("video_id, note, created_at"),
      supabase.from("resource_shares").select("resource_id, note, created_at"),
    ]);

  const videoNotes = new Map(
    (videoShares ?? []).map((s) => [s.video_id, { note: s.note as string, at: s.created_at as string }])
  );
  const resourceNotes = new Map(
    (resourceShares ?? []).map((s) => [
      s.resource_id,
      { note: s.note as string, at: s.created_at as string },
    ])
  );

  const items: Item[] = [
    ...((videos ?? []) as Video[]).map((video): Item => {
      const share = videoNotes.get(video.id);
      return {
        kind: "video",
        id: video.id,
        phase: video.phase,
        date: share?.at ?? video.created_at,
        note: share?.note ?? "",
        video,
      };
    }),
    ...((resources ?? []) as Resource[]).map((resource): Item => {
      const share = resourceNotes.get(resource.id);
      return {
        kind: "resource",
        id: resource.id,
        phase: resource.phase,
        date: share?.at ?? resource.created_at,
        note: share?.note ?? "",
        resource,
        href: resource.url,
      };
    }),
  ];

  // Sign any file-backed resources so they can actually be opened.
  for (const item of items) {
    if (item.kind === "resource" && item.resource.file_path) {
      const { data } = await supabase.storage
        .from("resources")
        .createSignedUrl(item.resource.file_path, 3600);
      item.href = data?.signedUrl ?? null;
    }
  }

  const groups: { key: string; label: string; numeral: string | null; items: Item[] }[] = [
    ...PHASE_KEYS.map((key) => ({
      key,
      label: PHASE_LABELS[key],
      numeral: PHASE_NUMERALS[key],
      items: items.filter((i) => i.phase === key),
    })),
    {
      key: "general",
      label: "General",
      numeral: null,
      items: items.filter((i) => i.phase === null),
    },
  ].filter((group) => group.items.length > 0);

  return (
    <div>
      <h1 className="font-display text-3xl font-light text-foreground">Library</h1>
      <p className="mt-1 text-sm text-muted">
        Everything Arun has shared with you, gathered by stage.
      </p>

      {groups.length === 0 && (
        <p className="mt-8 text-sm text-muted">
          Nothing here yet. Materials will appear as Arun shares them with you.
        </p>
      )}

      {groups.map((group) => (
        <section key={group.key} className="mt-10">
          <div className="flex items-baseline gap-3 border-b border-brown/20 pb-2">
            {group.numeral && (
              <span className="font-display text-2xl font-light text-gold/60">
                {group.numeral}
              </span>
            )}
            <h2 className="font-display text-2xl font-light text-foreground">{group.label}</h2>
            <span className="text-xs tracking-[0.15em] text-muted uppercase">
              {group.items.length} {group.items.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="mt-5 grid gap-6 md:grid-cols-2">
            {group.items.map((item) =>
              item.kind === "video" ? (
                <VideoItem key={`v-${item.id}`} item={item} />
              ) : (
                <ResourceItem key={`r-${item.id}`} item={item} />
              )
            )}
          </div>
        </section>
      ))}
    </div>
  );
}

function VideoItem({ item }: { item: Extract<Item, { kind: "video" }> }) {
  const id = youtubeId(item.video.youtube_url);
  return (
    <div className="border border-brown/20 bg-surface/50">
      {id && (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title={item.video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-display text-xl font-light text-foreground">{item.video.title}</h3>
        {item.video.description && (
          <p className="mt-1 text-sm text-muted">{item.video.description}</p>
        )}
        {item.note && (
          <p className="mt-2 border-l-2 border-gold pl-3 text-sm text-foreground italic">
            {item.note}
          </p>
        )}
        <p className="mt-2 text-xs text-muted/70">Added {formatDate(item.date)}</p>
      </div>
    </div>
  );
}

function ResourceItem({ item }: { item: Extract<Item, { kind: "resource" }> }) {
  return (
    <div className="flex flex-col border border-brown/20 bg-surface/50 p-5">
      <p className="text-xs tracking-[0.15em] text-muted uppercase">
        {item.resource.kind === "file" ? "Document" : "Link"}
      </p>
      <h3 className="font-display mt-1 text-xl font-light text-foreground">
        {item.resource.title}
      </h3>
      {item.resource.description && (
        <p className="mt-1 text-sm text-muted">{item.resource.description}</p>
      )}
      {item.note && (
        <p className="mt-2 border-l-2 border-gold pl-3 text-sm text-foreground italic">
          {item.note}
        </p>
      )}
      {item.href && (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block self-start border border-burgundy/50 px-5 py-2.5 text-xs tracking-[0.2em] text-burgundy uppercase transition-all hover:border-burgundy hover:bg-burgundy/5"
        >
          {item.resource.kind === "file" ? "Open document" : "Open link"}
        </a>
      )}
      <p className="mt-3 text-xs text-muted/70">Added {formatDate(item.date)}</p>
    </div>
  );
}
