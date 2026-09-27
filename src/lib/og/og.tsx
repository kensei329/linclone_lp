import 'server-only';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ReactNode } from 'react';
import { loadDefaultJapaneseParser } from 'budoux';
import type { Locale } from '@/i18n/config';

// Shared pieces of the Open Graph images (spec §8.2). Rendered by Satori at
// build time; fonts are the committed subsets from scripts/build-og-fonts.mjs.

export const OG_SIZE = { width: 1200, height: 630 };
export const INK = '#28273b';
export const INK_2 = '#5b5970';

const FONT_DIR = join(process.cwd(), 'src/lib/og/fonts');

type OgFont = { name: string; data: Buffer; weight: 500 | 800; style: 'normal' };

/** Latin first (Plus Jakarta Sans), Japanese second: Satori falls back glyph by glyph. */
export async function ogFonts(): Promise<OgFont[]> {
  const load = (f: string) => readFile(join(FONT_DIR, f));
  const [p8, p5, n8, n5] = await Promise.all([
    load('PlusJakartaSans-800.ttf'),
    load('PlusJakartaSans-500.ttf'),
    load('NotoSansJP-800.ttf'),
    load('NotoSansJP-500.ttf'),
  ]);
  return [
    { name: 'PJS', data: p8, weight: 800, style: 'normal' },
    { name: 'PJS', data: p5, weight: 500, style: 'normal' },
    { name: 'NotoJP', data: n8, weight: 800, style: 'normal' },
    { name: 'NotoJP', data: n5, weight: 500, style: 'normal' },
  ];
}
export const FAMILY = 'PJS, NotoJP';

export async function brandMark(): Promise<string> {
  const mark = await readFile(join(process.cwd(), 'public/brand/mark-256.png'));
  return `data:image/png;base64,${mark.toString('base64')}`;
}

let jaParser: ReturnType<typeof loadDefaultJapaneseParser> | null = null;

/**
 * Text that wraps only between phrases (BudouX for JA, words for EN): each
 * unit is a no-wrap flex item, as Satori has no `word-break: auto-phrase`.
 * JA `lines` mode also starts a new row after each 、 (「推しと、／声で話そう」).
 * EN trailing punctuation is pulled in, as on the site (Plus Jakarta Sans 800
 * sets a wide right bearing on "l", "d", "t" before a period).
 */
export function Phrases({
  text,
  lang,
  style,
  lines = false,
}: {
  text: string;
  lang: Locale;
  style: Record<string, string | number>;
  lines?: boolean;
}): ReactNode {
  const rows = lang === 'ja' && lines ? text.split(/(?<=、)/) : [text];
  const unitsOf = (row: string) => (lang === 'ja' ? (jaParser ??= loadDefaultJapaneseParser()).parse(row) : row.split(/\s+/).filter(Boolean));
  const unit = (u: string, last: boolean, key: number) => {
    if (lang === 'ja') return <span key={key}>{u}</span>;
    const m = u.match(/^(.*?)([.,!?]+)$/);
    return (
      <span key={key} style={{ display: 'flex', whiteSpace: 'pre' }}>
        {m ? m[1] : u}
        {m ? <span style={{ marginLeft: '-0.1em' }}>{m[2]}</span> : null}
        {last ? '' : ' '}
      </span>
    );
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {rows.map((row, r) => {
        const units = unitsOf(row);
        return (
          <div key={r} style={{ display: 'flex', flexWrap: 'wrap' }}>
            {units.map((u, i) => unit(u, i === units.length - 1, i))}
          </div>
        );
      })}
    </div>
  );
}

/** First sentence of a lead (up to and including the first 。/.). */
export function firstSentence(text: string): string {
  const m = text.match(/^.*?[。.!?！？](?=\s|$|[^\s])/u);
  return (m ? m[0] : text).trim();
}

/** Faceless aura "can badge": a メンカラ radial field in a story-gradient ring, white monogram. */
export function AuraBadge({ size, color, tint, deep, monogram }: { size: number; color: string; tint: string; deep: string; monogram: string }) {
  return (
    <div
      style={{
        display: 'flex',
        width: size,
        height: size,
        padding: 6,
        borderRadius: size,
        backgroundImage: 'linear-gradient(135deg, #a97fe0, #e14b81, #e8a33d)',
        boxShadow: '0 24px 60px rgba(60,55,90,.18)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: size,
          border: '4px solid #fbf7f0',
          backgroundImage: `radial-gradient(circle at 35% 30%, ${tint} 0%, ${color} 50%, ${deep} 100%)`,
          color: 'rgba(255,255,255,.92)',
          fontFamily: 'PJS',
          fontWeight: 800,
          fontSize: Math.round(size * 0.36),
        }}
      >
        {monogram}
      </div>
    </div>
  );
}
