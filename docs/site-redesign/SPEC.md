# LinClone marketing site: final design and build spec

**Concept: 「推しと過ごす一日、字幕つき」 / "A day with your favorite, captioned"**

This spec covers `/` (JA), `/en`, `/creators` (JA) and `/en/creators`. Parallel engineers build from it. Copy lives in `ja.json` / `en.json` next to this file (1007 keys each, identical key sets, lint-clean after the final critic pass). If this spec and the dictionaries disagree, the dictionaries win for wording and this spec wins for structure.

How to read it:
- Keys are written `home.call.title`, meaning `d.home.call.title` in code.
- `svh` heights are the scroll length of a section. "Stage" means a `position: sticky; top: 0; height: 100svh` child inside that section.
- "p" means ScrollTrigger progress of a section, from 0 to 1.
- Desktop is ≥1024px and mobile is <1024px, unless a row says otherwise.

---

## §1 Final concept and design principles

### 1.1 Concept (one paragraph)

The fan page is **one day spent with your 推し, told as live captions**. The backbone comes from *day-with-oshi*:
- the time-of-day light: dawn → day → night → sunrise
- the keyword-bearing chapter H2s 「推しの声で、目がさめる。」「昼休みは、チャットの続き。」「今夜は、推しのLIVE配信。」「夜は、推しを育てる時間。」「最初の60秒は、無料で話せる。」
- strict truth discipline

The conversion and engineering layer comes from *kinetic-editorial*:
- 声のテロップ caption lines with a travelling caption marker
- メンカラ can-badge auras with per-creator 声紋 voiceprints in place of faces
- a captions-only **tap-to-call demo** that ends on the store badges
- the final CTA as a **reverse collapse** of the call back into a phone
- lite mode, contrast-safe CTAs, lazy animators

From *phone-as-stage* it takes:
- the app's navigation grammar for screen changes
- background-clip text fills
- the head script that sets `data-platform`
- the 「アプリでできること、ぜんぶ」 index
- the phone-to-app-icon morph at the mid-page download point

The hero states the whole proposition in the first mobile viewport: category, H1 「推しと、声で話そう」, the 60 free seconds, the store CTA and the AI-clone disclosure.

Straight after, the page proves the core value with two moves. First, "scroll expands the screen": a phone showing the free first call grows into a full-bleed night call stage. Second, the VoiceCallGlow handoff moves light between fan and 推し while the captions fill.

The day then runs: morning call at dawn, chat and Stories at lunch, LIVE配信 at night, 育成 before bed. At sunrise the page returns to cream for the rest of the app, how it works, FAQ and the creator band. It closes by shrinking the call back into a phone beside the badges.

`/creators` runs the Studio's "control room" in the same system. The command-centre expands (the shipped D01 layout; its 7 tiles are the page's table of contents), then the clone-check self-call expands. Earnings are qualitative only. There is one clear, invitation-only CTA.

### 1.2 Design principles (binding for every package)

1. **Five seconds, no scroll.** At 390×664 (an in-app browser), these must all be visible without scrolling: category eyebrow, H1, lead with 「最初の60秒は無料」, the primary store CTA, and 「クリエイターのプロフィールはすべてAIクローンです」. The same test applies at 1280×720 and 1440×900.
2. **Voice you can read.** SNS visitors have the sound off, so voice is always shown as captions. Nothing autoplays audio. The demo is captions-only unless a rights-cleared sample exists (`DEMO_AUDIO_SRC`).
3. **Honest by construction.** Truth rules live in data and props, not in reviewers' memory:
   - the only numerals are "free" and "60 seconds", plus UI clocks and timers inside mockups
   - no prices, counts or versions
   - free relationship modes only
   - no video
   - no "Mina" and no real people
   - CI lint enforces all of this (§9.6)
4. **Cream Glass, lit.** Use only the app's tokens: cream surfaces, frosted glass, and teal for action. Night (#0f1018) is used only for the call stage, the LIVE stage, the final CTA and the footer. There are no solid poster bands, no full-page grain blend and no invented colours.
5. **Motion adds, never gates.**
   - Server HTML is the final state: text filled, stages expanded (or collapsed, for the final CTA).
   - JS applies start states only to content that is below the fold at init.
   - Only transform, opacity, clip-path and one CSS custom property per effect are animated.
   - Reduced motion shows the final state.
   - The hero H1 is the LCP element and is never at opacity 0.
6. **Mobile first.**
   - At most **3 scrubbed sticky stages on mobile**, each ≤200svh.
   - About **14 viewport-heights to the final CTA on mobile** and about 18 on desktop.
   - No meaningful mockup text renders below an effective 0.75 scale. Use cropped `ScreenSlice`s at 0.8.
   - A sticky phone, a bottom sheet, the sticky bar and the header are never stacked together.
7. **Download is always one tap away.** Download points:
   - server-rendered badges in the hero
   - the demo done card
   - the checkpoint after the call
   - the mid-page CTA with the icon morph
   - the final CTA
   - the footer
   - the sticky mobile bar
   - the desktop QR dock
   - the Smart App Banner (fan pages only)
   - a header CTA that works without JS
8. **No faces.** Creators appear as メンカラ aura can-badges with 声紋. A photo can only render through `CreatorImage` when `licensed: true` and `rightsRef` are set; otherwise the build throws. Every mockup cluster carries `common.screenNote`.
9. **Accessible by default.**
   - Ink labels on the teal gradient, never white.
   - `#5b5970` is the minimum for any text on cream; `#8d8ba0` is decoration only.
   - One H1 per page, a real H2 per section, one text fill per viewport.
   - Real text in the DOM, with `forced-colors` overrides.

### 1.3 What was fixed relative to the three concepts (traceability)

| Judge must-fix | Resolution in this spec |
|---|---|
| Mina persona and real-singer traits; @kensei | Cast is Yuzu, Ren, Kai, Sora, Nagi and Aoi, with fan ひなた. New traits only: dance, sweets, hojicha latte, board games, rainy-day songs, cafés. The lint bans Mina, Kensei, 星空, シンセ, 深夜ラジオ, フィルム, 神戸 and Kobe. |
| Numbers rule | LIVE request copy uses a hedge: 「準備ができしだい配信が始まります」 (`mock.fan.liveRequest.body`). No 30分/3分, +N counts, 翌月5日, ring %, counts or versions. The wired 「通常約1分」 is behind `CLAIMS.liveTimingWired` and is **not** in the dictionaries. |
| Privacy contradiction | No 「読んだことは通知されません」 anywhere. There is no "creators can't see chats" claim on fan pages. Official replies are shown (verified shipped). |
| Studio store badges | While `STUDIO_LIVE=false`: neutral text pills 「App Store・近日公開」 that are `aria-disabled`. No badge artwork, no Smart App Banner, no offers or installUrl. |
| 390×664 first viewport | Acceptance wireframe in §5.1 and a Playwright test in §9.7. |
| Scroll length | Budget table in §5.0. Mobile has 3 sticky stages: call 180svh, LIVE 160svh, final 140svh. |
| Demo must read as a demo | A 「デモ」 tag on the button and in the stage, captions only, and a note on the done card. The done card points to the real free 60 seconds. |
| 「本人の声と言葉から」 for legacy clones | Not used on the fan page. The trust card says 「クリエイターが公認した、公式のAIクローン」. Any copy variant is behind `CLAIMS.builtFromOwnVoice=false`. |
| Disclosure placement | Hero, `#about` bar, final CTA and footer on both locales. LIVE audio-only chip next to the LIVE H2. |
| Morning call and LIVE honesty | 「自分で決めると」 wording, inline Focus/DND note, no proactive calls. The chapter eyebrows carry no clock times (no "20:00"). |
| CTA contrast | `.btn-primary` = teal gradient with an ink label (5.5–6.8:1). Studio CTA = violet #8b55d6 with white (4.8:1). |
| Header CTA without JS | Server href `/get?src=header&lang=…`, upgraded by `html[data-platform]` CSS before paint. |
| /creators first viewport and literal H1 | 「自分の公認AIクローンを、スマホでつくる。」 with 招待制 eyebrow, mailto, copy address and 近日公開 pills. The written editor is stated, links are Wikipedia/YouTube only, and there is no AI interview. |
| FAQ coverage | Voice-only, store-only payment, deleting memories, Apple/Google without a password, link to /creators, account deletion. No FAQPage promise. |
| Performance density | One active fill per viewport. At most 4 stickers per viewport on desktop and 2 on mobile. Loops paused off-screen. Animators lazy-loaded. At most 3 live backdrop-filters per viewport on mobile and 6 on desktop. |
| Night-heavy second half | Night only for the call, LIVE, final CTA and footer. 育成 is lavender. Bento, how-it-works, FAQ and the creators band are cream or lavender. |
| Structure contradiction (hero vs expand) | Hero and call stage are separate sections. |
| Clip-path cost | No backdrop-filter, filter:blur or text fill inside a clip-expanding layer while the clip runs. Lite mode uses a simple reveal. |
| JA fonts | Preloaded Noto Sans JP 800 headline subset (JA pages only) plus the Noto Sans JP variable body with `preload:false`. |
| LIVE iconography | `podcasts` / `graphic_eq` only. The `videocam` glyph does not exist in the icon set. |
| Keyword gap | 推し活, AIチャット, AI通話 appear in meta and FAQ. EN uses "AI clone app". |
| ファン/あなた on /creators | Zero. The lint enforces it on `creators.*`, `mock.studio.*` and `meta.creators.*`. |
| Launch gating | `LAUNCH.v3PublicOnStores=false` shows `common.devNote` under every mockup cluster. Never write "new" or "now available". |

### 1.4 Owner decisions still open (build must not block on them)

Defaults ship. Each flag lives in `src/lib/site-config.ts`.

1. `CLAIMS.liveTimingWired`: may the wired 「通常約1分」 be shown? Default false; the hedge copy ships.
2. `CLAIMS.builtFromOwnVoice`: does "made from the creator's own voice and words" hold for legacy v1.0 clones? Default false.
3. `CLAIMS.liveDropIn` (Studio LIVE drop-in, "likely") and `CLAIMS.legacyCarryOver` (v1.0 carry-over, "likely"). Default false; the copy exists but is not rendered.
4. Relationship-mode JA names: ふつう・やさしい・親友・応援団・スパルタ・ツンデレ are glossary proposals (OPEN).
5. JA for the Studio per-chat pause switch: `mock.studio.thread.pause*` is a proposal. The shipped app string is untranslated.
6. Verified social accounts for the footer and `Organization.sameAs`. Default: none, except the App Store developer page.
7. App Store `pt` provider token (`FAN_APP.appStoreProviderToken`). Default null.
8. The privacy statement conflict between the fan app's aggregated-stats text and Studio's chat reading. This must be resolved by legal before launch. The fan page stays silent on it. **Note:** `/creators` necessarily shows that creators can read follower chats and post official replies (`creators.real.officialBody`, D02b, shipped), and says individual follower data is shown only inside LC Studio (`creators.insights.privacy`, worded to match the Studio app string). Legal must sign off both lines together with the fan-app privacy text.
9. Launch timing with the v3 store release, and localising the App Store listing into JA. **Launch blocker** (see §9.8).
10. Narrowing the fan-app AASA so `/creators` links open in the browser. This is an app-team change; the site does not touch `.well-known`.

---

## §2 Routes and file tree

> **Before editing anything, engineers must re-read `middleware.ts`, `next.config.ts`, `package.json` and `src/app/layout.tsx` from the current branch.** The owner's production branch may have diverged. Never edit `public/.well-known/*`: production serves a newer AASA/assetlinks than the repo, and deploys must preserve what is live.

### 2.1 URL map

| URL | Served by | Notes |
|---|---|---|
| `/` | rewrite → `/ja` → `src/app/(site)/[lang]/page.tsx` | JA fan home |
| `/en` | `(site)/[lang]/page.tsx` | EN fan home |
| `/creators` | rewrite → `/ja/creators` → `(site)/[lang]/creators/page.tsx` | JA LC Studio |
| `/en/creators` | same | EN LC Studio |
| `/ja`, `/ja/*` | 308 → `/`, `/*` (except `*opengraph-image*`) | never linked |
| `/get` | `src/app/get/route.ts` | noindex redirect by user agent (QR and no-JS CTA) |
| `/invite`, `/share/clone/[id]`, `/share/post/[id]`, `/privacy`, `/terms`, `/cookies`, `/support`, `/delete-user`, `/policies/child-protection-policy` | `src/app/(legacy)/…` moved **byte-for-byte** | URLs unchanged |
| `/sitemap.xml`, `/robots.txt` | `src/app/sitemap.ts`, `src/app/robots.ts` | new |
| `/.well-known/*` | `public/.well-known/*` | **do not touch** |
| `/studio/*` | none | reserved for Studio universal links; never create routes there |

### 2.2 Final tree (new = ★, moved = →, changed = ✎)

```
linclone_lp/
├─ next.config.ts ✎
├─ package.json ✎
├─ middleware.ts ✗ (delete)
├─ scripts/ ★
│  ├─ split-dictionaries.mjs        # scratchpad ja.json/en.json → src/i18n/dictionaries/{ja,en}/*.json + index.ts
│  ├─ lint-copy.mjs                 # §9.6 rules + key parity; runs in prebuild and CI
│  ├─ build-ja-headline-font.mjs    # subset NotoSansJP-ExtraBold to headline glyphs → public/fonts/
│  ├─ build-icons.mjs               # Material Symbols SVG paths → src/components/site/icons/paths.ts
│  └─ build-brand-assets.mjs        # sharp: logo package → public/brand/*, src/app/icon.png, apple-icon.png, favicon.ico
├─ assets-src/ ★                    # committed sources for the scripts (not served)
│  ├─ fonts/NotoSansJP-ExtraBold.ttf           # OFL, from Google Fonts
│  └─ brand/ (copy of scratchpad fan-v3-design/logo-package/**)
├─ public/
│  ├─ .well-known/**                 # UNTOUCHED
│  ├─ icon-1.png                     # keep (legacy layout metadata references it)
│  ├─ showcase.mp4, file.svg, globe.svg, next.svg, window.svg   ✗ delete (grep first; only old home used them)
│  ├─ brand/ ★  mark-64.png mark-128.png mark-256.png mark-512.png mark-white-256.png logo-512.png (mark on white, JSON-LD) appicon-180.png appicon-512.png
│  ├─ badges/ ★ app-store-ja.svg app-store-en.svg google-play-ja.png google-play-en.png   # OFFICIAL artwork, unmodified
│  ├─ fonts/ ★  NotoSansJP-Headline.woff2      # generated
│  └─ textures/ ★ noise-128.png (≤2 KB, used at 3.5% opacity in hero/aura only)
└─ src/
   ├─ app/
   │  ├─ favicon.ico ✎ (regenerated from appicon-48)   icon.png ★ (512)   apple-icon.png ★ (180)
   │  ├─ icon-1.png ✗ (delete; the file convention would apply the old v2 icon to new pages)
   │  ├─ global-not-found.tsx ★
   │  ├─ sitemap.ts ★   robots.ts ★
   │  ├─ get/route.ts ★
   │  ├─ page.tsx ✗ (old home)   layout.tsx → (legacy)/layout.tsx   globals.css → (legacy)/globals.css
   │  ├─ (legacy)/ →  layout.tsx globals.css cookies/ delete-user/ invite/ policies/ privacy/ share/ support/ terms/
   │  └─ (site)/[lang]/ ★
   │     ├─ layout.tsx                 # root layout #2: <html lang>, fonts, head script, SmoothScroll
   │     ├─ page.tsx                   # fan home
   │     ├─ opengraph-image.tsx        # fan OG (per locale)
   │     └─ creators/
   │        ├─ page.tsx
   │        └─ opengraph-image.tsx
   ├─ styles/site.css ★               # Tailwind v4 entry for (site): @theme tokens, base, components
   ├─ i18n/ ★
   │  ├─ config.ts  get-dictionary.ts  format.ts  paths.ts  types.ts
   │  └─ dictionaries/ index.ts (generated)  ja/*.json  en/*.json
   ├─ lib/ ★
   │  ├─ site-config.ts  store-links.ts  personas.ts  analytics.ts
   │  ├─ units.tsx (server-only BudouX)   qr.ts (server-only)   jsonld.ts
   │  ├─ fonts.ts                      # next/font instances
   │  └─ motion/ load.ts  use-scroll-scene.ts  use-expand-stage.ts  use-in-view.ts  policy.ts  smooth-scroll.tsx  tokens.ts
   ├─ components/
   │  ├─ ClientProvider.tsx            # KEEP (legacy)
   │  ├─ HeroSection.tsx FeaturesSection.tsx CloneProcessSection.tsx DemoSection.tsx BetaSection.tsx Footer.tsx LanguageToggle.tsx  ✗ delete
   │  ├─ site/ ★   (chrome and primitives, §4)
   │  ├─ sections/home/ ★  (one folder per section, §5)
   │  ├─ sections/creators/ ★ (§6)
   │  ├─ mockups/kit/ ★  mockups/fan/ ★  mockups/studio/ ★ (§7)
   │  └─ seo/JsonLd.tsx ★
   ├─ hooks/useClientTranslation.ts   # KEEP (terms, cookies)
   ├─ lib/i18n.ts                     # KEEP (ClientProvider)
   └─ locales/{ja,en}/translation.json # KEEP (invite page and legacy client i18n)
```

**What legacy still needs** (verified from imports; so i18n client libs are *not* deleted):
- `(legacy)/layout.tsx` → `@/components/ClientProvider` → `@/lib/i18n` → `react-i18next`, `i18next`, `js-cookie`, `@/locales/*`
- terms, cookies → `@/hooks/useClientTranslation`
- invite → `@/locales/*`
- support → `framer-motion`, `@heroicons/react`

Keep all of these dependencies. Delete only the 7 old home components listed above. After moving, run `grep -rn "components/\(Hero\|Features\|CloneProcess\|Demo\|Beta\|Footer\|LanguageToggle\)" src` and expect zero hits.

The legacy layout keeps its `cookies()` call and its `ClientProvider`. Without the middleware, the `i18next` cookie is no longer auto-set, so legacy pages default to `ja` unless the visitor's own cookie says `en`. That is the intended behaviour.

### 2.3 `next.config.ts` (final)

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  images: { formats: ['image/avif', 'image/webp'] },
  async headers() {
    return [
      // KEEP the existing entry exactly as it is on the current branch:
      { source: '/.well-known/apple-app-site-association', headers: [{ key: 'Content-Type', value: 'application/json' }] },
      { source: '/get', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/ja' },
        { source: '/creators', destination: '/ja/creators' },
        // one explicit line per future marketing page; NEVER a catch-all (it would hijack /share/*)
      ],
    };
  },
  async redirects() {
    return [
      { source: '/ja', destination: '/', permanent: true },
      // keep /ja/…/opengraph-image reachable (metadata image URLs are generated under /ja)
      { source: '/ja/:path((?!.*opengraph-image).*)', destination: '/:path', permanent: true },
    ];
  },
};
export default nextConfig;
```

Verify after build:
- `curl -I /` → 200 (JA HTML)
- `/ja` → 308 to `/`
- `/ja/creators` → 308 to `/creators`
- `/ja/opengraph-image` → 200 `image/png`
- `/share/clone/abc` → 200 (legacy)
- `/invite?code=X` → 200

### 2.4 Middleware removal

Delete `middleware.ts` (the ipapi.co geolocation). There is no replacement proxy. It made every page dynamic, served mixed-language signals to crawlers, and set a cookie on every response. If a proxy is ever needed, name it `src/proxy.ts` (Next 16) with a matcher that excludes `_next`, metadata files, `.well-known`, `get`, `invite` and `share`.

### 2.5 `package.json`

- Add dependencies:
  - `gsap@^3.15.0`
  - `@gsap/react@^2.1.2`
  - `lenis@^1.3.26`
  - `budoux@^0.9.2` (server only)
  - `qrcode@^1.5.4` (server only)
  - `server-only@^0.0.1`
- Add devDependencies:
  - `@types/qrcode`
  - `sharp` (scripts)
  - `subset-font@^2` (harfbuzz WASM, node-only)
  - `@material-symbols/svg-400` (Apache-2.0; build-time only)
  - `@playwright/test`
  - `@lhci/cli`
- Scripts:
  - `"dev": "next dev"`
  - `"build": "next build"`
  - `"prebuild": "node scripts/lint-copy.mjs && node scripts/build-ja-headline-font.mjs --check"`
  - `"lint": "eslint ."` (`next lint` is removed in Next 16)
  - `"copy:lint": "node scripts/lint-copy.mjs"`
  - `"dict:split": "node scripts/split-dictionaries.mjs"`
  - `"fonts:ja": "node scripts/build-ja-headline-font.mjs"`
  - `"icons": "node scripts/build-icons.mjs"`
  - `"brand": "node scripts/build-brand-assets.mjs"`
  - `"test:e2e": "playwright test"`
- Keep `next@^16.1.1`. Do **not** depend on `next/root-params`, which requires 16.3; read `params` instead. Upgrading to 16.3.x is optional and must not change any code path.
- Remove `--turbopack` from dev; it is the default in 16.
- Do not add `@vercel/analytics` or Speed Insights unless the owner asks. The `track()` shim (§4) works without them.

### 2.6 `global-not-found.tsx`

It imports `@/styles/site.css` and the fonts. It renders `<html lang="ja">`. Content: the wordmark, a JA+EN bilingual title and body from `meta.notFound` (imported directly from the ja/en JSON), and links to `/` and `/en`. It exports `metadata = { title: 'Page not found | LinClone', robots: { index: false } }`.

### 2.7 `get/route.ts`

```ts
export const dynamic = 'force-dynamic';
export function GET(req: Request) {
  const url = new URL(req.url);
  const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'ja';
  const src = (url.searchParams.get('src') ?? 'qr').replace(/[^a-z0-9_-]/gi, '').slice(0, 24) as Placement;
  const ua = req.headers.get('user-agent') ?? '';
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && /Mobile/.test(ua));
  const isAndroid = /Android/.test(ua);
  const dest = isIOS ? storeUrl('ios', lang, src) : isAndroid ? storeUrl('android', lang, src) : `${lang === 'en' ? '/en' : '/'}#download`;
  return Response.redirect(new URL(dest, url.origin), 302);
}
```

Fan-app users who scan the QR with the app installed land in the app, because the AASA claims `*`. That is acceptable.

---

## §3 Design tokens, typography, surfaces

All colours come from the fan app's `tokens.ts` and the Studio `tokens.ts` (verified in verdict.json). **Do not invent colours.** The persona accents are taken from the app's `mock.ts` creator accents.

### 3.1 `src/styles/site.css`: Tailwind v4 `@theme`

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-surface="dark"], [data-surface="dark"] *));

@theme {
  /* ── ink ── */
  --color-ink: #28273b;          /* text on light */
  --color-ink-2: #5b5970;        /* secondary text: MINIMUM for any text on cream (≈6:1) */
  --color-ink-muted: #8d8ba0;    /* decoration/icons ONLY (3.0:1 on cream, fails for text) */
  --color-ink-faint: #9a98ab;    /* fill "dim" state, dividers */
  --color-ink-disabled: #b7b5c6; /* studio disabled, studio fill dim */
  /* ── cream ── */
  --color-cream: #f7f3ec;  --color-cream-raised: #fbf7f0;  --color-cream-pressed: #eceae4;
  --color-studio-intro: #f5f4f8;
  /* ── teal (action) ── */
  --color-teal: #00c4d8;  --color-teal-deep: #00afc4;  --color-teal-mid: #00b0c2;
  --color-teal-text: #0096a8;   /* text only ≥24px bold or icons */
  --color-teal-dark: #00808e;   /* white text on this = 4.7:1 */
  --color-teal-ink: #00636e;
  --color-teal-bright: #00e2f4; --color-teal-neon: #7df4ff; --color-teal-wash: #d8f2f5;
  --color-studio-accent-deep: #006e7a;
  /* ── pink (LIVE / love) ── */
  --color-pink: #e14b81; --color-pink-deep: #d0417a; --color-pink-wash: #ffe0eb; --color-red: #d6455a;
  /* ── purple (stories / quests / grow) ── */
  --color-purple: #8b55d6; --color-purple-bright: #a97fe0; --color-purple-deep: #6f3fb8;
  --color-purple-wash: #f0e6fb; --color-purple-wash-bright: #e5d5ff; --color-lavender: #f2ecfb;
  --color-violet-hover: #7a46c4;
  /* ── gold (coins) ── */
  --color-gold: #e8a33d; --color-gold-bright: #ffd166; --color-gold-text: #a86f1d; --color-gold-on-dark: #f7c66a;
  /* ── night ── */
  --color-night: #15161e; --color-night-deep: #0f1018;
  /* ── logo only (never UI) ── */
  --color-logo-red: #e83942; --color-logo-blue: #3b6ceb;
  /* ── persona メンカラ (mock.ts accents) ── */
  --color-p-rose: #e14b81; --color-p-teal: #00afc4; --color-p-lavender: #a97fe0;
  --color-p-amber: #f0a53a; --color-p-sky: #5b8def; --color-p-mint: #3fb98a;
  --color-success: #1e9e6e;

  /* ── type families (vars set by next/font in lib/fonts.ts) ── */
  --font-sans: var(--font-pjs), var(--font-noto-jp), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, system-ui, sans-serif;
  --font-display: var(--font-pjs), "LC JP Headline", var(--font-noto-jp), "Hiragino Sans", "Yu Gothic", sans-serif;
  --font-label: var(--font-sg), var(--font-noto-jp), system-ui, sans-serif;
  --font-wordmark: var(--font-poppins), system-ui, sans-serif;

  /* ── radii ── */
  --radius-xs: 4px; --radius-sm: 10px; --radius-md: 14px; --radius-lg: 16px; --radius-xl: 20px;
  --radius-2xl: 28px; --radius-band: 40px; --radius-bubble: 18px; --radius-phone: 52px; --radius-screen: 44px;

  /* ── shadows (tokens.ts CSS originals) ── */
  --shadow-card: 0 24px 60px rgba(60,55,90,.16);
  --shadow-chip: 0 8px 24px rgba(60,55,90,.15);
  --shadow-dark: 0 16px 40px rgba(15,16,24,.25);
  --shadow-teal-glow: 0 0 15px rgba(0,175,196,.45);
  --shadow-violet-glow: 0 0 18px rgba(139,85,214,.35);
  --shadow-phone: 0 0 0 11px #0f1018, 0 0 0 12px rgba(255,255,255,.14), 0 40px 80px rgba(15,16,24,.35);

  /* ── easing (GSAP equivalents in lib/motion/tokens.ts) ── */
  --ease-reveal: cubic-bezier(.215,.61,.355,1);   /* power3.out */
  --ease-pop: cubic-bezier(.34,1.56,.64,1);        /* ≈ back.out(1.6) */
  --ease-inout: cubic-bezier(.645,.045,.355,1);    /* power3.inOut */
  --ease-sine: cubic-bezier(.37,0,.63,1);          /* sine.inOut */
  --ease-hero: cubic-bezier(.2,.7,.2,1);
  --ease-burst: cubic-bezier(.7,0,.84,0);          /* splash burst */

  /* ── keyframe animations (CSS-only motion) ── */
  --animate-rise: rise .7s var(--ease-hero) both;
  --animate-pop: pop .45s var(--ease-pop) both;
  --animate-breathe: breathe 1s var(--ease-sine) infinite alternate;
  --animate-pulse-soft: pulseSoft .9s var(--ease-sine) infinite alternate;
  --animate-marquee: marquee 40s linear infinite;
  --animate-shimmer: shimmer 1.3s var(--ease-inout) infinite;
  --animate-live-dot: liveDot 1.4s var(--ease-sine) infinite;
  --animate-wave: wave .45s var(--ease-sine) infinite alternate;
}

:root {
  --dur-fast: 160ms; --dur-base: 260ms; --dur-fluid: 420ms; --stagger: 60ms;
  --oshi: var(--color-p-rose);            /* 推し色 picker writes this (never affects CTA teal) */
  --header-h: 56px; --sticky-bar-h: 64px;
  --gutter: 16px; --container: 1312px;
  --section-y: clamp(88px, 4.5rem + 5vw, 160px);
  --grad-cta: linear-gradient(135deg, #00c4d8, #00afc4);
  --grad-story: conic-gradient(from 0deg, #a97fe0, #e14b81, #e8a33d, #a97fe0);
  --grad-live: linear-gradient(135deg, #e14b81, #8b55d6);
  --grad-purple: linear-gradient(135deg, #a97fe0, #8b55d6);
  --grad-lavender: linear-gradient(180deg, #f2ecfb, #f7f3ec);
  --grad-studio-headline: linear-gradient(90deg, #8b55d6, #0096a8);
  --grad-studio-logo: linear-gradient(135deg, #8b55d6, #00b0c2);
  --grad-logo-burst: radial-gradient(circle, #e83942 0%, #3b6ceb 70%);
  --grad-dawn: linear-gradient(180deg, #0f1018 0%, #6f3fb8 25%, #e14b81 50%, #ffd166 75%, #f7f3ec 100%);
  --grad-fan-glow: radial-gradient(closest-side, rgba(0,226,244,.95), rgba(0,175,196,.6) 45%, rgba(0,175,196,.26) 70%, transparent);
  --grad-avatar-glow: radial-gradient(closest-side, rgba(0,226,244,.62), rgba(0,196,216,.25) 55%, transparent);
  --grad-photo-fade: linear-gradient(180deg, rgba(15,16,24,.12), rgba(15,16,24,.88));
}
@media (min-width: 1024px) { :root { --header-h: 64px; --gutter: 24px; } }
```

Keyframes, defined once in `site.css`:
- `rise`: `from{transform:translateY(24px)} to{transform:none}`
- `pop`: `from{transform:scale(.9) rotate(-10deg)} to{transform:scale(1) rotate(var(--tilt,0deg))}`
- `breathe`: `to{transform:scale(1.08)}`
- `pulseSoft`: `from{transform:scale(.96)} to{transform:scale(1.06)}`
- `marquee`: `to{transform:translate3d(-50%,0,0)}`
- `shimmer`: `from{transform:translateX(-100%)} to{transform:translateX(100%)}`
- `liveDot`: `50%{transform:scale(.97);opacity:.7}`
- `wave`: `from{transform:scaleY(.72)} to{transform:scaleY(1.45)}`

**Every looping animation is paused unless its section carries `.is-inview`**, which the global `InViewObserver` (§4.3) toggles. The pause applies only when JS is present (the head script sets `html[data-js]`), so with no JS the CSS loops simply run:

```css
html[data-js] [data-loop]{animation-play-state:paused}
html[data-js] .is-inview [data-loop]{animation-play-state:running}
```

### 3.2 Surfaces (section backgrounds, no fixed sky layers)

Each section owns its background. There are no page-level fixed layers. Adjacent sections blend through a 120px gradient `::before` on the lower section, running from the upper section's colour at the top to transparent.

| Surface token | Recipe | Header theme | Used by |
|---|---|---|---|
| `dawn` | `radial-gradient(90% 70% at 78% 100%, rgba(255,209,102,.30), rgba(255,224,235,.26) 35%, transparent 70%), radial-gradient(80% 60% at 12% 0%, rgba(216,242,245,.9), transparent 60%), #fbf7f0` plus noise 3.5% | light | hero, about |
| `cream` | `#f7f3ec` | light | bento, how-it-works, FAQ |
| `day` | `radial-gradient(120% 80% at 50% 0%, #e6f5f7, transparent 60%), #f7f3ec` | light | chat |
| `teal-band` | rounded band `#d8f2f5 → #f7f3ec`, inset 12px (mobile 8), radius 40 (mobile 28) | light | chat steps backdrop |
| `night` | `#0f1018` (panels `#15161e`) | dark | call, LIVE, final CTA |
| `night-to-dawn` | `--grad-dawn` scrubbed (desktop) / static top-to-bottom (mobile) | dark until 45%, then light | morning |
| `lavender` | `linear-gradient(180deg, #f2ecfb 0%, #f0e6fb 40%, #f7f3ec 100%)` plus a violet aura blob | light | 育成, creators band |
| `studio` | `radial-gradient(120% 80% at 50% 0%, #f0e6fb, #eceae4 60%)` | light | /creators hero, control |
| `studio-cyan` | `radial-gradient(120% 80% at 50% 0%, #e6f5f7, #eceae4 60%)` | light | /creators setup, insights |
| `night-deep` | `#0f1018` plus a 4%-white watermark wordmark | dark | footer, /creators voice band |

