import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  return [
    { url: `${base}/`,                           priority: 1.0 },
    { url: `${base}/our-mission`,                priority: 0.8 },
    { url: `${base}/about`,                      priority: 0.8 },
    { url: `${base}/testimonials`,               priority: 0.7 },
    { url: `${base}/faq`,                        priority: 0.7 },
    { url: `${base}/enquire`,                    priority: 0.9 },
    { url: `${base}/path/recovery`,              priority: 0.7 },
    { url: `${base}/path/reconstruction`,        priority: 0.7 },
    { url: `${base}/path/re-entry`,              priority: 0.7 },
    { url: `${base}/path/relationship-mastery`,  priority: 0.7 },
    { url: `${base}/privacy`,                    priority: 0.3 },
    { url: `${base}/terms`,                      priority: 0.3 },
  ];
}
