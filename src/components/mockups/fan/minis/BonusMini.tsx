import type { MockProps } from '@/components/mockups/types';
import { Icon } from '@/components/site';
import { cx } from '../parts';

/**
 * F21 `BonusMini` (spec §7.1): 7 login-bonus tiles with no day numbers or
 * amounts; the last one is today. Hook: `[data-m="day"]` ×7.
 */
export function BonusMini({ d, className }: MockProps) {
  const t = d.mock.fan.bonus;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-bm', className)} data-mock="BonusMini">
      <div className="fm-mini-in" aria-hidden="true">
        <span className="fm-bm-title">{t.title}</span>
        <div className="fm-bm-days">
          {Array.from({ length: 7 }, (_, i) => {
            const today = i === 6;
            return (
              <span key={i} className="fm-bm-day" data-m="day" data-today={today ? '' : undefined}>
                <Icon name={today ? 'redeem' : 'check_circle'} filled={!today} size={18} />
                {today ? <span className="fm-bm-today">{t.today}</span> : null}
              </span>
            );
          })}
        </div>
        <span className="fm-bm-claim">
          <Icon name="redeem" size={16} />
          {t.claim}
        </span>
      </div>
    </figure>
  );
}
