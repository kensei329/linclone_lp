import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// STUB (WP0a), owned by WP7: brand-only placeholder (no JA text, so no font
// fetch). WP7 replaces it with the §8.2 design and per-locale alt text.

export const alt = 'LC Studio';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  await params;
  const mark = await readFile(join(process.cwd(), 'public/brand/mark-256.png'));
  const src = `data:image/png;base64,${mark.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, background: 'radial-gradient(#f0e6fb, #eceae4)', color: '#28273b', fontSize: 88, fontWeight: 700, letterSpacing: 8 }}>
        {/* eslint-disable-next-line jsx-a11y/alt-text -- decorative image inside the OG render */}
        <img src={src} width={140} height={140} />
        LC STUDIO
      </div>
    ),
    size,
  );
}
