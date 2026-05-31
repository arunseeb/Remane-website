export const NAV_ITEMS = [
  { label: "The Path", href: "#path" },
  { label: "Enquire", href: "#enquire" },
] as const;

export const MENU_ITEMS = [
  { label: "Our Philosophy", href: "/our-mission" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Transformations", href: "/transformations" },
] as const;

export const VISUAL_PANELS = [
  {
    id: "panel-1",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=85&fit=crop",
    alt: "Refined interior with natural light",
    videoPath: "/video/panel-1.mp4",
  },
  {
    id: "panel-2",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=85&fit=crop",
    alt: "Warm living space with wood and leather",
    videoPath: "/video/panel-2.mp4",
  },
  {
    id: "panel-3",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe3c364df?w=1920&q=85&fit=crop",
    alt: "Quiet luxury atmosphere",
    videoPath: "/video/panel-3.mp4",
  },
] as const;

export const PHASES = [
  {
    numeral: "I",
    title: "Recovery",
    line: "Emotional steadiness and a clear mind.",
    href: "/path/recovery",
    image: "/images/recovery.png",
    alt: "Man in quiet contemplation by a window",
  },
  {
    numeral: "II",
    title: "Reconstruction",
    line: "Body, style, and social presence — refined.",
    href: "/path/reconstruction",
    image: "/images/reconstruction.png",
    alt: "Tailored jacket and fine materials",
  },
  {
    numeral: "III",
    title: "Re-entry",
    line: "Connection and discernment, on your terms.",
    href: "/path/re-entry",
    image: "/images/re-entry.png",
    alt: "Tasteful dinner setting for two",
  },
  {
    numeral: "IV",
    title: "Relationship Mastery",
    line: "Devotion, care, and love done well.",
    href: "/path/relationship-mastery",
    image: "/images/relationship-mastery.png",
    alt: "Relationship Mastery panel image",
  },
] as const;
