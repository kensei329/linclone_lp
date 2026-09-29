import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import { BrandRow, GoogleG, Mark, cx } from './parts';

/**
 * F20 `GuestGate02` (spec §7.1): the guest sign-in gate (V3 02). Apple and
 * Google only, plus the 「パスワードは不要です」 chip. Night reel behind a cream sheet.
 */
export function GuestGate02({ d, persona = 'oshi', className }: MockProps) {
  const t = d.mock.fan.gate;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-gate', className)} data-mock="GuestGate02">
        <div className="fm-fill-aura fm-gate-bg">
          <Aura persona={persona} shape="reel" theme="night" voiceprint={false} />
        </div>
        <span className="fm-gate-dim" />
        <BrandRow brand={d.common.brand} top={64} />

        <div className="fm-gate-sheet">
          <span className="fm-gate-grab" />
          <div className="fm-gate-head">
            <Mark size={40} tone="color" />
            <span>
              <span className="fm-gate-title">{t.title}</span>
              <span className="fm-gate-sub">{t.sub}</span>
            </span>
          </div>
          <span className="fm-signin" data-kind="apple">
            <Icon name="apple" size={20} />
            {t.apple}
          </span>
          <span className="fm-signin" data-kind="google">
            <GoogleG />
            {t.google}
          </span>
          <span className="fm-nopw">
            <Icon name="key" size={15} />
            {t.noPassword}
          </span>
          <span className="fm-gate-foot">{d.common.disclosure}</span>
        </div>
      </div>
    </Screen>
  );
}
