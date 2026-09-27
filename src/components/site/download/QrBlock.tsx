import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import type { Placement } from '@/lib/site-config';
import { getAbsUrl } from '@/lib/store-links';
import { qrSvg } from '@/lib/qr';

type QrBlockProps = { d: Dictionary; lang: Locale; placement: Placement; size?: number; caption?: string };

/**
 * Build-time QR to /get?src=qr_<placement>&lang=<lang> (spec §4.2). Callers
 * pass a `qr_*` placement; a plain placement is prefixed here.
 */
export async function QrBlock({ d, lang, placement, size = 132, caption }: QrBlockProps) {
  const src = (placement.startsWith('qr_') ? placement : `qr_${placement}`) as Placement;
  const svg = await qrSvg(getAbsUrl(src, lang), size);
  return (
    <figure className="qr-block">
      <div role="img" aria-label={d.common.store.qrAlt} className="rounded-2xl bg-white p-2.5" dangerouslySetInnerHTML={{ __html: svg }} />
      <figcaption className="t-small">{caption ?? d.common.store.qrCaption}</figcaption>
    </figure>
  );
}
