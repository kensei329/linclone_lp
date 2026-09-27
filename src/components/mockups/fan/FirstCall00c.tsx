import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Aura, CallGlow, Icon } from '@/components/site';
import { fmt } from '@/i18n/format';
import { BrandRow, CallBackdrop, cx, personaOf, vars } from './parts';

/**
 * F1 `FirstCall00c` (spec §7.1): the free 60-second first call (V3 00c).
 * Night screen. Hooks: `[data-avatar-glow]` (breathing loop), `[data-meter]`
 * (the `0:60` value text; animators rewrite its textContent), `[data-m="cta"]`
 * (soft pulse loop). Loops only run while the host section is `.is-inview`.
 * Removed from the design: the coin reward line and the version string.
 */
export function FirstCall00c({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.firstCall;
  return (
    <Screen theme="night">
      <div className={cx('fm-root fm-first', className)} data-mock="FirstCall00c" style={vars({ '--pc': p.color })}>
        <CallBackdrop>
          <Aura persona={persona} shape="scene-portrait" theme="night" monogram={false} voiceprint={false} />
        </CallBackdrop>

        <BrandRow brand={d.common.brand} top={64} right={<span className="fm-first-later">{t.later}</span>} />

        <div className="fm-first-portrait">
          <CallGlow variant="avatar" size={475} state="breathe" />
          <span className="fm-portrait-ring">
            <Aura persona={persona} shape="avatar" size={190} theme="night" />
          </span>
        </div>

        <div className="fm-first-name">{p.name}</div>
        <div className="fm-first-sub">{t.sub}</div>

        <div className="fm-meter glass-night fm-first-meter">
          <span className="fm-meter-label">{t.freeLabel}</span>
          <span className="fm-meter-value" data-meter="">
            0:60
          </span>
        </div>

        <div className="fm-first-cta" data-m="cta" data-loop="">
          <Icon name="call" filled size={20} />
          <span>{fmt(t.tapToTalk, { name: p.name })}</span>
        </div>

        <div className="fm-foot fm-first-foot">{d.common.disclosure}</div>
      </div>
    </Screen>
  );
}
