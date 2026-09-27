import type { ReactNode } from 'react';
import type { MockProps } from '@/components/mockups/types';
import { Aura, Icon, Waveform } from '@/components/site';
import { cx } from './parts';
import s from './studio.module.css';

type SelfCallStageProps = MockProps & { fillSlot?: ReactNode };

/**
 * S11 `SelfCallStage` (spec §6.5, §7.2): the full-viewport night self-call,
 * i.e. the `#check` stage media (`position:absolute; inset:0`). The shipped
 * self-call is "a ring that changes colour, no animation loop".
 *
 * Hooks (SSR = final state, reduced motion / no JS):
 * - `[data-self-ring]`: 4px border `var(--ring, #8b55d6)`; the stage scrubs it
 *   teal `#00b0c2` → `#7df4ff` → violet `#8b55d6` (set `--ring` or
 *   `borderColor`). Its glow follows `--ring` (colour-mix, no filter).
 * - `[data-wave]` (the `Waveform`, `amp="css-var"`): `--amp` 0→1; SSR 1.
 * - `[data-fill]`: wraps `fillSlot` (`creators.check.fill`, rendered by the
 *   section), under the static controls.
 * Layout: the column sits at x 68% on desktop (the intro keeps the left),
 * below `var(--intro-h)` on mobile. No backdrop-filter or blur (it lives in
 * `[data-stage-media]`).
 */
export function SelfCallStage({ d, persona, fillSlot, className }: SelfCallStageProps) {
  const sc = d.mock.studio.selfCall;
  const who = persona && persona !== 'oshi' ? persona : 'aoi';
  return (
    <div className={cx(s.self, className)} data-mock="SelfCallStage" aria-hidden={fillSlot ? undefined : true}>
      <span className={s.selfScene} aria-hidden="true">
        <Aura persona={who} shape="scene-portrait" theme="night" monogram={false} voiceprint={false} />
      </span>
      <span className={s.selfShade} aria-hidden="true" />
      <div className={s.selfCol}>
        <span className={s.selfRing} data-self-ring="" aria-hidden="true">
          <span className={s.selfAvatar}>
            <Aura persona={who} shape="avatar" theme="night" />
          </span>
        </span>
        <span className={s.selfTexts} aria-hidden="true">
          <span className={s.selfLabel}>{sc.label}</span>
          <span className={s.selfName}>{d.personas[who].name}</span>
          <span className={s.selfState}>{sc.state}</span>
        </span>
        <span className={s.selfWave} aria-hidden="true">
          <Waveform tone="neon" amp="css-var" playing bars={14} />
        </span>
        <span className={s.selfControls} aria-hidden="true">
          <span className={s.selfBtn}>
            <Icon name="mic" filled size={24} />
          </span>
          <span className={cx(s.selfBtn, s.selfEnd)}>
            <Icon name="call_end" filled size={26} />
          </span>
          <span className={s.selfBtn}>
            <Icon name="volume_up" filled size={24} />
          </span>
        </span>
        {fillSlot ? (
          <div className={s.selfFill} data-fill="">
            {fillSlot}
          </div>
        ) : null}
      </div>
    </div>
  );
}
