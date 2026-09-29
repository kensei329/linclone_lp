import type { MockProps } from '@/components/mockups/types';
import { Icon, Scene, Waveform } from '@/components/site';
import { cx } from '../parts';

const TABS = ['image', 'stories', 'voice', 'archive'] as const;
const THUMBS = ['cafe-light', 'night-sea', 'autumn-leaves', 'rain-neon', 'dawn-sky', 'stage-light'] as const;

/**
 * F21 `MyPageMini` (spec §7.1): the My Page library (stat grid removed).
 * Hooks: `[data-m="tab"]` ×4 (`data-active` on the current one, SSR image),
 * `[data-m="underline"]` (SSR under the first tab; animators set x + width).
 */
export function MyPageMini({ d, className }: MockProps) {
  const t = d.mock.fan.myPage;
  return (
    <figure role="img" aria-label={t.alt} className={cx('fm-mini fm-mp', className)} data-mock="MyPageMini">
      <div className="fm-mini-in" aria-hidden="true">
        <span className="fm-mp-title">{t.title}</span>
        <div className="fm-mp-tabs">
          {TABS.map((k, i) => (
            <span key={k} className="fm-mp-tab" data-m="tab" data-active={i === 0 ? '' : undefined}>
              {t.tabs[k]}
            </span>
          ))}
          <span className="fm-mp-underline" data-m="underline" />
        </div>
        <div className="fm-mp-grid">
          {THUMBS.map((k) => (
            <span key={k} className="fm-mp-thumb">
              <Scene kind={k} />
            </span>
          ))}
        </div>
        <div className="fm-mp-voice">
          <span className="fm-play-disc fm-mp-play">
            <Icon name="play_arrow" filled size={16} />
          </span>
          <Waveform tone="teal" size="sm" bars={12} />
        </div>
      </div>
    </figure>
  );
}
