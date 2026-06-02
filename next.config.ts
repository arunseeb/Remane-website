import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers guessing MIME types
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Clickjacking protection for older browsers (CSP frame-ancestors covers modern ones)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Stop referrer leaking to third-party sites
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for 2 years once visited
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Disable unnecessary browser features
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline + unsafe-eval for hydration scripts
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.calendly.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://images.unsplash.com https://*.calendly.com",
      "font-src 'self'",
      // Formspree form posts + Calendly API calls
      "connect-src 'self' https://formspree.io https://calendly.com https://*.calendly.com",
      // Calendly inline widget iframe
      "frame-src https://calendly.com",
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
