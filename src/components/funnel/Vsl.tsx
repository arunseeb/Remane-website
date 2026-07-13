import Image from "next/image";

// Unlisted YouTube video ID for the VSL. Leave empty until the film is recorded —
// the placeholder panel renders instead.
const VSL_VIDEO_ID = "";

export function Vsl() {
  return (
    <div className="relative aspect-video w-full overflow-hidden bg-[#1a1410] shadow-[0_30px_80px_-30px_rgba(44,36,25,0.5)]">
      {VSL_VIDEO_ID ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${VSL_VIDEO_ID}?rel=0&modestbranding=1&playsinline=1`}
          title="Remane — a message from Arun"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <div className="grain absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center">
          <Image
            src="/brand/remane-lion-gold.png"
            alt=""
            width={72}
            height={72}
            className="opacity-70"
          />
          <p className="font-display text-2xl text-[#f3efe8] md:text-3xl">
            A message from Arun
          </p>
          <p className="text-xs tracking-[0.25em] text-[#d6b687]/70 uppercase">
            The film is being prepared
          </p>
        </div>
      )}
    </div>
  );
}
