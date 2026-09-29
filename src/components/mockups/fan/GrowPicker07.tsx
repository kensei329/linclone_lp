import type { MockProps } from '@/components/mockups/types';
import { CoinPill, Screen, TabBarFan, VerifiedMark } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import type { PersonaId } from '@/lib/personas';
import { cx, personaOf } from './parts';

const GRID: (PersonaId | 'oshi')[] = ['sora', 'oshi', 'kai', 'nagi'];

/**
 * F15 `GrowPicker07` (spec §7.1): choose a creator to grow (V3 07), cream.
 * The search field is removed (its placeholder mentions categories).
 */
export function GrowPicker07({ d, className }: MockProps) {
  const t = d.mock.fan.growPicker;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-pick', className)} data-mock="GrowPicker07">
        <div className="fm-pick-title">{t.title}</div>
        <span className="fm-pick-coin">
          <CoinPill theme="cream" />
        </span>
        <div className="fm-pick-sub">{t.subtitle}</div>
        <div className="fm-pick-grid">
          {GRID.map((id) => {
            const p = personaOf(d, id);
            return (
              <span key={id} className="fm-pick-card">
                <span className="fm-fill-aura">
                  <Aura persona={id} shape="card" voiceprint={false} />
                </span>
                <span className="fm-pick-scrim" />
                <span className="fm-pick-copy">
                  <span className="fm-pick-name">
                    {p.name}
                    <VerifiedMark size={14} />
                  </span>
                  <span className="fm-pick-genre">{p.genre}</span>
                  <span className="fm-pick-cta">
                    <Icon name="auto_awesome" filled size={16} />
                    {t.cta}
                  </span>
                </span>
              </span>
            );
          })}
        </div>
        <TabBarFan d={d} active="grow" />
      </div>
    </Screen>
  );
}
