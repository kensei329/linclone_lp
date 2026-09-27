import type { MockProps } from '@/components/mockups/types';
import { Toggle } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx } from '../parts';

/**
 * F21 `SleepMini` (spec §7.1): mute notifications while asleep; the morning
 * call still comes through. Hooks: `[data-toggle]` (SSR on), `[data-m="moon"]`,
 * `[data-m="sticker"]` (rotated 4°).
 */
export function SleepMini({ d, className }: MockProps) {
  const t = d.mock.fan.sleep;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-sm', className)} data-mock="SleepMini">
      <div className="fm-mini-in" aria-hidden="true">
        <span className="fm-sm-title">{t.title}</span>
        <div className="fm-sm-row">
          <span className="fm-sm-moon" data-m="moon">
            <Icon name="bedtime" filled size={20} />
          </span>
          <span className="fm-sm-txt">
            <span className="fm-sm-row-t">{t.row}</span>
            <span className="fm-sm-row-s">{t.sub}</span>
          </span>
          <Toggle on tone="cyan" />
        </div>
        <span className="fm-sm-sticker glass-fake" data-m="sticker">
          <span className="fm-sm-sticker-ico">
            <Icon name="alarm_on" filled size={14} />
          </span>
          {t.morningStill}
        </span>
      </div>
    </figure>
  );
}
