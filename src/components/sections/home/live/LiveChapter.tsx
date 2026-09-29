import type { SectionProps } from '@/i18n/types';
import { Section, Eyebrow, ExpandStage, ScrollFillText, Icon } from '@/components/site';
import { LiveFeedCard } from '@/components/mockups/fan/LiveFeedCard';
import { LivePlayerStage } from '@/components/mockups/fan/LivePlayerStage';
import { Units } from '@/lib/units';
import { LiveRequestRow } from './LiveRequestRow';
import { LiveStageAnimator } from './LiveStageAnimator.client';
import { LiveLoops } from './LiveLoops.client';
import s from './live.module.css';

/**
 * #live: 04 LIVE配信, 今夜は、推しのLIVE配信。 (spec §5.7), stage #2.
 * A night intro (H2 + audio-only chip, a giant outlined "LIVE" behind), then
 * the scroll-expand stage: the LIVE feed card in a phone grows into the
 * full-bleed audio player while the fill line reads, then the request row.
 * Desktop with motion: the intro is a sticky layer over the stage's first
 * frame (copy left, phone right) and fades as the clip opens, so the stage
 * needs no separate intro scroll. SSR / no JS / reduced motion: the intro in
 * flow, then the full-bleed player, fill complete.
 */
export function LiveChapter({ d, lang }: SectionProps) {
  const t = d.home.live;
  return (
    <Section id="live" surface="night" labelledBy="live-title" className={s.section}>
      <div className={s.stageWrap}>
        <div className={s.intro} data-live-intro="">
          <span className={s.glow} aria-hidden="true" />
          <span className={s.giant} aria-hidden="true" data-live-word="">
            LIVE
          </span>
          <div className={`container-site ${s.introInner}`}>
            <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
            <div className={s.titleRow}>
              <h2 id="live-title" className={`t-h2 ${s.title}`}>
                <Units text={t.title} lang={lang} mode="phrase" />
              </h2>
              <p className={s.audioChip}>
                <span className={s.onAir} data-loop="" aria-hidden="true" />
                <Icon name="podcasts" size={16} />
                <span>{t.audioChip}</span>
              </p>
            </div>
            <p className={`t-lead ${s.lead}`}>{t.lead}</p>
          </div>
        </div>

        <ExpandStage
          id="live-stage"
          labelledBy="live-title"
          height={{ mobile: 160, desktop: 180 }}
          direction="expand"
          surfaceStart="night"
          phone={{
            desktop: { side: 'right', width: 320 },
            mobile: { width: 'min(74vw, 290px)', top: '96px' },
            radius: { desktop: 44, mobile: 36 },
          }}
          intro={
            <>
              <LiveStageAnimator />
              <LiveLoops />
            </>
          }
          media={
            <LivePlayerStage
              d={d}
              lang={lang}
              persona="kai"
              fillSlot={
                <ScrollFillText
                  as="p"
                  id="live-fill"
                  text={t.fill}
                  lang={lang}
                  mode="units"
                  unit="phrase"
                  driver="external"
                  tone="white"
                  className={`t-display-l ${s.fill}`}
                />
              }
            />
          }
          bezelScreen={
            <div className={s.bezelFill} aria-hidden="true">
              <div className={s.bezelScreen}>
                <LiveFeedCard d={d} lang={lang} persona="kai" />
              </div>
            </div>
          }
          skip={{ href: '#live-request', label: d.common.skip.stage }}
        />
      </div>

      <LiveRequestRow d={d} lang={lang} />
    </Section>
  );
}
