import type { NextConfig } from "next";

// linclone.com (the apex) redirects to www for every path EXCEPT /.well-known/*.
// Apple's and Google's app-association fetchers read
// /.well-known/apple-app-site-association and /.well-known/assetlinks.json from
// the apex itself and refuse to follow redirects, so those two files must be
// served here. This rule replaces the per-domain redirect in the Vercel
// dashboard, which cannot exclude a path: that dashboard redirect must be set
// to "No Redirect" for this rule to be reached. 307 keeps the status the
// dashboard redirect used.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: { globalNotFound: true },
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      {
        source: "/.well-known/apple-app-site-association",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
      { source: "/get", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/ja" },
        { source: "/creators", destination: "/ja/creators" },
        // one explicit line per future marketing page; NEVER a catch-all (it would hijack /share/*)
      ],
    };
  },
  async redirects() {
    return [
      // Must stay first: the apex-to-www rule described at the top of this file.
      {
        source: "/:path((?!\\.well-known/).*)",
        has: [{ type: "host", value: "linclone\\.com" }],
        destination: "https://www.linclone.com/:path",
        permanent: false,
      },
      { source: "/ja", destination: "/", permanent: true },
      // keep /ja/…/opengraph-image reachable (metadata image URLs are generated under /ja)
      { source: "/ja/:path((?!.*opengraph-image).*)", destination: "/:path", permanent: true },
    ];
  },
};

export default nextConfig;
