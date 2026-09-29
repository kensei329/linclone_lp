import type { Metadata } from 'next';
import Script from 'next/script';
import { cookies } from 'next/headers';
import ja from '@/locales/ja/translation.json';
import en from '@/locales/en/translation.json';
import InviteCode from './InviteCode';

const APPLE_APP_ID = '6748680628';
const APP_STORE_URL = `https://apps.apple.com/app/linclone/id${APPLE_APP_ID}`;
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.linclone.app';
const SITE_ORIGIN = 'https://www.linclone.com';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
type Props = { searchParams: SearchParams };

// Accept only what the app generates (6-10 alphanumerics) with a little slack;
// anything else is treated as no code at all.
function sanitiseCode(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!/^[A-Za-z0-9_-]{1,16}$/.test(trimmed)) return null;
  return trimmed;
}

async function pickLanguage(): Promise<'ja' | 'en'> {
  // Same rule as src/app/layout.tsx: 'en' only when the cookie says so.
  const cookieStore = await cookies();
  return cookieStore.get('i18next')?.value === 'en' ? 'en' : 'ja';
}

function copyFor(lang: 'ja' | 'en') {
  const t = lang === 'en' ? en : ja;
  return { invite: t.invite, download: t.download };
}

function playUrlFor(code: string | null): string {
  return code
    ? `${PLAY_STORE_URL}&referrer=${encodeURIComponent(`invite_code=${code}`)}`
    : PLAY_STORE_URL;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const [lang, params] = await Promise.all([pickLanguage(), searchParams]);
  const code = sanitiseCode(params.code);
  const { invite } = copyFor(lang);
  const canonical = code ? `${SITE_ORIGIN}/invite?code=${code}` : `${SITE_ORIGIN}/invite`;

  return {
    title: invite.metaTitle,
    description: invite.metaDescription,
    robots: { index: false, follow: false },
    other: {
      'apple-itunes-app': `app-id=${APPLE_APP_ID}, app-argument=${canonical}`,
    },
  };
}

export default async function InvitePage({ searchParams }: Props) {
  const [lang, params] = await Promise.all([pickLanguage(), searchParams]);
  const code = sanitiseCode(params.code);
  const { invite, download } = copyFor(lang);
  const playUrl = playUrlFor(code);

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-pink-500/30 blur-3xl" />
      </div>

      {/* The page only loads on iOS when the app is NOT installed (the universal link
          would otherwise have opened it), so go straight to the store. */}
      <Script id="invite-store-redirect" strategy="afterInteractive">
        {`
          (function () {
            if (window.__lcInviteRedirected) return;
            window.__lcInviteRedirected = true;
            var ua = navigator.userAgent || '';
            var isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
            var isIPhone = /iPhone|iPod/i.test(ua) && !isIPad;
            var isAndroid = /Android/i.test(ua);
            if (isIPhone || isIPad) {
              window.location.replace(${JSON.stringify(APP_STORE_URL)});
            } else if (isAndroid) {
              window.location.replace(${JSON.stringify(playUrl)});
            }
          })();
        `}
      </Script>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center px-6 py-16 text-center">
        <a href="/" className="mb-10 text-2xl font-bold tracking-tight text-white/90">
          LinClone
        </a>

        <h1 className="main-title text-balance mb-4">{invite.title}</h1>
        <p className="mb-8 max-w-xl text-base sm:text-lg text-white/80 text-balance">{invite.subtitle}</p>

        {code ? (
          <InviteCode
            code={code}
            label={invite.codeLabel}
            copyLabel={invite.copy}
            copiedLabel={invite.copied}
          />
        ) : (
          <div className="w-full max-w-md rounded-3xl border border-yellow-200/30 bg-yellow-200/10 px-6 py-5 text-sm text-yellow-100">
            {invite.noCode}
          </div>
        )}

        <p className="mt-6 max-w-xl text-sm sm:text-base text-white/80">{invite.steps}</p>

        <div className="mt-10 flex w-full flex-col items-stretch gap-4 sm:w-auto sm:flex-row sm:justify-center">
          <a
            href={APP_STORE_URL}
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-2xl border border-gray-600 bg-black/80 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black"
          >
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-75">{download.appStoreTop}</div>
                <div className="text-lg font-semibold">{download.appStoreBottom}</div>
              </div>
            </div>
          </a>

          <a
            href={playUrl}
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-2xl border border-gray-600 bg-black/80 px-6 py-3 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black"
          >
            <div className="flex items-center space-x-4">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              <div className="text-left">
                <div className="text-xs opacity-75">{download.playStoreTop}</div>
                <div className="text-lg font-semibold">{download.playStoreBottom}</div>
              </div>
            </div>
          </a>
        </div>

        <p className="mt-8 text-sm text-white/60">{invite.phoneHint}</p>
      </div>
    </main>
  );
}