Each section sets `data-surface="light|dark"`. The header reads the surface under its bottom edge (§4.1).

### 3.3 Glass recipes (CSS classes in `site.css @layer components`)

| Class | CSS | Budget |
|---|---|---|
| `.glass` | `background: rgba(255,255,255,.72); border: 1px solid rgba(255,255,255,.9); box-shadow: inset 0 1px 0 rgba(255,255,255,.9), var(--shadow-card); border-radius: var(--radius-2xl);` | no blur |
| `.glass-live` | `.glass` plus `backdrop-filter: blur(20px) saturate(140%)` | ≤3 per viewport on mobile, ≤6 on desktop. Used only by the header (and its mobile sheet), the sticky bar, the QR dock, the header QR popover and the `/creators` join CTA card. FAQ rows use `.glass` (11 rows would blow the budget), and the demo done card uses `.glass-night` because it sits inside `[data-stage-media]`. |
| `.glass-fake` | `background: linear-gradient(145deg, rgba(255,255,255,.95), rgba(255,255,255,.82)); border: 1px solid rgba(255,255,255,.9); box-shadow: 0 0 0 3px #fff, var(--shadow-chip);` | stickers and chips (vinyl edge) |
| `.glass-night` | `background: rgba(15,16,24,.55); border: 1px solid rgba(255,255,255,.14); box-shadow: var(--shadow-dark);` (+ `backdrop-filter: blur(20px)` only as `.glass-night.glass-live`) | same budget |
| Lite and fallback | `html[data-lite] .glass-live, @supports not (backdrop-filter: blur(1px))` → opaque `#fbf7f0` / `rgba(21,22,30,.94)` and no blur | |

**Never** use `backdrop-filter` or `filter: blur()` inside a `[data-stage-media]` layer.

### 3.4 Buttons and links

| Class | Spec | Contrast |
|---|---|---|
| `.btn-primary` | height 52 (≥1024: 56), px 24, pill, `background: var(--grad-cta)`, **label `#28273b` PJS 700 16 / Noto 700 15**, `box-shadow: var(--shadow-teal-glow)`. Hover: `filter: brightness(1.05)`. Active: `scale(.96)` over 160ms. Focus: 3px `#28273b` outline with 3px offset. | 6.8:1 → 5.5:1 |
| `.btn-night` | bg `#0f1018`, white label, `box-shadow: 0 0 0 1px rgba(125,244,255,.35), var(--shadow-teal-glow)` | 18:1 |
| `.btn-violet` (creators primary) | bg `#8b55d6`, hover `#7a46c4`, white label 700, `var(--shadow-violet-glow)` | 4.8:1 |
| `.btn-ghost` | transparent, 1.5px `currentColor` border, ink label (white on dark) | |
| `.pill-disabled` (Studio 近日公開) | `.glass` plus an ink-2 label, `aria-disabled="true"`, not focusable as a link, `cursor: default`. A 16px Material icon (`phone_iphone` / `android`) precedes the store name. **No badge artwork.** | 6:1 |
| Links in text | ink, `text-decoration: underline 2px #00c4d8`, `text-underline-offset: 4px`. On dark: white with a `#7df4ff` underline. | |
| Min target | every interactive element ≥44×44 | |

### 3.5 Layout grid and spacing

| Breakpoint | Columns | Container, gutter, margin |
|---|---|---|
| ≥1280 | 12 | container 1312, column gap 24, side margin `max(40px, (100vw − 1312px)/2)` |
| 1024–1279 | 12 | gap 20, margin 40 |
| 768–1023 | 8 | gap 20, margin 32 |
| <768 | 4 | gap 12, **side margin 16**. `main { overflow-x: clip }` (never `hidden`, or sticky breaks). No horizontal page scroll. |

- Utility: `.container-site { width: min(100% - 2*var(--gutter), var(--container)); margin-inline: auto; }`.
- 8px base rhythm. Section vertical padding is `var(--section-y)`.
- Radii: cards 28 (mobile 20), bands 40 (mobile 28), phone bezel 52 / screen 44, stickers pill.
- Remove `html { scroll-behavior: smooth }` from anything `(site)` loads. Lenis handles anchors.

### 3.6 Fonts (`src/lib/fonts.ts`)

```ts
import { Plus_Jakarta_Sans, Space_Grotesk, Noto_Sans_JP, Poppins } from 'next/font/google';
export const pjs = Plus_Jakarta_Sans({ subsets: ['latin'], weight: 'variable', variable: '--font-pjs', display: 'swap', preload: true, adjustFontFallback: true });
export const sg = Space_Grotesk({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-sg', display: 'swap', preload: false });
export const notoJp = Noto_Sans_JP({ subsets: ['latin'], weight: 'variable', variable: '--font-noto-jp', display: 'swap', preload: false,
  fallback: ['Hiragino Sans', 'Hiragino Kaku Gothic ProN', 'Yu Gothic', 'Meiryo', 'sans-serif'] }); // self-hosted unicode-range slices, fetched on demand
export const poppins = Poppins({ subsets: ['latin'], weight: '600', variable: '--font-poppins', display: 'swap', preload: true }); // wordmark only (~9 KB)
```

**JA headline subset** (it protects LCP and CLS on the 44–88px JA H1):
- `scripts/build-ja-headline-font.mjs` collects every string in `ja/*.json` whose key path matches `/(^|\.)(title|fill|statement|captionLine|eyebrow\.label|fanCaption|oshiCaption|lineOne|lineTwo|doneTitle|stickers\.[a-z]+|chips\.[a-z]+)$/`, plus `common.tagline`, `common.disclosure*`, `home.final.eyebrow` and `creators.header.lockup`.
- It adds the ASCII and fullwidth punctuation `、。・？「」（）～…` and subsets `assets-src/fonts/NotoSansJP-ExtraBold.ttf` with `subset-font` into `public/fonts/NotoSansJP-Headline.woff2` (target ≤45 KB).
- `--check` fails the build if any headline glyph is missing from the committed woff2.
- `site.css` declares it:

```css
@font-face { font-family: "LC JP Headline"; src: url("/fonts/NotoSansJP-Headline.woff2") format("woff2"); font-weight: 800; font-display: swap; }
```

- `(site)/[lang]/layout.tsx` calls `ReactDOM.preload('/fonts/NotoSansJP-Headline.woff2', { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })` **only when `lang === 'ja'`**.
- The `.font-display` stack only reaches `"LC JP Headline"` for CJK glyphs, because PJS has none. CJK fallbacks are square-em, so CLS on swap is negligible.

### 3.7 Type scale (fluid 390 → 1440; utility classes in `@layer components`)

JA values apply under `:lang(ja)`. Japanese is **never letter-spaced**. `font-feature-settings: "palt"` goes on JA display classes only.

| Class | Use | JA | EN |
|---|---|---|---|
| `.t-display-xl` | the H1 | `font: 800 clamp(2.75rem, 1.729rem + 4.19vw, 5.5rem)/1.2 var(--font-display)` | `800 clamp(2.625rem, 1.371rem + 5.143vw, 6rem)/1.0`, tracking −0.035em |
| `.t-display-l` | text-fill lines, stage fills, final H2 | `800 clamp(1.875rem, 1.086rem + 3.238vw, 4rem)/1.35` | `800 clamp(2rem, 1.071rem + 3.81vw, 4.5rem)/1.05`, −0.03em |
| `.t-h2` | chapter H2 | `800 clamp(1.75rem, 1.1rem + 2.667vw, 3.5rem)/1.3` | `800 clamp(2rem, 1.257rem + 3.048vw, 4rem)/1.05`, −0.03em |
| `.t-statement` | background-clip fill paragraphs | `700 clamp(1.375rem, .957rem + 1.714vw, 2.5rem)/1.65` | `700 clamp(1.5rem, .989rem + 2.095vw, 2.875rem)/1.25`, −0.02em |
| `.t-h3` | beat and card titles | `700 clamp(1.1875rem, 1.025rem + .667vw, 1.625rem)/1.5` | `700 clamp(1.25rem, 1.064rem + .762vw, 1.75rem)/1.25` |
| `.t-lead` | intros | `400 clamp(1rem, .93rem + .286vw, 1.1875rem)/1.85`, max-width 30em | `400 clamp(1.0625rem, .993rem + .286vw, 1.25rem)/1.55`, max-width 34em |
| `.t-body` | text | `400 15px/1.9` → ≥1024 `16px` | `400 16px/1.6` → ≥1024 `17px` |
| `.t-small` | footnotes, disclosure | `400 12.5px/1.7`, **colour ink-2 minimum** | `400 13px/1.5` |
| `.t-label` | eyebrows, chips | `700 12px/1.4 var(--font-sans)` | `700 12px/1.3 var(--font-label)`, uppercase, `letter-spacing: .14em` |
| `.t-num` | timers, meter, big clock | `700 clamp(2.5rem, 1.6rem + 3.8vw, 4.5rem)/1 var(--font-label)`, `font-variant-numeric: tabular-nums` | same |
| `.t-poster-clock` | morning clock | `700 clamp(6rem, 2.5rem + 14vw, 11rem)/.9 var(--font-label)`, −0.04em, tabular | same |
| `.wordmark` | "LinClone" | `600 var(--font-wordmark)`, `letter-spacing: .04em` | same |

### 3.8 Japanese line breaking

- `<html lang="ja">` on JA pages is required (glyph shapes, `auto-phrase`).
- Headings, fill lines, stickers and chips pass through the server `Units` component (`src/lib/units.tsx`).
  - JA uses the BudouX `loadDefaultJapaneseParser().parse(text)` phrases → `<span data-u>` + `<wbr>`. EN splits on spaces. Char mode splits graphemes via `Intl.Segmenter`.
  - Style: `word-break: keep-all; overflow-wrap: anywhere; text-wrap: balance;`
  - `:lang(ja) :is(h1,h2,h3){ word-break: auto-phrase }` is a Chrome-only bonus.
- Body paragraphs: `line-break: strict; text-wrap: pretty;`, capped at 30 zenkaku (`max-width: 30em`).
- Explicit `\n` in a dictionary string (only `mock.fan.welcome.*`) renders as `<br>`.
- QA: headline screenshots at 360 / 375 / 390 / 430 widths (§9.7).

---

## §4 Shared primitives and components (WP0 owns all of §4 unless stated)

Conventions:
- Server Components by default. Client files start with `'use client'` and are named `*.client.tsx`.
- Every client animator imports GSAP only through `loadMotion()`, a dynamic import, so GSAP and Lenis are **not** in the initial JS.
- Props below are TypeScript. `d` is the full `Dictionary` and `lang` is the `Locale`.

### 4.1 Chrome

| Component | Path | Props | Behaviour |
|---|---|---|---|
| `Header` | `src/components/site/header/Header.tsx` (server) + `HeaderBehavior.client.tsx` | `{ d: Dictionary; lang: Locale; page: 'home' \| 'creators' }` | See the details below. |
| `LangPill` | `site/header/LangPill.client.tsx` | `{ lang; page; d }` | See the details below. |
| `MobileDownloadBar` | `site/download/MobileDownloadBar.client.tsx` | `{ d; lang; appStoreHref; playHref; getHref }` (hrefs computed on the server) | See the details below. |
| `QrDock` | `site/download/QrDock.client.tsx` + server `QrDockShell.tsx` passing `svg` children | `{ d; children: ReactNode /* QrBlock */ }` | See the details below. |
| `Footer` | `site/footer/Footer.tsx` (server) | `{ d; lang; page }` | See the details below. |
| `SkipLink` | `site/SkipLink.tsx` | `{ href: string; label: string }` | Visually hidden until focus. Fixed top-left, white pill, ink text. |

**Header.** A 56px (≥1024: 64px) fixed bar, `z-40`.
- **Home desktop:**
  - left: mark (28px `mark-128.png`) + `.wordmark` "LinClone", linking to `localePath(lang,'home')`
  - centre: `<nav aria-label={d.header.navLabel}>` with anchors to `#call #morning-call #chat #live #grow #faq`
  - right: a text link to `/creators` (`d.header.forCreators`, data-analytics `creators_nav{from:'header'}`), then `LangPill`, then the **header CTA**
- **Home mobile:** mark, CTA (`getAppShort`), then a menu button that opens a full-height cream sheet. The sheet holds large nav links (t-h2 size), creators link, lang switch, both badges and the disclosure. It is a focus-trapped `dialog`.
- **Creators:** the lockup is the mark + `LC STUDIO` (SG 700, `letter-spacing: .28em`). Nav `#how #setup #control #insights #faq` (keys `creators.header.nav.how|setup|control|earnings|faq`; `earnings` → `#insights`). Right: a link to `/` (`creators.header.fanApp`), `LangPill`, and the CTA `.btn-violet` mailto (`creators.header.requestInvite`; mobile `requestShort`).
- **Header CTA without JS:** it renders three sibling anchors of identical box size, and CSS shows one:
  - `.cta-get` `href=getUrl('header',lang)` is the default and no-JS fallback
  - `.cta-ios` App Store is shown under `html[data-platform=ios]`
  - `.cta-android` Play is shown under `html[data-platform=android]`
  - a `.cta-desktop` `<button>` under `html[data-platform=desktop]` opens a `.glass-live` popover (`header.qrPopoverTitle/Body`, QR 120px, both badges)
  - No hydration is needed and there is no CLS.
- **Behaviour (client):**
  - transparent over the hero (`data-top`), then `.glass-live` with a 1px `rgba(40,39,59,.08)` hairline after 24px of scroll
  - `data-theme="dark"` when the section under y=header-bottom has `data-surface="dark"` (one IntersectionObserver with `rootMargin: -${h}px 0px -${100vh-h-1}px`)
  - on mobile it hides on scroll-down >8px and shows on scroll-up (translateY −100%, 260ms)
  - it is always shown while focus is inside it
- **Progress line:** a 2px bar under the header, `scaleX` = page progress (ScrollTrigger on `main`, scrub true, `transform-origin: left`), teal gradient. Violet→cyan on /creators.

**Chrome key map** (every chrome key has one owner and one use):
- `header.homeLabel` / `creators.header.homeLabel`: `aria-label` of the logo link. `header.navLabel` / `creators.header.navLabel`: the `<nav>` label.
- `header.getApp` (≥1024) / `header.getAppShort` (<1024): the header CTA label. `header.menuOpen` / `header.menuClose`: the mobile menu button states. `header.qrPopoverTitle` / `header.qrPopoverBody`: the desktop QR popover; its close button uses `common.close`.
- `common.skip.toContent` → `#main` (page-level SkipLink); `common.skip.toDownload` → `#download` (a second skip link rendered right after it on home pages only); `common.skip.stage` → every stage SkipLink.
- `common.lang.switchLabel`: `aria-label` of the LangPill; `common.lang.ja|en` its visible text; `common.lang.dismiss` closes the "available" chip.
- `a11y.pageProgress`: reserved. The progress line is decorative (`aria-hidden="true"`, no `role="progressbar"`). `a11y.phoneMockup`: fallback `PhoneFrame` label when a caller omits one. `a11y.carouselPrev|Next|Position`: Carousel buttons and dots. `a11y.opensStore`: StoreBadges `aria-describedby`. `a11y.opensMail`: MailtoButton `aria-describedby`. `a11y.decorative`: unused by default (decoration is `aria-hidden`).

**LangPill.**
- It is a plain `<a href={localePath(other,page)} hrefLang={other} lang={other}>` rendered on the server, so it works without JS.
- The client part adds the dismissible "available" chip under the header:
  - On `/`, show `common.lang.englishAvailable` if **no** entry of `navigator.languages` starts with `ja`.
  - On `/en`, show `common.lang.japaneseAvailable` if `navigator.languages[0]` starts with `ja`.
  - Dismissal is stored in `localStorage['lc.langPill']` inside try/catch.
  - It never redirects.

**MobileDownloadBar.** Rendered only on home pages and only below 1024px.
- 64px + `env(safe-area-inset-bottom)`, `.glass-night.glass-live`, bottom fixed, `z-30`.
- Content: app icon 36px (`appicon-180.png`), `stickyBar.title` in PJS 700 15 white, `stickyBar.sub` 12px white 72%, a `.btn-primary` 40px-tall pill `stickyBar.cta` with the platform href, and a 44px ✕.
- **Visible only when all of these hold:**
  - the hero badges (`#hero [data-badges]`) are out of view
  - no `[data-download-block]` is ≥20% in view (checkpoint, how CTA, final, footer)
  - no `[data-immersive]` stage is ≥50% in view (call stage, LIVE stage)
  - no `lc:demo` is running (window events `lc:demo-start` / `lc:demo-end`)
  - the last scroll direction is up, or scrolling has been idle for more than 1.2s
  - it has not been dismissed (`sessionStorage['lc.stickyDismissed']` in try/catch)
  - under `html[data-ios-safari]` (where the Smart App Banner shows), it is suppressed until `#chat` has entered
- Enter/leave: translateY 100% ↔ 0 over 260ms `--ease-reveal`.
- On home pages below 1024px, `main` **always** reserves `padding-bottom: calc(var(--sticky-bar-h) + env(safe-area-inset-bottom))` in CSS (never toggled by JS), so showing or hiding the bar never changes layout.
- Analytics: `cta_click{loc:'sticky'}`, `sticky_dismiss`.

**QrDock.** ≥1024 only, home only.
- Fixed bottom-right (24px), a `.glass-live` card 200px wide: `qrDock.title`, QR 132px, `qrDock.caption`, and a collapse button (`qrDock.collapse`) → a 44px chip labelled `qrDock.title` with a `qr_code_2` icon and `aria-label={qrDock.expand}`.
- Appears after `#hero` leaves the viewport. Hides while any `[data-download-block]` is in view.
- The collapsed state is remembered in `sessionStorage['lc.qrDock']`. Analytics `qr_open`.

**Footer.** `night-deep` surface with a watermark `.wordmark` "LinClone" at 18vw, 4% white, `aria-hidden`.
- **Columns (desktop 4, mobile accordions via `<details>`):**
  - Brand: mark-white, wordmark, `footer.tagline`, small `StoreBadges` (home only; on creators, `StudioStoreCTA` compact)
  - `footer.columns.app`: `footer.links.call|morning|chat|live|grow|faq` anchors (on /creators, those links point to `localePath(lang,'home', '#call')` etc.) plus `footer.links.fanApp` → `localePath(lang,'home')`
  - `footer.columns.creators`: `footer.links.studio` → `/creators` (or `/en/creators`) and `footer.links.requestInvite` (mailto, `studio_mailto{loc:'footer'}`)
  - `footer.columns.support`: `footer.links.support` → `/support`, `footer.links.deleteUser` → `/delete-user`
  - `footer.columns.legal`: `footer.links.privacy` → `/privacy`, `footer.links.terms` → `/terms`, `footer.links.cookies` → `/cookies`, `footer.links.childSafety` → `/policies/child-protection-policy`
- Legacy links are plain `<a>` (a different root layout means a full load). **Decision:** `/delete-user` stays in the footer under Support; it is a store-required route.
- **Bottom row:** `LangPill` (static), `footer.copyright`, and `common.disclosure`.
- **Social:** render `SOCIAL` from config only (empty by default). The old Twitter/Discord/GitHub/LinkedIn links are dropped.

### 4.2 Download and CTA primitives

| Component | Path | Props | Behaviour |
|---|---|---|---|
| `StoreBadges` | `site/download/StoreBadges.tsx` (server) | `{ d; lang; placement: Placement; size?: 'md' \| 'lg'; qr?: boolean; showFriction?: boolean }` | See the details below. |
| `StudioStoreCTA` | `site/download/StudioStoreCTA.tsx` (server) | `{ d; lang; compact?: boolean }` | `STUDIO_LIVE=false` → two `.pill-disabled` elements (`creators.hero.storePillIos/Android`) inside a `<p>`. `true` → official badges linking to `STUDIO_APP.*`. |
| `QrBlock` | `site/download/QrBlock.tsx` (server, async) | `{ d: Dictionary; lang: Locale; placement: Placement; size?: number (default 132); caption?: string (default common.store.qrCaption) }` | See the details below. |
| `FrictionList` | `site/download/FrictionList.tsx` | `{ d; items?: ('freeDownload' \| 'first60' \| 'trialBeforeSignup' \| 'noPassword')[] }` | Inline `<ul>` of chips: `check` icon 14px + `.t-small` ink-2. |
| `MailtoButton` | `site/download/MailtoButton.tsx` (server) + `CopyEmail.client.tsx` | `MailtoButton: { d: Dictionary; lang: Locale; variant: 'primary' \| 'header' \| 'compact'; placement: StudioPlacement }`; `CopyEmail: { label: string; copiedLabel: string; placement: StudioPlacement; variant?: 'text' \| 'chip' }` | `href={mailtoStudio(lang, d)}` `.btn-violet`, `aria-describedby` → `a11y.opensMail`, with `studio_mailto{loc}` analytics. `CopyEmail`: `navigator.clipboard.writeText(SITE.contactEmail)` inside try/catch (on failure it selects the visible address instead) → label swaps to `copiedLabel` for 1.6s (`aria-live=polite`); `studio_copy_email{loc}`. Callers pass `creators.hero.copyEmail/copied` or `creators.join.copyEmail/copied`. |
| `Disclosure` | `site/Disclosure.tsx` | `{ d; variant: 'line' \| 'bar' }` | `line`: `verified` icon + `common.disclosure`, `.t-small` ink-2 (white 78% on dark). `bar`: full-width `.glass` rounded bar, t-h3, `common.disclosureOfficial`. |
| `ScreenNote` | `site/ScreenNote.tsx` | `{ d; tone?: 'light' \| 'dark' }` | Renders `common.screenNote`, plus `common.devNote` when `!LAUNCH.v3PublicOnStores`. Goes under **every** mockup cluster. |

**StoreBadges details:**
- Renders **both** official badges (unaltered artwork from `/public/badges/`; JA artwork on `ja`, EN on `en`), height 44 (`lg`: 52), with the guideline clear space (¼ of the height).
- Links are `storeUrl('ios'|'android', lang, placement)`, `target` default (same tab), with `aria-describedby` → `a11y.opensStore`.
- **Platform ordering, CSS only:**
  - `html[data-platform=android]` puts Play first (`order:-1`).
  - On <768 under `data-platform=ios|android`, the matching badge grows to height 52 and the other badge is replaced by a text link (`common.store.otherStoreFromIos/Android`) in a reserved 20px row.
  - Unknown platform or no JS shows both badges.
- `showFriction` renders `common.freeWithIap` under the badges.
- `qr` (≥1024 only) adds a `QrBlock` 112px on the right.
- Wrapper: `data-badges`. `onClick` delegates `cta_click{loc:placement, platform}` through the tiny `BadgeTracker.client.tsx`.

**QrBlock details:**
- `qrSvg(getAbsUrl('qr_'+placement, lang))` renders at build time as inline SVG in a white radius-16 card with padding 10. Caption `common.store.qrCaption`, `role="img"`, `aria-label={common.store.qrAlt}`.
- Encodes `https://www.linclone.com/get?src=qr_<placement>&lang=<lang>`.

### 4.3 Layout and text primitives

| Component | Path | Props | Behaviour |
|---|---|---|---|
| `Section` | `site/Section.tsx` | `{ id: string; surface: SurfaceToken; labelledBy?: string; className?; children; skipTo?: string; skipLabel?: string; download?: boolean; immersive?: boolean; }` | `<section id aria-labelledby data-surface=light\|dark data-download-block? data-immersive?>` plus the surface class. With `skipTo`, it renders a `SkipLink` as the first child. It stays a server component: `.is-inview` is toggled by the single global `InViewObserver.client.tsx` (mounted once in the `(site)` layout), which observes every `main section` with one IntersectionObserver (`rootMargin: 20% 0px`) and also pauses loops on `visibilitychange`. |
| `Eyebrow` | `site/Eyebrow.tsx` | `{ num?: string; label: string; tone?: 'ink' \| 'white' \| 'violet' }` | Label row: `num` in SG 700 12 (if non-empty) + a 24px 1px rule + label `.t-label`. Colour ink-2 (white 72% / `#6f3fb8`). |
| `ScrollFillText` | `site/fill/ScrollFillText.tsx` (server) + `FillAnimator.client.tsx` | `{ as: 'h1' \| 'h2' \| 'h3' \| 'p'; id?: string; text: string; lang: Locale; mode: 'clip' \| 'units'; unit?: 'phrase' \| 'word' \| 'char'; tone: 'ink' \| 'white' \| 'purple' \| 'studio' \| 'white-on-night'; accent?: string; start?: string; end?: string; scrub?: number \| true; className?: string; driver?: 'self' \| 'external' }` | See the details below. |
| `CaptionMarker` | `site/fill/CaptionMarker.client.tsx` | `{ targetId: string; restOn?: 'last' \| number; tone: 'teal' \| 'neon' \| 'violet' }` | See the details below. |
| `Sticker` | `site/Sticker.tsx` | `{ icon: IconName; label: string; tilt?: number (−6..6); tone?: 'teal' \| 'pink' \| 'purple' \| 'gold' \| 'violet'; dark?: boolean; index?: number }` | `.glass-fake` pill 36px (mobile 32) with an icon in a 24px tinted disc (14% alpha of the tone) and the label (`.t-label` size 13–14, no uppercase in JA). CSS entrance `animate-pop` with `animation-delay: calc(200ms + var(--i)*60ms)`. `--tilt` is set inline. Budget: at most 4 per desktop viewport and 2 on mobile, only in heroes and chapter openers. |
| `GlassCard` | `site/GlassCard.tsx` | `{ as?; tone: 'day' \| 'night' \| 'fake' \| 'live'; radius?: 'xl' \| '2xl'; className; children }` | Maps to §3.3 classes. |
| `Button` / `ButtonLink` | `site/Button.tsx` | `{ variant: 'primary' \| 'night' \| 'violet' \| 'ghost'; size?: 'md' \| 'lg'; href?; icon?: IconName; iconEnd?: IconName; ...a11y }` | §3.4 styles. |
| `Carousel` | `site/Carousel.client.tsx` | `{ label: string; items: ReactNode[]; itemWidth?: string (default '86vw'); d; onActive?: never }` | Native `scroll-snap-type: x mandatory`, `overscroll-behavior-x: contain`, `data-lenis-prevent`. Dots (`a11y.carouselPosition`) and 44px prev/next buttons. Each item gets `data-active` when ≥60% visible (IntersectionObserver with root = scroller), which mockup micro-sequences listen to. `role="region" aria-roledescription="carousel"`. |
| `StickySteps` | `site/steps/StickySteps.tsx` (server) + `StickyStepsAnimator.client.tsx` | `{ id: string; steps: { id: string; label?: string; title: string; body: ReactNode; mobileSlice: ReactNode /* ScreenSlice for <1024 */ }[]; screens: ReactNode[] /* one per step, rendered inside PhoneFrame + ScreenStack */; phoneSize: { desktop: number }; phoneLabel: string; side: 'left' \| 'right'; stepMinHeight?: string (default '70svh'); transition?: ('fade' \| 'push')[]; mobileLayout?: 'carousel' \| 'list' (default 'carousel'); carouselLabel?: string }` | See the details below. |
| `ScreenStack` | `mockups/kit/ScreenStack.tsx` | `{ children: ReactNode[] }` | Absolute stack of 390×844 screens. `[data-screen][data-active]` is visible. Transitions are CSS: fade (opacity .26s, translateY 8→0 in / →−8 out) or push (`xPercent` via `translate: 100% 0 → 0`; outgoing `−30%` with a `rgba(15,16,24,.12)` dim), per the app's TabBar/stack grammar. Inactive screens get `visibility:hidden` after the transition. |

**ScrollFillText details:**
- **clip mode:** one text node inside `<span class="fill-clip">`, using `--fill` (default `100%` in CSS):
  - `background-image: linear-gradient(var(--fill-on), var(--fill-on)), linear-gradient(var(--fill-off), var(--fill-off)); background-size: var(--fill) 100%, 100% 100%; background-repeat:no-repeat; -webkit-background-clip:text; background-clip:text; color:transparent; box-decoration-break: slice;`
  - `@media (forced-colors: active){ color: CanvasText; background:none }`
- **units mode:** `Units` spans with `color: var(--fill-on)` by default. The animator tweens each unit from `--fill-off` to `--fill-on` (colours resolved via `getComputedStyle`) with `stagger` spread across the scrub.
- `accent`: a substring rendered in a `span.fill-accent`. It ends in the tone's accent colour: teal-neon on night, the teal→purple gradient on cream, the studio gradient on /creators. It toggles a class when progress ≥0.7 (colour transition 420ms).
- Defaults: start `'top 80%'`, end `'bottom 45%'`, `scrub: true`.
- The animator sets the start state **only if the element's top > viewport height at init**.
- `driver='external'` means a stage timeline drives it: the animator exposes `el.__fill(progress)` via a data attribute contract (`[data-fill-id]`) and does no ScrollTrigger of its own.
- Tones (`--fill-off` → `--fill-on`):

| Tone | Dim (`--fill-off`) | Full (`--fill-on`) |
|---|---|---|
| ink | `rgba(154,152,171,.35)` | `#28273b` |
| white | `rgba(255,255,255,.22)` | `#fff` |
| purple | `rgba(139,85,214,.25)` | `#6f3fb8` |
| studio | `#b7b5c6` | `#28273b`, with the accent in the studio gradient |

**CaptionMarker details:**
- After `requestIdleCallback`, it measures the `[data-u]` rects of the target (FLIP, re-measured on resize and `document.fonts.ready`).
- It moves one absolutely positioned pill behind the text, using `x`/`y` and `scaleX` of a 1px-wide element. Height = line-height × 0.9, radius pill.
- Colours: `rgba(0,196,216,.22)`, `rgba(125,244,255,.18)` on dark, or `rgba(139,85,214,.18)`.
- It hops phrase by phrase: 0.35s `power3.inOut`, 0.12s gap. It rests on the last unit, or on the unit index given.
- It never changes text colour or opacity. Under reduced motion it is placed on the resting unit with no hops. With no JS there is no marker.

**StickySteps details:**
- Desktop grid (≥1024): the step column (`side` opposite the phone) is 6 cols. Each step is a block with `min-height: stepMinHeight`, the title an H3 inside, the body `.t-body`.
- The phone column is 5 cols. The phone is `position: sticky; top: calc(50svh - var(--ph)/2)`.
- The animator: one ScrollTrigger per step, `start:'top 55%', end:'bottom 55%'`, `onToggle` sets `data-active` on the matching `[data-screen]` and dispatches `lc:step` (detail `{sectionId, stepId}`) so mockup micro-sequences can play.
- Mobile (<1024): it does **not** render the sticky phone. Each step renders as a card in a `Carousel`, or a vertical list if `mobileLayout='list'`, with its own `ScreenSlice`.

### 4.4 Stage (scroll-expand)

**`ExpandStage`** (`site/stage/ExpandStage.tsx`, server) + hook **`useExpandStage`** (`lib/motion/use-expand-stage.ts`, client). Section packages write thin `*StageAnimator.client.tsx` wrappers that call the hook and add their own beats.

