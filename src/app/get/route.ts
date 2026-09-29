import type { Placement } from '@/lib/site-config';
import { storeUrl } from '@/lib/store-links';

// QR / no-JS download entry point (spec §2.7): redirects by user agent.
// noindex comes from the X-Robots-Tag header in next.config.ts.

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
