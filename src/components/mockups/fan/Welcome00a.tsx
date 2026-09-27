import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import { BrandRow, Lines, cx } from './parts';

/**
 * F18 `Welcome00a` (spec §7.1): the tutorial welcome (V3 00a), night. The
 * photo becomes the 推し色 aura reel and `videocam` becomes `podcasts`.
 * The copy stack is bottom-anchored so it always fits the crop {y:500,h:344}.
 */
export function Welcome00a({ d, persona = 'oshi', className }: MockProps) {
  const t = d.mock.fan.welcome;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-wel', className)} data-mock="Welcome00a">
        <div className="fm-fill-aura">
          <Aura persona={persona} shape="reel" theme="night" />
        </div>
        <span className="fm-photo-fade fm-wel-fade" />
        <BrandRow brand={d.common.brand} top={64} />

        <div className="fm-wel-stack">
          <span className="fm-dots">
            <i data-on="" />
            <i />
            <i />
          </span>
          <div className="fm-wel-title">
            <Lines text={t.title} />
          </div>
          <div className="fm-wel-sub">
            <Lines text={t.sub} />
          </div>
          <div className="fm-wel-values">
            <span>
              <Icon name="call" filled size={18} className="fm-v-call" />
              {t.valueCalls}
            </span>
            <span>
              <Icon name="forum" filled size={18} className="fm-v-chat" />
              {t.valueChat}
            </span>
            <span>
              <Icon name="podcasts" filled size={18} className="fm-v-live" />
              {t.valueLive}
            </span>
          </div>
          <div className="fm-wel-cta">
            {t.getStarted}
            <Icon name="arrow_forward" size={20} />
          </div>
          <div className="fm-foot fm-wel-foot">{t.footnote}</div>
        </div>
      </div>
    </Screen>
  );
}
