import type { MockProps } from '@/components/mockups/types';
import { CoinPill, Screen } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { Card, RoundIcon, ScreenHeader, cx, personaOf } from './parts';

const REPEAT = ['once', 'daily', 'weekdays', 'weekends'] as const;

/**
 * F4 `MorningSetup06b` (spec §7.1): morning call setup (V3 06b), cream.
 * Shipped repeat options 1回のみ・毎日・平日・週末; the coin rules card is removed.
 * Hooks: `[data-m="time"]`; `[data-m="sel"][data-sel]` is the selection
 * highlight, a grid overlay that sits on `daily` in SSR (animators translate it
 * from tile to tile; `[data-selected]` marks the SSR tile only);
 * `[data-m="ring-card"]`.
 */
export function MorningSetup06b({ d, persona = 'oshi', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.morningSetup;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-ms', className)} data-mock="MorningSetup06b">
        <ScreenHeader
          title={t.title}
          caption={p.name}
          right={
            <>
              <CoinPill theme="cream" />
              <RoundIcon icon="menu" />
            </>
          }
        />

        <Card radius={16} className="fm-ms-time">
          <span className="fm-ms-clock" data-m="time">
            7:00
          </span>
          <span className="fm-ms-hint">{t.timeHint}</span>
        </Card>

        <div className="fm-label fm-ms-lbl" style={{ top: 250 }}>
          {t.dateLabel}
        </div>
        <Card radius={16} className="fm-ms-date">
          <span className="fm-ms-date-ico">
            <Icon name="calendar_month" filled size={20} />
          </span>
          <span className="fm-ms-date-txt">
            <span className="fm-ms-date-val">{t.dateValue}</span>
            <span className="fm-ms-date-hint">{t.dateHint}</span>
          </span>
          <Icon name="chevron_right" size={20} className="fm-ms-chev" />
        </Card>

        <div className="fm-label fm-ms-lbl" style={{ top: 350 }}>
          {t.repeatLabel}
        </div>
        <div className="fm-ms-grid">
          {REPEAT.map((k) => (
            <span key={k} className="fm-ms-tile" data-repeat={k} data-selected={k === 'daily' ? '' : undefined}>
              <span className="fm-ms-tile-title">{t[k].title}</span>
              <span className="fm-ms-tile-sub">{t[k].sub}</span>
            </span>
          ))}
          <span className="fm-ms-sel" data-m="sel" data-sel="" />
        </div>

        <Card radius={16} className="fm-ms-ringcard" data-m="ring-card">
          <span className="fm-ms-ring-ico">
            <Icon name="notifications_active" filled size={20} />
          </span>
          <span className="fm-ms-ring-txt">
            <span className="fm-ms-ring-title">{t.ringTitle}</span>
            <span className="fm-ms-ring-body">{t.ringBody}</span>
            <span className="fm-ms-ring-link">{t.seeHow}</span>
          </span>
        </Card>

        <div className="fm-pill-cta" style={{ top: 760 }}>
          <Icon name="alarm" filled size={20} />
          {t.cta}
        </div>
      </div>
    </Screen>
  );
}
