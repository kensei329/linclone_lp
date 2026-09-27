import type { NextConfig } from "next";

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
      { source: "/ja", destination: "/", permanent: true },
      // keep /ja/…/opengraph-image reachable (metadata image URLs are generated under /ja)
      { source: "/ja/:path((?!.*opengraph-image).*)", destination: "/:path", permanent: true },
    ];
  },
};

export default nextConfig;
