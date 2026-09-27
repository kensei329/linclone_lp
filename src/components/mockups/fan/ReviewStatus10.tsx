import type { MockProps } from '@/components/mockups/types';
import { Screen, TabBarFan } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { Bar, Card, ScreenHeader, cx } from './parts';

const PROHIBITED = ['politics', 'religion', 'family', 'address', 'unannounced', 'sexual'] as const;

/**
 * F17 `ReviewStatus10` (spec §7.1): a Grow submission under review (V3 10).
 * No coin cost, no vote counts, and the 10b community vote is never built.
 * Hook: `[data-status]` pill, `data-state` = ai | community | approved (SSR
 * `approved`); CSS colours it per state (gold / purple / teal + check) and the
 * grow animator swaps its single text node between the three status labels.
 */
export function ReviewStatus10({ d, className }: MockProps) {
  const t = d.mock.fan.growReview;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-rev', className)} data-mock="ReviewStatus10">
        <ScreenHeader title={t.title} />

        <Card radius={18} className="fm-rev-card">
          <span className="fm-rev-status" data-status="" data-state="approved">
            <span className="fm-rev-ico" data-ico="ai">
              <Icon name="auto_awesome" filled size={13} />
            </span>
            <span className="fm-rev-ico" data-ico="community">
              <Icon name="groups" filled size={14} />
            </span>
            <span className="fm-rev-ico" data-ico="approved">
              <Icon name="check_circle" filled size={14} />
            </span>
            <span className="fm-rev-txt">{t.statusApproved}</span>
          </span>
          <span className="fm-rev-fact">{t.fact}</span>
          <span className="fm-rev-src">
            <span className="fm-label">{t.source}</span>
            <Bar w="72%" h={10} />
          </span>
        </Card>

        <div className="fm-rev-note">
          <Icon name="auto_awesome" filled size={16} />
          {t.note}
        </div>

        <div className="fm-label fm-rev-lbl">{t.prohibitedTitle}</div>
        <div className="fm-rev-chips">
          {PROHIBITED.map((k) => (
            <span key={k} className="fm-rev-chip">
              <Icon name="block" size={13} />
              {t.prohibited[k]}
            </span>
          ))}
        </div>
        <TabBarFan d={d} active="grow" />
      </div>
    </Screen>
  );
}
