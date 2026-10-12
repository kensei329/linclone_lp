import type { Locale } from '@/i18n/config';

// EVERY visible string of the DONE-C pages — /c/<slug> (clone page),
// /studio/invite/<code> (LC Studio invitation), their computer view and the
// neutral "not available" page — lives here, in Japanese and English.
//
// Contract (clone-net-web docs/DONE-C-HANDOFF.md §2): "Every visible string on
// these pages needs Kensei's copy … do not invent it." Kensei's strings.json
// has no key for these pages yet, so each entry below is PROVISIONAL (written
// by engineering to make the pages work) until Kensei supplies the wording.
// To approve one: replace ja/en with Kensei's text and set `provisional: false`.
// The open list for Kensei is docs/copy-gaps-clone-pages.md (keep it in step).
//
// Strings that already exist on the site with approved wording (store badge
// alt texts, the language names, the "back to LinClone" link) are NOT copied
// here: the pages read them from the site dictionaries (d.common.store.*,
// d.common.lang.*, d.meta.notFound.home), listed in the same doc as reused.
//
// Rules kept for the provisional text (scripts/lint-copy.mjs): no あなた, no
// full-width "!", no numerals, no reasons on the not-available page.

export type CopyEntry = {
  ja: string;
  en: string;
  /** true = engineering placeholder, waiting for Kensei's copy. */
  provisional: boolean;
  /** Where the string shows (for the copy-gap list). */
  where: string;
};

export const CLONE_PAGE_COPY = {
  // ── shared by both pages ────────────────────────────────────────────────
  'shared.handoffHint': {
    ja: 'ボタンを押すと、このページのリンクをコピーしてストアを開きます。',
    en: 'Tapping the button copies this page’s link and opens the store.',
    provisional: true,
    where: 'Phone view of /c and /studio/invite (VALID), small line under the button',
  },
  'shared.computerTitle': {
    ja: 'スマホで開く',
    en: 'Open on your phone',
    provisional: true,
    where: 'Computer view of /c and /studio/invite (VALID), heading of the store badges + QR panel',
  },
  'shared.qrCaption': {
    ja: 'スマホのカメラで読み取ると、このページが開きます',
    en: 'Scan with your phone camera to open this page',
    provisional: true,
    where: 'Computer view, caption under the QR code (the QR encodes the page URL)',
  },
  'shared.qrAlt': {
    ja: 'このページを開くQRコード',
    en: 'QR code that opens this page',
    provisional: true,
    where: 'Computer view, screen-reader text of the QR code',
  },
  'shared.notAvailableTitle': {
    ja: 'このページは表示できません',
    en: 'This page is not available',
    provisional: true,
    where: '/c/<slug> when the clone is not served (404), and /c or /studio/invite when the API is busy with nothing cached; also the browser tab title',
  },
  'shared.notAvailableBody': {
    ja: 'リンク先のページは現在ご覧いただけません。',
    en: 'The page this link leads to can’t be shown right now.',
    provisional: true,
    where: 'Not-available page, line under the heading (never says why)',
  },

  // ── /c/<slug> — the clone page ─────────────────────────────────────────
  'clone.cta': {
    ja: 'LinCloneアプリで開く',
    en: 'Open in the LinClone app',
    provisional: true,
    where: '/c/<slug> on a phone: the one button (copies the page URL, then opens the store; in LINE/Instagram/X it tries the app first)',
  },
  'clone.storesLabel': {
    ja: 'LinCloneアプリ',
    en: 'The LinClone app',
    provisional: true,
    where: '/c/<slug> computer view, label above the App Store / Google Play badges',
  },

  // ── /studio/invite/<code> — the LC Studio invitation ────────────────────
  'invite.title': {
    ja: 'LC Studioへの招待',
    en: 'Your invitation to LC Studio',
    provisional: true,
    where: '/studio/invite/<code> (VALID): page heading and browser tab title',
  },
  'invite.lead': {
    ja: 'LC Studioをインストールして、この招待コードで始められます。',
    en: 'Install LC Studio and start with this invitation code.',
    provisional: true,
    where: '/studio/invite/<code> (VALID): line under the heading',
  },
  'invite.codeLabel': {
    ja: '招待コード',
    en: 'Invitation code',
    provisional: true,
    where: '/studio/invite/<code> (VALID): label above the code in large type',
  },
  'invite.cta': {
    ja: 'LC Studioで開く',
    en: 'Open in LC Studio',
    provisional: true,
    where: '/studio/invite/<code> on a phone: the one button (copies the page URL, then opens the store; in LINE/Instagram/X it tries lcstudio:// first)',
  },
  'invite.storesLabel': {
    ja: 'LC Studioアプリ',
    en: 'The LC Studio app',
    provisional: true,
    where: '/studio/invite/<code> computer view, label above the App Store / Google Play badges',
  },
  'invite.invalidTitle': {
    ja: 'この招待は無効です',
    en: 'This invitation is not valid',
    provisional: true,
    where: '/studio/invite/<code> answered 404 (unknown, malformed or revoked): heading and tab title',
  },
  'invite.invalidBody': {
    ja: '招待のリンクやコードをもう一度ご確認ください。',
    en: 'Please check the invitation link or code again.',
    provisional: true,
    where: '/studio/invite/<code> 404: line under the heading',
  },
  'invite.usedTitle': {
    ja: 'この招待はすでに使われています',
    en: 'This invitation has already been used',
    provisional: true,
    where: '/studio/invite/<code> with status USED: heading and tab title',
  },
  'invite.usedBody': {
    ja: '新しい招待が必要な場合は、招待してくれた方にご連絡ください。',
    en: 'If you need a new invitation, please contact the person who invited you.',
    provisional: true,
    where: '/studio/invite/<code> USED: line under the heading',
  },
  'invite.expiredTitle': {
    ja: 'この招待は有効期限が切れています',
    en: 'This invitation has expired',
    provisional: true,
    where: '/studio/invite/<code> with status EXPIRED: heading and tab title',
  },
  'invite.expiredBody': {
    ja: '新しい招待が必要な場合は、招待してくれた方にご連絡ください。',
    en: 'If you need a new invitation, please contact the person who invited you.',
    provisional: true,
    where: '/studio/invite/<code> EXPIRED: line under the heading',
  },
} as const satisfies Record<string, CopyEntry>;

export type ClonePageCopyKey = keyof typeof CLONE_PAGE_COPY;
export type ClonePageCopy = Record<ClonePageCopyKey, string>;

/** The strings of one locale, keyed as above. */
export function clonePageCopy(lang: Locale): ClonePageCopy {
  return Object.fromEntries(Object.entries(CLONE_PAGE_COPY).map(([k, v]) => [k, v[lang]])) as ClonePageCopy;
}
