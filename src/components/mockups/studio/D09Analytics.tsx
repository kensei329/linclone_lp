import type { CSSProperties } from 'react';
import type { MockProps } from '@/components/mockups/types';
import { Screen, Segmented, TabBarStudio } from '@/components/mockups/kit';
import { Icon } from '@/components/site';
import { cx, FigureBlank, ScreenHeader } from './parts';
import s from './studio.module.css';

const METRICS = ['chats', 'images', 'voices', 'callTime', 'coins', 'live'] as const;
/** Relative bar heights (spec §7.2 S18); shapes only, no values or axis. */
const BARS = [42, 58, 47, 71, 64, 88, 100];
const DAYS = { ja: ['月', '火', '水', '木', '金', '土', '日'], en: ['M', 'T', 'W', 'T', 'F', 'S', 'S'] };
/** Top rows: gold / silver / bronze icons (no rank numerals), fictional handles, plan badges, no amounts. */
const TOP = [
  { handle: '@momo_pk', color: '#e8a33d', plan: 'super' },
  { handle: '@yuki_nn', color: '#b7b5c6', plan: 'premium' },
  { handle: '@tomo_ko', color: '#c8864b', plan: 'basic' },
] as const;

/**
 * S18 `D09Analytics` (spec §7.2, source d09-analytics, edited): range
 * segmented, a 3×2 metric grid with value PLACEHOLDER shapes, the weekly
 * chart (7 `[data-bar]`, SSR full height; the `#insights` micro runs scaleY
 * 0→1, origin bottom, already set), top followers without amounts, and the
 * privacy line. No values, axis values, subscribers or coin amounts.
 */
export function D09Analytics({ d, lang, className }: MockProps) {
  const a = d.mock.studio.analytics;
  const plans = d.home.more.tiles.plans.cards;
  return (
    <Screen theme="cream">
      <div className={cx(s.scr, s.withTabs, className)} data-mock="D09Analytics">
        <ScreenHeader title={a.title} />
        <div className={s.anBody}>
          <span className={s.rangeRow}>
            <Segmented items={[a.ranges.d7, a.ranges.d30, a.ranges.d90]} active={0} />
          </span>
          <div className={s.metrics}>
            {METRICS.map((m) => (
              <div key={m} className={cx(s.gcard, s.metric, m === 'coins' && s.metricAccent)}>
                <span className={s.metricLabel}>{a.metrics[m]}</span>
                <FigureBlank w={40} h={12} />
              </div>
            ))}
          </div>
          <div className={cx(s.gcard, s.chartCard)}>
            <span className={s.label12}>{a.chartTitle}</span>
            <div className={s.chart}>
              {BARS.map((v, i) => (
                <span key={i} className={s.barCol}>
                  <span className={s.bar} data-bar="" style={{ height: `calc(${v}% - 16px)` } as CSSProperties} />
                  <span className={s.day}>{DAYS[lang][i]}</span>
                </span>
              ))}
            </div>
          </div>
          <div className={cx(s.gcard, s.topCard)}>
            <div className={s.topHead}>
              <span className={s.label12}>{a.topTitle}</span>
              <span className={s.topNote}>{a.topNote}</span>
            </div>
            {TOP.map((r) => (
              <div key={r.handle} className={s.topRow}>
                <span className={s.medal} style={{ color: r.color }}>
                  <Icon name="workspace_premium" filled size={20} />
                </span>
                <span className={s.topHandle}>{r.handle}</span>
                <span className={s.planBadge}>{plans[r.plan].name}</span>
              </div>
            ))}
          </div>
          <span className={s.privacy9}>{a.privacy}</span>
        </div>
        <TabBarStudio d={d} active="home" />
      </div>
    </Screen>
  );
}