```ts
type ExpandStageProps = {
  id: string; labelledBy: string;
  height: { mobile: number; desktop: number };         // svh; mobile ≤ 200
  direction: 'expand' | 'collapse';
  phone: {                                               // phone-screen rect at rest (start for expand, end for collapse)
    desktop: { side: 'left' | 'right' | 'center'; width: number /* px, screen width */ };
    mobile:  { width: string /* e.g. 'min(76vw, 300px)' */; top: string /* e.g. 'calc(var(--intro-h) + 16px)' */ };
    radius: { desktop: number; mobile: number };        // 44 / 36
  };
  intro: React.ReactNode;       // eyebrow + H2 + lead; stays readable (colour scrubs ink→white)
  media: React.ReactNode;       // final full-viewport composition (server)
  bezelScreen?: React.ReactNode;// optional phone-only content shown inside bezel before the clip starts (e.g. LiveFeedCard)
  skip: { href: string; label: string };
  surfaceStart: 'cream' | 'night' | 'lavender';          // background under the phone at p=0
  surfaceEnd?: 'night' | 'studio';                        // default 'night'; 'studio' keeps the intro ink (creators command centre)
};
```

DOM contract (the hook and section animators select these):
- `section#{id}[data-stage][data-immersive][data-surface=dark]` (`data-surface=light` when `surfaceEnd='studio'`, e.g. the creators command centre, so the header stays ink), with `style="--h-m:{mobile}svh; --h-d:{desktop}svh"` → `height: var(--h-m)` (≥1024 `var(--h-d)`)
- `div[data-stage-sticky]`: `position: sticky; top: 0; height: 100svh; overflow: clip`
  - `div[data-stage-bg="start"]`: surfaceStart colour, opacity 1
  - `div[data-stage-bg="end"]`: `#0f1018`
  - `div[data-stage-phone]`: invisible rect, positioned by CSS from the `phone` props (desktop: vertically centred, `side` column; mobile: `top`, horizontally centred, bottom 0)
  - `div[data-stage-media]`: `position:absolute; inset:0; clip-path: var(--clip-final)`
    - `div[data-stage-inner]`: transform-origin centre
  - `div[data-stage-bezel]`: same rect as `[data-stage-phone]`; `box-shadow: var(--shadow-phone)`; `border-radius: var(--r)`; dynamic island `::before` 126×37 scaled; contains `bezelScreen`
  - `div[data-stage-intro]`: desktop: the other half, vertically centred; mobile: top 72px, sets `--intro-h`
  - `SkipLink` → `skip.href`

**SSR final state** (no JS, reduced motion, below-fold before init):
- `expand`: `--clip-final: inset(0 round 0)`, bezel `opacity:0`, `bg-start` opacity 0, intro coloured for night (white / white 78%).
- `collapse`: `--clip-final: inset(var(--pt) var(--pr) var(--pb) var(--pl) round var(--r))`. It is computed in pure CSS from the same custom properties that position `[data-stage-phone]`, so no JS is needed for the final look. Bezel opacity 1.

**`useExpandStage(scope, opts)`**:

```ts
useExpandStage(scope: RefObject<HTMLElement|null>, opts: {
  direction: 'expand' | 'collapse';
  clip: [number, number];                // progress window for the clip, e.g. [0.06, 0.40]
  scrub?: number;                        // default 0.5
  introToNight?: [number, number] | false; // window for intro colour ink→white and bg crossfade, default [0.06, 0.30]; false = keep colours (surfaceEnd 'studio' or already night)
  extend?: (tl: gsap.core.Timeline, ctx: SceneCtx) => void; // section beats, positioned by progress (tl duration = 1)
}): void
```

- It builds one timeline of **duration 1** so positions equal progress. Trigger: `scope`, `start:'top top'`, `end:'bottom bottom'`, `scrub`, `invalidateOnRefresh:true`.
- **Clip** (expand): `clip-path` from `() => insetFromRect(phoneRect, mediaRect, radius)` to `'inset(0px 0px 0px 0px round 0px)'`, ease `none`. Collapse is the reverse.
- **Inner**: `scale` 1.15→1 (collapse: 1→0.9).
- **Bezel**:
  - desktop: `opacity` 1→0 and `scale` 1→1.25 over the first 70% of the clip window
  - mobile: `opacity` 1→0 by `clip[0] + 0.10`, no scale
  - collapse: 0→1, scale 1.3→1
- **Background**: `bg-start` opacity 1→0 over `introToNight`.
- **Intro colours**: title `color` ink→#fff, lead ink-2→`rgba(255,255,255,.78)`. Colours come from `getComputedStyle` on tokens.
- Then it calls `opts.extend(tl, ctx)`.
- **Measurement:** `phoneRect` is read with `getBoundingClientRect()` of `[data-stage-phone]` relative to `[data-stage-media]`, as function-based values. It runs `ScrollTrigger.refresh()` after `document.fonts.ready`, and `ScrollTrigger.config({ ignoreMobileResize: true })` is set once.
- **Lite mode** (`html[data-lite]`) replaces the clip with a simple reveal: media `opacity` 0→1 and `scale` 1.05→1 over the clip window, bezel fades. This avoids clip-path repaints.
- **Reduced motion:** the hook does nothing.
- It is initialised by `useScrollScene` when the section is within 1 viewport.
- It emits `lc:stage` events (`{id, active: boolean}`) on enter and leave, for the sticky bar and the header auto-hide.

### 4.5 Motion infrastructure

| Module | Exports | Spec |
|---|---|---|
| `lib/motion/load.ts` (client) | `loadMotion(): Promise<{ gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger }>`, `requestRefresh(): void` | Memoised dynamic `import('gsap')` + `import('gsap/ScrollTrigger')`, `gsap.registerPlugin(ScrollTrigger)`, `gsap.defaults({ ease: 'power3.out', duration: .42 })`, `ScrollTrigger.config({ ignoreMobileResize: true })`. `requestRefresh` debounces `ScrollTrigger.refresh()` by 120ms. SplitText is **not** used; units are server-side. |
| `lib/motion/use-scroll-scene.ts` | `useScrollScene(scope, setup, opts?)` | See the details below. |
| `lib/motion/policy.ts` | `MQ_DESKTOP = '(min-width: 1024px)'`, `usePrefersReducedMotion(): boolean`, `useLite(): boolean` (reads `html[data-lite]`), `isInAppBrowser(): boolean` | Pure hooks with no GSAP. |
| `lib/motion/use-in-view.ts` | `useInView(ref, { rootMargin?: string; threshold?: number; once?: boolean }): boolean` | IntersectionObserver. Used by client islands to start micro-sequences. (Section-level `.is-inview` comes from `InViewObserver`, §4.3.) |
| `lib/motion/tokens.ts` | `EASE = { reveal:'power3.out', pop:'back.out(1.6)', inout:'power3.inOut', sine:'sine.inOut', burst:'cubic-bezier(.7,0,.84,0)' }`, `DUR = { fast:.16, base:.26, fluid:.42, stagger:.06 }`, `REVEAL_FROM = { y:16, scale:.97, autoAlpha:0 }` | Shared. |
| `lib/motion/smooth-scroll.tsx` (client) | `<SmoothScroll />`, `useLenis(): Lenis \| null`, `scrollToId(id: string)` | See the details below. |
| `lib/motion/reveal.client.tsx` | `<RevealGroup selector?: string; stagger?: number>` | Wraps below-fold groups. `ScrollTrigger.batch(children, { start:'top 85%', onEnter: batch => gsap.fromTo(batch, REVEAL_FROM, {y:0, scale:1, autoAlpha:1, stagger:.06}) })`. It only applies the from-state to items below the fold at init. |

**`useScrollScene(scope, setup, opts?)`:**

```ts
function useScrollScene(scope: RefObject<HTMLElement|null>, setup: (ctx: SceneCtx) => void | (() => void),
  opts?: { rootMargin?: string /* default '100% 0px' */; lite?: 'run' | 'skip' /* default 'run' (ctx.lite=true) */ }): void
type SceneCtx = { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; scope: HTMLElement;
  q: (sel: string) => HTMLElement[]; isDesktop: boolean; lite: boolean; belowFold: boolean };
```

- An IntersectionObserver fires when the scope comes within `rootMargin`. It then calls `loadMotion()` and runs `gsap.context(() => { mm = gsap.matchMedia(); mm.add({ isDesktop: MQ_DESKTOP, reduce: '(prefers-reduced-motion: reduce)' }, (c) => { if (c.conditions.reduce) return; return setup({...}) }) }, scope)`.
- It then calls `requestRefresh()`.
- Cleanup: `ctx.revert()` on unmount.
- This is the **only** way section code touches GSAP.

**`<SmoothScroll />`:**
- Mounted once in the `(site)` layout.
- On first `wheel`/`pointerdown`/`keydown`/`touchstart`, or on `requestIdleCallback` (timeout 2500), it dynamic-imports `lenis` and `loadMotion()`.
- It creates `new Lenis({ autoRaf: false, lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: { offset: -72 }, stopInertiaOnNavigate: true })`, then:
  - `lenis.on('scroll', ScrollTrigger.update)`
  - `gsap.ticker.add(t => lenis.raf(t * 1000))`
  - `gsap.ticker.lagSmoothing(0)`
- It is not created when `prefers-reduced-motion: reduce` or `html[data-lite]`; native scroll is used then.
- It exposes `window.__lcLenis` for `scrollToId`, which falls back to `el.scrollIntoView({behavior:'smooth'})`.
- It sets `data-lenis-prevent` on carousels and the header sheet.

**Reduced-motion policy (global):**
- `@media (prefers-reduced-motion: reduce)`:
  - all `animation`s are set to `none` except `liveDot`, which becomes a static dot
  - `[data-loop]` does not animate
  - stages are in their final state
  - fills are full
  - carousels keep working (user-driven)
  - the demo shows captions as a static transcript
- JS hooks never create scrubbed tweens under reduce (matchMedia guard).

**Lite mode (`html[data-lite]`, set by the head script):**
- glass → opaque
- clip-path stages → simple reveal
- marquee skew and speed-up off; marquee runs at a fixed speed
- no cursor parallax
- aura orbs static
- no gift/comment loops in the LIVE stage (static list)
- `CaptionMarker` rests immediately

### 4.6 Head script (in `(site)/[lang]/layout.tsx`)

The layout's `<html lang={lang} suppressHydrationWarning>` gets the classNames of all 4 font variables. Inline in `<head>`, before any stylesheet-dependent content. It sets `data-js` (loop pausing, §3.1), `data-platform`, `data-inapp`, `data-ios-safari`, `data-lite` and the saved `--oshi`:

```js
(function(){try{var d=document.documentElement,n=navigator,u=n.userAgent||'',c=n.connection||{};
var ios=/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&n.maxTouchPoints>1);var and=/Android/.test(u);
d.dataset.platform=ios?'ios':and?'android':'desktop';d.dataset.js='';
var inApp=/Line\/|Instagram|FBAN|FBAV|Twitter|TikTok|musical_ly|Bytedance/i.test(u);if(inApp)d.dataset.inapp='';
if(ios&&!inApp&&/Safari/.test(u)&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(u))d.dataset.iosSafari='';
if((n.deviceMemory&&n.deviceMemory<=4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||c.saveData)d.dataset.lite='';
var o=null;try{o=localStorage.getItem('lc.oshi')}catch(e){}if(o&&/^#[0-9a-f]{6}$/i.test(o))d.style.setProperty('--oshi',o);
}catch(e){}})();
```

### 4.7 Visual primitives

| Component | Path | Props | Behaviour |
|---|---|---|---|
| `Icon` | `site/icons/Icon.tsx` | `{ name: IconName; filled?: boolean; size?: number (default 20); className?; label?: string }` | `<svg viewBox="0 -960 960 960" width height aria-hidden={!label} role={label?'img':undefined}>` with `<path d={PATHS[name][filled?'f':'o']} fill="currentColor"/>`. `IconName` is a string union generated by `scripts/build-icons.mjs` from `@material-symbols/svg-400` (outlined weight 400; `-fill` files for filled). Custom brand glyphs `apple` and `google-g` (single-colour paths drawn by hand; the Google "G" is multi-colour in the gate mockup as 4 paths) live in `site/icons/brand.ts`. **There is no icon font.** |
| `Aura` | `site/aura/Aura.tsx` | `{ persona: PersonaId \| 'oshi'; shape: 'avatar' \| 'badge' \| 'card' \| 'reel' \| 'scene-portrait'; size?: number; ring?: 'none' \| 'story' \| 'live' \| 'seen'; ringSpin?: boolean; voiceprint?: boolean; monogram?: boolean; theme?: 'cream' \| 'night'; className? }` | See the details below. |
| `CreatorImage` | `site/aura/CreatorImage.tsx` | `{ persona; shape; sizes; preload?: boolean; theme? }` | If `PERSONAS[p].portrait` exists → `next/image` with the same box, `object-position` from `focal`, and the `--grad-photo-fade` scrim on card/reel. Otherwise → `<Aura>`. `lib/personas.ts` **throws at import** if any `portrait` lacks `licensed: true` or a non-empty `rightsRef`, so the build fails. |
| `Scene` | `site/aura/Scene.tsx` | `{ kind: 'rain-neon' \| 'cafe-light' \| 'night-sea' \| 'stage-light' \| 'autumn-leaves' \| 'dawn-sky'; className? }` | See the details below. |
| `Waveform` | `site/wave/Waveform.tsx` | `{ bars?: number (12); widths?: number[]; seed?: number; tone: 'teal' \| 'neon' \| 'white' \| 'purple' \| 'ink'; size?: 'sm' \| 'md' \| 'thick'; playing?: boolean; orientation?: 'h' \| 'v'; amp?: 'css-var' }` | See the details below. |
| `Ring` | `site/aura/Ring.tsx` | `{ progress?: number (0–1, CSS var driven); size: number; tone: 'violet' \| 'teal'; label?: ReactNode; stroke?: number }` | `conic-gradient(var(--tone) calc(var(--p)*1%), rgba(tone,.15) 0)` with an `@property --p { syntax:'<number>'; inherits:false; initial-value:100 }` mask ring. Default `--p:100` (SSR final). Used by S09, the creators band and the 60-second ring (with `tone:'teal'` and a label slot). |
| `CallGlow` | `site/glow/CallGlow.tsx` | `{ variant: 'avatar' \| 'fan'; size?: number; state?: 'off' \| 'breathe' }` | Avatar: absolute radial `--grad-avatar-glow` at 2.5× the portrait, `[data-avatar-glow]`, CSS `breathe` when `state='breathe'`. Fan: absolute disc 160vw wide, centred with `bottom: -52%` of its diameter, `--grad-fan-glow`, `[data-fan-glow]`. Transform and opacity only, **no filter**. The two are never lit at once (enforced by the timelines). |
| `Marquee` | `site/marquee/Marquee.tsx` + `MarqueeVelocity.client.tsx` | `{ rows: 1 \| 2; items: ReactNode[]; label: string; speed?: number (s, default 40) }` | See the details below. |
| `Units` | `lib/units.tsx` (server-only) | `{ text: string; lang: Locale; mode: 'phrase' \| 'word' \| 'char'; accent?: string; className? }` | Returns the spans described in §3.8. `accent` wraps the matching units in `span.fill-accent`. |
| `JsonLd` | `seo/JsonLd.tsx` | `{ data: object }` | `<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(data).replace(/</g,'\\u003c')}}/>` |

**Aura details.** Inline SVG, no network request.
1. `radialGradient` from a 30% white tint of the colour at (35%, 30%) → the colour → an edge (`#0f1018` on night, `#fbf7f0` on cream).
2. Two soft orbs as radial gradients in partner tokens (teal-neon, pink-wash, gold-bright) at 35–55% opacity.
3. A sheen linear band white 0→18%→0 at 20°.
4. Noise via the `/textures/noise-128.png` `<image>` at 4%.
5. The ring, as a wrapping div with a conic gradient masked to 3px (`story` = `--grad-story`, `live` = `--grad-live`, `seen` = `#d8d6ce→#c8c6be`). It spins at 8s/turn when `ringSpin` and in view.
6. The monogram, SG 700 at 40% of the size, white 92%.
7. For `card`, `reel` and `scene-portrait`: a **voiceprint** of 24 capsules along the lower third, with heights from `hash(persona.id + voiceSeed)`.

The colour is `PERSONAS[p].color`, or `var(--oshi)` when `persona === 'oshi'` (used for Yuzu on the fan page). Reduced motion or lite: static. `aria-hidden` (the containing mockup has the label).

**Scene details.** Token-only SVG and CSS compositions standing in for AI images and LIVE backgrounds. No people and no stars motif.
- rain-neon: pink/purple vertical streaks on night
- cafe-light: gold bokeh dots on a `#6f3fb8→#15161e` gradient
- night-sea: night into a `#00afc4` horizon with a moon disc
- stage-light: `--grad-live` conic beams from the top
- autumn-leaves: gold→pink blobs on a cream-raised field
- dawn-sky: `--grad-dawn`

`aria-hidden`.

**Waveform details.**
- Capsules 7px tall (`thick`: 20px wide, 4–12px tall), 5px gap. Every third bar at 45% opacity.
- Widths default to the app pattern `[7,22,14,7,18,26,10,22,14,18,10,22]`.
- When `playing`, each bar runs the CSS `wave` keyframe with duration `360+((i*97)%180)`ms and delay `(i%5)*120`ms. It carries `data-loop`, so it only runs in view.
- `amp='css-var'` multiplies by `var(--amp,1)`, which stage timelines set to 0–1.4.

**Marquee details.**
- Duplicates the items for a seamless loop, `animation: var(--animate-marquee)`. The second row reverses. Paused off-screen and on `:hover`.
- The velocity client reads Lenis velocity and sets `--skew` = clamp(velocity × 0.15, −6°, 6°) on rows (`transform: skewX(var(--skew))` on an inner wrapper). Disabled in lite and reduced motion.
- Reduced motion: `animation:none`, items wrap in a static grid.

### 4.8 Mockup kit (WP0 builds; WP4/WP5 consume)

All in `src/components/mockups/kit/`. Mockups are **server components** that take `{ d: Dictionary; lang: Locale; ... }` and render a 390×844 logical screen.

| Component | Props | Spec |
|---|---|---|
| `PhoneFrame` | `{ size: { mobile: number; desktop: number }; label: string; theme?: 'cream' \| 'night'; statusTime?: string; className?; children: ReactNode }` | See the details below. |
| `ScreenSlice` | `{ label: string; width: { mobile: number; desktop?: number }; crop: { y: number; h: number }; radius?: number; children }` | A figure with `role="img"`, `width: var(--sw)`, `height: calc(var(--sw) * crop.h / 390)` (where `--s = var(--sw)/390`), `overflow:hidden`, radius 28 (default). The inner screen is `translateY(-crop.y * --s px)` scaled. **Rule:** effective scale ≥0.75 when the slice carries meaning, so on mobile `width.mobile ≥ 292`. |
| `Screen` | `{ theme: 'cream' \| 'night'; children }` | A 390×844 box with `background: #f7f3ec` / `#0f1018`, `font-family: var(--font-sans)` and `color: #28273b` / white. |
| `StatusBar` | `{ time: string; theme }` | 54px: time PJS 600 15 at x=32, y=18; the right cluster (signal, wifi, battery) as 3 simple SVGs at 17×11, 15×11, 25×12. |
| `TabBarFan` | `{ d; active: 'home' \| 'chat' \| 'grow' \| 'live' \| 'mypage' }` | See the details below. |
| `TabBarStudio` | `{ d; active: 'chat' \| 'grow' \| 'home' \| 'earnings' \| 'me' }` | A glass bar (white .75 + border), 72px tall. Items: `forum` チャット, `psychiatry` 育成, **`home` ホーム centred as a 48px `#00b0c2` disc with a white icon**, `payments` 収益, `person` マイページ. Labels SG 500 10. Active `#0096a8`. |
| `MockChip` | `{ icon?; label; tone?: 'white' \| 'teal' \| 'purple' \| 'pink' \| 'dark'; selected?: boolean }` | 34px (sm 30) pill, PJS 600 12, per blueprint colours. **It has no price or coin tag prop.** |
| `CoinPill` | `{ theme }` | 31px pill white .88: an `LCCoin` 19px gold disc with a white "LC" PJS 700 8 + an 18px teal-gradient "+" disc. **No number (by design, no prop).** |
| `LiveBadge` | `{ pulse?: boolean }` | `#e14b81` radius 6, PJS 700 10 white "LIVE", tracking .6, `animate-live-dot` when pulsing. |
| `RingAvatar` | `{ persona; size; ring }` | Wraps `Aura shape="avatar"`. |
| `VerifiedMark` | `{ size?: number; tone?: 'teal' \| 'neon' }` | `check_circle` filled `#00c4d8` (neon `#7df4ff`). |
| `TypingDots` | — | 3 dots of 6px `#8d8ba0`, staggered opacity loop 1.2s (`data-loop`). |
| `ScanLine` | — | 3px `#00c4d8` line with a `0 0 12px #00e2f4` glow, `translateY ±60px` 1.4s `sine.inOut` yoyo (`data-loop`). |
| `Toggle` | `{ on: boolean; tone?: 'teal' \| 'pink' \| 'cyan' }` | 44×26 track; 22px knob translateX 0→18 (`transition .15s`). `data-toggle` hooks for animators. |
| `Segmented` | `{ items: string[]; active: number }` | Pills 7×14 padding, 11/600, selected cyan wash. |
| `GlassMockCard` | `{ radius?: 16 \| 20; tone }` | White .55–.72 + 1px white .9 edge; no backdrop-filter inside mockups. |

**PhoneFrame details:**
- `<figure role="img" aria-label={label} class="phone" style="--pw-m:{mobile};--pw-d:{desktop}">` with `--pw` switched by media query.
- `width: calc(var(--pw) * 1px)`, `height: calc(var(--pw) * 844 / 390 * 1px)`, `border-radius: calc(52px * var(--pw) / 390)`, `box-shadow: var(--shadow-phone)`.
- Inner `.screen`: 390×844 absolutely positioned, `transform: scale(calc(var(--pw) / 390))`, `transform-origin: 0 0`, radius 44, `overflow: hidden`, all content `aria-hidden="true"`.
- The dynamic island is 126×37 at the top 11px. The status bar comes from `StatusBar` with `statusTime` (default `10:42`).

**TabBarFan details:**
- Floating frosted pill: bottom 16, left/right 12, height 64, radius 32, `rgba(255,255,255,.88)`, `--shadow-chip`.
- 5 items: `home` ホーム, `forum` チャット, `psychiatry` 育成, **`podcasts` LIVE配信** (never videocam), `person` マイページ. Icon 22px, label PJS 600 11.
- Active: a 40×32 halo radius 16 `rgba(0,196,216,.14)`, filled icon `#0096a8`, label `#0096a8`. Inactive: `#8d8ba0` (decorative, inside `aria-hidden`).
- The halo carries `data-tab-halo` so animators can spring it (0.7→1, `back.out(2)`).

---

## §5 `/` and `/en`: fan home, section by section

### 5.0 Composition, order, and scroll budget

`src/app/(site)/[lang]/page.tsx` (owned by WP0; it only composes):

```tsx
export const dynamicParams = false;
export async function generateMetadata({ params }: PageProps<'/[lang]'>) { /* §8.1 */ }
export default async function HomePage({ params }: PageProps<'/[lang]'>) {
  const { lang } = (await params) as { lang: Locale };
  const d = getDictionary(lang);
  return (<>
    <SkipLink href="#main" label={d.common.skip.toContent} />
    <Header d={d} lang={lang} page="home" />
    <main id="main" className="overflow-x-clip">
      <HomeHero d={d} lang={lang} />          {/* WP1 */}
      <CastMarquee d={d} lang={lang} />       {/* WP1 */}
      <About d={d} lang={lang} />             {/* WP1 */}
      <CallChapter d={d} lang={lang} />       {/* WP1 (includes Checkpoint + CallDemo) */}
      <MorningChapter d={d} lang={lang} />    {/* WP2 */}
      <ChatChapter d={d} lang={lang} />       {/* WP2 */}
      <LiveChapter d={d} lang={lang} />       {/* WP2 */}
      <GrowChapter d={d} lang={lang} />       {/* WP2 */}
      <MoreBento d={d} lang={lang} />         {/* WP3 */}
      <HowChapter d={d} lang={lang} />        {/* WP3 */}
      <Faq d={d} lang={lang} />               {/* WP3 */}
      <CreatorsBand d={d} lang={lang} />      {/* WP3 */}
      <FinalCta d={d} lang={lang} />          {/* WP3 */}
    </main>
    <Footer d={d} lang={lang} page="home" />
    <MobileDownloadBar d={d} lang={lang} {...hrefs('sticky', lang)} />
    <QrDockShell d={d} lang={lang} />
    <JsonLd data={homeGraph(lang, d)} />
  </>);
}
```

Section components live at `src/components/sections/home/<name>/<Name>.tsx`. Each exports `function <Name>({ d, lang }: { d: Dictionary; lang: Locale })`.

| # | id (anchor) | Surface | Mobile height | Desktop height | Sticky stage? |
|---|---|---|---|---|---|
| 1 | `hero` | dawn | ≈1.15 vh (content) | 100svh min | no |
| 2 | `cast` | dawn→cream | 132px | 176px | no |
| 3 | `about` | cream | ≈1.0 vh | ≈1.0 vh | no |
| 4 | `call` (+ `call-checkpoint`) | night | **180svh** + ≈0.45 vh | 260svh + 0.4 vh | **yes #1** |
| 5 | `morning-call` (+ `voice-message`) | night→dawn→cream | ≈1.3 vh (no sticky) | 160svh stage + 0.8 vh | desktop only |
| 6 | `chat` (+ `stories`, `memory`) | day | ≈1.15 vh (carousel) | ≈2.4 vh (3 steps × 70svh + header) | desktop CSS-sticky phone, no scrub |
| 7 | `live` (+ `live-request`) | night | intro 0.5 + **160svh** + 0.9 | intro 0.6 + 220svh + 0.9 | **yes #2** |
| 8 | `grow` | lavender | ≈1.1 vh | ≈1.3 vh | no |
| 9 | `more` | cream | ≈1.45 vh | ≈1.7 vh | no |
| 10 | `how-it-works` | cream + sunrise | ≈1.3 vh | ≈2.0 vh (4 × 45svh steps) | desktop CSS-sticky phone |
| 11 | `faq` | cream | ≈1.0 vh | ≈1.0 vh | no |
| 12 | `creators` | lavender band | ≈0.6 vh | ≈0.8 vh | no |
| 13 | `download` | night | **140svh** | 200svh | **yes #3** |
| — | footer | night-deep | — | — | — |

The total to the start of `#download` is ≈14.3 viewport-heights on mobile and ≈18 on desktop. That is within budget. Each sticky stage has a `SkipLink` to the next section's id.

### 5.1 `#hero`: 推しと、声で話そう (WP1)

**Purpose:** the 5-second proposition and the first download point. It holds the page's single `<h1>`.

**Files:** `sections/home/hero/HomeHero.tsx`, `HeroAnimator.client.tsx`.

**Keys:** `home.hero.*`, `common.disclosure`, `common.freeWithIap`, `common.screenNote`, `common.devNote`.

