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
  async redirects() {
    return [
      {
        source: "/:path((?!\\.well-known/).*)",
        has: [{ type: "host", value: "linclone\\.com" }],
        destination: "https://www.linclone.com/:path",
        permanent: false,
      },
    ];
  },
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
    ];
  },
};

export default nextConfig;
