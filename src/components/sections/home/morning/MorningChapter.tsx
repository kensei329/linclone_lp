import type { SectionProps } from '@/i18n/types';
import { Section, Eyebrow, ScrollFillText, ScreenNote, Icon } from '@/components/site';
import { PhoneFrame, ScreenSlice } from '@/components/mockups/kit';
import { IncomingRing06b } from '@/components/mockups/fan/IncomingRing06b';
import { MorningSetup06b } from '@/components/mockups/fan/MorningSetup06b';
import { HomeCards01 } from '@/components/mockups/fan/HomeCards01';
import { Units } from '@/lib/units';
import { MorningStageAnimator } from './MorningStageAnimator.client';
import { MorningMicro } from './MorningMicro.client';
import s from './morning.module.css';

/** Minutes the poster clock rolls through (UI clock, not a claim). */
const CLOCK = ['6:58', '6:59', '7:00'] as const;

/** 8 fixed star positions (x%, y%, size px) for the night sky at p=0. */
const STARS: [number, number, number][] = [
  [8, 14, 2], [22, 32, 1.5], [37, 9, 2], [49, 24, 1.5], [63, 12, 2.5], [76, 30, 1.5], [88, 8, 2], [94, 22, 1.5],
];

/**
 * #morning-call: 02 モーニングコール (spec §5.5).
 * Desktop: a 160svh stage whose sticky layer scrubs night → dawn (one composited
 * transform on a 500%-tall gradient layer), rolls the poster clock 6:58 → 7:00
 * and lifts the ringing phone in; then a cream grid with setup + voice message.
 * Mobile: no sticky; a static night → cream gradient and a phone slice.
 * The server HTML is the final state (cream, 7:00, ink, phone in place, caption filled).
 */
export function MorningChapter({ d, lang }: SectionProps) {
  const t = d.home.morning;
  const m = d.mock.fan;
  return (
    <Section id="morning-call" surface="night-to-dawn" labelledBy="morning-title" className={s.section}>
      {/* ── stage (desktop sticky scrub; mobile static dawn) ── */}
      <div className={s.stage} data-morning-stage="" data-surface="dark">
        {/* Header theme markers: dark until the sky has turned (p≈0.45), then light. */}
        <span className={s.surfDark} data-surface="dark" aria-hidden="true" />
        <span className={s.surfLight} data-surface="light" aria-hidden="true" />
        <div className={s.sticky}>
          <div className={s.dawn} data-dawn="" aria-hidden="true">
            <span className={s.sun} />
          </div>
          <div className={s.stars} data-stars="" aria-hidden="true">
            {STARS.map(([x, y, z], i) => (
              <span key={i} style={{ left: `${x}%`, top: `${y}%`, width: z, height: z, animationDelay: `${(i % 4) * 0.6}s` }} />
            ))}
          </div>

          <div className={`container-site ${s.stageGrid}`}>
            <div className={s.copy} data-morning-copy="">
              <div className={s.eyebrow}>
                <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
              </div>
              <h2 id="morning-title" className={`t-h2 ${s.title}`}>
                <Units text={t.title} lang={lang} mode="phrase" />
              </h2>
              <p className={`t-poster-clock ${s.clock}`} aria-hidden="true">
                <span className={s.clockWin}>
                  {CLOCK.map((c) => (
                    <span key={c} className={s.clockDigit} data-clock="">
                      {c}
                    </span>
                  ))}
                </span>
              </p>
              <ScrollFillText
                as="p"
                id="morning-caption"
                text={t.captionLine}
                lang={lang}
                mode="units"
                unit="phrase"
                driver="external"
                tone="white"
                className={`t-display-l ${s.caption}`}
              />
            </div>

            <div className={s.phoneCol}>
              <div className={s.ringPhone} data-ring-phone="">
                <span className={s.ripple} data-loop="" aria-hidden="true" />
                <span className={`${s.ripple} ${s.ripple2}`} data-loop="" aria-hidden="true" />
                <PhoneFrame size={{ mobile: 340, desktop: 340 }} theme="night" statusTime="7:00" label={m.incoming.alt}>
                  <IncomingRing06b d={d} lang={lang} persona="oshi" />
                </PhoneFrame>
              </div>
            </div>

            <div className={s.ringSlice}>
              <ScreenSlice label={m.incoming.alt} width={{ mobile: 312 }} crop={{ y: 96, h: 690 }}>
                <IncomingRing06b d={d} lang={lang} persona="oshi" />
              </ScreenSlice>
            </div>
          </div>
        </div>
        <MorningStageAnimator />
      </div>

      {/* ── grid (cream): setup + latest voice message ── */}
      <div className={s.grid} data-morning-grid="" data-surface="light">
        <div className={`container-site ${s.gridInner}`}>
          <div className={s.setupCol}>
            <p className={`t-lead ${s.lead}`}>{t.lead}</p>
            <p className={`t-small ${s.note}`}>
              <Icon name="info" size={16} />
              <span>{t.note}</span>
            </p>
            <div className={s.setupPhone} data-setup-root="">
              <span className={s.setupGlow} aria-hidden="true" />
              <PhoneFrame size={{ mobile: 320, desktop: 320 }} label={m.morningSetup.alt}>
                <MorningSetup06b d={d} lang={lang} persona="oshi" />
              </PhoneFrame>
            </div>
            <div className={s.setupSlice} data-setup-root="">
              <ScreenSlice label={m.morningSetup.alt} width={{ mobile: 312 }} crop={{ y: 120, h: 520 }}>
                <MorningSetup06b d={d} lang={lang} persona="oshi" />
              </ScreenSlice>
            </div>
          </div>

          <div id="voice-message" className={s.voiceCol}>
            <div className={`glass ${s.voiceCard}`}>
              <Eyebrow label={t.voiceEyebrow} />
              <h3 className={`t-h3 ${s.voiceTitle}`}>
                <Units text={t.voiceTitle} lang={lang} mode="phrase" />
              </h3>
              <p className={`t-body ${s.voiceBody}`}>{t.voiceBody}</p>
              <div className={s.voiceSlice} data-home-root="">
                <ScreenSlice label={m.home.alt} width={{ mobile: 300, desktop: 380 }} crop={{ y: 430, h: 330 }} radius={24}>
                  <HomeCards01 d={d} lang={lang} persona="oshi" />
                </ScreenSlice>
              </div>
            </div>
          </div>
        </div>
        <div className="container-site">
          <ScreenNote d={d} />
        </div>
        <MorningMicro />
      </div>
    </Section>
  );
}
