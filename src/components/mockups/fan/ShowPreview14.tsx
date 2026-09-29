import type { MockProps } from '@/components/mockups/types';
import { Screen } from '@/components/mockups/kit';
import { Icon, type IconName } from '@/components/site';
import { fmt } from '@/i18n/format';
import { Units } from '@/lib/units';
import { Card, ScreenHeader, StepDots, cx, personaOf } from './parts';

const SEGS = ['s1', 's2', 's3', 's4'] as const;
const FLOW: { key: 'flow1' | 'flow2' | 'flow3'; icon: IconName }[] = [
  { key: 'flow1', icon: 'graphic_eq' },
  { key: 'flow2', icon: 'forum' },
  { key: 'flow3', icon: 'replay' },
];

/**
 * F13 `ShowPreview14` (spec §7.1): the AI-written rundown (V3 14), cream.
 * Removed: "uses one 30-min ticket", "10 minutes" and every segment duration.
 * Hooks: `[data-m="seg"]` ×4 (rundown rows), `[data-m="flow"]` ×3.
 */
export function ShowPreview14({ d, lang, persona = 'kai', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.showPreview;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-show', className)} data-mock="ShowPreview14">
        <ScreenHeader title={t.title} right={<StepDots active={1} />} />

        <Card radius={20} className="fm-show-card">
          <span className="fm-show-glow" />
          <span className="fm-show-kicker">
            <Icon name="podcasts" filled size={14} />
            {d.mock.fan.common.liveBadge}
          </span>
          <span className="fm-show-title fm-phr">
            <Units text={fmt(t.showTitle, { name: p.name })} lang={lang} mode="phrase" />
          </span>
        </Card>

        <div className="fm-label fm-show-lbl" style={{ top: 236 }}>
          {t.rundown}
        </div>
        <ol className="fm-show-segs">
          {SEGS.map((k) => (
            <li key={k} className="fm-show-seg" data-m="seg">
              <span className="fm-show-dot" />
              <span className="fm-show-seg-title">{t.segments[k].title}</span>
              <span className="fm-show-seg-desc">{t.segments[k].desc}</span>
            </li>
          ))}
        </ol>

        <Card radius={18} className="fm-show-flow">
          <span className="fm-label">{t.flowTitle}</span>
          {FLOW.map((f) => (
            <span key={f.key} className="fm-show-flowrow" data-m="flow">
              <span className="fm-show-flowico">
                <Icon name={f.icon} size={18} />
              </span>
              {fmt(t[f.key], { name: p.name })}
            </span>
          ))}
        </Card>

        <div className="fm-pill-cta fm-show-start" style={{ top: 760 }}>
          <Icon name="podcasts" filled size={20} />
          {t.start}
        </div>
      </div>
    </Screen>
  );
}
