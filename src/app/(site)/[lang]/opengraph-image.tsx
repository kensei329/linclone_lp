import { ImageResponse } from 'next/og';
import { getDictionary } from '@/i18n/get-dictionary';
import { isLocale, type Locale } from '@/i18n/config';
import { OG_SIZE, INK, INK_2, FAMILY, ogFonts, brandMark, Phrases, firstSentence, AuraBadge } from '@/lib/og/og';

// Fan home OG image (spec §8.2): per-locale headline, the free-minute chip,
// three faceless aura badges and the AI-clone disclosure. Static at build.

export const size = OG_SIZE;
export const contentType = 'image/png';

/** Per-locale alt text (a static `alt` export cannot vary by locale). */
export async function generateImageMetadata({ params }: { params: { lang: string } }) {
  const lang: Locale = isLocale(params.lang) ? params.lang : 'ja';
  return [{ id: 'card', alt: getDictionary(lang).meta.home.ogImageAlt, size: OG_SIZE, contentType }];
}

// Persona メンカラ (lib/personas: yuzu, kai, sora); tint and deep are Aura's
// cream-theme mixes (70% with white, 55% with #fbf7f0).
const BADGES = [
  { size: 220, color: '#e14b81', tint: '#ea81a7', deep: '#ed98b3', monogram: 'Y', x: 830, y: 70 },
  { size: 180, color: '#f0a53a', tint: '#f5c075', deep: '#f5ca8c', monogram: 'K', x: 960, y: 290 },
  { size: 150, color: '#5b8def', tint: '#8caff4', deep: '#a3bdef', monogram: 'S', x: 790, y: 340 },
];

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: raw } = await params;
  const lang: Locale = isLocale(raw) ? raw : 'ja';
  const d = getDictionary(lang);
  const [fonts, mark] = await Promise.all([ogFonts(), brandMark()]);
  const ja = lang === 'ja';
  return new ImageResponse(
    (
      <div style={{ position: 'relative', display: 'flex', width: '100%', height: '100%', fontFamily: FAMILY, color: INK, backgroundImage: 'linear-gradient(180deg, #fbf7f0, #f7f3ec)' }}>
        {/* soft dawn (bottom right) and morning teal (top left) washes; solid stops, as Satori mis-blends transparent ones */}
        <div style={{ position: 'absolute', left: 560, top: 250, width: 900, height: 700, backgroundImage: 'radial-gradient(circle, #fde9bf 0%, #fbeee6 35%, #f8f4ed 62%)' }} />
        <div style={{ position: 'absolute', left: -300, top: -330, width: 800, height: 700, backgroundImage: 'radial-gradient(circle, #d8f2f5 0%, #e9f4f1 35%, #fbf7f0 65%)' }} />
        {BADGES.map((b) => (
          <div key={b.monogram} style={{ position: 'absolute', left: b.x, top: b.y, display: 'flex' }}>
            <AuraBadge {...b} />
          </div>
        ))}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: 720, padding: '48px 0 0 72px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative image inside the OG render */}
            <img src={mark} width={56} height={56} />
            <span style={{ fontFamily: 'PJS', fontWeight: 800, fontSize: 38, letterSpacing: 1 }}>{d.common.brand}</span>
          </div>
          <Phrases
            text={d.home.hero.title}
            lang={lang}
            lines
            style={{ marginTop: 30, fontWeight: 800, fontSize: ja ? 84 : 72, lineHeight: ja ? 1.2 : 1.02, letterSpacing: ja ? 0 : -2.2 }}
          />
          <Phrases text={firstSentence(d.home.hero.lead)} lang={lang} style={{ marginTop: 20, fontWeight: 500, fontSize: 27, lineHeight: 1.45, color: INK_2, maxWidth: 630 }} />
          <div style={{ display: 'flex', marginTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', height: 56, padding: '0 26px', borderRadius: 56, background: '#d8f2f5', color: '#00636e', fontWeight: 800, fontSize: 26 }}>
              {d.common.friction.first60}
            </div>
          </div>
        </div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', height: 64, padding: '0 72px', background: 'rgba(255,255,255,.62)', borderTop: '1px solid rgba(40,39,59,.08)', fontWeight: 500, fontSize: 20, color: INK_2 }}>
          {d.common.disclosure}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
