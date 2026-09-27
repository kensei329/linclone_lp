import type { MockProps } from '@/components/mockups/types';
import { MockChip, Screen, Toggle } from '@/components/mockups/kit';
import { Aura, Icon, Scene } from '@/components/site';
import { Card, ScreenHeader, StepDots, cx, personaOf } from './parts';

const BGS = ['rain-neon', 'night-sea', 'cafe-light', 'stage-light'] as const;

/**
 * F12 `LiveSetup13` (spec §7.1): request a LIVE show, step one (V3 13), cream.
 * No length options (30分/3分) and no ticket info.
 * Hook: `[data-m="topic"]` (the topic text; animators retype it).
 */
export function LiveSetup13({ d, persona = 'kai', className }: MockProps) {
  const p = personaOf(d, persona);
  const t = d.mock.fan.liveSetup;
  return (
    <Screen theme="cream">
      <div className={cx('fm-root fm-setup', className)} data-mock="LiveSetup13">
        <ScreenHeader title={t.title} right={<StepDots active={0} />} />

        <div className="fm-label fm-setup-lbl" style={{ top: 126 }}>
          {t.hostLabel}
        </div>
        <Card radius={16} className="fm-setup-host">
          <span className="fm-setup-host-av">
            <Aura persona={persona} shape="avatar" size={44} />
          </span>
          <span className="fm-setup-host-name">{p.name}</span>
          <MockChip label={t.hostRole} tone="teal" />
        </Card>

        <div className="fm-label fm-setup-lbl" style={{ top: 232 }}>
          {t.topicLabel}
        </div>
        <div className="fm-setup-topic">
          <span data-m="topic">{t.topicValue}</span>
          <span className="fm-caret" />
        </div>

        <Card radius={16} className="fm-setup-comments">
          <span className="fm-setup-ctxt">
            <span className="fm-setup-ctitle">{t.commentsLabel}</span>
            <span className="fm-setup-csub">{t.commentsSub}</span>
          </span>
          <Toggle on tone="cyan" />
        </Card>

        <div className="fm-label fm-setup-lbl" style={{ top: 480 }}>
          {t.bgLabel}
        </div>
        <div className="fm-setup-bgs">
          {BGS.map((k, i) => (
            <span key={k} className="fm-setup-bg" data-selected={i === 0 ? '' : undefined}>
              <Scene kind={k} />
              {i === 0 ? (
                <span className="fm-setup-bg-check">
                  <Icon name="check" size={14} />
                </span>
              ) : null}
            </span>
          ))}
        </div>

        <div className="fm-pill-cta" style={{ top: 760 }}>
          {t.next}
          <Icon name="arrow_forward" size={20} />
        </div>
      </div>
    </Screen>
  );
}
