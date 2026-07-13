import type { NextConfig } from "next";

// Turbopack needs eval in dev; the production bundle does not, and dropping
// 'unsafe-eval' there closes off a whole class of injected-script tricks.
const scriptSrc = `'self' 'unsafe-inline'${
  process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
} https://assets.calendly.com`;

const securityHeaders = [
  // Prevent browsers guessing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection for older browsers (CSP frame-ancestors covers modern ones)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop referrer leaking to third-party sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 2 years once visited
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable unnecessary browser features. Microphone allowed for same-origin only —
  // the coach's dictation field in the portal uses it.
  { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline for hydration scripts; eval is dev-only (above)
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.calendly.com https://i.ytimg.com",
      "font-src 'self'",
      // Formspree form posts + Calendly API calls + Supabase (portal: auth, data, realtime, storage)
      "connect-src 'self' https://formspree.io https://calendly.com https://*.calendly.com https://*.supabase.co wss://*.supabase.co",
      // Calendly inline widget iframe + YouTube embeds (portal video bank)
      "frame-src https://calendly.com https://*.calendly.com https://www.youtube-nocookie.com https://www.youtube.com",
      // Prevent this site from being embedded elsewhere
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
