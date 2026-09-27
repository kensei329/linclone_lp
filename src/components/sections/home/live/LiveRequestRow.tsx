import type { SectionProps } from '@/i18n/types';

/** #live-request row (spec §5.7). STUB (WP0a), owned by WP2: replace wholesale. */
export function LiveRequestRow({ d }: SectionProps) {
  const t = d.home.live;
  return (
    <div id="live-request">
      <h3 className="t-h3">{t.requestTitle}</h3>
      <p className="t-body">{t.requestBody}</p>
      <h3 className="t-h3">{t.archiveTitle}</h3>
      <p className="t-body">{t.archiveBody}</p>
    </div>
  );
}
