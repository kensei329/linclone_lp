import { ImageResponse } from 'next/og';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';
import { OG_SIZE, INK, FAMILY, ogFonts, brandMark, Phrases } from '@/lib/og/og';

// LC Studio OG image (spec §8.2): lockup, headline, the invitation-only pill
// and a violet ring around a faceless aura. No store, price or "free" claims.

export const size = OG_SIZE;
export const contentType = 'image/png';

/** Per-locale alt text (a static `alt` export cannot vary by locale). */
export async function generateImageMetadata({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : 'ja';
  return [{ id: 'card', alt: getDictionary(lang).meta.creators.ogImageAlt, size: OG_SIZE, contentType }];
}

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : 'ja';
  const d = getDictionary(lang);
  const [fonts, mark] = await Promise.all([ogFonts(), brandMark()]);
  const ja = lang === 'ja';
  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', fontFamily: FAMILY, color: INK, backgroundImage: 'radial-gradient(120% 90% at 50% 0%, #f0e6fb, #eceae4 65%)' }}>
        <div style={{ position: 'absolute', left: 790, top: 150, display: 'flex', width: 330, height: 330, padding: 18, borderRadius: 330, background: '#8b55d6', boxShadow: '0 0 60px rgba(139,85,214,.35)' }}>
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 330, border: '6px solid #f2ecfb', backgroundImage: 'radial-gradient(circle at 35% 30%, #ae88e2 0%, #8b55d6 50%, #bd9ee2 100%)', color: 'rgba(255,255,255,.92)', fontFamily: 'PJS', fontWeight: 800, fontSize: 110 }}>
            A
          </div>
        </div>
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: 700, padding: '64px 0 0 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative image inside the OG render */}
            <img src={mark} width={52} height={52} />
            <span style={{ fontFamily: 'PJS', fontWeight: 800, fontSize: 30, letterSpacing: 8 }}>LC STUDIO</span>
          </div>
          <Phrases
            text={d.creators.hero.title}
            lang={lang}
            lines
            style={{ marginTop: 44, fontWeight: 800, fontSize: ja ? 72 : 68, lineHeight: ja ? 1.25 : 1.05, letterSpacing: ja ? 0 : -2 }}
          />
          <div style={{ display: 'flex', marginTop: 34 }}>
            <div style={{ display: 'flex', alignItems: 'center', height: 56, padding: '0 28px', borderRadius: 56, background: '#e5d5ff', color: '#6f3fb8', fontWeight: 800, fontSize: 26 }}>
              {d.meta.creators.ogPill}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
