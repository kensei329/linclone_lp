# Clone pages (DONE-C, linclone.com half)

Spec: clone-net-web `docs/DONE-C-HANDOFF.md` §2 (branch `claude/k1009-donec`), using the two public reads
of §1.1 / §1.2. Copy status: [copy-gaps-clone-pages.md](./copy-gaps-clone-pages.md).

## Routes

| URL | What | Code |
|---|---|---|
| `/c/<slug>` (JA), `/en/c/<slug>` | Clone page (§2.1) | `src/app/(site)/[lang]/c/[slug]/` |
| `/u/<slug>`, `/en/u/<slug>` | **301** to `/c/<slug>`, no API call, forever (§2.2) | `next.config.ts` redirects |
| `/studio/invite/<code>` (JA), `/en/studio/invite/<code>` | LC Studio invitation (§2.3) | `src/app/(site)/[lang]/studio/invite/[code]/` |
| `/.well-known/apple-app-site-association`, `/apple-app-site-association` | AASA (§2.5), one file | `public/.well-known/`, root via rewrite |
| `/.well-known/assetlinks.json` | Android App Links (§2.6) | `public/.well-known/` |

Behaviour:

- **Clone page.** API 404 → neutral "not available" page, HTTP 404. `redirect: true` → permanent redirect to
  `url` (EN: `/en/c/<canonical slug>`). Otherwise avatar, name, `@username` (only when non-null), bio, and
  OG/Twitter tags from `og` (`og:description` / `og:image` only when non-null, `twitter:card=summary`, no
  site card in place of a missing avatar). A link-only (UNLISTED) clone is `noindex`.
- **Invitation page.** 404 → "not valid" (HTTP 404); `USED` / `EXPIRED` → their own states; `VALID` → the
  code in large type. Always `noindex`.
- **Phone vs computer** is CSS on `html[data-platform]` (set before paint by the `(site)` layout's head
  script), so each page is one cached render for everyone. Phone: one button. Computer (and no JS): the right
  app's store badges + a QR code (server-rendered SVG, existing `qrcode` dependency) of the API's `url`.
- **The button** (`src/components/clone-pages/HandoffButton.client.tsx`): on tap, copies `url` to the
  clipboard, then opens the App Store (`https://apps.apple.com/jp/app/id6748680628`, Studio `id6798622206`)
  or Google Play with `&referrer=` + `encodeURIComponent("lc_link=" + encodeURIComponent(url))`
  (`src/lib/clone-links.ts`). In LINE / Instagram / X in-app browsers (`html[data-inapp]`) it first tries
  `linclone://share/clone/<influencerId>` (invitation: the API's `appLink`, `lcstudio://invite?code=…`) and
  goes to the store if the page is still visible ~1.6 s later. No fingerprinting.

## API host and caching

- `LINCLONE_PUBLIC_API_URL` (server-only, read at request time). **Unset = the dev host
  `https://api-dev.linclone.com`.** Production on Vercel must set `https://api.linclone.com`
  (Project → Settings → Environment Variables, Production), staging the staging host. No other secret.
- `src/lib/public-api.ts`: each answer (200 and 404) is kept 60 s in the Next.js data cache
  (`unstable_cache`), and the pages are ISR with `revalidate = 60`. A 429, 5xx, timeout (5 s) or malformed
  answer is never cached: the stale answer keeps being served; with nothing cached yet the visitor gets the
  neutral page (clone: 404; invitation: the neutral state). Slugs/codes that the API could never accept
  (`[A-Za-z0-9_-]{1,64}` / `[A-Z0-9_-]{1,32}` after trim + upper-case) are answered 404 without a call.
- Checked locally against a mock API: 60 s caching, stale page served while the API answers 429, `/u` 301,
  404 / USED / EXPIRED / VALID states, the exact Play referrer URL, copy-then-store on tap.

## AASA (§2.5) — applied as written

LC Studio narrowed to `/studio/invite/*`; every fan-app entry (`com.linclone.app`, `.stg`, `.qa`, `.dev`)
gets `"NOT /studio/*"` before `"*"`; `webcredentials` unchanged. Served `application/json`, 200, no redirect
on the apex (the apex→www rule now also skips the root `/apple-app-site-association`). After deploy, poll
`https://app-site-association.cdn-apple.com/a/v1/linclone.com` until the new paths show (up to a day).

## assetlinks.json (§2.6)

> **TODO (Puneet):** the SHA-256 of the **Play app-signing certificate** of `com.linclone.app`
> (Play Console → Setup → App signing) is not known yet. Add it to the `com.linclone.app` entry's
> `sha256_cert_fingerprints` (keep the three fingerprints already there; one of them may already be it —
> compare before adding). Do not guess a value. Puneet also confirms LC Studio's (added 24 Sept) is current.

The file is unchanged on this branch. `com.linclone.app` already has `handle_all_urls`.

## Known deviations / open points

- `redirect: true` answers **308** (Next.js `permanentRedirect`), not the contract's literal 301: a page
  cannot set 301, and doing the API call in a proxy instead would double the calls against the shared rate
  limit. Both are permanent; for GET they behave the same. `/u/<slug>` is an exact 301 (config redirect).
- The apex `linclone.com/c/…` and `/studio/invite/…` still 307 to `www` like every page (Universal Links
  and App Links read the apex AASA / assetlinks, which are served without a redirect).
- The (site) layout no longer sets `dynamicParams = false` (Next.js applies one segment's `false` to every
  route below it); every other page under `[lang]` sets it itself. Side effect: `/xx/opengraph-image-…/card`
  for an unknown locale now renders the JA card instead of a 404.
- Store badges link to LC Studio's store pages even though `STUDIO_LIVE` is false: the contract asks for
  them, and only invitees reach this page. Until both v3 apps are in the stores, test with TestFlight / Play
  internal testing (the Play Install Referrer needs a Play-track install).
