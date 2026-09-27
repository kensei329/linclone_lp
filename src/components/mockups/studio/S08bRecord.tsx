import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { BackButton, cx } from './parts';
import s from './studio.module.css';

/**
 * S9 `S08bRecord` (spec §7.2): record in app. A 118px cyan orb with a white
 * mic (`data-m="orb"`, CSS pulse .96↔1.06, in view only), the SG timer
 * `[data-m="clock"]` at 0:24 (a timer, allowed), the meter
 * `[data-m="meter"]` at `scaleX(.6)` with a pink marker line (no label), the
 * gold ★ chip, the hint and the recording pill. No "30:00", no BGM /
 * single-speaker checks. Crop `{y:100,h:560}`.
 */
export function S08bRecord({ d, className }: MockProps) {
  const r = d.mock.studio.record;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.bgCyan, className)} data-mock="S08bRecord">
        <div className={s.hdr}>
          <BackButton />
          <div className={s.hdrText}>
            <span className={s.hdrTitle}>{r.title}</span>
          </div>
        </div>
        <div className={s.record}>
          <span className={s.goldChip}>
            <Icon name="star" filled size={13} />
            {r.chip}
          </span>
          <span className={s.orbWrap}>
            <span className={s.orbGlow} />
            <span className={s.ripple} data-loop="" />
            <span className={s.ripple} data-loop="" />
            <span className={s.orb} data-m="orb" data-loop="">
              <Icon name="mic" filled size={46} />
            </span>
          </span>
          <span className={s.clock} data-m="clock">
            0:24
          </span>
          <span className={s.meter}>
            <span className={s.meterFill} data-m="meter" />
            <span className={s.meterMark} />
          </span>
          <span className={s.recPill}>
            <span className={s.recDot} data-loop="" />
            {r.recording}
          </span>
          <div className={cx(s.tintGold, s.recHint)}>
            <Icon name="info" filled size={16} />
            <span className={s.tintText}>{r.hint}</span>
          </div>
        </div>
      </div>
    </Screen>
  );
}
