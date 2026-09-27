import type { MetadataRoute } from 'next';
import { SITE, SITE_LAST_MODIFIED } from '@/lib/site-config';

// Marketing pages with reciprocal hreflang, plus the public legal pages
// (spec §8.4). /invite, /share/*, /get and /delete-user are deliberately absent.
export default function sitemap(): MetadataRoute.Sitemap {
  const O = SITE.origin;
  const UPDATED = new Date(SITE_LAST_MODIFIED);
  const pages = [
    { ja: '/', en: '/en' },
    { ja: '/creators', en: '/en/creators' },
  ];
  const marketing = pages.flatMap((p) => {
    const alternates = { languages: { ja: O + p.ja, en: O + p.en, 'x-default': O + p.ja } };
    return [
      { url: O + p.ja, lastModified: UPDATED, alternates },
      { url: O + p.en, lastModified: UPDATED, alternates },
    ];
  });
  const legal = ['/privacy', '/terms', '/cookies', '/support', '/policies/child-protection-policy'].map((p) => ({ url: O + p }));
  return [...marketing, ...legal];
}
