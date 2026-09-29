import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Aura, Icon, Scene } from '@/components/site';
import { cx, personaOf, vars } from './parts';

/**
 * F3 `IncomingRing06b` (spec §7.1): the morning call ringing on a lock screen
 * (V3 06b IncomingCallScreen). Night; hosts pass `statusTime="7:00"`.
 * Hooks: `[data-m="portrait"]` (.98↔1.04 loop), `[data-m="accept"]` (.96↔1.06
 * loop with a ripple). Both are `data-loop`, so they only run in view.
 */
export function IncomingRing06b({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.incoming;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-ring', className)} data-mock="IncomingRing06b" style={vars({ '--pc': p.color })}>
        <Scene kind="dawn-sky" />
        <span className="fm-ring-scrim" />

        <div className="fm-ring-time">7:00</div>
        <div className="fm-ring-day">{t.weekday}</div>

        <div className="fm-ring-kicker">
          <span className="fm-ring-live" />
          {t.kicker}
        </div>
        <div className="fm-ring-portrait" data-m="portrait" data-loop="">
          <Aura persona={persona} shape="avatar" size={148} theme="night" />
        </div>
        <div className="fm-ring-name">{p.name}</div>
        <div className="fm-ring-sub">{t.subtitle}</div>

        <div className="fm-ring-btn" data-kind="decline">
          <span className="fm-ring-disc">
            <Icon name="call" filled size={32} />
          </span>
          <span className="fm-ring-label">{t.decline}</span>
        </div>
        <div className="fm-ring-btn" data-kind="accept">
          <span className="fm-ring-disc" data-m="accept" data-loop="">
            <Icon name="call" filled size={32} />
          </span>
          <span className="fm-ring-label">{t.accept}</span>
        </div>
      </div>
    </Screen>
  );
}
