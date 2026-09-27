import type { CSSProperties } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { Placement } from '@/lib/site-config';
import { getAbsUrl } from '@/lib/store-links';
import { qrSvg } from '@/lib/qr';

type QrBlockProps = { d: Dictionary; lang: Locale; placement: Placement; size?: number; caption?: string };

/**
 * Build-time QR to https://www.linclone.com/get?src=qr_<placement>&lang=<lang>
 * (spec §4.2), inline SVG in a white radius-16 card. Callers pass a `qr_*`
 * placement; a plain placement is prefixed here. `caption=""` hides the caption.
 */
export async function QrBlock({ d, lang, placement, size = 132, caption }: QrBlockProps) {
  const src = (placement.startsWith('qr_') ? placement : `qr_${placement}`) as Placement;
  const svg = await qrSvg(getAbsUrl(src, lang), size);
  return (
    <figure className="qr-block">
      <div role="img" aria-label={d.common.store.qrAlt} className="qr-card" style={{ '--qr': `${size}px` } as CSSProperties} dangerouslySetInnerHTML={{ __html: svg }} />
      {caption === '' ? null : <figcaption className="t-small">{caption ?? d.common.store.qrCaption}</figcaption>}
    </figure>
  );
}
