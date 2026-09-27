import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '@/styles/site.css';
import { fontVariables } from '@/lib/fonts';
import { LOCALES, isLocale } from '@/i18n/config';
import { SmoothScroll } from '@/lib/motion/smooth-scroll';
import { InViewObserver } from '@/components/site/InViewObserver.client';

// Root layout #2 for the marketing pages (spec §2.2, §8.1). Fully static:
// no cookies()/headers(); the locale comes from the [lang] segment only.

export const metadata: Metadata = {
  metadataBase: new URL('https://www.linclone.com'),
  applicationName: 'LinClone',
  title: { default: 'LinClone', template: '%s | LinClone' },
  formatDetection: { telephone: false, email: false, address: false },
  twitter: { card: 'summary_large_image' },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION }, // optional
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f3ec' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1018' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}
export const dynamicParams = false;

// Head script (spec §4.6): sets data-js, data-platform, data-inapp,
// data-ios-safari, data-lite and the saved --oshi before first paint.
const HEAD_SCRIPT = `(function(){try{var d=document.documentElement,n=navigator,u=n.userAgent||'',c=n.connection||{};
var ios=/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&n.maxTouchPoints>1);var and=/Android/.test(u);
d.dataset.platform=ios?'ios':and?'android':'desktop';d.dataset.js='';
var inApp=/Line\\/|Instagram|FBAN|FBAV|Twitter|TikTok|musical_ly|Bytedance/i.test(u);if(inApp)d.dataset.inapp='';
if(ios&&!inApp&&/Safari/.test(u)&&!/CriOS|FxiOS|EdgiOS|OPiOS/.test(u))d.dataset.iosSafari='';
if((n.deviceMemory&&n.deviceMemory<=4)||(n.hardwareConcurrency&&n.hardwareConcurrency<=4)||c.saveData)d.dataset.lite='';
var o=null;try{o=localStorage.getItem('lc.oshi')}catch(e){}if(o&&/^#[0-9a-f]{6}$/i.test(o))d.style.setProperty('--oshi',o);
}catch(e){}})();`;

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // WP0b: ReactDOM.preload of the JA headline subset goes here once it exists (lang === 'ja' only).
  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body>
        {children}
        <InViewObserver />
        <SmoothScroll />
      </body>
    </html>
  );
}
