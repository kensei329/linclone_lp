import type { NextConfig } from "next";

// linclone.com (the apex) redirects to www for every path EXCEPT /.well-known/*
// (and the root copy of the AASA, /apple-app-site-association).
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
      // The same file at the root (DONE-C §2.5: "both /.well-known/ and the root").
      { source: "/apple-app-site-association", headers: [{ key: "Content-Type", value: "application/json" }] },
      { source: "/get", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/ja" },
        { source: "/creators", destination: "/ja/creators" },
        // legal/support pages (src/content/legal/pages.ts): JA at the store-registered URLs
        { source: "/support", destination: "/ja/support" },
        { source: "/delete-user", destination: "/ja/delete-user" },
        { source: "/privacy", destination: "/ja/privacy" },
        { source: "/terms", destination: "/ja/terms" },
        { source: "/cookies", destination: "/ja/cookies" },
        { source: "/policies/child-protection-policy", destination: "/ja/policies/child-protection-policy" },
        // LC Studio's legal pages keep the URLs Google Play and the app link to:
        // English unprefixed, Japanese with /ja at the end (src/i18n/paths.ts).
        { source: "/lc-studio/:doc(privacy|terms)", destination: "/en/lc-studio/:doc" },
        { source: "/lc-studio/:doc(privacy|terms)/ja", destination: "/ja/lc-studio/:doc" },
        // DONE-C (clone-net-web docs/DONE-C-HANDOFF.md §2): the clone page and the LC Studio
        // invitation page, JA unprefixed at the URLs the API hands out, EN under /en.
        { source: "/c/:slug", destination: "/ja/c/:slug" },
        { source: "/studio/invite/:code", destination: "/ja/studio/invite/:code" },
        // §2.5: the root copy of the AASA is the /.well-known file itself (one source of truth).
        { source: "/apple-app-site-association", destination: "/.well-known/apple-app-site-association" },
        // one explicit line per future marketing page; NEVER a catch-all (it would hijack /share/*)
      ],
    };
  },
  async redirects() {
    return [
      // Must stay first: the apex-to-www rule described at the top of this file.
      {
        source: "/:path((?!\\.well-known/|apple-app-site-association$).*)",
        has: [{ type: "host", value: "linclone\\.com" }],
        destination: "https://www.linclone.com/:path",
        permanent: false,
      },
      // DONE-C §2.2: the old clone path, forever (LC Studio showed /u URLs before 11 Oct and
      // production keeps them until STUDIO_CLONE_PAGE_C_PATH is on). Same slug, no API call:
      // the /c page resolves old slugs itself. 301 exactly, as the contract asks.
      { source: "/u/:slug", destination: "/c/:slug", statusCode: 301 },
      { source: "/en/u/:slug", destination: "/en/c/:slug", statusCode: 301 },
      // The [lang] forms behind the LC Studio legal rewrites are not public
      // URLs. Before the /ja rule below, which would send Japanese to English.
      { source: "/en/lc-studio/:doc(privacy|terms)", destination: "/lc-studio/:doc", permanent: false },
      { source: "/ja/lc-studio/:doc(privacy|terms)", destination: "/lc-studio/:doc/ja", permanent: false },
      { source: "/ja", destination: "/", permanent: true },
      // keep /ja/…/opengraph-image reachable (metadata image URLs are generated under /ja)
      { source: "/ja/:path((?!.*opengraph-image).*)", destination: "/:path", permanent: true },
    ];
  },
};

export default nextConfig;
