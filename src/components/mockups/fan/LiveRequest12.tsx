import type { MockProps } from '@/components/mockups/types';
import { Aura, Icon } from '@/components/site';
import type { PersonaId } from '@/lib/personas';
import { Units } from '@/lib/units';
import { cx } from './parts';

const TRIO: (PersonaId | 'oshi')[] = ['kai', 'sora', 'oshi'];

/**
 * F11 `LiveRequest12` (spec §7.1): the LIVE request card (V3 12, wired
 * variant) as a responsive card, not a phone. Numeral-free: the body uses the
 * hedge 「準備ができしだい配信が始まります」; no ticket counts, no "10 minutes".
 */
export function LiveRequest12({ d, lang, className }: MockProps) {
  const t = d.mock.fan.liveRequest;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-card fm-req', className)} data-mock="LiveRequest12">
      <div className="fm-req-inner" aria-hidden="true">
        <div className="fm-req-top">
          <span className="fm-req-disc">
            <Icon name="podcasts" filled size={24} />
          </span>
          <span className="fm-req-trio">
            {TRIO.map((p) => (
              <span key={p} className="fm-req-trio-av">
                <Aura persona={p} shape="avatar" size={36} />
              </span>
            ))}
          </span>
        </div>
        <div className="fm-req-title fm-phr">
          <Units text={t.title} lang={lang} mode="phrase" />
        </div>
        <div className="fm-req-body">{t.body}</div>
        <div className="fm-req-cta">
          <Icon name="podcasts" filled size={20} />
          {t.cta}
        </div>
      </div>
    </figure>
  );
}
