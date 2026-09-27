import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  // No `host`: a Yandex-only directive that other crawlers flag as unknown.
  return { rules: [{ userAgent: '*', allow: '/' }], sitemap: `${SITE.origin}/sitemap.xml` };
}
