import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import { cx, SetupFooter, StepHead } from './parts';
import s from './studio.module.css';

/**
 * S6 `S05Photos` (spec §7.2): three faceless Aura portraits (aoi, 100×178,
 * radius 16, `data-m="photo"`), the first with the メイン badge
 * (`data-m="main"`), a dashed add tile and the guide line. No photos, no
 * counts. Crop `{y:100,h:420}`.
 */
export function S05Photos({ d, className }: MockProps) {
  const p = d.mock.studio.photos;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, className)} data-mock="S05Photos">
        <StepHead d={d} active={2} title={p.title} />
        <div className={s.photos}>
          <div className={s.photoGrid}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={s.photo} data-m="photo">
                <Aura persona="aoi" shape="reel" size={100} monogram={i === 0} voiceprint={i !== 1} />
                {i === 0 ? (
                  <span className={s.mainBadge} data-m="main">
                    {p.main}
                  </span>
                ) : null}
              </span>
            ))}
          </div>
          <span className={s.addTile}>
            <Icon name="add" size={22} />
          </span>
          <span className={s.note10}>{p.guide}</span>
        </div>
        <SetupFooter d={d} />
      </div>
    </Screen>
  );
}
