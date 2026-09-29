import type { MockProps } from '@/components/mockups/types';
import { MockChip, Screen, TabBarFan, VerifiedMark } from '@/components/mockups/kit';
import { Aura, Icon } from '@/components/site';
import { fmt } from '@/i18n/format';
import { RoundIcon, cx, personaOf } from './parts';

const ROWS = ['drink', 'hobby', 'style'] as const;

/**
 * F16 `CreatorProfile08` (spec §7.1): the public creator profile (V3 08) with
 * new fictional facts for Sora. No follower count, no "+N" counts.
 * Hook: `[data-m="new-row"]` (the `season` row, visible in SSR).
 */
export function CreatorProfile08({ d, persona = 'sora', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.growProfile;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-prof', className)} data-mock="CreatorProfile08">
        <div className="fm-prof-hero">
          <span className="fm-fill-aura">
            <Aura persona={persona} shape="card" voiceprint={false} />
          </span>
          <span className="fm-prof-scrim" />
          <span className="fm-prof-back">
            <RoundIcon icon="arrow_back" theme="night" />
          </span>
          <span className="fm-prof-id">
            <span className="fm-prof-name">
              {p.name}
              <VerifiedMark size={20} />
            </span>
            <span className="fm-prof-genre">{p.genre}</span>
          </span>
          <span className="fm-prof-follow">
            <Icon name="check" size={18} />
          </span>
        </div>

        <div className="fm-prof-body">
          <div className="glass-mock fm-prof-sheet" data-tone="light">
            <span className="fm-label fm-prof-sheet-h">{t.factSheet}</span>
            {ROWS.map((k) => (
              <span key={k} className="fm-prof-row">
                <span className="fm-prof-row-lbl">{t.rows[k].label}</span>
                <span className="fm-prof-row-val">
                  {t.rows[k].value}
                  {k === 'style' ? (
                    <span className="fm-prof-by">
                      <MockChip label={t.creatorBadge} tone="teal" />
                      <span className="fm-prof-byline">
                        <VerifiedMark size={12} />
                        {fmt(t.addedByCreator, { name: p.name })}
                      </span>
                    </span>
                  ) : null}
                </span>
              </span>
            ))}
            <span className="fm-prof-row" data-m="new-row" data-new="">
              <span className="fm-prof-row-lbl">{t.rows.season.label}</span>
              <span className="fm-prof-row-val">{t.rows.season.value}</span>
            </span>
          </div>

          <div className="fm-pill-cta">
            <Icon name="psychiatry" filled size={20} />
            {t.cta}
          </div>
        </div>
        <TabBarFan d={d} active="grow" />
      </div>
    </Screen>
  );
}