**Desktop layout (≥1024):**
- Grid 12 cols with the container width, min-height `100svh`, padding-top `calc(var(--header-h) + 48px)`.
- **Copy, cols 1–6, vertically centred:**
  1. `Eyebrow` (no num) with `home.hero.eyebrow` (`.t-label`, ink-2)
  2. **H1** `id="hero-title"`, `.t-display-xl`, ink, `home.hero.title` rendered via `Units` (phrase), max 2 lines
  3. lead `.t-lead` ink-2, max-width 30em, `home.hero.lead`
  4. `StoreBadges placement="hero" size="lg" qr showFriction` (`data-badges`)
  5. `Disclosure variant="line"`
  6. the chip strip `<nav aria-label={chipsLabel}>`: 6 `MockChip`-styled links (`.glass-fake`, 36px) in order: `call` (#call, icon `call`), `morning` (#morning-call, `alarm`), `voice` (#voice-message, `graphic_eq`), `chat` (#chat, `forum`), `live` (#live, `podcasts`), `grow` (#grow, `psychiatry`)
- **Phone, cols 8–11:**
  - `PhoneFrame size={{mobile: 300, desktop: 360}} label={home.hero.phoneAlt}` containing `<FirstCall00c persona="oshi" />`, which is Yuzu with the 推し色 aura.
  - A `radial-gradient(closest-side, rgba(255,209,102,.35), transparent)` dawn orb (560px) sits behind it.
  - 4 `Sticker`s orbit it (`fake glass`): `stickers.official` (`verified`, teal, tilt −5, top-left), `stickers.first60` (`timer`, gold, tilt 4, right-middle), `stickers.call` (`call`, teal, tilt −3, left-bottom) and `stickers.live` (`podcasts`, pink, tilt 6, top-right).
- `ScreenNote` sits under the phone (right-aligned `.t-small`).

**Mobile layout (<1024), the acceptance wireframe at 390×664:**

```
y=0    ┌ header 56 ────────────────────────────┐ mark · [入手 pill] · ☰
y=72   │ 推しのAIクローンと話せるアプリ (eyebrow 12)   │
y=96   │ 推しと、                                │ H1 44/1.2 → 106px
       │ 声で話そう                              │
y=214  │ 公式のAIクローンと、通話・チャット・LIVE配信。│ lead 16/1.85 → 2–3 lines ≈ 90px
       │ 最初の60秒は無料で話せます。               │
y=316  │ [ App Store badge ][ Google Play badge ]│ 44px (platform-matched: 52px + text link row 20)
y=384  │ ダウンロード無料・アプリ内課金あり           │ 12.5px
y=408  │ ✓ クリエイターのプロフィールはすべてAIクローンです │ 12.5px (ink-2)
y=440  │ ◀ 通話 · モーニングコール · ボイス… ▶ (chip row, x-scroll, 36px) │
y=492  │     ╭──────────╮  ◉公式AIクローン          │ phone peek (300px wide, top ≈ 500)
y=664  └─────┴──────────┴────────────────────────┘ (fold)
```

- Order: eyebrow → H1 → lead → badges → friction line → disclosure → chip row (`overflow-x:auto; scroll-snap-type:x proximity; data-lenis-prevent`) → phone → `ScreenNote`.
- Only 2 stickers on mobile (`official` top-right of the phone, `first60` left). They overlap the phone top edge.
- The phone is centred at 300px. Its top peeks above the fold (≈170px visible at 664) so the first call screen's portrait and name show.

**Animation (no GSAP above the fold):**
- CSS on load:
  - H1 `animation: rise .6s var(--ease-hero) both` with 16px travel (override `--rise-y:16px`)
  - lead and badges: rise with delay 80ms and 140ms
  - phone: `rise .7s .08s` plus a `rotate(2deg)→0` variant
  - stickers: `animate-pop` staggered 60ms from 220ms
  - All are transform-only, so every element is visible at the first frame (opacity 1).
- Inside `FirstCall00c`:
  - `[data-avatar-glow]` `animate-breathe` (1s alternate, scale 1→1.08)
  - the call button `animate-pulse-soft` (.95↔1.06, .9s)
  - both are `data-loop`, running only while `#hero.is-inview`
- **After idle** (`HeroAnimator`, via `useScrollScene` with `rootMargin:'0px'`, desktop only for parallax):
  - `CaptionMarker targetId="hero-title" restOn="last" tone="teal"` (it rests on 「話そう」 / "out loud.")
  - on desktop, cursor parallax on stickers: `gsap.quickTo(el,'x',{duration:.6, ease:'power3'})`, ±12px × depth (0.6–1.2)
- **Scroll-away** (desktop, scrub): `start 'top top', end 'bottom top'`: phone `y: 0 → -60`, orb `scale 1 → 1.15`, stickers `y` −20…−80 by depth. Transform only.

**Reduced motion:** no rise, pop, loops or marker. **No JS:** everything is visible, and the header CTA points to `/get`.

**Performance:**
- The H1 is the LCP element: server text, no image. The JA headline subset is preloaded.
- The phone is DOM plus inline SVG aura with no raster.
- The two badge images are `<img>` SVG/PNG with explicit `width`/`height` and `fetchpriority="high"` for the first badge.
- No backdrop-filter in the hero except the header.

### 5.2 `#cast`: メンカラ can-badge marquee (WP1)

**Purpose:** "these are official AI clones of creators" at a glance, with no faces.

**Files:** `sections/home/cast/CastMarquee.tsx`.

**Keys:** `home.cast.*`, `personas.*`.

**Layout:**
- `<section aria-label={home.cast.label}>`, `Marquee rows={2 desktop / 1 mobile}`.
- Each item is a 120px (mobile 96px) `Aura shape="badge" ring="story" ringSpin voiceprint={false}` + name (PJS 700 14) + genre (`.t-small` ink-2) + a mini chip `home.cast.badge` (`verified` 12px).
- Personas in order: yuzu (as `oshi`), ren, kai, sora, nagi, yuzu, kai… (6 unique, looped). `home.cast.note` sits under the marquee, right-aligned.

**Motion:** CSS marquee 40s. Row 2 is reversed. Velocity skew ≤6° (desktop, non-lite). Paused off-screen. Reduced motion: static wrap.

### 5.3 `#about`: 話し相手は、公式のAIクローン。 (WP1)

**Purpose:** trust before features. The AI disclosure becomes the page's biggest statement.

**Files:** `sections/home/about/About.tsx`, `OshiColorPicker.client.tsx`.

**Keys:** `home.about.*`, `common.disclosureOfficial`.

**Desktop:**
- `Eyebrow label=home.about.eyebrow.label`, then **H2** `id="about-title"` `.t-h2` `home.about.title`.
- Then `ScrollFillText as="p" mode="clip" tone="ink" className="t-statement" text={home.about.statement} accent="公認のAIクローン"` (EN accent `official AI clones`), cols 1–10.
- Then a 3-up grid of `GlassCard tone="day"` cards (`cards.official` icon `verified` teal; `labelled` icon `auto_awesome` purple; `memory` icon `psychology` purple). Each card has an H3 `.t-h3`, a body and a **detail crop**:
  - official: a small `Aura badge` with a verified mark
  - labelled: a chip rendering `mock.fan.livePlayer.disclaimer` on night
  - memory: a mini memory row from `Memory06` (`ScreenSlice width 260 crop {y:520,h:120}`)
- Then `Disclosure variant="bar"`.
- `OshiColorPicker` sits right-aligned under the bar: label `oshiColor.label`, 6 swatches (24px circles inside 44px hit areas, `role="radiogroup"`, each `role="radio"` with `aria-label` from `oshiColor.options.rose|teal|lavender|amber|sky|mint`) using the persona accents, and `oshiColor.hint`. Without JS the swatches render but do nothing.
  - Clicking sets `document.documentElement.style.setProperty('--oshi', hex)` and `localStorage['lc.oshi']` (try/catch).
  - It never changes CTA teal.

**Mobile:** single column. The cards form a horizontal `Carousel` (80vw each) to save height. The picker sits under the bar.

**Animation:**
- Fill: start `'top 80%'`, end `'bottom 45%'`, scrub true. The accent class toggles at 0.7.
- Cards: `RevealGroup` (stagger .06).
- Disclosure bar icon: pop `back.out(1.6)` .45s on enter (once).
- **One fill per viewport:** the statement is the only fill here.

**Reduced motion:** full text, no reveals.

### 5.4 `#call`: 01 通話, 声で話すと、もっと近い。 (WP1): **stage #1, text-fill, tap-to-call**

**Purpose:** make the core value physical: *you're on a voice call with them*. It is also the only hands-on demo.

**Files:**
- `sections/home/call/CallChapter.tsx` (server)
- `CallStageAnimator.client.tsx`
- `CallDemo.client.tsx` (lazy)
- `Checkpoint.tsx`
- Uses `mockups/fan/CallStageMedia.tsx` (WP4) and `FirstCall00c` (WP4) as `bezelScreen`

**Keys:** `home.call.*`, `home.demo.*`, `home.checkpoint.*`, `mock.fan.call.*`, `mock.fan.firstCall.*`.

**Structure:** `ExpandStage id="call" height={{mobile:180, desktop:260}} direction="expand" surfaceStart="cream"` with:
- `phone`: desktop `{side:'right', width: 330}`; mobile `{ width:'min(76vw, 300px)', top:'calc(var(--intro-h) + 12px)' }`; radius `{desktop:44, mobile:36}`
- `intro`: `Eyebrow num="01" label` + **H2** `id="call-title"` `.t-h2` `home.call.title` + lead `.t-lead` + a chip row (`home.call.routes` with `volume_up`; `common.friction.first60` with `timer`)
- `media`: `<CallStageMedia d lang persona="oshi" variant="stage" />`
- `bezelScreen`: `<FirstCall00c persona="oshi" />`, shown only at p<0.06 so that the phone looks like the hero phone before expanding
- `skip`: `#morning-call`, `common.skip.stage`

**CallStageMedia DOM hooks** (WP4 must render these; see §7):
- `[data-call-state]` with child spans `[data-s="connecting|listening|thinking|speaking"]`; the active one is shown by the `data-state` attribute on the root
- `[data-caption="fan"]` and `[data-caption="oshi"]`, both `ScrollFillText driver="external" mode="units" unit="phrase" tone="white"`
- `[data-meter]` (text `0:60`)
- `[data-avatar-glow]`, `[data-fan-glow]`, `[data-wave]` (Waveform `amp='css-var'`)
- `[data-toast]` (`home.call.transcriptToast`)
- `[data-demo-root]` (where CallDemo mounts; it contains a server-rendered button that is a `#download` link when there is no JS)

**Timeline** (`useExpandStage` with `clip:[0.06,0.40]`, `introToNight:[0.06,0.30]`, scrub 0.5). `extend` adds:

| p | Beat | Tween(s) |
|---|---|---|
| 0.00–0.06 | hold | bezelScreen visible, media behind the clip |
| 0.05–0.07 | handoff | `bezelScreen` opacity 1→0 (media under the clip already shows the same composition) |
| 0.06–0.40 | expand (hook) | clip from the phone rect to full, inner 1.15→1, bezel fade, bg cream→night, intro ink→white |
| 0.40 | state → `listening` | `onUpdate` sets `media.dataset.state` by thresholds: `<0.40` connecting, `<0.52` listening, `<0.58` thinking, else speaking |
| 0.40–0.52 | fan's turn | `[data-fan-glow]`: `yPercent 40→0`, `opacity 0→1`, `scale .95→1.1`; fan caption fill 0→1 (white 25%→white 72%) |
| 0.52–0.58 | thinking | fan glow `y:-140`, `opacity→0` (ease `power3.inOut`); `[data-avatar-glow]` `opacity 0→1`, `scale .82→1` (starting at 0.55) |
| 0.58–0.86 | 推し speaks | avatar glow `scale` keyframes `[1,1.2,.9,1.25,.95,1.15,1]`; oshi caption fill 0→1 (accent 「聞かせて」 / "Tell me everything" → `#7df4ff`); `[data-wave]` `--amp 0→1.3→1`; meter `onUpdate` text `0:60` → `0:48` (integer seconds, tabular) |
| 0.86–0.92 | transcript | `[data-toast]` `y 12→0, autoAlpha 0→1` |
| 0.86–1.00 | demo CTA | `[data-demo-root]` `y 16→0, autoAlpha 0→1`; hold |

- **Mobile:** same map with `clip:[0.06,0.34]`. The bezel fades out by 0.16. Captions are per phrase (they already are). The demo button is 64px tall in the bottom 96px of the viewport (thumb reach), and captions sit above it.
- **Lite:** simple reveal (hook). Glows use opacity only (no scale keyframes).
- **Reduced motion or no JS:** the SSR final state is a full-bleed night stage with the intro in white, both captions filled, state `speaking`, meter `0:60`, and the demo button visible.

**Tap-to-call demo (`CallDemo.client.tsx`):**
- Dynamic-imported when `#call` is within 1 viewport (≈6 KB, no GSAP needed except `loadMotion` for glows).
- The button is `.btn-night` 64px, full width on mobile and 360px on desktop. Label `home.demo.button`, followed by a pink-wash **tag chip** `home.demo.tag` (`デモ`). `aria-label={home.demo.startLabel}`. A `.t-small` under the button: `home.demo.note`.
- On click, dispatch `lc:demo-start` and `track('demo_start')`, then run a gsap timeline (time-based, not scroll):

| t (s) | State | What happens |
|---|---|---|
| 0 | `connecting` | Button squeezes to .96 then 1. Two teal ripple rings (`1px #00e2f4`, 120px) scale 1→6 with opacity .6→0 over 1.2s, the second delayed .3s. |
| 1.2 | `speaking` | Logo burst: a 48px `--grad-logo-burst` disc inside the portrait ring scales 1→3 with opacity .6→0 over .6s `power2.out`. Avatar glow beats on a scripted envelope (`[.82,1.35,.9,1.5,1,1.3,.88,1.2]`, each step 60ms up and 200ms down). Caption strip (`aria-live="polite"`, `.t-display-l`-sized white, `min-height` reserved for 2 lines so typing never shifts layout; the full line is set in the DOM at once for assistive tech and the typing is a `clip-path`/per-unit opacity reveal) shows `home.demo.lineOne`, revealed at 45ms/char (EN 25ms/char). |
| 5.5 | `listening` | Avatar glow →0 over .2s. Fan glow rises (`yPercent 40→0` over .45s) and breathes (scale .95↔1.1, 1.2s sine, 2 cycles). Caption `home.demo.hint` in white 72%. |
| 8.6 | `thinking` | Fan glow drifts `y:-140` and fades over .45s `power3.inOut`. |
| 9.4 | `speaking` | Caption `home.demo.lineTwo`, beats resume. |
| 0→14 | meter | `[data-meter]` counts `0:60`→`0:46` in real time (1s ticks). |
| 14 | end | Dispatch `lc:demo-end` and `track('demo_complete')`. The **done card** pops into `[data-demo-root]` (`back.out(1.6)` .45s): `.glass-night` radius 28 (no backdrop-filter: it sits inside `[data-stage-media]`), `check_circle` teal 40px, `home.demo.doneTitle` `.t-h3` white, `home.demo.doneBody`, `StoreBadges placement="demo" qr`, `home.demo.note`, and a `home.demo.replay` ghost button. |

- An IntersectionObserver (threshold .25) pauses the timeline off-screen and resumes it on return. Scrolling is **never locked**.
- **Reduced motion:** clicking immediately shows lineOne, hint and lineTwo as a static list, then the done card. No glows or ripples.
- **Audio:** `DEMO_AUDIO_SRC` is null, so no audio UI is rendered. If the owner later sets a rights-cleared URL, render a `音声をオン` toggle (off by default) that plays `<audio preload="none">`. Never autoplay, and never use the app's ringtone MP3s.

**Checkpoint (`#call-checkpoint`, after the stage, night surface, `data-download-block`):**
- Centred container, max 720.
- `home.checkpoint.title` as a `<p class="t-h3">` (**not** a heading; it is a CTA), `home.checkpoint.sub`, `StoreBadges placement="checkpoint" showFriction`, `FrictionList items={['first60','trialBeforeSignup','noPassword']}`, then `home.call.trust` and `home.call.billing` as `.t-small` white 78% with `check` icons.
- `ScreenNote tone="dark"`.
- Padding: 64px top, 96px bottom (mobile 48/72).

### 5.5 `#morning-call`: 02 モーニングコール, 推しの声で、目がさめる。 (WP2)

**Purpose:** the most shareable 推し活 feature, plus the latest voice message on Home.

**Files:** `sections/home/morning/MorningChapter.tsx`, `MorningStageAnimator.client.tsx`, `MorningMicro.client.tsx`.

**Keys:** `home.morning.*`, `mock.fan.incoming.*`, `mock.fan.morningSetup.*`, `mock.fan.home.*`.

**Mockups:** `IncomingRing06b`, `MorningSetup06b`, `HomeCards01` (all WP4).

**Desktop (≥1024):** section = a stage part (160svh, sticky) + a grid part (auto). `data-surface` flips from dark to light at 45% via the header observer (the stage root uses `data-surface="dark"` and the grid `light`).
- **Stage layers:**
  - `[data-dawn]`: an absolutely positioned layer `inset: 0 0 auto 0; height: 500%` painted once with `background: var(--grad-dawn)`, inside the sticky stage (`overflow: clip`). It is moved with `transform` only (`will-change: transform`), never `background-position`.
  - `[data-stars]`: 8 absolutely placed 2px white dots, opacity .7
  - left cols 1–6: `Eyebrow num="02"` (white), **H2** `id="morning-title"` (white→ink), `[data-clock]` `.t-poster-clock` holding three stacked spans `6:58`, `6:59`, `7:00` (overflow clip, height 1em)
  - under the clock: the caption line `ScrollFillText as="p" mode="units" unit="phrase" driver="external" tone="ink" className="t-display-l"` with `home.morning.captionLine`
  - right cols 8–11: `PhoneFrame size={{mobile:0, desktop:340}} theme="night" statusTime="7:00" label={mock.fan.incoming.alt}` with `<IncomingRing06b persona="oshi"/>` as `[data-ring-phone]`

**Stage timeline** (`useScrollScene`: trigger the stage wrapper `start:'top top'`, `end:'bottom bottom'`, scrub .6, timeline duration 1):

| p | Tween |
|---|---|
| 0→0.50 | `[data-dawn]` `yPercent: 0 → -80` (ease none; −80% of a 500%-tall layer shows its last viewport, the cream end) |
| 0→0.30 | `[data-stars]` opacity .7→0 |
| 0.12–0.16 | clock span stack `yPercent 0 → -100` (6:58→6:59), `power2.inOut` |
| 0.28–0.32 | clock stack `yPercent -100 → -200` (→7:00) |
| 0.25–0.45 | H2 and clock `color` #fff → #28273b; eyebrow white→ink-2 |
| 0.30–0.45 | `[data-ring-phone]` `y: '60vh' → 0` (from-state applied only when below the fold at init) |
| 0.45–0.75 | caption line fill 0→1 |
| 0.75–1 | hold |

The loops inside IncomingRing (portrait pulse .98↔1.04, accept pulse .96↔1.06, both `data-loop`) run in view.

- **Grid part** (cream, padding `var(--section-y)` 0): 12-col.
  - Left cols 1–6: lead `.t-lead` `home.morning.lead`, `home.morning.note` (`.t-small` ink-2 with an `info` icon), then `PhoneFrame 320` `MorningSetup06b`.
  - Right cols 7–12: `div#voice-message` containing `Eyebrow label=voiceEyebrow`, **H3** `.t-h3` `voiceTitle`, `voiceBody`, and a `ScreenSlice width={{mobile:320, desktop:380}} crop={{y:430, h:330}} label={mock.fan.home.alt}` with `HomeCards01` (morning card and voice card).
  - `ScreenNote`.
- **Grid micro** (`MorningMicro`, once on `top 70%`):
  - in the setup mockup, the selection highlight moves from `once` to `daily` (a `[data-sel]` pill transforms to the next tile, .42s `power3.inOut`)
  - the ring card pops (`back.out(1.6)`)
  - in HomeCards: the play icon morphs to pause (crossfade .26s), `Waveform playing` starts, and the 新着 badge pops then fades to 40% after 2.4s

**Mobile:** no sticky.
- The section background is the static `--grad-dawn` from the top (night) to the bottom (cream).
- Order: Eyebrow (white), H2 (white), clock (`.t-poster-clock` at 26vw), caption line fill (`scrub true`, `top 75%`→`center 45%`, tone white), then `ScreenSlice width={{mobile: 312}} crop={{y:96, h:600}}` of IncomingRing, then lead, note, setup `ScreenSlice crop={{y:120,h:520}}`, then `#voice-message` block with the HomeCards slice.
- The clock flips once on enter (0.35s per step).

**Reduced motion / no JS / SSR:** the CSS default is the final state: `[data-dawn]` at `translateY(-80%)` (cream), stars hidden, clock stack at 7:00, H2 and clock in ink, phone in place, caption filled, no loops. The animator applies the start state (night) only when the stage is below the fold at init.

**Performance:** one composited `transform` on the dawn layer (no background-position or colour-stop animation). No blur. The phone's inner loops run only in view. The H2/clock `color` tween is paint-only on two small elements.

### 5.6 `#chat`: 03 チャット, 昼休みは、チャットの続き。 (WP2)

**Purpose:** chat with memory, the call-to-chat transcript bridge, Stories (image **and** voice from one reply), and bond & memories (free modes only).

**Files:** `sections/home/chat/ChatChapter.tsx`, `ChatMicro.client.tsx`.

**Keys:** `home.chat.*`, `mock.fan.conversation.*`, `mock.fan.story.*`, `mock.fan.memory.*`.

**Mockups:** `Conversation04`, `StoryFlow04to03b`, `Memory06` (WP4).

**Desktop:**
- Surface `day`, with a `teal-band` rounded backdrop behind the steps.
- Header block cols 1–7: `Eyebrow num="03"`, **H2** `id="chat-title"`, lead.
- Then `StickySteps side="right" phoneSize={{desktop:340}} stepMinHeight="70svh"` with steps:
  1. `id="chat-step"`: label `steps.chat.label` (as a `MockChip`), H3 `steps.chat.title`, body `steps.chat.body` → screen `Conversation04`
  2. `id="stories"`: `steps.stories.*` → screen `StoryFlow04to03b`, transition `push`
  3. `id="memory"`: `steps.memory.*` → screen `Memory06`, transition `fade`
- After the steps: `steps.stories.footnote` and `ScreenNote`.

**Micro-sequences** (`ChatMicro` listens for `lc:step` and plays a `gsap.timeline` once per activation; they are not scrubbed):
- **Conversation04:** `[data-m=ended]` pops, then `[data-m=b1]`, `[data-m=b2]` (with `[data-m=read]`), `[data-m=typing]` for 1.2s, `[data-m=b3]`, then `[data-m=chips]`. Each uses the REVEAL_FROM tween with 0.5s gaps. Transform and opacity only.
- **StoryFlow:** `[data-m=chip-image]` squeezes .96. `[data-m=gen]` (dashed teal card with ScanLine) appears; its scan line loops for 1.4s × 2. `[data-m=scene]` (`Scene kind="cafe-light"`) pops with `[data-m=ai-tag]`. `[data-m=post]` presses and its label swaps to `story.posted`. Then a sub-screen push to `[data-sub=viewer]` (`xPercent 100→0`, the old screen goes to −30 with a dim). `[data-m=progress]` runs `scaleX 0→1` over 5s linear. `[data-m=heart]` pops.
- **Memory06:** `[data-m=nick]` types `personas.fan.nickname` at 50ms/char. `[data-m=mode-sel]` pill hops standard → gentle → cheerleader (0.9s each). `[data-m=mem]` rows reveal (stagger .06). The `[data-m=lock-2]` icon pops filled.

**Mobile:**
- Header block, then `Carousel label={home.chat.title}` of 3 cards (86vw, `.glass`, padding 16). Each card: label chip, H3, body, and `ScreenSlice width={{mobile: 300}}` with crops Conversation `{y:96,h:560}`, StoryFlow `{y:120,h:560}`, Memory `{y:80,h:560}`.
- The card's micro-sequence plays when the card gets `data-active`. `home.chat.swipeHint` sits under the dots.

**Reduced motion:** all screens show their final state (all bubbles, the posted Story, the nickname set, the mode on gentle).

### 5.7 `#live`: 04 LIVE配信, 今夜は、推しのLIVE配信。 (WP2): **stage #2**

**Purpose:** audio-only LIVE, comments read on air, gifts and Super Chat, archives, and requesting a show.

**Files:** `sections/home/live/LiveChapter.tsx`, `LiveStageAnimator.client.tsx`, `LiveLoops.client.tsx`, `LiveRequestRow.tsx`, `LiveRequestMicro.client.tsx`.

**Keys:** `home.live.*`, `mock.fan.liveFeed|livePlayer|liveRequest|liveSetup|showPreview|archive.*`.

**Mockups:** `LiveFeedCard`, `LivePlayerStage` (full viewport), `LiveRequest12`, `LiveSetup13`, `ShowPreview14`, `ArchiveCard11` (WP4).

**Intro block** (night, before the stage):
- `Eyebrow num="04" tone="white"`, then **H2** `id="live-title"` `.t-h2` white, with an inline chip immediately after it on the same line (desktop) or below (mobile): `home.live.audioChip` (`podcasts` icon, bg `rgba(225,75,129,.16)`, text `#ffe0eb`, PJS 700 13).
- Lead white 78%.
- A decorative giant "LIVE" word (`aria-hidden`, SG 700 min(22vw, 280px), `-webkit-text-stroke: 1px rgba(255,255,255,.12)`, transparent fill, liveRing glow `text-shadow` none) sits behind the intro and parallaxes `yPercent −10→10` (desktop scrub).

**Stage:** `ExpandStage id="live-stage" height={{mobile:160, desktop:220}} direction="expand" surfaceStart="night"` with:
- phone: desktop `center` width 320; mobile `{width:'min(74vw, 290px)', top:'96px'}`
- `bezelScreen`: `LiveFeedCard persona="kai"`
- media: `LivePlayerStage persona="kai"`
- intro: empty (the intro block sits above the section)
- skip: `#live-request`

`extend` beats:

| p | Tween |
|---|---|
| 0.03–0.08 | `[data-m=join]` (inside bezelScreen) press: scale 1→.96→1 |
| 0.08–0.40 | clip expand (hook `clip:[0.08,0.40]`) |
| 0.42–0.70 | `[data-fill]` line `home.live.fill` (`ScrollFillText driver="external" mode="units" unit="phrase" tone="white" className="t-display-l"`, on a `rgba(15,16,24,.45)` pill scrim) fills 0→1 |
| 0.30–0.80 | `[data-theme-progress]` `scaleX .2→.65` (transform-origin left) |
| 0.55 | `[data-m=superchat]` gets class `is-read`, so the 読み上げ済み tag pops (CSS `animate-pop`) |
| 0.70–1 | hold |

- **Loops** (`LiveLoops`, only while `#live-stage.is-inview`, not in lite):
  - comments column `[data-comments]` is a CSS `translateY` loop 12s linear with a `mask-image: linear-gradient(transparent, #000 15%, #000 85%, transparent)`
  - every 2.4s one of the 6 `[data-gift]` glyphs pops (`back.out(1.6)` .45s) then floats `y:-80` with opacity →0 over 1.2s `power1.out`
  - the big `Waveform bars=24 tone="white" playing`
- **Lite and reduced motion:** static comments with no gift loop. The SSR final state is the full-bleed player.

**Request row (`#live-request`)** (night, padding 64/96):
- **H3** `.t-h3` white `home.live.requestTitle` and `requestBody` (white 78%).
- Desktop: 3 columns:
  1. `LiveRequest12` as a *card* (not a phone): lavender card radius 24, width 100%
  2. `PhoneFrame 300` `LiveSetup13`
  3. `PhoneFrame 300` `ShowPreview14`
- Under them, `ArchiveCard11` plus **H3** `archiveTitle` and `archiveBody`.
- A drawn SVG connector (1.5px `#7df4ff` at 40%) links the three columns: `stroke-dashoffset` from its length to 0, scrub, `start:'top 70%'`, `end:'bottom 60%'`.
- Mobile: `Carousel` of 4 items (request card, setup slice `{y:96,h:560}`, preview slice `{y:96,h:600}`, archive card).
- **Micro** (`LiveRequestMicro`, once when the row enters or a card becomes active): LiveSetup13 `[data-m=topic]` types `topicValue` at 60ms/char; ShowPreview14 `[data-m=seg]` rows reveal with stagger .12; `[data-m=flow]` rows pop.
- `home.live.footnote` `.t-small` white 72%, then `ScreenNote tone="dark"`.

**Truth:** no viewer counts, no gift tiers or coin amounts, no ticket lengths, no request timing numerals, the `podcasts` glyph only, `LINCLONE AI・AI生成コンテンツ` always visible in the player.

### 5.8 `#grow`: 05 育成, 夜は、推しを育てる時間。 (WP2)

**Purpose:** fans teach the clone who the creator really is. The creator has the final say. The community vote is never shown as binding or as a perk.

**Files:** `sections/home/grow/GrowChapter.tsx`, `GrowAnimator.client.tsx`.

**Keys:** `home.grow.*`, `mock.fan.growPicker|growProfile|growReview.*`.

**Mockups:** `GrowPicker07`, `CreatorProfile08`, `ReviewStatus10` (WP4). **10b community vote is never built.**

**Desktop (lavender surface, with a `nights_stay` moon glyph decoration at the top-right, 64px `#a97fe0` 40%):**
- Cols 1–6: `Eyebrow num="05" tone="violet"`, **H2** `id="grow-title"`, then the fill line `ScrollFillText as="p" mode="units" unit="phrase" tone="purple" className="t-display-l" text={home.grow.fill}` (start `'top 70%'`, end `'center 40%'`, scrub 1), then lead.
- Cols 7–12: the card stack `[data-stack]` with 3 `PhoneFrame 280` (Picker, Profile, Review) absolutely stacked at the centre.
- Below both, full width: a pipeline track (`<ol>` of 4 steps: `pipeline.submit` `edit_note`, `ai` `auto_awesome`, `community` `groups`, `approved` `verified`) with a connector, then a pill `finalSay` (icon `verified_user`), then `rules` (`.t-small` ink-2 with a `block` icon).
- `ScreenNote`.

**Animation:**
- Stack spread (scrub 1, trigger `[data-stack]`, `start:'top 80%'`, `end:'center 50%'`): from stacked (rotate 0, x 0, the back cards scaled .96 and offset y 12) to fanned: phone 1 `x:'-42%', rotate:-8`, phone 2 `x:0, rotate:0, y:-12`, phone 3 `x:'42%', rotate:8`.
- Pipeline (once, `top 75%`): each step disc goes from `#f0e6fb` to `#8b55d6` with a white icon, 0.5s apart. The connector runs `scaleX 0→1` in sync. At the same time, ReviewStatus10's `[data-status]` pill swaps text and colour: AI審査中 (gold) → みんなの審査 (purple) → 承認済み (teal). After that, CreatorProfile08's `[data-m=new-row]` (`rows.season`) pops.

**Mobile:** H2, fill (scrub true), lead, then a `Carousel` of 3 slices (`width 300`, crops Picker `{y:80,h:560}`, Profile `{y:60,h:600}`, Review `{y:80,h:560}`), then a vertical pipeline stepper whose line runs `scaleY` on enter (once), then `finalSay` and `rules`.

**Reduced motion:** fanned stack, all steps lit, status 承認済み, new row visible.

### 5.9 `#more`: まだまだ、推しとできること。 (WP3)

**Purpose:** breadth. Everything else in the app, each with a micro-interaction. Plans are qualitative; there is honest money copy.

**Files:** `sections/home/more/MoreBento.tsx`, `ModeSampler.client.tsx`, `BentoMicro.client.tsx`, `FeatureIndex.tsx`.

**Keys:** `home.more.*`, `mock.fan.memory.modes`, `mock.fan.quests|bonus|invite|confirm|myPage|sleep|gate|reel.*`.

**Mini mockups:** `ReelMini`, `QuestsMini`, `BonusMini`, `InviteMini`, `PlansMini`, `ConfirmSheetMini`, `MyPageMini`, `SleepMini`, `SignInMini` (WP4). Each is a small DOM composition (not a full phone).

**Desktop:** `Eyebrow`, **H2** `id="more-title"`, lead. Then a 12-col bento with `grid-auto-rows: 280px` and gap 16. Tiles are `GlassCard tone="day"` radius 28 with padding 24 and an H3 `.t-h3` plus a body:

| Tile (id) | Span | Mini mockup | Micro-interaction (desktop hover or focus; otherwise once in view) |
|---|---|---|---|
| `more-modes` | 8×1 | `ModeSampler`: 6 radio chips + a sample bubble | Chip click → the bubble text swaps to `tiles.modes.samples.<mode>` by typewriter (.4s total, `aria-live="polite"`). It auto-cycles every 2.4s until the first interaction, paused off-screen. `tiles.modes.note` in `.t-small`. |
| `more-reel` | 4×1 | `ReelMini` (a 9:16 aura reel with a voice bubble) | Vertical snap loop Kai → Sora → Yuzu: `yPercent -100` steps, .6s `power3.inOut` every 2.2s, waveform playing. The Follow pill morphs to Following (bg white → `#00b0c2`, label swap). |
| `more-quests` | 4×1 | `QuestsMini` (5 chapter rows, ✓ and GO) | Checks draw via `stroke-dashoffset` with stagger .06, then the 「クエスト達成」 card pops (`celebration` icon, **no amount**). |
| `more-bonus` | 4×1 | `BonusMini` (7 day tiles, the last is today) | Tiles light up at .08s stagger. Today's tile gets a teal glow `box-shadow 0 0 14px rgba(0,175,196,.35)`. |
| `more-invite` | 4×1 | `InviteMini` (code chip `YUZUHINA`) | Click → the icon swaps to `check` for 1.6s with the `copied` label. It is **visual only**; no clipboard write. |
| `more-plans` | 8×1 | `PlansMini`: 4 glass cards (`cards.*.name/perk`), with a `#8b55d6` ring on the premium card | Cards fan in (rotate −6/−2/2/6 → 0, y 20→0, stagger .06). `tiles.plans.note` sits under them. **No prices, coin numbers or ticket counts.** |
| `more-money` | 4×1 | `ConfirmSheetMini` + 5 points list | The sheet slides up (y 100%→0 .42s), then the refund line's check icon draws. The `points.*` list uses `check` icons. |
| `more-library` | 4×1 | `MyPageMini` (tabs + a 3×2 `Scene` grid) | The tab underline slides image → stories → voice → archive every 1.6s in view. |
| `more-sleep` | 4×1 | `SleepMini` (toggle + a moon glyph) | The toggle flips on, `bedtime` fades in, and a sticker `mock.fan.sleep.morningStill` pops (tilt 4). |
| `more-signin` | 4×1 | `SignInMini` (Apple and Google rows) | `noPassword` chip pulse (once). |

- **Mobile:** H2, lead, then `more-modes` full width (sampler chips wrap onto 2 rows), then a `Carousel` of 6 small tiles (reel, quests, bonus, invite, library, sleep; 72vw each, 240px tall), then `more-plans` full width (cards in a 2×2 grid), then `more-money` full width, then `more-signin` full width, compact.
- **FeatureIndex** (after the bento, both breakpoints): **H3** `home.more.indexTitle`, then a `<ul>` of 22 chip links (`home.more.index.*`). Each links to an anchor:

| Index keys | Anchor |
|---|---|
| call | `#call` |
| chat | `#chat` |
| imageVoice, stories | `#stories` |
| morning | `#morning-call` |
| voiceMessage | `#voice-message` |
| memory, nickname | `#memory` |
| modes | `#more-modes` |
| live, gifts | `#live` |
| liveRequest, archive | `#live-request` |
| grow | `#grow` |
| reel | `#more-reel` |
| quests | `#more-quests` |
| bonus | `#more-bonus` |
| invite | `#more-invite` |
| wallet | `#more-plans` |
| notifications | `#more-sleep` |
| signin | `#how-it-works` |
| languages | `#faq` |

  The chips wrap, and the list is always visible (for SEO); `indexToggle` is unused except on screens below 360px, where the list collapses into a `<details>`.

**Entrance:** `RevealGroup` batch (.42s, stagger .06). Mini-mockup animators are lazy (`useScrollScene` with rootMargin 100%).

**Reduced motion:** no entrance, no auto-cycling (the mode sampler rests on `standard` and still swaps text on click, instantly), every mini shows its final state (reel on Kai with Following, quests checked with the reward card, today's bonus tile lit, invite chip static, plan cards flat, confirm sheet up, library tab on image, sleep toggle on). **No JS:** the same final states; the mode chips are plain buttons with no effect.

### 5.10 `#how-it-works`: 06 はじめかた, 最初の60秒は、無料で話せる。 (WP3)

**Purpose:** remove friction. It is the second download checkpoint, with the phone-to-app-icon morph.

**Files:** `sections/home/how/HowChapter.tsx`, `HowAnimator.client.tsx`.

**Keys:** `home.how.*`, `common.freeWithIap`, `common.friction.*`.

**Mockups:** `Welcome00a`, `PickReel00b`, `FirstCall00c` (with `Ring` 60→0), `GuestGate02` (WP4).

**Desktop:**
- Cream surface. A **sunrise glow** `[data-sunrise]` sits at the section bottom: `CallGlow variant="fan"`, opacity .55, `yPercent 30→0` scrubbed across the section.
- Left cols 1–5: a sticky phone column (`top: 12svh`) holding `PhoneFrame 330` + `ScreenStack` [Welcome00a, PickReel00b, FirstCall00c, GuestGate02] + `[data-ring60]` (`Ring size=420 tone="teal" label=<span class="t-num">0:60</span>`, placed behind the phone and visible only on step 3) + `[data-icon-pad]` (a 120px squircle target at the bottom of the column, `aria-hidden`).
- Right cols 7–12: `Eyebrow num="06"`, **H2** `id="how-title"`, lead, then 4 step blocks (`min-height 45svh`). Each has a step dot (32px circle with `check`, not a numeral), a title (`ScrollFillText as="h3" mode="units" unit="phrase" tone="ink"`, start `top 70%`, end `top 40%`; only the active step's fill runs) and a body.
- The **CTA block** `#how-cta` (`data-download-block`): `home.how.ctaTitle` (`.t-h3`, not a heading element; `<p>`), `StoreBadges placement="how" qr showFriction`, `FrictionList`.

**Animation:**
- Step toggles, as in `StickySteps`: screens crossfade .26s.
- Ring60 is scrubbed over step 3 (trigger `#how-step-call`, `top 55%` → `bottom 55%`): `--p 100→0` and the label text `0:60`→`0:00`.
- **Icon morph** (scrub .5, trigger `#how-cta`, `start:'top 85%'`, `end:'top 45%'`):
  - the phone's `scale` goes 1→`() => padW/phoneW`, with `x`/`y` to the pad centre (function-based, `invalidateOnRefresh`)
  - the `--r` radius var goes 52→`22%` equivalent
  - `[data-app-icon]` (`appicon-512.png` inside the screen) crossfades opacity 0→1 over the first 60%
  - `[data-screen]` elements fade to 0
  - the box-shadow bezel fades via an opacity overlay
- Result: the phone becomes the LinClone app icon sitting beside the CTA.

**Mobile:**
- Header, then a vertical timeline `<ol>`: 4 items, each with a `ScreenSlice width={{mobile:300}}` (Welcome `{y:500,h:344}`, PickReel `{y:420,h:424}`, FirstCall `{y:80,h:520}` with a mini `Ring` 110px beside it, Gate `{y:360,h:400}`).
- The connector line on the left runs `scaleY` (scrub true, section).
- Ring60 animates once on enter (1.6s, `--p` 100→0, label counts).
- Then the CTA block with a static app icon (72px).

**Reduced motion:** all steps are visible, the ring is full with `0:60`, and the icon is static next to the CTA (the phone shows GuestGate02).

### 5.11 `#faq`: よくある質問 (WP3)

**Files:** `sections/home/faq/Faq.tsx`.

**Keys:** `home.faq.*`.

**Layout:**
- Desktop: 2 columns. Left, sticky at `top: 120px`: `Eyebrow`, **H2** `id="faq-title"`, lead with a link to `/support` (`supportLink`). Right: the accordion.
- Mobile: single column.

**Items** (order): `what`, `real`, `free`, `account`, `video`, `morning`, `memory`, `payment`, `oshikatsu`, `delete`, `creator`.
- Each is a `<details class="glass">` (no backdrop-filter; see §3.3) with `<summary>` (min-h 56, the question as `<h3 class="t-body font-bold">` inside the summary, and a `+` icon that rotates 45° over .26s) and the answer `.t-body` ink-2.
- `delete` appends `<a href="/delete-user">{linkLabel}</a>`. `creator` appends `<a href={localePath(lang,'creators')}>{linkLabel}</a>` (analytics `creators_nav{from:'faq'}`).
- No height animation (height is a layout property). On open, the answer fades in (`opacity 0→1`, `translateY 4px→0`, .26s, CSS `@starting-style` where supported; otherwise instant). Reduced motion: instant, and the `+` does not rotate.
- No JS.
- `content-visibility: auto; contain-intrinsic-size: auto 1100px`.
- No FAQPage JSON-LD (Google no longer shows these; the visible content is the value).

### 5.12 `#creators`: creators band (WP3), the secondary entry

**Files:** `sections/home/creators-band/CreatorsBand.tsx`, `BandRing.client.tsx`.

**Keys:** `home.creatorsBand.*`.

**Layout:**
- A lavender rounded band (radius 40, inset 12px; mobile 28 and 8) with a violet aura blob top-right.
- Desktop cols 1–6: `Eyebrow label=eyebrow tone="violet"`, **H2** `id="creators-band-title"` `.t-h2`, body, and `ButtonLink variant="ghost"` (violet border and text `#6f3fb8`; it passes AA at 16px bold: `#6f3fb8` on `#f2ecfb` is ≈6.4:1) → `localePath(lang,'creators')`, with an `arrow_forward` icon that nudges +4px on hover. Analytics `creators_nav{from:'band'}`.
- Cols 8–11: a `.glass` card 360px holding `Ring size=220 tone="violet"` around an `Aura persona="aoi" shape="avatar" size=150` + a label stack (`ringBuilding` / `ringReady`, crossfade), labelled with `aria-label={alt}`.
- Mobile: copy, then the ring card (240px), then the link.

**Animation:**
- Ring `--p` 0→100, scrub true, `start:'top 80%'`, `end:'center 45%'`. The label crossfades at p≥0.95 (class toggle). The Aoi aura brightness goes .85→1 (opacity of a white overlay).
- **No percentage numeral anywhere.**
- Reduced motion: full ring, `ringReady`.

### 5.13 `#download`: final CTA, 推しに、電話しよう。 (WP3): **stage #3 (reverse collapse)**

**Purpose:** the last conversion. The call from #call **shrinks back into your hand**. The SSR final state is the no-JS download block that every `#download` link targets.

**Files:** `sections/home/final/FinalCta.tsx`, `FinalStageAnimator.client.tsx`.

**Keys:** `home.final.*`, `common.disclosure`, `common.friction.*`.

**Mockups:** `CallStageMedia variant="final"` (WP4). This variant has no controls or meter, and a breathing avatar glow with the Yuzu 推し色 aura.

**Structure:** `ExpandStage id="download" height={{mobile:140, desktop:200}} direction="collapse" surfaceStart="night"` with `data-download-block`.
- `phone`: desktop `{side:'right', width: 300}`; mobile `{ width:'min(56vw, 220px)', top:'calc(var(--intro-h) + 8px)' }`.
- `intro`:
  - `Eyebrow label=home.final.eyebrow tone="white"` (the tagline)
  - **H2** `id="download-title"` as `ScrollFillText as="h2" mode="units" unit={lang==='ja'?'char':'word'} tone="white" driver="external" className="t-display-l"` with `CaptionMarker restOn` = the index of 「電話」/"call" (tone neon)
  - sub (white 78%)
  - `StoreBadges placement="final" qr showFriction`
  - `Disclosure variant="line"` (white)
  - `ScreenNote tone="dark"`
- A `[data-burst]` disc (120px `--grad-logo-burst`, `border-radius:50%`) sits behind the phone rect.
- `[data-sunrise]` is a `CallGlow variant="fan"` at the stage bottom.

**Timeline** (`useExpandStage` collapse, `clip:[0,0.40]`, `introToNight` disabled since it is already night):

| p | Tween |
|---|---|
| 0→0.40 | clip `inset(0)` → phone rect; inner scale 1→.9; bezel opacity 0→1 and scale 1.3→1 (hook) |
| 0.30–0.70 | H2 fill 0→1 |
| 0.60–0.80 | `[data-burst]` `scale 0→2.2`, `opacity .5→.12` (never above .5, so it never flashes) |
| 0.70–0.90 | badges, QR, sub and disclosure: `y 16→0, autoAlpha 0→1` (from-state only if below the fold at init) |
| 0.80–1.00 | `[data-sunrise]` `yPercent 30→0`, opacity 0→.6 |

- **Mobile:** the intro sits at the top, the phone below it (220px), with the badges under the phone. The `intro` and badges wrap in a flex column; the phone is centred.
- **Reduced motion or no JS:** collapsed final state (phone plus the full CTA block).
- The sticky bar hides here (`data-download-block`).

### 5.14 Footer (WP0)

See §4.1. The disclosure is repeated.

---

## §6 `/creators` and `/en/creators`: LC Studio

**Page-level rules:**
- **フォロワー** only. **Zero ファン and zero あなた** (lint enforced). ご自身 is used as the polite "you". 育成 is used in JA.
- LIVE is written LIVE配信 in copy and LIVE on Studio mockup tiles. There is no ライブ anywhere on the site.
- No Smart App Banner, no sticky download bar, no QR dock, no Studio `offers`/`installUrl`.
- Primary CTA is `.btn-violet` mailto everywhere, and every placement also shows the copy-address fallback.
- The display face in EN is Plus Jakarta Sans 800 (same as the fan page). The fill ink uses the Studio headline gradient.

**Composition** (`src/app/(site)/[lang]/creators/page.tsx`, WP0 composes): `Header page="creators"`, then `main`:
`CreatorsHero` → `CreatorsStatement` → `CommandCentre` → `StudioSetup` → `CloneCheck` → `StudioControl` → `StudioReal` → `StudioVoice` → `StudioInsights` → `StudioJoin` → `StudioFaq` → `CreatorsFinal`.
Then `Footer page="creators"` and `JsonLd data={creatorsGraph(lang,d)}`.

All section components live in `src/components/sections/creators/<name>/` and are owned by **WP6**. Studio mockups are owned by **WP5**.

| # | id | Surface | Mobile height | Desktop height | Stage? |
|---|---|---|---|---|---|
| 1 | `top` | studio | ≈1.1 vh | 100svh | no |
| 2 | `about` | studio | ≈0.7 vh | ≈0.8 vh | no |
| 3 | `how` | studio → night | **180svh** | 240svh | **yes #1** |
| 4 | `setup` | studio-cyan | ≈2.0 vh (list) | 6 × 45svh sticky phone | desktop CSS-sticky |
| 5 | `check` | night | **160svh** | 220svh | **yes #2** |
| 6 | `control` | studio | ≈1.8 vh | ≈1.3 vh | no |
| 7 | `real` | cream | ≈1.4 vh | ≈1.0 vh | no |
| 8 | `voice` | night-deep band | ≈1.4 vh | ≈1.2 vh | no |
| 9 | `insights` | studio-cyan | ≈1.3 vh | ≈1.0 vh | no |
| 10 | `join` | lavender | ≈1.2 vh | ≈1.0 vh | no |
| 11 | `faq` | cream | ≈1.0 vh | ≈1.0 vh | no |
| 12 | `final` | studio | ≈0.7 vh | ≈0.8 vh | no |

**Motion triggers, reduced motion and no-JS states for the non-stage creator sections** (binding; stages #how and #check are specified in their own sections):

| Section | Trigger | Reduced motion / no JS (= SSR final state) | Mobile (<1024) |
|---|---|---|---|
| `#setup` | `lc:step` per step (desktop); `useInView once` per card (mobile) | every screen in its final state (4 picks selected, sample text shown, links `analyzed`, 3 photos + メイン, 6 modes on, NG rows on + custom chip, clock `0:24`, meter .6); all 6 steps listed; ready card full | vertical list of 6 `.glass` cards with `ScreenSlice` (≥292px), then the ready card |
| `#control` | fill: scrub `top 75%`→`center 45%`; card micros: `useInView once` at `top 70%`, 0.3s stagger between cards | H2 filled; grow card shows `approved`; NG switches on; AI-images toggle shown **on** (the SSR state); label chip + ribbon visible | single column, cards full width, crops ≥292px |
| `#real` | `useInView once` at `top 70%` | all four bubbles + official bubble and badge visible; pause toggle in the paused state; LIVE dot static; DL chip visible | stacked: H2, bodies, thread slice, then LIVE H3, body and slice |
| `#voice` | marquee CSS (paused off-screen); card micros `useInView once`; morning `Segmented` auto-toggle every 2.4s only in view | marquee becomes a static wrap; pipeline chips all lit + check; `gentle` list shown; gentle filler card selected, waveforms static | one marquee row, then cards stacked |
| `#insights` | `useInView once` at `top 70%` | bars at full height; hourglass static; shimmer off (skeleton bars static) | stacked: analytics block + slice, then earnings block + slice |
| `#join` | connector scrub `top 75%`→`center 50%` (`scaleX` desktop / `scaleY` mobile) | connector full; all steps lit | vertical track, CTA card full width, email row wraps |
| `#faq` | none (native `<details>`) | instant open, no icon rotation | single column |
| `#final` | `CaptionMarker` after idle (not scrubbed) | marker rests on the last phrase; no marker without JS | centred column; mailto full width; pills wrap |

### 6.1 `#top`: hero, 自分の公認AIクローンを、スマホでつくる。

**Keys:** `creators.hero.*`, `common.studioBrand`.

**Mockup:** `S09Building` (WP5).

**Desktop:**
- Cols 1–6 (there are **no stickers** on /creators; the eyebrow carries 招待制):
  - `Eyebrow label=creators.hero.eyebrow tone="violet"`
  - **H1** `id="creators-title"` `.t-display-xl` (`Units` phrase, `CaptionMarker tone="violet" restOn="last"`)
  - lead `.t-lead`
  - `audience` (`.t-body` ink-2)
  - a CTA row: `MailtoButton variant="primary" placement="hero"` + `CopyEmail`
  - `StudioStoreCTA`
  - `note` (`.t-small` with a `lock` icon)
  - `Disclosure`-style line `creators.hero.disclosure`
  - `fanLink` text link → `/` (or `/en`)
- Cols 8–11: `PhoneFrame 340` `S09Building` on a violet ambience orb.

**Mobile (390×664 acceptance):**

```
header 56 · eyebrow (12) · H1 36px × 3 lines (≈132) · lead 3 lines (≈84) · [招待をリクエスト] 52 full-width ·
[メールアドレスをコピー] text button 44 · [App Store・近日公開][Google Play・近日公開] pills 36 ·
note 12.5 ≈ y 600 · phone peek below fold
```

The audience line moves under the fold on mobile (after the note).

**Animation:**
- The S09 ring `[data-ring]` fills `--p 0→100` by CSS `@keyframes ringFill` 1.6s `var(--ease-reveal)` .4s delay (`@property --p` animatable).
- The swap to the ready state is **CSS-only** (no client file): `[data-m=title]`/sub crossfade `building` → `readyTitle/readySub` with `@keyframes readySwap` .42s starting at 2.0s (`animation-fill-mode: both`), so it completes without JS.
- Reduced motion: the ready state is shown directly (`--p:100`, ready texts visible, no keyframes).
- The rest follows the fan hero rules (transform-only rise, marker after idle).

### 6.2 `#about`: statement (fill)

**Keys:** `creators.statement.*`.

**Layout:** a centred cols 2–11 block, **H2** `id="creators-statement"` rendered as `ScrollFillText as="h2" mode="clip" tone="studio" accent="もう一人の自分"` (EN accent `The you`, case-sensitive match against `creators.statement.fill`) with `.t-display-l`. Then `sub` `.t-lead` ink-2.

**Animation:** clip fill `top 80%` → `bottom 45%`. The accent toggles to the violet→teal gradient text at 0.7.

**Mobile:** full width, `.t-display-l` at the mobile clamp, `sub` below. **Reduced motion / no JS:** filled, accent in gradient.

### 6.3 `#how`: 01 しくみ, command centre (**stage #1**)

**Keys:** `creators.home.*`, `mock.studio.home.*`, `mock.studio.common.tabs`.

**Mockups:** `D01Home` (phone screen) and `D01Bento` (full-viewport, WP5).

**Structure:** `ExpandStage id="how" height={{mobile:180, desktop:240}} direction="expand" surfaceStart="cream" surfaceEnd="studio"` (section `data-surface=light`) with:
- `phone`: desktop right 300; mobile `{width:'min(74vw,290px)', top:'calc(var(--intro-h) + 12px)'}`
- `intro`: `Eyebrow num="01"`, **H2** `id="how-title"` = `ScrollFillText as="h2" mode="units" unit="phrase" tone="studio" driver="external" className="t-h2" text={creators.home.fill}`, and lead. The intro stays ink the whole time (`introToNight:false`).
- `bezelScreen`: `D01Home`
- `media`: `D01Bento`. This is the **cream** studio surface, and the bento occupies the right 58% on desktop (cols 6–12, full height). On mobile it takes the area below the intro (from `var(--intro-h)` to the bottom). The rest of the media is plain studio background, so the intro is never covered.
- skip → `#setup`

`extend` beats:

| p | Tween |
|---|---|
| 0.06–0.40 | clip (hook); each `[data-tile]` inner `scale 1.1→1` with a 0.03 progress offset per tile |
| 0.40–0.70 | H2 fill 0→1 (tone `studio`: dim `#b7b5c6` → ink, accent 「スマホひとつで」/"All from your phone" → studio gradient) |
| 0.70–0.90 | `[data-tile-arrow]` chips pop (stagger .04) |

**Tiles are real links** (`<a>` in `D01Bento` with `aria-label="{tile label}: {creators.home.tiles.<id>}"`):

| Tile | Anchor |
|---|---|
| publicProfile | `#control` |
| fanContent | `#control` |
| live | `#real` |
| homeVoice | `#voice` |
| morningCall | `#voice` |
| fillers | `#voice` |
| analytics | `#insights` |

The tile grid is also exposed as `<nav aria-label={creators.home.tocLabel}>`.

**Lite:** simple reveal. **Reduced motion:** final bento with the H2 filled.

### 6.4 `#setup`: 02 セットアップ

**Keys:** `creators.setup.*`, `mock.studio.picks|words|photos|modes|ng|record|building.*`.

**Mockups:** `S04QuickPicks`, `S04aOwnWords`, `S05Photos`, `S06ModesFree`, `S07NgTopics`, `S08bRecord`, `S09Building` (ready state) (WP5).

**Desktop:**
- Header cols 1–7: `Eyebrow num="02"`, **H2** `id="setup-title"`, lead, then `trust` inside a `.glass` note with a `link` icon.
- Then `StickySteps side="right" phoneSize={{desktop:320}} stepMinHeight="45svh"` with steps picks, words, photos, modes, ng, voice mapped to the 6 screens.
- After the last step, a ready card (`.glass`, `Ring size=96 tone="violet"` full, `readyTitle` `.t-h3`, `readyBody`).

**Micro** (on `lc:step`):
- picks: chips tap themselves in sequence (`[data-m=pick]` gets `.is-selected`, .3s apart: 私 → 標準語 → 音楽 → 料理)
- words: `[data-m=text]` types `sample` (30ms/char, capped at 2.4s); then the link rows `[data-m=link-wiki]` and `[data-m=link-yt]` go from `analyzing` (gold `#a86f1d` with a spinner) to `analyzed ✓` (cyan `#0096a8`) after 2.2s
- photos: 3 `Aura shape="card"` tiles pop, then the メイン badge pops on the first
- modes: 6 free chips light up (stagger .06)
- ng: `[data-toggle]` switches flip one by one (.3s): the row bg goes to `rgba(225,75,129,.07)`, the detail turns pink and the NG badge pops; then `customChip` pops in
- voice: a 118px cyan orb pulses (scale .96↔1.06), a `[data-m=clock]` SG timer counts `0:00→0:24` (a timer, allowed), and the meter bar runs `scaleX 0→.6`

**Mobile:** a vertical list of 6 compact cards (`.glass`, each a title, body and `ScreenSlice width={{mobile:300}}` with the crop from §7), then the ready card. The micro-sequence plays once per card on enter.

**Truth:** write mode only (no interview tab), links are Wikipedia and YouTube only, NG copy says 最優先に適用 / "避けるように", there are no voice-length numbers, and no public/limited URL row.

### 6.5 `#check`: 03 たしかめる, clone check (**stage #2**)

**Keys:** `creators.check.*`, `mock.studio.check.*`, `mock.studio.selfCall.*`.

**Mockups:** `D01bCloneCheck` (phone) and `SelfCallStage` (full-viewport night) (WP5).

**Structure:** `ExpandStage id="check" height={{mobile:160, desktop:220}} direction="expand" surfaceStart="cream"` with:
- `phone`: desktop `{side:'right', width: 300}`; mobile `{width:'min(74vw,290px)', top:'calc(var(--intro-h) + 12px)'}`; radius `{desktop:44, mobile:36}`
- `intro`: `Eyebrow num="03"`, **H2** `id="check-title"` `.t-h2` `creators.check.title`, and lead
- `bezelScreen`: `D01bCloneCheck`
- `media`: `SelfCallStage persona="aoi"`
- skip → `#control`

`extend` beats:

| p | Tween |
|---|---|
| 0.02–0.06 | `[data-m=preview-note]` pops in the bezel screen |
| 0.06–0.40 | clip, bg cream→night, intro ink→white (hook) |
| 0.40–1.00 | `[data-self-ring]` `--hue` scrubbed from teal to violet: `borderColor` from `#00b0c2` to `#8b55d6` through `#7df4ff`. This is a **colour change, not a loop**, matching the shipped self-call. |
| 0.45–0.85 | `[data-fill]` `creators.check.fill` (units, white) fills |
| 0.50–0.90 | `[data-wave]` `--amp 0→1` |

- **Mobile:** the self-call column sits below the intro (§7.2 S11); clip window `[0.06,0.34]`, bezel fades by 0.16. **Lite:** simple reveal; the ring colour steps instead of scrubbing. **Reduced motion / no JS:** full-bleed night self-call, ring violet, fill complete, `--amp:1`.

### 6.6 `#control`: 04 安心, 最終判断は、いつもご自身で。

**Keys:** `creators.control.*`, `mock.studio.grow|ng|profile|content.*`.

**Mockups:** `D06GrowCard`, `S07NgCompact`, `D08ProfileCard`, `D04GalleryCard` (WP5; card crops, not phones).

**Layout:**
- `Eyebrow num="04"`, then **H2** `id="control-title"` as `ScrollFillText as="h2" mode="units" unit="phrase" tone="studio"` (`.t-display-l`, `top 75%` → `center 45%`), then lead.
- Then a 2×2 bento (desktop) of `GlassCard` with the card H3 (`cards.<id>.title`), body and mock crop:

| Card | Mock crop | Micro |
|---|---|---|
| grow | D06 pending card | `承認` presses (.96), card morphs to `approved` (bg teal wash, text swap) |
| ng | S07 5 rows compact | two switches flip pink |
| profile | D08 licensed line + facts + AI images toggle | toggle flips **off** once (`aiImagesSub` highlights) |
| labels | D04 grid of 6 `Scene` thumbs + `labelChip` | chip pops, and a label ribbon slides over the first image |

- Mobile: single column.

### 6.7 `#real`: 05 本人として

**Keys:** `creators.real.*`, `mock.studio.thread.*`, `mock.studio.live.*`.

**Mockups:** `D02bThread`, `D05Live` (WP5).

**Layout:**
- Desktop 2 columns.
- Left: **H2** `id="real-title"`, `officialBody`, `pauseBody`, then `PhoneFrame 320` `D02bThread`.
- Right: **H3** `liveTitle`, `liveBody`, and `dropIn` **only if `CLAIMS.liveDropIn`**; then `PhoneFrame 320` `D05Live dropIn={CLAIMS.liveDropIn}`.
- Mobile: stacked with slices.

**Micro:**
- Thread bubbles appear follower → AI → follower → **official** (solid `#00b0c2`, white text, the verified badge draws via `stroke-dashoffset`). The `[data-toggle=pause]` switch flips to paused and shows `pauseOff`.
- LIVE: the `LIVE中` dot pulses 1.4s (loop in view), settings toggles show on, and the archive row's DL chip pops.
- **Not shown:** "call as the real you", co-host, templates, viewer counts.

### 6.8 `#voice`: 06 ボイス (night-deep band)

**Keys:** `creators.voice.*`, `mock.studio.homeVoice|morning|fillers.*`.

**Mockups:** `D07HomeVoiceCard`, `D07bMorningCard`, `D07cFillersCard` (WP5).

**Layout:**
- `Eyebrow num="06" tone="white"`, **H2** `id="voice-title"` white, lead.
- Then a **voice-line marquee**: `Marquee rows={2 desktop / 1 mobile}` of `lines.l1…l5`. Each item has a speaker tag (`Aura avatar 28px aoi` + `Waveform sm neon playing`) and the line in `.t-display-l` white.
  - A row mask `mask-image: linear-gradient(90deg, rgba(0,0,0,.35), #000 35% 65%, rgba(0,0,0,.35))` brightens the centre (no JS).
  - Velocity skew ≤6°.
- Then 3 `GlassCard tone="night"` cards (H3 plus body plus crop):
  - homeVoice: the pipeline chips `draft` → `synth` → `published` light in sequence (cyan) and a check pops
  - morning: `Segmented` toggles gentle↔casual every 2.4s in view, and the list swaps (fade .26s)
  - fillers: two tone cards, and the chosen one's `Waveform` plays
- Mobile: a single marquee row, then the cards stacked.

### 6.9 `#insights`: 07 データと収益

**Keys:** `creators.insights.*`, `mock.studio.analytics|earnings.*`.

**Mockups:** `D09Analytics`, `D10EarningsCalculating` (WP5).

**Layout:**
- Desktop 2 columns: left **H2** `id="insights-title"`, `analyticsBody`, `privacy` (a `.glass` note with a `lock` icon), `PhoneFrame 320 D09Analytics`; right **H3** `earningsTitle`, `earningsBody`, `PhoneFrame 320 D10EarningsCalculating`.
- Mobile: stacked slices.

**Micro:**
- D09 `[data-bar]` runs `scaleY 0→1` (transform-origin bottom) over .5s, stagger .05. The last bar is solid `#00b0c2`, the others `rgba(0,176,194,.35)`. **No values or axes.**
- D10: the `hourglass_top` icon rotates 180° over .6s every 2s in view, with a skeleton shimmer (`animate-shimmer`) where figures would be.

### 6.10 `#join`: 08 参加方法, はじまりは、招待から。

**Keys:** `creators.join.*`, `creators.mailto.*`.

**Layout:**
- Lavender surface. `Eyebrow num="08" tone="violet"`, **H2** `id="join-title"`.
- A 4-step track (`<ol>`): desktop horizontal with a connector `scaleX` scrub; mobile vertical with `scaleY`. Steps: `request` (`mail`), `contact` (`forum`), `get` (`STUDIO_LIVE ? getLive : get`, icon `phone_iphone`), `setup` (`key`).
- The **CTA card** (`.glass-live`, max-w 720, centred):
  - `ctaTitle` as a `<p class="t-h3">`
  - `ctaBody`
  - `MailtoButton variant="primary" placement="join"`
  - an email row: `emailLabel` + `<code>info@linclone.com</code>` (selectable) + `CopyEmail`
  - `<details>` with `templateToggle` showing `<pre class="t-small whitespace-pre-wrap">{creators.mailto.body}</pre>`
  - `StudioStoreCTA`
  - `fine`

### 6.11 `#faq`: creator FAQ

**Keys:** `creators.faq.*`.

**Layout and behaviour:** same component pattern as §5.11 (WP6 builds `StudioFaq` by reusing a shared `FaqList` from WP0 at `site/faq/FaqList.tsx`: `{ items: {q:string; a:string; link?: {href:string; label:string}}[]; headingLevel: 'h3' }`).

**Items:** `what`, `who`, `cost`, `studio`, `time`, `control`, `label`, `agency`, `stop` (link → `/privacy`), then `legacy` **only if `CLAIMS.legacyCarryOver`**, then `release` (or `releaseLive` when `STUDIO_LIVE`).

### 6.12 `#final`: もう一人の自分に、会いにいこう。

**Keys:** `creators.final.*`.

**Layout:**
- Studio surface with a violet aura.
- **H2** `id="final-title"` `.t-display-l` with `CaptionMarker tone="violet"` (not scrubbed, to cap fills).
- `sub`, `MailtoButton variant="primary" placement="final"`, `CopyEmail`, `StudioStoreCTA`.
- `fanLink` → `/` (analytics `creators_nav{from:'creators_final'}`, the reverse direction).

---

## §7 Mockup screens (coded, bilingual, animatable, faceless)

### 7.0 Rules for every mockup

**Signatures:**

```ts
// src/components/mockups/types.ts (WP0)
export type MockProps = { d: Dictionary; lang: Locale; persona?: PersonaId | 'oshi'; className?: string };
```

- Phone screens render a `<Screen>` (390×844 logical) and are wrapped by sections in `PhoneFrame` or `ScreenSlice`.
- Cards and minis render a responsive box.
- Full-viewport stage media (`CallStageMedia`, `LivePlayerStage`, `D01Bento`, `SelfCallStage`) render `position:absolute; inset:0` compositions.

**Coordinates:** y offsets below are in the 390×844 frame (status bar is 0–54). Fonts: PJS = Plus Jakarta Sans (JA falls back to Noto via the stack); SG = Space Grotesk. The app type scale is hero 30/36, h1 26/32, h2 19/25, h3 14/19, body 13.5/19, sub 11.5/16, caption 10.5/14, label SG 700 10 +1.2 tracking.

**Truth, enforced by props:**
- There is **no prop** that can render a price, coin amount, viewer, follower or like count, percentage, version, duration limit or ticket count. Placeholders for figures are neutral shapes (rounded rects `rgba(40,39,59,.08)`) or sparklines.
- Relationship modes come from a fixed list of the 6 free modes.
- The LIVE glyph is `podcasts` / `radio` / `graphic_eq`. **`videocam` is not in the icon set.**
- Every persona is fictional (`PERSONAS`). No `@kensei`, no "Mina". Fictional handles only: `mocha`, `rin.rin`, `hinata`, `sakura`, `@momo_pk`, `@yuki_nn`, `@tomo_ko`.
- No text is baked into images; all text is DOM from the dictionaries.

**Accessibility:** the wrapper `figure` has `role="img"` and `aria-label` = the mockup's `alt` key. The inner DOM is `aria-hidden="true"`, and there are no focusable elements inside mockups. **Exception:** `D01Bento` tiles are real links (§6.3), so `D01Bento` is a `<nav>`, not an `img`.

**Animation hooks:** elements carry `data-m="…"` names as listed. SSR renders the **final** state; animators set start states. Loops carry `data-loop`.

**Persona `'oshi'`:** renders Yuzu's name and genre with colour `var(--oshi)`.

**Mobile crops:** each row gives `crop {y,h}` for `ScreenSlice` at width ≥292 (effective scale ≥0.75).

**Key paths in §7:** a key written without a namespace (e.g. `firstCall.later`, `readyToTalk`, `picks.title`) is relative to `mock.fan.` in §7.1 and to `mock.studio.` in §7.2 (inside a mockup block, also relative to that mockup's own group, e.g. `readyToTalk` in F5 = `mock.fan.home.readyToTalk`). A key that starts with `common.`, `home.`, `creators.`, `personas.` or `mock.` is always a **full top-level path** (so `common.disclosure` is the top-level disclosure, and `mock.fan.common.follow` is the mockup Follow label). Tab labels come from `mock.fan.common.tab*` (TabBarFan) and `mock.studio.common.tabs.*` (TabBarStudio); the `LiveBadge` text is `mock.fan.common.liveBadge`.

### 7.1 Fan mockups (WP4): `src/components/mockups/fan/`

**F1 `FirstCall00c`** (`FirstCall00c.tsx`). Source: V3 canvas **00c · Tutorial call experience** (+ AICalls.html). Used in the hero, the call bezelScreen and how-it-works step 3. Night screen.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 0–54 | StatusBar | white, `10:42` | — | |
| 64 | brand row | mark-white 24px + `.wordmark` 15.5 white (x 20); right: `firstCall.later` PJS 600 13 white 72% | `common.brand`, `mock.fan.firstCall.later` | |
| 180–370 | portrait | `Aura shape="avatar" size=190` (persona), 2px `rgba(255,255,255,.5)` border; behind it `CallGlow variant="avatar" size=475 state="breathe"` | — | `data-avatar-glow` (loop) |
| 396 | name | SG 700 34 white | `personas.<p>.name` | |
| 446 | sub | PJS 400 15 white 72%, centred | `firstCall.sub` | |
| 500 | meter | `.glass-night` radius 20 padding 12/24: label SG 700 10 uppercase white 72% + value `0:60` SG 700 26 white tabular | `firstCall.freeLabel` | `data-meter` |
| 712 | CTA | 64px pill, x 20→370, teal gradient, filled `call` 20 + `fmt(tapToTalk,{name})` PJS 700 17 white (app styling inside the mockup), tealGlow | `firstCall.tapToTalk` | `data-m="cta"` (loop pulse .95↔1.06) |
| 800 | footnote | SG 700 10 +1.2 tracking, white 50% (JA: Noto 700 10) | `common.disclosure` | |

Removed from the design: the coin reward line and the version string.

**F2 `CallStageMedia`** (`CallStageMedia.tsx`). Source: **05 · Voice call stage** (AICalls.html), web recomposition. Props: `MockProps & { variant: 'stage' | 'final' }`. Full viewport, `data-state="speaking"` on the root (SSR).

- **Background:**
  - `#0f1018`
  - `Aura shape="scene-portrait"` of the persona scaled to `cover`, opacity .35 (this replaces the app's blurred photo; **no filter**)
  - overlay `rgba(15,16,24,.45)`
  - `CallGlow variant="fan"` `data-fan-glow` (SSR opacity 0)
- **Portrait column:**
  - desktop centred at x=68%, y=40%; mobile centred at x=50%, top = `calc(var(--intro-h) + 8svh)`
  - `Aura avatar` 240 (mobile 168) with a 2px white-50% border, and `CallGlow avatar` 2.5× (`data-avatar-glow`, SSR opacity 1)
  - Name SG 700 34 white.
  - `data-call-state`: SG 700 16 `#7df4ff`, `00:08 · ` followed by 4 state spans `[data-s]` (`call.connecting|listening|thinking|speaking`). CSS shows the span matching the root's `data-state`.
  - `Waveform bars=12 tone="neon" amp="css-var"` `data-wave`, 16px under the name.
- **Captions (variant `stage` only):**
  - `data-caption="fan"`: `.t-h3` white 72%, right-aligned, max-width 18em, above the portrait (desktop) or below the state (mobile)
  - `data-caption="oshi"`: `.t-display-l`, but at mobile `clamp(1.5rem,…)`, white, centred under the portrait
  - both are `ScrollFillText driver="external"`
  - keys `home.call.fanCaption` / `home.call.oshiCaption` (with the oshi caption accent)
- **Meter (stage only):** `.glass-night` radius 20, one column only: label `call.freeLabel` + `0:60` (`data-meter`). **No EXTRA TIME column and no Add-time button.**
- **Toast (stage only):** `data-toast`, a `.glass-night` pill with a `graphic_eq` icon + `home.call.transcriptToast`, top-centre under the state line. It is visible in SSR, since that is the final state.
- **Controls (stage only):** a bottom row with 3 circles: mic 56 (glass-night), `call_end` 64 (`#d6455a`), `volume_up` 56. `aria-hidden`.
- **Demo root (stage only):** `data-demo-root` sits above the controls. SSR content: `<a href="#download" class="btn-night">` with `home.demo.button` + the `home.demo.tag` chip. The rest of the media is decorative and `aria-hidden`, so **render the demo root outside the aria-hidden wrapper**, as a sibling layer within the media, so it stays focusable.
- **Variant `final`:** portrait, name, state (`speaking`) and the breathing glow only. No captions, meter, controls or toast.

**F3 `IncomingRing06b`** (`IncomingRing06b.tsx`). Source: **06b · incoming call ring** (IncomingCallScreen). Night lock screen. `statusTime` `7:00`.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 0–844 | wallpaper | `Scene kind="dawn-sky"` + `rgba(15,16,24,.55)` overlay | — | |
| 96 | lock time | SG 700 72 white, `7:00` | — | |
| 186 | weekday | PJS 500 15 white 72% | `incoming.weekday` | |
| 288 | kicker | SG 700 12 `#7df4ff` (JA Noto 700 12) | `incoming.kicker` | |
| 320–468 | portrait | `Aura avatar` 148, 3px `#00c4d8` ring + tealGlow | — | `data-m="portrait"` (loop .98↔1.04) |
| 492 | name | SG 700 34 white | persona name | |
| 540 | subtitle | PJS 500 15 white 72% | `incoming.subtitle` | |
| 690–766 | buttons | Decline: 76px `#d6455a` circle, `call` icon rotated 135°. Accept: 76px teal gradient circle, filled `call`. Labels PJS 500 13 white below. | `incoming.decline`, `incoming.accept` | `data-m="accept"` (loop .96↔1.06) |

**F4 `MorningSetup06b`** (`MorningSetup06b.tsx`). Source: **06b · Morning call setup**. Cream.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 54–110 | header | back RoundIcon 34 · title PJS 700 17 · persona name SG 700 10 uppercase `#8d8ba0` · `CoinPill` (no number) · menu | `morningSetup.title` | |
| 126 | time card | `GlassMockCard` radius 16: `7:00` SG 700 56 `#0096a8` tracking −1.1; hint PJS 400 12 | `morningSetup.timeHint` | `data-m="time"` |
| 250 | date | label SG 700 10 tracked; row card: filled `calendar_month` teal + value PJS 700 15 + hint 12 | `dateLabel`, `dateValue`, `dateHint` | |
| 350 | repeat grid | label; 2×2 tiles (white .55, radius 16, gap 10, 64px tall): title PJS 700 13 + sub PJS 400 10; selected = `rgba(0,175,196,.12)` + 1px `#00c4d8` + `#0096a8` text | `once`, `daily`, `weekdays`, `weekends` | `data-m="sel"` (absolute highlight, SSR on `daily`) |
| 520 | ring card | filled `notifications_active` teal disc 36 + `ringTitle` PJS 700 14 + `ringBody` PJS 400 12 ink-2 + `seeHow` PJS 700 12 `#0096a8` | as named | `data-m="ring-card"` |
| 760 | footer CTA | 52 pill `#00b0c2`, filled `alarm` + `cta` PJS 700 15 white, tealGlow | `morningSetup.cta` | |

Removed: **the coin rules card** and any 「コイン」 text.

**F5 `HomeCards01`** (`HomeCards01.tsx`). Source: **01 · Home (signed in)**. Cream. `TabBarFan active="home"`.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 54 | header | mark 36 · spacer · `CoinPill` · search, bell (pink dot with no number), menu RoundIcons 34 | — | |
| 104 | greeting | PJS 800 22 | `mock.fan.home.greeting` | |
| 140 | following header | label PJS 700 13 · `seeAll` PJS 700 12 `#0096a8` + chevron (no count) | `followingLabel`, `seeAll` | |
| 168 | rail | a 60px dashed "new" tile (`followNew` 9) + 4 tiles 60 radius 14 (`Aura avatar` square: oshi, ren, kai, sora) + names PJS 500 11.5; oshi active with 2px `#00c4d8` + glow | persona names | |
| 262–420 | hero card (compact, 158 tall) | radius 26, bg `var(--oshi)`; `Aura card` on the left 50% melting into the accent; chip `readyToTalk`; name PJS 800 22 white; two pills `mock.fan.common.callNow` (white) / `mock.fan.common.chat` (white 20%) | as named | |
| 436 | morning card | `GlassMockCard` radius 18: 40px gold-wash disc with filled `alarm_on` gold; `morningTitle` PJS 700 14; `morningScheduled` SG 700 20 `#0096a8`; `morningRepeat` 12 ink-2 | as named | |
| 560 | voice card | `GlassMockCard` radius 18: a 44 `#00b0c2` play disc; `voiceTitle` PJS 700 14 + `mock.fan.common.newBadge` (pink pill SG 8.5); `Waveform size="thick"` teal; `voiceQuote` PJS 500 13 ink-2 | as named | `data-m="play"`, `data-m="new"`, `data-m="wave"` |
| 700 | quest strip | card with a `flag` icon + `mock.fan.quests.board` (no counts) | `quests.board` | |
| 764 | tab bar | `TabBarFan active="home"` | | |

Crop for the morning section: `{y:430,h:330}`.

**F6 `Conversation04`** (`Conversation04.tsx`). Source: **04 · Clone chat thread** (AIChat.html). Cream.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 54 | header | back · 48px `RingAvatar ring="story"` (pink story ring) + 14px teal online dot · persona name PJS 700 18 + `VerifiedMark` · `CoinPill` · bell · menu | — | |
| 120 | day label | SG 700 10 tracking 1.4 `#8d8ba0` centred | `conversation.dayLabel` | |
| 146 | call ended | system pill `rgba(40,39,59,.06)`: `call` 14 + `callEnded` PJS 600 11 ink-2 | `callEnded` | `data-m="ended"` |
| 186 | bubble 1 | creator: white, radius 4/18/18/18, padding 14/9, PJS 400 14.5/21, max 86% | `creator1` | `data-m="b1"` |
| 280 | bubble 2 | fan: `#eceae4`, right, radius 18/4/18/18; below it `read` SG 10 `#8d8ba0` | `fan1`, `read` | `data-m="b2"`, `data-m="read"` |
| 364 | typing | a creator bubble with `TypingDots` (SSR hidden: `data-m="typing"` with `hidden` attr in the final state) | — | `data-m="typing"` |
| 364 | bubble 3 | creator | `creator2` | `data-m="b3"` |
| 446 | chips | `MockChip` filled `auto_awesome` `#8b55d6` + `chipImage`; `MockChip` `mic` `#0096a8` + `chipVoice`. **No coin tags.** | as named | `data-m="chips"` |
| 772 | composer | 48 input (white .9, `composer`) + 48 teal send disc | `composer` | |

Removed: the paywall bubble, coin tags and 「チャットを追加」.

**F7 `StoryFlow04to03b`** (`StoryFlow04to03b.tsx`). Sources: **04** generation card + post; **03b · Story viewer**. Two sub-screens: `[data-sub="create"]` (cream) and `[data-sub="viewer"]` (night). SSR shows `viewer` active (the final state).

- **create:**
  - header as in F6
  - bubble `conversation.creator2`
  - `[data-m="chip-image"]` pressed chip
  - `[data-m="gen"]`: a 300×210 card, radius 18, 1.5px dashed `rgba(0,196,216,.5)`, `blur_on` icon (opacity pulse), `story.generating` PJS 600 13 `#0096a8`, `ScanLine`
  - `[data-m="scene"]`: `Scene kind="cafe-light"` 300×300 radius 18 with `[data-m="ai-tag"]` chip `mock.fan.common.aiGenerated` (white 90% pill SG 9)
  - voice pill: play disc + `Waveform` teal
  - `[data-m="post"]` 44 pill teal gradient: `story.postBoth` → `story.posted`
- **viewer:**
  - 3 progress bars at y 60 (`[data-m="progress"]` on the first)
  - header `RingAvatar 32 ring="live"` (the fan's own story ring = liveRing) + persona name + `hinata`
  - chip `story.fanMade` (glass-night pill SG 9)
  - full-bleed `Scene cafe-light`
  - title `story.storyTitle` PJS 700 20 white
  - glass-night voice player (play + Waveform neon)
  - label `mock.fan.common.aiGenerated`
  - reply input `story.replyPlaceholder`
  - `[data-m="heart"]` filled `favorite` `#e14b81` 28
- Rule: a Story always shows **image and voice** together.

**F8 `Memory06`** (`Memory06.tsx`). Source: **06 · Memory & Relationship**. Cream.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 54 | header | back · `memory.title` PJS 700 17 · `CoinPill` | `memory.title` | |
| 110 | nickname card | `GlassMockCard`: `fmt(nickHeading,{name})` PJS 700 13; value PJS 700 20 + a caret bar; right pill `memory.edit` | `nickHeading`, `personas.fan.nickname` | `data-m="nick"` |
| 236 | modes | `modesHeading` PJS 700 13; 6 `MockChip`s (the free modes only, fixed list), wrap, gap 8; selected pill `rgba(0,196,216,.14)` + `#0096a8` text | `memory.modes.*` | `data-m="mode"` (each `data-mode`), `data-m="mode-sel"` (SSR `gentle`) |
| 396 | recent | `recentHeading` (no count); 3 rows `GlassMockCard` radius 16: text PJS 500 14 + icons `lock` (m2 filled `#8b55d6` in SSR), `edit`, `delete` (20px `#8d8ba0`) | `memories.m1–m3` | `data-m="mem"`, `data-m="lock-2"` |

Removed: **the premium heading and block, the 18+ note**, 「27/30」 and every coin price.

**F9 `LiveFeedCard`** (`LiveFeedCard.tsx`). Source: **LIVE feed live card** (12 family). Night.
- `Aura shape="reel"` persona (kai) full-bleed + `--grad-photo-fade`
- header overlay `liveFeed.title` PJS 800 26 white at y 64
- body at y 600: `LiveBadge pulse` + `liveFeed.onAir` PJS 600 12 white 72%, then name PJS 800 26 white + `VerifiedMark`, then `liveFeed.theme` PJS 500 13.5 white 72% (**no viewer count**)
- `[data-m="join"]` 54 pill `--grad-live` with filled `podcasts` + `liveFeed.join` PJS 700 15 white
- `TabBarFan active="live"`

**F10 `LivePlayerStage`** (`LivePlayerStage.tsx`). Source: **11 · LIVE player live mode** (LivePlayer.html), web recomposition. Full viewport, night.
- **Background:** `Scene kind="stage-light"` tinted with the persona colour at 30% + the 4-stop scrim `rgba(15,16,24,.2)→.45→.7→.9`.
- **Top bar** (top `calc(var(--header-h) + 16px)`, left `max(5vw,16px)`):
  - `RingAvatar 44 ring="live"` + mini `LiveBadge`
  - name PJS 700 17 white + `VerifiedMark tone="neon"`
  - `livePlayer.onAir` PJS 500 12 white 72%
  - pill `livePlayer.follow` (white 14%, SG 700 10)
  - on the next line: `radio` icon + `livePlayer.theme` + `[data-theme-progress]` (4px `rgba(255,255,255,.2)` track, teal fill `scaleX` SSR .65)
- **Disclaimer:** `[data-disclaimer]`, a `.glass-night` pill SG 700 10 tracked white 72%, `livePlayer.disclaimer`. **Always visible** (top-right).
- **Centre:** `Aura avatar` 132 (`ring="live"`) + `Waveform bars=24 tone="white" playing` 480px wide (mobile 80vw). This makes audio-only visible.
- **Fill slot:** `[data-fill]` sits above the centre with the `home.live.fill` units on a `rgba(15,16,24,.45)` pill scrim. The section passes the `ScrollFillText` via a `fillSlot` prop.
- **Comments** `[data-comments]`: desktop left column 360px, bottom 12svh, height 42svh; mobile bottom area 38svh.
  - `c1…c4` bubbles `.glass-night` radius 16 (top-left 4): user SG 700 11 `#7df4ff` + text PJS 400 13.5 white. Duplicated ×2 for the loop.
  - Mask top and bottom.
- **Super Chat** `[data-m="superchat"]` (class `is-read` in SSR), pinned above the comments: `.glass-night` with a 3px left border `--grad-live`, label `superChat` SG 700 10 `#ffe0eb` + `superChatText`, and a tag `readOnAir` (`#7df4ff` on `rgba(125,244,255,.14)`, `animate-pop` when `.is-read` is added).
- **Gifts** `[data-gift]`: 6 absolutely positioned icons (`favorite`, `star`, `auto_awesome`, `celebration`, `music_note`, `local_fire_department`) near the bottom-right, SSR opacity 0. A desktop-only tray row of 6 chips: icon + `gifts.*` name (**no coin tiers**).
- **Composer** (bottom): input `composer` + `gift` pill (`redeem`).

**F11 `LiveRequest12`** (`LiveRequest12.tsx`, card). Source: **12 · LIVE request card** (wired variant, numeral-free).
- `role="img"` card, radius 24, `--grad-lavender`, padding 24
- 48px pink-wash disc with filled `podcasts` `#e14b81`
- title `liveRequest.title` (JA Noto 800 24/1.4; EN SG 700 26/36) ink
- body `liveRequest.body` PJS 400 14 ink-2
- lg teal pill with glow `liveRequest.cta` (white label, app styling)
- **No ticket counts and no "10 minutes".**

**F12 `LiveSetup13`** (`LiveSetup13.tsx`). Source: **13 · LIVE setup**. Cream.
- header back + `liveSetup.title` + 2 step dots (no "1/2")
- host row: `hostLabel` SG 10 + `Aura avatar` 44 (kai) + name PJS 700 15 + chip `hostRole`
- `topicLabel` + a textarea card (white .72, radius 14, min-h 96) `[data-m="topic"]` = `topicValue`
- `commentsLabel` row + `Toggle on` + `commentsSub` 12 ink-2
- `bgLabel` + 4 `Scene` swatches 64 radius 12 (rain-neon selected with a 2px `#00c4d8` ring)
- footer pill `next` `#00b0c2`
- **No length options (30分/3分) and no ticket info.**

**F13 `ShowPreview14`** (`ShowPreview14.tsx`). Source: **14 · AI show preview**. Cream.
- header `showPreview.title`
- show card `fmt(showTitle,{name})` PJS 800 20
- `rundown` label; 4 `[data-m="seg"]` rows on a 2px teal vertical line with 10px dots: title PJS 700 14 + desc PJS 400 12 ink-2 (**no durations**)
- `flowTitle`; 3 `[data-m="flow"]` rows with icons `graphic_eq` / `forum` / `replay` + `flow1`, `flow2`, `flow3` (`fmt` with `{name}`)
- footer pill `start` `--grad-live` white
- **Removed:** "uses one 30-min ticket" and "10 minutes".

**F14 `ArchiveCard11`** (`ArchiveCard11.tsx`, card). Source: **11 archive mode**.
- `.glass-night` radius 20, padding 14
- a 72px `Scene rain-neon` thumb radius 14
- `archive.tag` SG 700 9 tracked `#7df4ff`
- `archive.title` PJS 700 15 white
- a `mic` icon + `archive.recording` 11 white 72%
- a 3px `#7df4ff` scrubber at 40% (**no time labels**)
- a play disc 40 `#00b0c2`

**F15 `GrowPicker07`** (`GrowPicker07.tsx`). Source: **07 · Grow creator picker**. Cream.
- title `growPicker.title` PJS 800 26 at y 64; `subtitle` PJS 400 13.5 ink-2
- **no search field** (its placeholder mentions categories, which the site must not claim)
- a 2-col grid (gap 12, cards 230 tall, radius 20, 1.5px `#00c4d8` border): `Aura card` for sora, oshi, kai, nagi + scrim; name PJS 700 16 white; genre 11.5 white 80%; `growPicker.cta` 42 pill teal gradient with filled `auto_awesome`
- `TabBarFan active="grow"`

**F16 `CreatorProfile08`** (`CreatorProfile08.tsx`). Source: **08 · Public creator profile**. Cream.
- header `Aura card` (sora) 220 tall + scrim; name PJS 800 24 white + `VerifiedMark`; genre PJS 400 11.5 white 80% (**no follower count**); a 30px teal follow disc
- fact sheet card radius 16: label `factSheet`; rows `drink`, `hobby`, `style` (label PJS 500 13.5 ink + value PJS 400 13 ink-2); the `style` row carries a `creatorBadge` chip (teal) and a line `fmt(addedByCreator,{name})` + `VerifiedMark 12`
- `[data-m="new-row"]` `season` row (SSR visible)
- **No +N counts.**
- CTA `growProfile.cta` 52 `#00b0c2` with filled `psychiatry`

**F17 `ReviewStatus10`** (`ReviewStatus10.tsx`). Source: **10 · Grow review status**. Cream.
- header `growReview.title`
- submission card (`GlassMockCard`): `fact` PJS 500 14; `source` label + a grey placeholder bar (no URL)
- `[data-status]` pill with `data-state="ai|community|approved"` (SSR `approved`): ai = gold wash + `#a86f1d` text; community = purple wash + `#6f3fb8`; approved = teal wash + `#0096a8` + check. Texts `statusAi` / `statusCommunity` / `statusApproved`.
- `note` with `auto_awesome`
- `prohibitedTitle` + 6 chips (`#d6455a` text on `rgba(214,69,90,.10)`) from `prohibited.*`
- **No coin cost, no vote counts, no 10b vote screen.**

**F18 `Welcome00a`** (`Welcome00a.tsx`). Source: **00a · Tutorial welcome**. Night.
- `Aura shape="reel"` (oshi) full-bleed + `--grad-photo-fade`
- brand row at y 64: mark-white 24 + `.wordmark` 15.5 white
- bottom stack from y 520, gap 16:
  - page dots (8px white 35%, active 26×8 `#00c4d8`)
  - `welcome.title` (with `\n`) SG 700 34/41 white (JA Noto 800 30/40)
  - `welcome.sub` PJS 400 17/24 white 72%
  - value row: filled `call` `#7df4ff` + `valueCalls`; filled `forum` `#e5d5ff` + `valueChat`; filled **`podcasts`** `#ff9dbf` + `valueLive`
  - `getStarted` 56 pill teal gradient + `arrow_forward`
  - `welcome.footnote` SG 700 10 +1.2 white 50%

Crop: `{y:500,h:344}`.

**F19 `PickReel00b`** (`PickReel00b.tsx`). Source: **00b · Tutorial follow picker / 01b Reel**. Night.
- `Aura reel` (oshi) + scrim
- tooltip `GlassMockCard` at y 120 (x 20–370): `reel.tooltipTitle` PJS 700 14 + `tooltipSub` 12 ink-2
- right-edge 44px circles (`expand_less`, `expand_more`)
- bottom body from y 470: name SG 700 34 + `VerifiedMark`; follow pill white 40 `mock.fan.common.follow`; tags `personas.<p>.tags` 11.5 white 72%; voice bubble `.glass-night` radius 20: 44 play disc `#00b0c2` + `reel.voiceQuote` PJS 500 13.5 white + `Waveform` 10 neon
- action row: 54 teal pill `fmt(callCta,{name})`; dark pill `podcasts` + "LIVE"; dark pill `forum`

Crop: `{y:420,h:424}`.

**F20 `GuestGate02`** (`GuestGate02.tsx`). Source: **02 · Guest sign-in gate**.
- a dimmed night `Aura reel` behind
- cream sheet from y 430, radius 24 top, with a grabber
- `gate.title` PJS 800 24; `gate.sub` 14 ink-2
- Apple button 52 (black, white text, `apple` glyph) `gate.apple`
- Google button 52 (white, 1px `rgba(40,39,59,.14)`, multicolour `google-g`) `gate.google`
- chip `gate.noPassword` (teal wash, `key` icon)
- footnote `common.disclosure` SG 10 ink-2
- **Apple and Google only.**

Crop: `{y:360,h:484}`.

**F21 Minis** (`src/components/mockups/fan/minis/*.tsx`). Responsive boxes (not phones), each `role="img"` with an alt key:

| Mini | Spec | Hooks |
|---|---|---|
| `ReelMini` | 180×320 (mobile 150×266) radius 20; a vertical track of 3 `Aura reel` slides (kai, sora, oshi) with name SG 700 18 + `Waveform` neon + follow pill (`mock.fan.common.follow` → `mock.fan.common.following`) | `data-m="reel-track"`, `data-m="follow"` |
| `QuestsMini` | title `quests.title`; a list of 5 rows (`quests.chapters.c1–c5`, PJS 600 12) with an SVG check circle (`stroke-dasharray`) and a `quests.done` pill (the last row shows `quests.go` instead); a `quests.daily` strip with two chips `quests.login` and `quests.shareX` (**no amounts**); a reward card `quests.reward` + `celebration` gold (**no amount**) | `data-m="check"`, `data-m="reward"` |
| `BonusMini` | 7 tiles 40×48 radius 12 (`redeem` icon, **no day numbers**); the last carries `bonus.today`; claim pill `bonus.claim` | `data-m="day"` |
| `InviteMini` | `invite.title`; code chip `codeLabel` + `code` (SG 700); a button toggling `copy` / `copied` with the `content_copy` / `check` icon | `data-m="copy"` |
| `PlansMini` | props `{ cards: Dictionary['home']['more']['tiles']['plans']['cards'] }`; 4 cards: name PJS 800 16 + perk 12 ink-2; premium has a 2px `#8b55d6` ring; icons `forum` / `paid` / `confirmation_number` | `data-m="plan"` |
| `ConfirmSheetMini` | a bottom sheet radius 24: `confirm.title` PJS 700 15 + `confirm.body` 12 + buttons `confirm` (teal) / `cancel`; a refund line with an SVG check + `confirm.refund` | `data-m="sheet"`, `data-m="refund"` |
| `MyPageMini` | `myPage.title`; tabs `myPage.tabs.*` (SG 500 11) with an underline; a 3×2 grid of `Scene` thumbs + one voice row | `data-m="tab"`, `data-m="underline"` |
| `SleepMini` | a row `sleep.row` + `sleep.sub` + `Toggle`; a `bedtime` moon icon; a sticker `sleep.morningStill` (tilt 4) | `data-toggle`, `data-m="moon"`, `data-m="sticker"` |
| `SignInMini` | Apple and Google rows (as F20, 44 tall) + chip `gate.noPassword` | `data-m="nopw"` |

The keys `mock.fan.done.*` are reserved for an optional `Done00d`. They are not rendered in v1 of the site.

### 7.2 Studio mockups (WP5): `src/components/mockups/studio/`

Studio styling uses the Studio tokens:
- accent fill `#00B0C2` with white text **inside mockups only**
- accent text `#0096A8`
- violet `#8B55D6`
- pink `#E14B81`
- gold text `#A86F1D`
- glass white .60–.90 with a .9 edge
- hairlines `rgba(60,55,90,.10)`

Fonts: PJS 700/800 for display, and PJS (standing in for Poppins, a noted deviation to save a font) for body. SG for numerals, labels and the `LC STUDIO` brand. Tabs are `TabBarStudio`.

**S1 `S09Building`** (`S09Building.tsx`). Source: **s09-building** (shipped copy). Props: `MockProps & { state: 'building' | 'ready' }`. Background: radial `#F0E6FB→#ECEAE4`.

| y | Element | Spec | Keys | Hook |
|---|---|---|---|---|
| 110 | ring | `Ring size=104 tone="violet"` with an inner 86px `#F7F3EC` disc holding `building.building` SG 700 8 tracked `#8D8BA0` (**no percentage**), or a filled `check` violet 28 when ready | `building.building` | `data-ring` (`--p`) |
| 240 | title | PJS 800 23 centred; both `title` and `readyTitle` exist and are crossfaded by `.is-ready` on the root | `building.title`, `building.readyTitle` | `data-m="title"` |
| 284 | sub | PJS 400 11.5/1.7 ink-2, max-width 300 | `building.sub`, `building.readySub` | |
| 372 | tour label | SG 700 9 +.14em `#8D8BA0` | `building.tourLabel` | |
| 396 | tour rows ×3 | 34px wash disc + 17px filled icon (reply `forum` cyan; curate `psychology` violet; voice `graphic_eq` cyan); title PJS 700 12.5; body PJS 400 10.5 ink-2 | `building.tour.*` | |
| 764 | CTA | 52 pill `#8B55D6` white PJS 700 14.5 | `building.cta` | |

Removed: the earnings tour row, "within 24 hours", "we'll notify you" and "$1,000".

**S2 `D01Home`** (`D01Home.tsx`). Source: **d01-home**, *shipped* layout. Cream.
- header y 54: `mock.studio.home.welcome` 12.5 ink-2; name `personas.aoi.name` PJS 800 25; followers pill: violet wash + `group` icon **only**. Right: coins pill (`paid` gold icon only) + bell 34 (pink dot, no number).
- status y 140: 8px `#00B0C2` dot (`data-loop` livePulse) + `mock.studio.home.status` 11 ink-2 (**no "last trained"**)
- stats 2×2 y 170: cards radius 20 glass .6, padding 13×14: label (`mock.studio.home.stats.*`) 10 ink-2 + a **sparkline** (SVG polyline 64×18, stroke `#00B0C2` at 45%). The accent tile (`estMonth`) is teal wash. **No values.**
- clone-check strip y 372: radius 22 accent card, `checkTitle` PJS 700 14 + `checkSub` 11 + `call` / `forum` icons
- tiles y 460: 7 tiles, 2 columns (analytics full width), radius 18 glass: 36px icon well (radius 12) + label PJS 700 12. Icons: publicProfile `badge`, fanContent `photo_library`, live `podcasts`, homeVoice `graphic_eq`, morningCall `alarm`, fillers `chat_bubble`, analytics `bar_chart`.
- `TabBarStudio active="home"`
- **Removed:** the URL row and all numbers.

**S3 `D01Bento`** (`D01Bento.tsx`). Full-viewport command centre. Props: `MockProps & { tileHrefs: Record<TileId,string>; tileDesc: Dictionary['creators']['home']['tiles'] }`.
- Root `<nav aria-label={creators.home.tocLabel}>` on a cream studio surface.
- Desktop: the bento occupies cols 6–12 (right 58%), vertically from `header-h + 24px` to `100svh − 32px`. Grid 6 cols with gap 12:
  - a header card (span 4: welcome + name + followers icon pill + status dot)
  - a clone-check card (span 2)
  - 4 stat cards (span 3/2 each over two rows: label + sparkline)
  - 7 **tile links** `<a href={tileHrefs[id]} data-tile>` (span 2; analytics span 4): icon well + label (`mock.studio.home.tiles.*`) + desc (`tileDesc[id]`, 12 ink-2) + `[data-tile-arrow]` 28px `arrow_forward` chip
- Mobile: the area under the intro, a 2-col compact grid (header hidden, stats hidden, tiles only + clone-check).
- Focus styles on tiles: a 3px `#28273B` outline.

**S4 `S04QuickPicks`** (`S04QuickPicks.tsx`). Source: **s04-personality** (shipped, **no postal codes**). Cream.
- eyebrow `mock.studio.common.step` SG 9.5 +.14em `#0096A8`, then 6 step dots (the first active) where the design had "1 / 6"
- title `picks.title` PJS 800 22; sub `picks.sub` 11.5 ink-2
- groups (label 12/700 ink): `pronounLabel` → chips `pronouns.p1–p3`; `dialectLabel` → `dialects.*`; `hobbyLabel` → `hobbies.*`. Chip: 9×14 padding, 12/600. Selected: `rgba(0,176,194,.13)` + border `rgba(0,150,168,.45)` + `#0096A8`. Unselected: white .6 + ink-2.
- SSR selection: `p3`, `standard`, `music`, `cooking`
- footer: back 48 glass (`mock.studio.common.back`) + next 48 `#00B0C2` (`mock.studio.common.next`)

Hooks: `data-m="pick"` on the 4 chips (in order). Crop: `{y:100,h:600}`.

**S5 `S04aOwnWords`** (`S04aOwnWords.tsx`). Source: **s04a-about-you**, **write mode only**.
- eyebrow + dots (second active); title `words.title`
- cyan tint card (`rgba(0,176,194,.08)`, border .2) `coverTitle` 11/700 `#0096A8` + bullets `cover.c1–c3` 10.5 ink-2
- violet tint card: `psychology` + `reassurance`
- textarea glass radius 20 min-h 190, 12.5/1.75 `[data-m="text"]` = `words.sample`
- `linksTitle` + 2 rows: `link` icon + `linkWiki` / `linkYoutube` + a status chip (`analyzing` gold `#A86F1D` with a spinner → `analyzed` `#0096A8`)
- `proposalNote` 10 ink-2
- **No interview segment and no blog/stream rows.**

Hooks: `data-m="link-wiki"`, `data-m="link-yt"` (SSR analyzed). Crop: `{y:100,h:620}`.

**S6 `S05Photos`**: title `photos.title`; 3 `Aura shape="card"` tiles (aoi) 100×178 radius 16 (`data-m="photo"`); the first has a `main` badge (SG 700 9, teal); a dashed add tile; `guide` 10 ink-2. Crop `{y:100,h:420}`.

**S7 `S06ModesFree`**: title `modes.title` + `modes.sub`; 6 rows (`mock.fan.memory.modes.*`), each a `Toggle on tone="cyan"` (`data-m="mode"`). **No premium section.** Crop `{y:100,h:520}`.

**S8 `S07NgTopics`** (`S07NgTopics.tsx`). Props: `MockProps & { compact?: boolean }`.
- title `ng.title` PJS 800 22; `ng.sub` 11 ink-2
- a glass list of 5 rows: icons `gavel`, `favorite`, `do_not_disturb_on`, `crisis_alert`, `groups` + label 12.5/700 + detail 10 + `Toggle tone="pink"` (`data-toggle`). ON state: row `rgba(225,75,129,.07)`, icon and detail `#E14B81`, and an `ngBadge` pill (SG 700 8.5) after the label. SSR: all ON.
- `customLabel` + chip `customChip` (pink, `data-m="custom"`) + dashed add
- nickname row + cyan `Toggle on`
- `compact` shows the 5 rows only
- **No page-visibility / URL card.**

Crop `{y:100,h:600}`.

**S9 `S08bRecord`**:
- title `record.title`
- a 118px orb (radial `#00e2f4→#00B0C2`) with a white `mic` (`data-m="orb"`, loop .96↔1.06)
- `[data-m="clock"]` SG 700 28 `0:24` (a timer)
- meter 7px track + `[data-m="meter"]` fill `scaleX .6` + a 2px pink marker line (**no label**)
- chip `★ record.chip` gold; `hint` 11 ink-2; pill `recording` with a pink dot

Crop `{y:100,h:560}`.

**S10 `D01bCloneCheck`** (`D01bCloneCheck.tsx`). Source: **d01b-clone-check**. Cream.
- sticky glass header: back · `Aura avatar 38` (aoi) with a 2px cyan ring · `fmt(check.title,{name})` 13.5/700 · a 6px pulsing cyan dot + `online` 10 `#0096A8` · a 38px `#00B0C2` call circle
- `[data-m="preview-note"]` cyan tint radius 14: `visibility` + `check.preview` 11
- chat: clone bubble (white .8, radius 4 18 18 18) `clone1`; creator bubble (`#00B0C2`, white) `me1`; clone `clone2`
- composer area: pills `voiceCall` (cyan wash, `call`) and `morningCall` (gold wash `rgba(232,163,61,.14)`, `#A86F1D`, `alarm`); input `composer` + send
- `TabBarStudio active="home"`

**S11 `SelfCallStage`** (`SelfCallStage.tsx`). Full-viewport night. Shipped self-call: "a ring that changes colour, no animation loop".
- background `#0F1018` + `Aura scene-portrait` (aoi) at 25% + overlay
- column at x 68% (desktop) or below the intro (mobile): `[data-self-ring]` a 280px (mobile 200px) circle with a 4px border `var(--ring, #00B0C2)` around `Aura avatar` 220 (mobile 156)
- `selfCall.label` SG 700 12 white 72%; name SG 700 34; `selfCall.state` SG 700 16 `#7DF4FF`
- `[data-wave]` Waveform neon; static controls (mic, `call_end`, `volume_up`)
- `[data-fill]` slot (via a `fillSlot` prop) for `creators.check.fill`, under the controls

**S12 `D06GrowCard`** (card). Source: **d06-grow-management**.
- header `grow.title` PJS 800 18 + `grow.sub` 11
- label `pending`
- card glass radius 20: meta row: category pill `grow.category` (SG 700 9, violet wash) + handle `grow.handle` 10 ink-2 + chip `✓ grow.aiReview` (`#0096A8` 9.5). **No vote count or %.**
- a 4px violet bar at 70% with no label; `fact` 12.5/1.6
- buttons `approve` (40 `#8B55D6` white + `check`, `data-m="approve"`) / `reject` (white .85 + border)
- `[data-m="result"]` `approved` `#0096A8` (SSR shown; buttons hidden in the SSR final state)

**S13 `D08ProfileCard`** (card). Source: **d08-public-profile**, edited.
- `profile.title`
- a 62px squircle `Aura` (aoi) + name PJS 800 18 + `VerifiedMark` + `licensed` 10 ink-2 (**no follower count**)
- bio card `profile.bio` 12/1.7
- `factsTitle` + rows `f1`, `f2` (cat SG 700 9 violet uppercase + text 11.5) + edit/delete icons (**no +N**)
- toggle card `aiImages` + `aiImagesSub` + `Toggle` `data-toggle="ai-images"` (SSR on)
- **No "allow fan posts on social media" row.**

**S14 `D04GalleryCard`** (card). Source: **d04-fan-content / d04a**.
- `content.title`
- tabs `content.tabs.*` (underline on images)
- 3×2 `Scene` grid radius 10, each with a tiny `AI生成` corner tag (`mock.fan.common.aiGenerated`)
- `[data-m="label-chip"]` `labelChip` (cyan pill); `labelNote` 10 ink-2
- **No Stop/Restore controls.**

**S15 `D02bThread`** (`D02bThread.tsx`). Source: **d02b-chat-thread**, edited.
- header: back · 38px violet disc with the white initial "M" · `thread.handle` 13.5/700 (**no plan or coin meta**) · a `person` circle
- **No call button and no "call as the real you" note.**
- pause row `[data-toggle="pause"]`: `pauseTitle` 12/700 + state `pauseOn` / `pauseOff` + `Toggle` (SSR off = paused state shown)
- thread:
  - follower bubble (white .8) `follower1`, label `@momo_pk · 21:04`
  - AI bubble right (cyan wash, border) `ai1`, label `aiLabel · 21:05`
  - follower `follower2`
  - `[data-m="verified"]` filled `verified` `#0096A8` + `officialLabel`
  - `[data-m="official"]` solid `#00B0C2` bubble, white `official`
  - `officialFoot` 9 ink-2
- composer: `verified` + `composer` placeholder + send

**S16 `D05Live`** (`D05Live.tsx`). Props: `MockProps & { dropIn: boolean }`. Source: **d05-live-and-archive**, edited.
- `live.title`
- LIVE NOW card: dark, radius 22, `Scene stage-light`; pink pill `liveNow` with a white dot (loop 1.4s); `autoHosting` + `segment` (**no "2 / 4", no viewer count**); chat lines `chat1`, `chat2`
- if `dropIn`: composer `dropIn` + line `fmt(realLabel,{name})` + `dropInLine`
- settings glass list: 3 rows + `Toggle on` (`readAloud`, `autoArchive`, `acceptRequests`). **No daily-cap stepper, no co-host, no templates.**
- archives: `archivesTitle` + a row (`Scene` thumb + `archiveItem` + a `[data-m="dl"]` `download` pill)

**S17 `D07HomeVoiceCard`, `D07bMorningCard`, `D07cFillersCard`** (cards, night-glass variants for the voice band):
- **D07HomeVoiceCard:**
  - `homeVoice.title` + `sub`; `draftsLabel`
  - draft card: `draft` text 12.5/1.65
  - pipeline row `[data-m="pipe"]` × 3 chips (`pipeline.draft` → `synth` → `published`) with chevrons
  - buttons `confirm` / `publish`
  - **No play counts and no slots.**
- **D07bMorningCard:**
  - `morning.title` + `sub`
  - `Segmented` `[data-m="seg"]` (`gentle` | `casual`)
  - two lists of 3 lines (`linesGentle.*`, `linesCasual.*`; only the active one is visible), each with a `play_circle` `#00B0C2` + `edit`
  - **No coin note and no "10 patterns".**
- **D07cFillersCard:**
  - `fillers.title` + `intro`
  - two tone cards (`gentle` + `gentleSample`, `casual` + `casualSample`), each with `Waveform` (`data-m="wave-gentle"` / `"wave-casual"`)
  - the selected card has a 2px cyan ring

**S18 `D09Analytics`** (`D09Analytics.tsx`). Source: **d09-analytics**, edited.
- header back + `analytics.title` + `Segmented` (`ranges.d7` selected, `d30`, `d90`)
- a 3×2 metric grid: label (`metrics.*`) 9 ink-2 + a **value placeholder shape** (40×12 rounded `rgba(40,39,59,.08)`). The accent tile (`coins`) is teal wash.
- chart card `chartTitle`: 7 `[data-bar]` bars at relative heights 42/58/47/71/64/88/100%, radius 7 7 3 3; the last solid `#00B0C2`, the rest `rgba(0,176,194,.35)`; day initials only (JA 月火水木金土日, EN M T W T F S S). **No axis values.**
- `topTitle` + `topNote`: 3 rows with `workspace_premium` icons in gold / `#b7b5c6` / `#c8864b` (**no rank numerals**) + handles `@momo_pk`, `@yuki_nn`, `@tomo_ko` + plan badge (`home.more.tiles.plans.cards.super|premium|basic.name`). **No amounts.**
- `privacy` 9.5 ink-2
- **No subscribers section.**

**S19 `D10EarningsCalculating`** (`D10EarningsCalculating.tsx`). Source: **d10-earnings**, calculating state only.
- `earnings.title` + `sub`
- month chips `months.prev` / `months.current` (selected)
- an 84px gold-wash circle with `hourglass_top` `#A86F1D` (`data-m="hourglass"`)
- `calculatingTitle` PJS 800 17; `calculatingBody` 11
- 3 skeleton bars (`animate-shimmer`, `data-loop`)
- buttons `csv` (`download`) + `bank` (`account_balance`)
- **No balance, $, share %, payout floor, 翌月5日 or statement lines.**

### 7.3 Minor and reserved keys

- `stickyBar.dismiss`: `aria-label` of the sticky bar ✕. `common.close`: the header QR popover close button.
- `common.demo`: the 「デモ」/"Demo" tag shown inside the call stage while the demo runs (the button tag uses `home.demo.tag`).
- `home.demo.captionsLabel`: `aria-label` of the demo caption strip. `home.demo.paused`: text shown in the strip while the IntersectionObserver has paused the demo.
- `common.copy` / `common.copied`: labels of the compact `CopyEmail` chip in the footer. `common.store.comingSoonSuffix`: the compact `StudioStoreCTA` (footer) renders `{common.store.appStoreName}・{comingSoonSuffix}` / `{googlePlayName}・{comingSoonSuffix}` (EN joiner ` · `).
- `home.final.qrCaption`: caption of the final CTA's `QrBlock` (`caption` prop).
- `mock.fan.modeSampler.alt`: `aria-label` of the ModeSampler figure.
- The legal name comes from `SITE.legalName` (§10); the visible line is `footer.copyright`. There is no `common.legalName` key.
- Reserved (kept for parity, not rendered in v1): `mock.fan.call.mute|end|speaker` (the stage controls are `aria-hidden` icons), `mock.fan.story.chatTitle`, `mock.fan.story.reactionsRow`, `mock.fan.archive.play`, `mock.fan.done.*`, `a11y.pageProgress`, `a11y.decorative`.

### 7.4 Mockup inventory by section (for planning)

| Section | Fan mockups | Studio mockups |
|---|---|---|
| hero | F1 | |
| call | F1 (bezel), F2 | |
| morning | F3, F4, F5 | |
| chat | F6, F7, F8 | |
| live | F9, F10, F11, F12, F13, F14 | |
| grow | F15, F16, F17 | |
| more | F21 minis | |
| how | F18, F19, F1, F20 | |
| final | F2 (final) | |
| creators band | (Ring + Aura only) | |
| /creators hero | | S1 |
| /creators how | | S2, S3 |
| /creators setup | | S4–S9, S1 (ready) |
| /creators check | | S10, S11 |
| /creators control | | S12, S8 (compact), S13, S14 |
| /creators real | | S15, S16 |
| /creators voice | | S17 |
| /creators insights | | S18, S19 |

---

## §8 SEO

### 8.1 Per-page metadata

Page titles are rendered with `title: { absolute }`. Lengths are verified: JA titles ≤32 chars, EN ≤60; JA descriptions ≤120, EN ≤155.

| Page | Title (key `meta.*.title`) | Description (key `meta.*.description`) |
|---|---|---|
| `/` | LinClone｜推しのAIクローンと話せる推し活アプリ (28) | 推しの公式AIクローンと、AI通話・AIチャット・モーニングコール・LIVE配信。最初の60秒は無料で話せます。ダウンロード無料、iPhone・Android対応。クリエイターのプロフィールはすべてAIクローンです。 (108) |
| `/en` | LinClone – The AI clone app for talking to your favorites (57) | Call, chat, get morning calls and join audio LIVE shows with official AI clones of the creators you love. Your first 60 seconds are free. iPhone & Android. (155) |
| `/creators` | LC Studio｜公認AIクローンをつくるクリエイターアプリ (31) | 自分の声と言葉から、公認のAIクローンを作成・管理。フォロワーとのチャット・通話・LIVE配信・育成・収益をスマホひとつで。LC Studioは招待制です。 (78) |
| `/en/creators` | LC Studio – Build and run your official AI clone (48) | Create and manage an official AI clone from your own voice and words. Chats, calls, LIVE, Grow and earnings in one creator app. LC Studio is invite-only. (153) |

**Site layout static `metadata`** (`(site)/[lang]/layout.tsx`):

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://www.linclone.com'),
  applicationName: 'LinClone',
  title: { default: 'LinClone', template: '%s | LinClone' },
  formatDetection: { telephone: false, email: false, address: false },
  twitter: { card: 'summary_large_image' },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION }, // optional
};
export const viewport: Viewport = { themeColor: [{ media: '(prefers-color-scheme: light)', color: '#f7f3ec' }, { media: '(prefers-color-scheme: dark)', color: '#0f1018' }], colorScheme: 'light', width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export function generateStaticParams() { return LOCALES.map((lang) => ({ lang })); }
export const dynamicParams = false;
```

**Per page `generateMetadata`** (helpers in `src/i18n/paths.ts`):

```ts
// home
const alt = alternatesFor('home', lang);
// → { canonical: lang==='ja' ? '/' : '/en', languages: { ja: '/', en: '/en', 'x-default': '/' } }
return {
  title: { absolute: d.meta.home.title }, description: d.meta.home.description, alternates: alt,
  openGraph: { type: 'website', siteName: 'LinClone', url: alt.canonical, title: d.meta.home.ogTitle, description: d.meta.home.ogDescription,
               locale: lang === 'ja' ? 'ja_JP' : 'en_US', alternateLocale: [lang === 'ja' ? 'en_US' : 'ja_JP'] },
  twitter: { title: d.meta.home.ogTitle, description: d.meta.home.ogDescription },
  itunes: { appId: FAN_APP.appStoreId, appArgument: `${SITE.origin}${alt.canonical}` },   // Smart App Banner: FAN PAGES ONLY
};
// creators: same shape with 'creators', meta.creators.*, and NO itunes field.
```

**x-default decision:** `x-default` → `/` (JA). This is a Japan-first product, and the page offers an "English available" pill. `/en` and `/en/creators` list the same set, so the links are reciprocal. Every page's canonical points to itself. The og:image comes from `opengraph-image.tsx` (`alt` = `meta.*.ogImageAlt`).

### 8.2 Open Graph images (WP7)

`src/app/(site)/[lang]/opengraph-image.tsx` and `.../creators/opengraph-image.tsx`:
- `export const size = { width: 1200, height: 630 }; contentType = 'image/png'; generateStaticParams → ja, en; export async function generateImageMetadata` is not needed.
- `alt` comes from the dictionary via a default export reading `params` (a Promise in Next 16).
- **Fonts:** fetch a Noto Sans JP 800 subset through the Google Fonts CSS2 `text=` parameter, with exactly the rendered strings. Parse the `url(...)` and fetch the TTF (no browser UA). Plus Jakarta Sans 800 uses the same method. Keep the bundle under 500 KB.
- **Logo:** `readFile(join(process.cwd(), 'public/brand/mark-256.png'))` → data URL.
- **Fan design:**
  - background `linear-gradient(180deg, #fbf7f0, #f7f3ec)` + a dawn radial at the right bottom (`rgba(255,209,102,.35)`)
  - left 60%: mark 56 + wordmark "LinClone" (PJS 700 38, since Satori has no Poppins), then the H1 `home.hero.title` at 84px (JA Noto 800 / EN PJS 800, ink), then `home.hero.lead` truncated to its first sentence (28px ink-2), then a chip row `最初の60秒は無料` / `First 60 seconds free` (teal-wash pill)
  - right: three aura "can badges" (circles 220/180/150) built from radial gradients in `#e14b81`, `#f0a53a`, `#5b8def`, each with a 6px ring (linear gradient `#a97fe0→#e14b81→#e8a33d`; Satori lacks conic) and a white monogram (Y, K, S)
  - bottom strip: `common.disclosure` 20px ink-2
- **Creators design:**
  - background `radial-gradient(#f0e6fb, #eceae4)`
  - lockup mark + "LC STUDIO" (PJS 800 tracked)
  - H1 `creators.hero.title` 72px
  - a pill `招待制` / `Invitation only` (violet wash, `#6f3fb8`)
  - right: a violet ring 300px (a thick border `#8b55d6` around a lavender disc holding an "A" monogram)
- Output is static at build.

### 8.3 JSON-LD (`src/lib/jsonld.ts`, WP0; rendered by `<JsonLd>` in each page)

**Home, JA** (EN is identical except `url`, `@id` suffixes, `inLanguage: "en"`, the `/en` URLs, and **no `WebSite` node**; `WebSite` appears only on `/`):

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.linclone.com/#org",
      "name": "LinClone",
      "legalName": "LinClone K.K.",
      "url": "https://www.linclone.com/",
      "logo": { "@type": "ImageObject", "url": "https://www.linclone.com/brand/logo-512.png", "width": 512, "height": 512 },
      "email": "info@linclone.com",
      "sameAs": ["https://apps.apple.com/jp/developer/linclone-k-k/id1826974719"]
    },
    {
      "@type": "WebSite",
      "@id": "https://www.linclone.com/#website",
      "name": "LinClone",
      "url": "https://www.linclone.com/",
      "inLanguage": ["ja", "en"],
      "publisher": { "@id": "https://www.linclone.com/#org" }
    },
    {
      "@type": "WebPage",
      "@id": "https://www.linclone.com/#webpage",
      "url": "https://www.linclone.com/",
      "name": "LinClone｜推しのAIクローンと話せる推し活アプリ",
      "description": "推しの公式AIクローンと、AI通話・AIチャット・モーニングコール・LIVE配信。最初の60秒は無料で話せます。ダウンロード無料、iPhone・Android対応。クリエイターのプロフィールはすべてAIクローンです。",
      "inLanguage": "ja",
      "isPartOf": { "@id": "https://www.linclone.com/#website" },
      "about": { "@id": "https://www.linclone.com/#fan-app" },
      "publisher": { "@id": "https://www.linclone.com/#org" }
    },
    {
      "@type": "MobileApplication",
      "@id": "https://www.linclone.com/#fan-app",
      "name": "LinClone",
      "operatingSystem": "iOS, Android",
      "applicationCategory": "EntertainmentApplication",
      "inLanguage": ["ja", "en"],
      "description": "推しの公式AIクローンと、通話・チャット・モーニングコール・LIVE配信を楽しめるアプリ。クリエイターのプロフィールはすべてAIクローンです。",
      "offers": { "@type": "Offer", "price": 0, "priceCurrency": "JPY" },
      "installUrl": "https://apps.apple.com/jp/app/linclone/id6748680628",
      "downloadUrl": [
        "https://apps.apple.com/jp/app/linclone/id6748680628",
        "https://play.google.com/store/apps/details?id=com.linclone.app"
      ],
      "publisher": { "@id": "https://www.linclone.com/#org" }
    }
  ]
}
```

- EN `@id`s: `…/en#webpage`, and the app `@id` stays `https://www.linclone.com/#fan-app`, since it is one entity.
- EN `installUrl`: `https://apps.apple.com/app/id6748680628`.
- The descriptions come from the dictionaries (`meta.home.description`). The app `description` is composed from `home.faq.items.what.a`'s first sentence plus `common.disclosure`.
- **No `aggregateRating`, no FAQPage, no HowTo.**

**Creators, JA:**

```json
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://www.linclone.com/#org", "name": "LinClone", "legalName": "LinClone K.K.", "url": "https://www.linclone.com/" },
    {
      "@type": "WebPage",
      "@id": "https://www.linclone.com/creators#webpage",
      "url": "https://www.linclone.com/creators",
      "name": "LC Studio｜公認AIクローンをつくるクリエイターアプリ",
      "description": "自分の声と言葉から、公認のAIクローンを作成・管理。フォロワーとのチャット・通話・LIVE配信・育成・収益をスマホひとつで。LC Studioは招待制です。",
      "inLanguage": "ja",
      "isPartOf": { "@id": "https://www.linclone.com/#website" },
      "about": { "@id": "https://www.linclone.com/#lc-studio" },
      "breadcrumb": { "@id": "https://www.linclone.com/creators#breadcrumb" }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://www.linclone.com/creators#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "LinClone", "item": "https://www.linclone.com/" },
        { "@type": "ListItem", "position": 2, "name": "クリエイターの方へ", "item": "https://www.linclone.com/creators" }
      ]
    },
    {
      "@type": "MobileApplication",
      "@id": "https://www.linclone.com/#lc-studio",
      "name": "LC Studio",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "iOS, Android",
      "description": "クリエイターが自分の公認AIクローンをつくり、運営するためのアプリ。招待制。",
      "publisher": { "@id": "https://www.linclone.com/#org" }
    }
  ]
}
```

- EN uses `/en` and `/en/creators`, names from `meta.creators.breadcrumbHome/Creators`, and `"inLanguage":"en"`.
- **The LC Studio entity never gets `offers`**, because a price of 0 would imply it is free.
- `installUrl` and `downloadUrl` are added only when `STUDIO_LIVE === true`.

### 8.4 sitemap.ts and robots.ts (WP0)

```ts
// src/app/sitemap.ts
const O = SITE.origin; const UPDATED = new Date(SITE_LAST_MODIFIED); // hand-maintained constant in site-config, e.g. '2026-10-15'
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [{ ja: '/', en: '/en' }, { ja: '/creators', en: '/en/creators' }];
  const marketing = pages.flatMap((p) => {
    const alternates = { languages: { ja: O + p.ja, en: O + p.en, 'x-default': O + p.ja } };
    return [{ url: O + p.ja, lastModified: UPDATED, alternates }, { url: O + p.en, lastModified: UPDATED, alternates }];
  });
  const legal = ['/privacy', '/terms', '/cookies', '/support', '/policies/child-protection-policy'].map((p) => ({ url: O + p }));
  return [...marketing, ...legal];
}
// src/app/robots.ts
export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE.origin}/sitemap.xml`, host: SITE.origin };
}
```

- Do **not** list `/invite`, `/share/*`, `/get` or `/delete-user`.
- Do not `Disallow` them either. `/get` sends `X-Robots-Tag: noindex`, and legacy pages keep their own metadata.

### 8.5 Smart App Banner

`itunes: { appId: '6748680628', appArgument }` goes on `/` and `/en` only. It never goes on `/creators`, and nothing is added for LC Studio.

### 8.6 Heading outline (exactly one H1 per page)

**`/`**

```
h1  推しと、声で話そう                                  (#hero)
  h2  話し相手は、公式のAIクローン。                      (#about)
    h3  公式・公認 / AIだとわかる / 記憶は、自分で管理
  h2  声で話すと、もっと近い。                            (#call)
  h2  推しの声で、目がさめる。                            (#morning-call)
    h3  ホームを開けば、推しの最新ボイスメッセージ。        (#voice-message)
  h2  昼休みは、チャットの続き。                          (#chat)
    h3  通話のあとも、チャットで続きを。 / 返信から、画像と声を。 / 呼び名も、話し方も、2人の関係で。
  h2  今夜は、推しのLIVE配信。                            (#live)
    h3  テーマを選んで、推しにLIVE配信をリクエスト。 / 見逃しても、アーカイブで。
  h2  夜は、推しを育てる時間。                            (#grow)
  h2  まだまだ、推しとできること。                        (#more)
    h3  (10 tile titles) / アプリでできること、ぜんぶ
  h2  最初の60秒は、無料で話せる。                        (#how-it-works)
    h3  (4 step titles)
  h2  よくある質問                                      (#faq)
    h3  (11 questions)
  h2  自分のAIクローンを、つくる。                        (#creators)
  h2  推しに、電話しよう。                              (#download)
```

The cast marquee has no heading; it is a `section` with `aria-label`. The checkpoint and how-CTA titles are `<p>`.

**`/creators`**

```
h1  自分の公認AIクローンを、スマホでつくる。              (#top)
  h2  オフラインにならない、もう一人の自分。              (#about)
  h2  会話も、LIVE配信も、収益も。スマホひとつで。        (#how)
  h2  スマホだけで、クローン設定。                        (#setup)   h3 × 6 steps
  h2  フォロワーより先に、話してみる。                    (#check)
  h2  最終判断は、いつもご自身で。                        (#control) h3 × 4 cards
  h2  ときどきは、本人として。                            (#real)    h3 LIVE配信は、クローンが進行。
  h2  ご自身の声で、フォロワーの毎日に。                  (#voice)   h3 × 3
  h2  フォロワーのことが、よくわかる。                    (#insights) h3 収益は、Coinsベース。
  h2  はじまりは、招待から。                              (#join)    h3 × 4 steps
  h2  よくある質問                                      (#faq)     h3 × 9–11
  h2  もう一人の自分に、会いにいこう。                    (#final)
```

### 8.7 Internal linking

**Fan → creators:**
- header `forCreators`
- creators band CTA
- FAQ `creator` link
- footer "LC Studio"

The anchor texts are descriptive (「クリエイターの方へ」, 「LC Studioについて見る」).

**Creators → fan:**
- header `fanApp`
- hero `fanLink`
- final `fanLink`
- footer

**Language:** a `LangPill` in the header and the footer, `<a hrefLang>`.

**Chapter anchors:** hero chips, header nav and the feature index. Anchors are stable ids and can earn sitelinks.

Every link to the legacy pages is a plain `<a>`.

### 8.8 Image and alt policy

- Mockups: `figure role="img"` with the dictionary `alt` (describes the screen, and says it is an illustration). The inner DOM is `aria-hidden`.
- Stage media: the `[data-stage-media]` root gets `role="img"` + `aria-label` from `*.stageAlt`. Interactive children (demo root, bento tiles) are rendered outside the hidden subtree.
- Auras, Scenes, glows, voiceprints, the marquee duplicate set and the watermark: `aria-hidden="true"`, with an empty alt where applicable.
- Store badges: the alt is the official badge text (`common.store.*BadgeAlt`). The QR has `common.store.qrAlt`.
- Brand mark `<img alt="">` next to the wordmark text (so it is not read twice). The standalone mark in the footer has alt `LinClone`.
- **No real-person images anywhere.** `CreatorImage` with a photo requires `licensed: true` and a `rightsRef`.

---

## §9 Accessibility, reduced motion, performance, testing

### 9.1 Accessibility checklist (WCAG 2.2 AA)

**Contrast:**
- body ink `#28273b` on cream: 13.6:1
- secondary `#5b5970`: ≈6:1
- `#8d8ba0`: **never used for text**
- teal text `#0096a8`: only ≥24px bold or icons
- CTAs: ink on teal (≥5.5:1)
- `.btn-violet`: white on `#8b55d6` (4.8:1)
- white on `#0f1018`: 18:1
- `rgba(255,255,255,.72)` on night: ≈11:1

**Text fills:** the dim state is transient, and the CSS default is filled. `forced-colors: active` → solid `CanvasText` with no backgrounds. Units are real text inside the heading element: no `aria-label`/`aria-hidden` splitting, and no SplitText.

**Keyboard and landmarks:**
- a skip link to `#main` first
- a `SkipLink` in every sticky stage
- focus rings: 3px `#28273b` (white on dark) with offset 3px
- the header menu is a focus-trapped dialog, and Esc closes it
- carousels have buttons plus arrow keys
- `<details>` for the FAQ

**Live regions:** demo captions (`aria-live="polite"`), copy-email feedback, and the mode sampler bubble.

**Motion:**
- no flashes (the burst opacity is ≤.5)
- parallax ≤±12px
- every scroll effect has a reduced-motion final state
- auto-cycling widgets (mode sampler, reel mini, library tabs, morning tone) pause on hover and focus, and have a pause state when out of view

**Targets:** ≥44×44. The sticky bar ✕ is 44.

**Language:** `lang` on `<html>`. The EN pill text uses `lang="en"` / `lang="ja"` on the other-language links.

### 9.2 How each effect degrades

| Effect | No JS | Reduced motion | Lite mode | Mobile |
|---|---|---|---|---|
| Hero entrance | static | static | same (CSS transform) | same |
| Caption marker | none | rests on the last phrase | rests immediately | same |
| Stage expand (call, LIVE, command centre, clone check) | final full-bleed | final | simple reveal (opacity + scale, no clip) | shorter (≤180svh), no bezel scale |
| Reverse collapse (final) | collapsed CTA | collapsed | simple fade | 140svh |
| Text fills | filled | filled | filled with a scrub (cheap) | per phrase |
| Dawn scrub | cream grid + static gradient | static | static gradient | static gradient, no sticky |
| StickySteps | all steps + the first screen | all screens final | toggles, no push | carousel or list |
| Marquee | static row (overflow hidden) | static wrap | no skew | 1 row |
| Loops (glows, waves, pulses) | CSS runs | off | on (cheap) but gated by in-view | same |
| Tap-to-call demo | `#download` link | static transcript + done card | captions only, no glow beats | same, thumb-reach |
| Sticky bar, QR dock | not rendered (header `/get` still works) | shown without slide | same | bar only |

### 9.3 Performance budget

| Metric (p75 mobile, 4G, Moto G class) | Target |
|---|---|
| LCP | **< 2.0s** (element: the hero H1) |
| CLS | **< 0.05** |
| INP | **< 200ms** |
| TBT (lab) | < 150ms |

JS and asset budgets:
- **Initial JS for `/`:** ≤ 95 KB gz (framework + header behaviour + small client islands). **GSAP (≈46 KB) and Lenis (≈5 KB) are not in the initial bundle**; they load on idle or first interaction via `loadMotion()`.
- **Per animator chunk:** ≤ 8 KB gz. CallDemo ≈ 6 KB.
- **Fonts on first paint (JA):** PJS latin (preload) + Poppins 600 (preload) + the JA headline subset (preload, ≤45 KB). Noto JP body slices load on demand. Space Grotesk is not preloaded.
- **Images above the fold:** 2 badges (SVG ≤8 KB / PNG ≤12 KB) + the mark. No raster in the hero phone.

**Rules:**
- Animate only transform, opacity, `clip-path` (stages) and one CSS var per effect.
- No `filter: blur()` on any large element; glows are radial gradients.
- Live `backdrop-filter` stays within budget (§3.3).
- No `mix-blend-mode` over the page.
- All loops pause off-screen (`.is-inview`) and on `visibilitychange`.
- Section animators initialise one viewport ahead (`useScrollScene`).
- `ScrollTrigger.refresh()` runs after `document.fonts.ready` and after lazy inits (debounced).
- Heights of sticky stages are reserved in CSS, so there are no pin-spacers.
- The sticky bar pads `main` only at the document end.
- `content-visibility: auto` only on sections without ScrollTriggers (FAQ, footer).
- `<link rel="preconnect">` is not needed (everything is self-hosted).
- Measure with `@next/bundle-analyzer` once in WP7.

### 9.4 Head and hydration safety

`<html suppressHydrationWarning>` is required because of the platform/lite/oshi attributes the head script sets. Badge order and visibility changes are CSS-only, with pre-reserved equal-height slots.

### 9.5 Analytics shim (`src/lib/analytics.ts`, client)

```ts
export type AnalyticsEvent = 'cta_click' | 'qr_open' | 'demo_start' | 'demo_complete' | 'sticky_dismiss'
  | 'creators_nav' | 'studio_mailto' | 'studio_copy_email' | 'lang_switch' | 'faq_open';
export function track(event: AnalyticsEvent, props: Record<string, string | number | boolean> = {}): void {
  try { (window as any).dataLayer?.push({ event, ...props }); window.dispatchEvent(new CustomEvent('lc:analytics', { detail: { event, ...props } })); } catch {}
}
```

Props used: `cta_click{loc: Placement, platform: 'ios'|'android'|'desktop', lang}`, `creators_nav{from}`, `studio_mailto{loc}`. It sends no personal data and no URL parameters with user data.

### 9.6 Copy lint (`scripts/lint-copy.mjs`, runs in `prebuild` and CI)

It fails the build on any of these in `src/i18n/dictionaries/**` (and warns on the same patterns in `src/components/**/*.tsx` string literals):

1. **Key parity:** the flattened key sets of `ja` and `en` must be identical.
2. **Digits:** any `\d`, after removing this allowlist:
   - `\d{1,2}:\d{2}` (clocks and timers)
   - `60秒`, `60-second`, `60 seconds`
   - `第[1-5]章`, `Chapter [1-5]`
   - exact `7日|30日|90日|7 days|30 days|90 days`
   - `1回のみ`, `1回だけ`
   - `1つのアカウントを1人`
   - `2人の` (the product name 「2人の関係と記憶」)
   - values of keys named `num` matching `^0[1-9]$`
   - `{current}`, `{total}` placeholders
3. **Money:** `[¥$%]`, `円`, `コイン` or `coins?` adjacent to a digit.
4. **Versions:** `\bVER\b`, `v\d`, `version`.
5. **JA voice:** `あなた` anywhere; `！` anywhere in site copy; `ライブ(?!ラリ)` anywhere; `・` directly after `ません|ました`.
6. **Creator pages** (`creators.*`, `mock.studio.*`, `meta.creators.*`): `ファン` (JA) and `\bfans?\b` (EN).
7. **Personas and premium:** `Mina|Kensei|kensei|星空|シンセ|深夜ラジオ|フィルム|神戸|Kobe|Digital Twilight|Romantic|Soulmate|Devoted|ロマンティック|ソウルメイト|18歳以上|18\+`.
8. **Refuted claims:**
   - `ビデオ|video` outside `*.video.*` keys
   - `10分以内|within 10 minutes|24時間|24 hours|無料で作成|free to create|interview|インタビュー|共同配信|co-host|限定URL|unlisted|無制限|unlimited` (plan allowances are server-set, so no "unlimited" claim even for Super)
   - `通常約1分|about a minute|within a minute` (unless `CLAIMS.liveTimingWired`, in which case the key must be added deliberately)
9. **Studio "free":** in `creators.*` and `meta.creators.*`, the words `無料` and `free`.

The lint passes on the delivered `ja.json` and `en.json`.

### 9.7 Testing checklist

**Lighthouse CI** (`@lhci/cli`, mobile preset, 3 runs, median) on `/`, `/en`, `/creators`, `/en/creators`:
- Performance ≥ 90
- Accessibility ≥ 98
- Best Practices ≥ 95
- SEO = 100
- CLS < 0.05, LCP < 2.0s
- Desktop preset: Performance ≥ 95

**Playwright** (`tests/e2e/`, WP7):
1. **First viewport** at 390×664 (JA and EN): the eyebrow, H1, text `最初の60秒は無料` / `60 seconds`, a store link, and `common.disclosure` are all within the viewport box. Repeat for `/creators` (H1, 招待制, mailto button, 近日公開 pills).
2. **Screenshots** of start, mid and end states of every stage at 375×812, 390×844, 768×1024, 1280×800, 1440×900 and 1920×1080. Also with `reducedMotion: 'reduce'` (final states), and with JS disabled (`javaScriptEnabled:false`: content complete, the header CTA href `/get…`).
3. **Headline wrapping** at 360 / 375 / 390 / 430: no H1/H2 overflow (`scrollWidth ≤ clientWidth`) and no single-character last line.
4. **Links:** every internal anchor target exists; the legacy routes return 200; `/ja` → 308; `/get?src=qr_hero&lang=ja` with an iPhone UA → 302 to `apps.apple.com/jp/...ct=lp_qr_hero_ja`.
5. **SEO checks:** one `h1`; `link[rel=alternate][hreflang]` × 3 on each page; the canonical is self; JSON-LD parses; there is no `apple-itunes-app` meta on `/creators`.
6. **Truth checks:** no `videocam` path in the DOM; no text matches `/\d+\s?(コイン|coins?)/`; `/creators` HTML contains no `ファン`, `あなた` or ライブ.
7. **Sticky bar logic:** hidden over `#call` and `#download`; hidden after dismiss for the session.
8. **Demo:** a click runs to the done card in ≤15s; badges exist in the done card; pause off-screen.

**Manual QA devices:** iPhone SE (375×667) in Safari **and** in the LINE, Instagram, X and TikTok in-app browsers; iPhone 15; Pixel 6a Chrome; a Moto G-class Android (lite mode); iPad (platform = ios); desktop Chrome, Safari and Firefox. Test Windows high contrast (forced colours) and VoiceOver on the H1 and a fill H2.

### 9.8 Launch gate (from verdict.json)

1. The v3 build is public on the App Store **and** Google Play. Until then, `LAUNCH.v3PublicOnStores=false`, which shows `common.devNote`. Never write "new" or "now available".
2. The App Store listing is localised to JA before JA traffic goes live.
3. Owner and legal settle the privacy text (§1.4.8).
4. A native reviewer signs off all new JA copy against GLOSSARY.md, including the mode names and the Studio pause-switch JA.
5. `.well-known` is unchanged from the **live** production files.

---

## §10 Config constants: `src/lib/site-config.ts` (WP0)

```ts
import type { Locale } from '@/i18n/config';

export const SITE = {
  origin: 'https://www.linclone.com',
  name: 'LinClone',
  legalName: 'LinClone K.K.',
  contactEmail: 'info@linclone.com',
  appStoreDeveloperUrl: 'https://apps.apple.com/jp/developer/linclone-k-k/id1826974719',
} as const;
export const SITE_LAST_MODIFIED = '2026-10-15'; // bump by hand when marketing pages change

export const FAN_APP = {
  appStoreId: '6748680628',
  appStoreUrlJa: 'https://apps.apple.com/jp/app/linclone/id6748680628',
  appStoreUrlIntl: 'https://apps.apple.com/app/id6748680628',
  playPackage: 'com.linclone.app',
  playUrl: 'https://play.google.com/store/apps/details?id=com.linclone.app',
  appStoreProviderToken: null as string | null, // owner to supply App Store Connect `pt`
} as const;

/** Flip to true ONLY when LC Studio is public on BOTH stores. Swaps 近日公開 pills → official badges + real links. */
export const STUDIO_LIVE = false;
export const STUDIO_APP = {
  appStoreId: '6798622206',
  appStoreUrl: 'https://apps.apple.com/app/id6798622206',
  playPackage: 'com.linclone.studio',
  playUrl: 'https://play.google.com/store/apps/details?id=com.linclone.studio',
} as const;

export const LAUNCH = { v3PublicOnStores: false } as const;       // false → show common.devNote under mockups

/** Owner-gated claims. Default false = the conservative copy ships. */
export const CLAIMS = {
  liveTimingWired: false,   // 「通常約1分」 wired LIVE copy (needs owner approval under the numbers rule)
  builtFromOwnVoice: false, // "made from the creator's own voice and words" (unverified for legacy v1.0 clones)
  liveDropIn: false,        // Studio LIVE "drop in as the real you" (shipped_confidence: likely)
  legacyCarryOver: false,   // Studio v1.0 clone carry-over (likely)
} as const;

/** Verified official social accounts only. Empty until the owner confirms. */
export const SOCIAL: { name: 'X' | 'Instagram' | 'TikTok' | 'YouTube' | 'LINE'; url: string }[] = [];

/** Rights-cleared fictional demo voice sample, or null (captions-only demo). Never a real creator. */
export const DEMO_AUDIO_SRC: string | null = null;

export type Placement = 'header' | 'hero' | 'demo' | 'checkpoint' | 'how' | 'final' | 'sticky' | 'footer' | 'faq'
  | `qr_${'hero' | 'demo' | 'how' | 'final' | 'dock' | 'header'}`;
/** LC Studio mailto / copy-address placements (analytics `studio_mailto{loc}`, `studio_copy_email{loc}`). */
export type StudioPlacement = 'header' | 'hero' | 'join' | 'final' | 'footer';
```

`src/lib/store-links.ts`:

```ts
export function storeUrl(store: 'ios' | 'android', lang: Locale, placement: Placement): string {
  if (store === 'ios') {
    const base = lang === 'ja' ? FAN_APP.appStoreUrlJa : FAN_APP.appStoreUrlIntl;
    const q = new URLSearchParams({ ct: `lp_${placement}_${lang}`, mt: '8' });
    if (FAN_APP.appStoreProviderToken) q.set('pt', FAN_APP.appStoreProviderToken);
    return `${base}?${q}`;
  }
  const ref = `utm_source=linclone_lp&utm_medium=${placement}&utm_campaign=${lang}`;
  return `${FAN_APP.playUrl}&hl=${lang}&referrer=${encodeURIComponent(ref)}`;
}
export const getUrl = (placement: Placement, lang: Locale) => `/get?src=${placement}&lang=${lang}`;
export const getAbsUrl = (placement: Placement, lang: Locale) => `${SITE.origin}${getUrl(placement, lang)}`;
/** Server-computed hrefs for client islands (MobileDownloadBar). */
export function hrefs(placement: Placement, lang: Locale): { appStoreHref: string; playHref: string; getHref: string } {
  return { appStoreHref: storeUrl('ios', lang, placement), playHref: storeUrl('android', lang, placement), getHref: getUrl(placement, lang) };
}

export function mailtoStudio(lang: Locale, d: Dictionary): string {
  const { subject, body } = d.creators.mailto;
  return `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
```

**Mailto templates** (from the dictionaries, `creators.mailto`):
- **JA subject:** 【LC Studio】招待リクエスト
- **JA body:**
  ```
  LinClone ご担当者様

  LC Studioへの招待を希望します。

  お名前（活動名）：
  SNSアカウント（URL）：
  フォロワー数（主なSNS）：
  ジャンル（アイドル／歌手／俳優・声優／配信者／アスリート／その他）：
  事務所名（任意）：
  ひとこと（任意）：

  よろしくお願いします。
  ```
- **EN subject:** LC Studio invitation request
- **EN body:**
  ```
  Hi LinClone team,

  I'd like an invitation to LC Studio.

  Name (stage name):
  Social account (URL):
  Follower count (main platform):
  Genre (idol / singer / actor or voice actor / streamer / athlete / other):
  Agency (optional):
  Message (optional):

  Thank you!
  ```

**`src/lib/personas.ts`** (the fictional cast; no real people):

```ts
export type PersonaId = 'yuzu' | 'ren' | 'kai' | 'sora' | 'nagi' | 'aoi';
type Portrait = { src: string; alt: Record<Locale, string>; focal: [number, number]; licensed: true; rightsRef: string };
export type PersonaDef = { id: PersonaId; color: string; ring: 'story' | 'live'; voiceSeed: number; monogram: string; portrait?: Portrait };
export const PERSONAS: Record<PersonaId, PersonaDef> = {
  yuzu: { id: 'yuzu', color: '#e14b81', ring: 'story', voiceSeed: 7,  monogram: 'Y' }, // fan-page protagonist; rendered with var(--oshi)
  ren:  { id: 'ren',  color: '#00afc4', ring: 'story', voiceSeed: 3,  monogram: 'R' },
  kai:  { id: 'kai',  color: '#f0a53a', ring: 'live',  voiceSeed: 11, monogram: 'K' }, // LIVE host
  sora: { id: 'sora', color: '#5b8def', ring: 'story', voiceSeed: 5,  monogram: 'S' }, // 育成 profile
  nagi: { id: 'nagi', color: '#3fb98a', ring: 'story', voiceSeed: 9,  monogram: 'N' },
  aoi:  { id: 'aoi',  color: '#8b55d6', ring: 'story', voiceSeed: 13, monogram: 'A' }, // /creators persona
};
for (const p of Object.values(PERSONAS)) if (p.portrait && !(p.portrait.licensed === true && p.portrait.rightsRef)) throw new Error(`Unlicensed portrait for ${p.id}`);
```

---

## §11 Work packages (strict file ownership)

**Rules:**
- No two packages edit the same file.
- WP0 lands first and creates **stub files** for everything owned by later packages. A stub exports the final signature and renders a minimal placeholder. Ownership of a stub transfers to the named package, which replaces it wholesale.
- Dictionary namespaces are split into files (below), so copy edits never collide.
- Every package must keep `npm run build`, `npm run copy:lint` and `npm run lint` green.

**Dictionary split** (`scripts/split-dictionaries.mjs`, run once by WP0). Its input is `ja.json` / `en.json` from `/private/tmp/claude-501/-Users-abhishekchauhan-Desktop-LinClone-linclone-lp/e7b769d5-0555-4cb5-b682-6b91bb3798b2/scratchpad/design/`. Copy them to `assets-src/dictionaries/` first so the script is reproducible in the repo. It writes `src/i18n/dictionaries/{ja,en}/<file>.json` and generates `index.ts`, which statically imports and composes `{ meta, common, a11y, header, stickyBar, qrDock, footer, personas, home: { hero, cast, about, call, demo, checkpoint, morning, chat, live, grow, more, how, faq, creatorsBand, final }, creators, mock: { fan, studio } }`. Then:

```ts
export type Dictionary = typeof ja;
const en: Dictionary = {...};   // compile-time key parity
```

| File(s) | Owner |
|---|---|
| `meta`, `common`, `a11y`, `header`, `stickyBar`, `qrDock`, `footer`, `personas` | WP0 |
| `home.hero`, `home.cast`, `home.about`, `home.call`, `home.demo`, `home.checkpoint` | WP1 |
| `home.morning`, `home.chat`, `home.live`, `home.grow` | WP2 |
| `home.more`, `home.how`, `home.faq`, `home.creatorsBand`, `home.final` | WP3 |
| `mock.fan` | WP4 |
| `mock.studio` | WP5 |
| `creators` | WP6 |

### WP0: Foundation (blocking; 1 engineer; first)

**Owns:**
- `next.config.ts`, `package.json`, `package-lock.json`
- delete `middleware.ts`
- `scripts/*`, `assets-src/*`
- `public/brand/*`, `public/badges/*`, `public/fonts/*`, `public/textures/*`
- deletions of `public/{showcase.mp4,file.svg,globe.svg,next.svg,window.svg}`
- `src/app/{favicon.ico,icon.png,apple-icon.png,global-not-found.tsx,sitemap.ts,robots.ts}`, `src/app/get/route.ts`
- `src/app/(legacy)/**` (the move only; contents byte-identical)
- `src/app/(site)/[lang]/layout.tsx`, `page.tsx`, `creators/page.tsx`
- `src/styles/site.css`
- `src/i18n/**` (including the WP0 namespace JSON files; other namespace files are created by the split, then owned as above)
- `src/lib/{site-config,store-links,personas,analytics,units,qr,jsonld,fonts}.ts(x)`, `src/lib/motion/**`
- `src/components/site/**` (all of §4, including `faq/FaqList.tsx`)
- `src/components/seo/JsonLd.tsx`
- `src/components/mockups/kit/**`, `src/components/mockups/types.ts`
- deletion of the 7 old home components
- **stubs** for every file listed under WP1–WP7

**Exports contract** (the exact names and signatures that parallel work compiles against):

```ts
// @/i18n/config
export const LOCALES: readonly ['ja','en']; export type Locale = 'ja'|'en'; export function isLocale(x: string): x is Locale;
// @/i18n/get-dictionary  (server-only)
export function getDictionary(lang: Locale): Dictionary;  export type { Dictionary } from './dictionaries';
// @/i18n/format
export function fmt(tpl: string, vars: Record<string, string | number>): string;
// @/i18n/paths
export type PageKey = 'home' | 'creators';
export function localePath(lang: Locale, page: PageKey, hash?: string): string;   // ('ja','home') → '/', ('en','creators','#faq') → '/en/creators#faq'
export function alternatesFor(page: PageKey, lang: Locale): NonNullable<Metadata['alternates']>;
// @/lib/site-config — §10 (SITE, SITE_LAST_MODIFIED, FAN_APP, STUDIO_LIVE, STUDIO_APP, LAUNCH, CLAIMS, SOCIAL, DEMO_AUDIO_SRC, type Placement, type StudioPlacement)
// @/lib/store-links — storeUrl, getUrl, getAbsUrl, hrefs, mailtoStudio(lang: Locale, d: Dictionary): string   // @/lib/personas — PERSONAS, PersonaId, PersonaDef (§10)
// @/lib/analytics — track, AnalyticsEvent   // @/lib/units — Units   // @/lib/qr — qrSvg(url: string, size?: number): Promise<string>
// @/lib/jsonld — homeGraph(lang: Locale, d: Dictionary): object; creatorsGraph(lang: Locale, d: Dictionary): object
// @/lib/motion/load — loadMotion, requestRefresh   // @/lib/motion/use-scroll-scene — useScrollScene, SceneCtx
// @/lib/motion/use-expand-stage — useExpandStage   // @/lib/motion/use-in-view — useInView
// @/lib/motion/policy — MQ_DESKTOP, usePrefersReducedMotion, useLite, isInAppBrowser   // @/lib/motion/tokens — EASE, DUR, REVEAL_FROM
// @/lib/motion/smooth-scroll — SmoothScroll (layout only), useLenis(): Lenis | null, scrollToId(id: string): void
// @/lib/motion/reveal.client — RevealGroup({ selector?: string; stagger?: number; children: ReactNode })
// @/components/site — Header, Footer, SkipLink, LangPill, MobileDownloadBar, QrDockShell, StoreBadges, StudioStoreCTA, QrBlock,
//   FrictionList, MailtoButton, CopyEmail, Disclosure, ScreenNote, Section, Eyebrow, ScrollFillText, CaptionMarker, Sticker,
//   GlassCard, Button, ButtonLink, Carousel, StickySteps, ExpandStage, Icon (+ type IconName), Aura, CreatorImage, Scene,
//   Waveform, Ring, CallGlow, Marquee, RevealGroup, FaqList, InViewObserver (layout only)      (barrel: src/components/site/index.ts)
//   Props are exactly as tabled in §4.1–§4.7; QrDockShell: { d: Dictionary; lang: Locale }; CopyEmail: see §4.2.
// @/components/mockups/kit — PhoneFrame, Screen, ScreenSlice, ScreenStack, StatusBar, TabBarFan, TabBarStudio, MockChip,
//   CoinPill, LiveBadge, RingAvatar, VerifiedMark, TypingDots, ScanLine, Toggle, Segmented, GlassMockCard  (barrel)
// @/components/mockups/types — MockProps
```

**Stub signatures** (created by WP0, owned by later WPs):

```ts
// home sections (each: ({ d, lang }: { d: Dictionary; lang: Locale }) => JSX)
HomeHero, CastMarquee, About, CallChapter, MorningChapter, ChatChapter, LiveChapter, GrowChapter, MoreBento, HowChapter, Faq, CreatorsBand, FinalCta
// creators sections (same signature)
CreatorsHero, CreatorsStatement, CommandCentre, StudioSetup, CloneCheck, StudioControl, StudioReal, StudioVoice, StudioInsights, StudioJoin, StudioFaq, CreatorsFinal
// fan mockups (MockProps unless noted)
FirstCall00c, CallStageMedia(+{variant}), IncomingRing06b, MorningSetup06b, HomeCards01, Conversation04, StoryFlow04to03b, Memory06,
LiveFeedCard, LivePlayerStage(+{fillSlot?: ReactNode}), LiveRequest12, LiveSetup13, ShowPreview14, ArchiveCard11, GrowPicker07,
CreatorProfile08, ReviewStatus10, Welcome00a, PickReel00b, GuestGate02,
minis: ReelMini, QuestsMini, BonusMini, InviteMini, PlansMini(+{cards}), ConfirmSheetMini, MyPageMini, SleepMini, SignInMini
// studio mockups
S09Building(+{state}), D01Home, D01Bento(+{tileHrefs, tileDesc}), S04QuickPicks, S04aOwnWords, S05Photos, S06ModesFree,
S07NgTopics(+{compact?}), S08bRecord, D01bCloneCheck, SelfCallStage(+{fillSlot?}), D06GrowCard, D08ProfileCard, D04GalleryCard,
D02bThread, D05Live(+{dropIn}), D07HomeVoiceCard, D07bMorningCard, D07cFillersCard, D09Analytics, D10EarningsCalculating
```

**Done when:**
- Legacy URLs render identically (visual diff of `/privacy`, `/support`, `/invite?code=ABC`)
- `/`, `/en`, `/creators` and `/en/creators` build statically with stubs; `next build` shows `●` (SSG) for `/[lang]` and `/[lang]/creators`
- the header, footer, sticky bar, QR dock, badges and fonts work
- the lint, sitemap, robots and `/get` work
- the Lighthouse SEO score is 100 with stubs

### WP1: Fan sections A (hero → call)

**Owns:**
- `src/components/sections/home/{hero,cast,about,call}/**`: `HomeHero.tsx`, `HeroAnimator.client.tsx`, `CastMarquee.tsx`, `About.tsx`, `OshiColorPicker.client.tsx`, `CallChapter.tsx`, `CallStageAnimator.client.tsx`, `CallDemo.client.tsx`, `Checkpoint.tsx`, plus any private helpers inside those folders
- dictionaries `home.hero`, `home.cast`, `home.about`, `home.call`, `home.demo`, `home.checkpoint`

**Depends on:** the WP0 exports. It uses `FirstCall00c` and `CallStageMedia` (WP4 stubs) through the DOM hooks in §7.1 F2.

**Acceptance:** the 390×664 first-viewport test; the call stage timeline (§5.4); the demo flow; reduced-motion and no-JS states.

### WP2: Fan sections B (morning → grow)

**Owns:**
- `src/components/sections/home/{morning,chat,live,grow}/**`: `MorningChapter.tsx`, `MorningStageAnimator.client.tsx`, `MorningMicro.client.tsx`, `ChatChapter.tsx`, `ChatMicro.client.tsx`, `LiveChapter.tsx`, `LiveStageAnimator.client.tsx`, `LiveLoops.client.tsx`, `LiveRequestRow.tsx`, `LiveRequestMicro.client.tsx`, `GrowChapter.tsx`, `GrowAnimator.client.tsx`
- dictionaries `home.morning`, `home.chat`, `home.live`, `home.grow`

**Depends on:** WP0; the WP4 mockups F3–F17 via their hooks.

### WP3: Fan sections C (more → final)

**Owns:**
- `src/components/sections/home/{more,how,faq,creators-band,final}/**`: `MoreBento.tsx`, `ModeSampler.client.tsx`, `BentoMicro.client.tsx`, `FeatureIndex.tsx`, `HowChapter.tsx`, `HowAnimator.client.tsx`, `Faq.tsx`, `CreatorsBand.tsx`, `BandRing.client.tsx`, `FinalCta.tsx`, `FinalStageAnimator.client.tsx`
- dictionaries `home.more`, `home.how`, `home.faq`, `home.creatorsBand`, `home.final`

**Depends on:** WP0; the WP4 minis, F18–F20, F1 and F2 (final variant).

### WP4: Fan mockups

**Owns:** `src/components/mockups/fan/**` (F1–F21 incl. `minis/`) and the dictionary `mock.fan`.

**Depends on:** the WP0 kit and primitives only.

**Deliverables:** every hook in §7.1 and the SSR final states. There is no public preview route; WP4 adds Playwright screenshots of each mockup in `tests/mockups/fan.spec.ts` (WP4 owns that file), mounting them via the section pages.

### WP5: Studio mockups

**Owns:** `src/components/mockups/studio/**` (S1–S19), the dictionary `mock.studio`, and `tests/mockups/studio.spec.ts`.

**Depends on:** the WP0 kit and primitives only.

### WP6: `/creators` sections

**Owns:** `src/components/sections/creators/**` (all 12 sections + their `*.client.tsx` animators; the hero ready swap is CSS-only, so there is no `HeroReady.client.tsx`) and the dictionary `creators`.

**Depends on:** WP0 (including `FaqList`, `MailtoButton`, `CopyEmail`, `StudioStoreCTA`, `ExpandStage`, `StickySteps`) and the WP5 mockups.

### WP7: OG images, E2E and performance QA

**Owns:**
- `src/app/(site)/[lang]/opengraph-image.tsx`, `src/app/(site)/[lang]/creators/opengraph-image.tsx`
- `tests/e2e/**`, `playwright.config.ts`, `lighthouserc.json`
- `.github/workflows/site-ci.yml` (if CI exists; otherwise document the commands in `README.md` — **README is WP7-owned**)

**Depends on:** WP0 (dictionaries, fonts approach); runs against the WP1–WP6 output.

**Order:** WP0, then WP1–WP6 in parallel (WP4 and WP5 should land their mockups early, ideally first-day skeletons with hooks), then WP7 continuously. The integration owner is WP0's engineer (merges, resolves hook mismatches by amending §7 hooks, never by editing another package's file).

---

## Appendix A: Mockup strip list (what differs from the design)

| Screen | Removed or changed on the site |
|---|---|
| 00 splash | not used; `VER 3.0` would be removed |
| 00a welcome | Mina photo → aura; `videocam` → `podcasts` |
| 00c/00d | "+30 coins" removed; the done card has no amounts |
| 01 home | CoinPill number, bell count and quest counts removed; header greeting 「おはようございます」 |
| 01b reel / 00b | photo → aura; the tooltip no longer says 「1人以上」 |
| 03/03b | `Kensei × M…` → fictional `hinata`; the rail is not shown with counts |
| 04 chat | coin tags on 画像/音声, the paywall bubble and "Add more chats · 100coins" removed |
| 05 call | EXTRA TIME column, the Add time button and pack prices removed |
| 06 memory | premium modes block, 18+ note, 30/100 coins and 27/30 removed |
| 06b setup | coin rules card removed; shipped repeat options 1回のみ・毎日・平日・週末 |
| 07 picker | search field removed (it mentions categories) |
| 08 profile | "1.2M followers", "+N" and all Mina facts removed; new fictional facts (Sora) |
| 09 submission | not shown ("50 coins") |
| 10 status | shown with no costs or votes |
| 10b community vote | **not used** |
| 11 player | "1.2K watching", gift coin tiers and `videocam` removed; the disclaimer stays |
| 12 request | demo "10分以内" replaced by the hedge; ticket counts removed |
| 13 setup | 30分/3分 lengths and the ticket note removed |
| 14 preview | "30-min ticket", "10 minutes" and segment durations removed; Mina → Kai, the anime theme → the rainy-day playlist |
| 15 my page | stat grid removed (the library only) |
| 16/16b/16c wallet, buy, plans | not shown as screens; qualitative plan cards only |
| 17/17b quests, bonus | all amounts, counts and day numbers removed; the invite code is fictional `YUZUHINA` |
| S01/S03 | not used ("Free to create", founding slot) |
| S04 | postal-code fields removed; "1 / 6" → dots |
| S04a | AI interview segment and blog/stream links removed |
| S07 | page visibility (public/unlisted URL) removed; 「完全ブロック」 → 「ブロック」 |
| S08/S08b | "30:00" marker label and "no BGM · single speaker passed" removed |
| S09 | "24 hours", "notify", the earnings tour row and "$1,000" removed; no % in the ring |
| D01 | shipped tab order + 7 tiles; numbers, URL row and "last trained" removed |
| D01b | shown as-is (emoji removed) |
| D02b | the "call as the real you" button and note removed; `@kensei` → `@momo_pk`; coin/plan meta removed |
| D04/D04c | Stop/Restore removed |
| D05 | co-host, templates, viewer count, "segment 2/4" and the daily-cap numbers removed; drop-in behind `CLAIMS.liveDropIn` |
| D06 | vote counts and % removed (bar only); `@kensei` → `@yuki_nn` |
| D07/D07b/D07c | play counts, slots, "50 Coins per call", "10 per tone" and the ！ removed |
| D08 | SNS toggle, follower count and +N removed |
| D09 | values, axis, subscribers section and coin amounts removed |
| D10 | balance, $, share %, payout floor and 翌月5日 removed; calculating state only |
| D12 | not used (team "PHASE 2") |

## Appendix B: Signature effects map

| Effect | Where | Mobile |
|---|---|---|
| Scroll expands the screen | `/` #call (00c → 05 full-bleed), `/` #live-stage (feed card → 11 player), `/creators` #how (D01 → bento ToC), `/creators` #check (D01b → self-call) | call 180svh, live 160svh, how 180svh, check 160svh |
| Reverse collapse | `/` #download (full-bleed call → phone beside badges) | 140svh |
| Text colour fill (one per viewport) | #about statement (clip), call captions (units, external), morning caption, LIVE fill, grow fill, how step titles, final H2; /creators statement (clip), command-centre H2, clone-check fill, control H2 | per phrase |
| 声のテロップ caption marker | hero H1 (both pages), final H2, creators final H2 | same |
| VoiceCallGlow handoff | #call stage, demo, hero phone breathing, final, how sunrise | same |
| Dawn scrub | #morning-call (desktop sticky) | static gradient |
| Can-badge marquee | #cast, /creators voice lines | 1 row |
| Phone → app icon morph | #how-it-works CTA (desktop) | static icon |
| Ring fill | /creators hero S09, creators band, 60-second ring | same |
