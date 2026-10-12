# Copy gaps — clone pages (DONE-C)

For **Kensei** (via Ritik). The linclone.com half of DONE-C — the clone page `/c/<slug>`, the LC Studio
invitation page `/studio/invite/<code>`, their computer view with the QR code, and the neutral
"not available" page — is built (branch `feature/clone-pages`). The contract
(clone-net-web `docs/DONE-C-HANDOFF.md` §2) says every visible string on these pages needs Kensei's copy,
and `strings.json` has no key for them yet. So every new string below is **PROVISIONAL**: engineering
wording, written only so the pages work, waiting for Kensei's text.

**Source of truth:** `src/content/clone-pages/strings.ts` (Japanese + English, one entry per key, each with
`provisional: true`). To apply Kensei's copy: replace `ja` / `en` there, set `provisional: false`, and
update the table below. Japanese is the default (`/c/…`, `/studio/invite/…`); English is under `/en/…`.

## New strings (need Kensei's copy)

| Key | State | Where it shows | Provisional JA | Provisional EN |
|---|---|---|---|---|
| `shared.handoffHint` | PROVISIONAL | Phone view of /c and /studio/invite (VALID), small line under the button | ボタンを押すと、このページのリンクをコピーしてストアを開きます。 | Tapping the button copies this page’s link and opens the store. |
| `shared.computerTitle` | PROVISIONAL | Computer view of /c and /studio/invite (VALID), heading of the store badges + QR panel | スマホで開く | Open on your phone |
| `shared.qrCaption` | PROVISIONAL | Computer view, caption under the QR code (the QR encodes the page URL) | スマホのカメラで読み取ると、このページが開きます | Scan with your phone camera to open this page |
| `shared.qrAlt` | PROVISIONAL | Computer view, screen-reader text of the QR code | このページを開くQRコード | QR code that opens this page |
| `shared.notAvailableTitle` | PROVISIONAL | /c/&lt;slug> when the clone is not served (404), and /c or /studio/invite when the API is busy with nothing cached; also the browser tab title | このページは表示できません | This page is not available |
| `shared.notAvailableBody` | PROVISIONAL | Not-available page, line under the heading (never says why) | リンク先のページは現在ご覧いただけません。 | The page this link leads to can’t be shown right now. |
| `clone.cta` | PROVISIONAL | /c/&lt;slug> on a phone: the one button (copies the page URL, then opens the store; in LINE/Instagram/X it tries the app first) | LinCloneアプリで開く | Open in the LinClone app |
| `clone.storesLabel` | PROVISIONAL | /c/&lt;slug> computer view, label above the App Store / Google Play badges | LinCloneアプリ | The LinClone app |
| `invite.title` | PROVISIONAL | /studio/invite/&lt;code> (VALID): page heading and browser tab title | LC Studioへの招待 | Your invitation to LC Studio |
| `invite.lead` | PROVISIONAL | /studio/invite/&lt;code> (VALID): line under the heading | LC Studioをインストールして、この招待コードで始められます。 | Install LC Studio and start with this invitation code. |
| `invite.codeLabel` | PROVISIONAL | /studio/invite/&lt;code> (VALID): label above the code in large type | 招待コード | Invitation code |
| `invite.cta` | PROVISIONAL | /studio/invite/&lt;code> on a phone: the one button (copies the page URL, then opens the store; in LINE/Instagram/X it tries lcstudio:// first) | LC Studioで開く | Open in LC Studio |
| `invite.storesLabel` | PROVISIONAL | /studio/invite/&lt;code> computer view, label above the App Store / Google Play badges | LC Studioアプリ | The LC Studio app |
| `invite.invalidTitle` | PROVISIONAL | /studio/invite/&lt;code> answered 404 (unknown, malformed or revoked): heading and tab title | この招待は無効です | This invitation is not valid |
| `invite.invalidBody` | PROVISIONAL | /studio/invite/&lt;code> 404: line under the heading | 招待のリンクやコードをもう一度ご確認ください。 | Please check the invitation link or code again. |
| `invite.usedTitle` | PROVISIONAL | /studio/invite/&lt;code> with status USED: heading and tab title | この招待はすでに使われています | This invitation has already been used |
| `invite.usedBody` | PROVISIONAL | /studio/invite/&lt;code> USED: line under the heading | 新しい招待が必要な場合は、招待してくれた方にご連絡ください。 | If you need a new invitation, please contact the person who invited you. |
| `invite.expiredTitle` | PROVISIONAL | /studio/invite/&lt;code> with status EXPIRED: heading and tab title | この招待は有効期限が切れています | This invitation has expired |
| `invite.expiredBody` | PROVISIONAL | /studio/invite/&lt;code> EXPIRED: line under the heading | 新しい招待が必要な場合は、招待してくれた方にご連絡ください。 | If you need a new invitation, please contact the person who invited you. |

Notes for the wording:

- `clone.cta` / `invite.cta` are the contract's "one button (Kensei's copy)". The tap copies the page URL,
  then opens the store; inside LINE / Instagram / X it first tries to open the app. Today's label says
  "open in the app" because that is what the visitor wants; Kensei may prefer a download wording.
- `shared.handoffHint` exists because the button writes to the clipboard: the hint says so. On iPhone the
  fan app then shows Apple's paste control labelled "Continue" (Kensei's Q12 answer; that label is the
  app's string, not the site's).
- `shared.notAvailable*` must never say why (deleted, link-only, paused, sanctioned and throttled all look
  the same).
- The invitation's `expiresAt` is not shown (it would need a date sentence from Kensei).

## Reused site strings (already approved, not duplicated)

| Site dictionary key | JA | EN | Where |
|---|---|---|---|
| `common.brand` | LinClone | LinClone | Lockup at the top of every state |
| `common.studioBrand` | LC Studio | LC Studio | Small label above the invitation heading |
| `header.homeLabel` | LinClone トップ | LinClone home | Screen-reader label of the lockup link |
| `common.lang.en` / `common.lang.ja` | English / 日本語 | English / 日本語 | Other-language link (top right) |
| `common.store.appStoreBadgeAlt` | App Storeからダウンロード | Download on the App Store | App Store badge (computer view) |
| `common.store.googlePlayBadgeAlt` | Google Play で手に入れよう | Get it on Google Play | Google Play badge (computer view) |
| `a11y.opensStore` | ストアのページが開きます | Opens the store page | Screen-reader note on the badges |
| `meta.notFound.home` | LinCloneのトップへ | Back to LinClone | Link on the not-available / invalid / used / expired states |

Data, not copy: the clone's display name, `@username`, bio and the OG title/description come from the API
(`og`); the invitation code is shown as the API returns it.
