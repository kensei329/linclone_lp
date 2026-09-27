import { Fragment, type ReactNode } from 'react';
import type { SectionProps } from '@/i18n/types';
import { Section, Eyebrow, ScrollFillText, StoreBadges, FrictionList, Icon, Ring, CallGlow, ScreenNote } from '@/components/site';
import { PhoneFrame, ScreenStack, ScreenSlice } from '@/components/mockups/kit';
import { Welcome00a } from '@/components/mockups/fan/Welcome00a';
import { PickReel00b } from '@/components/mockups/fan/PickReel00b';
import { FirstCall00c } from '@/components/mockups/fan/FirstCall00c';
import { GuestGate02 } from '@/components/mockups/fan/GuestGate02';
import { Units } from '@/lib/units';
import { HowAnimator } from './HowAnimator.client';
import s from './how.module.css';

const STEPS = ['download', 'pick', 'call', 'signin'] as const;
type StepKey = (typeof STEPS)[number];

/** Mobile crops of each screen (spec §5.10), at 300px wide (scale .77). */
const CROPS: Record<StepKey, { y: number; h: number }> = {
  download: { y: 500, h: 344 },
  pick: { y: 420, h: 424 },
  call: { y: 80, h: 520 },
  signin: { y: 360, h: 400 },
};

const APP_ICON = '/brand/appicon-512.png';

/** The ring-60 label: `ringLabel` + a tabular `0:60` the animators count down. */
function RingTimer({ label, size }: { label: string; size: 'lg' | 'sm' }) {
  return (
    <span className={s.ringTimer} data-size={size}>
      <span className={s.ringTimerLabel}>{label}</span>
      <span className={s.ringTimerTime} data-ring-time="">
        0:60
      </span>
    </span>
  );
}

/**
 * #how-it-works: 06 はじめかた, 最初の60秒は、無料で話せる。 (spec §5.10).
 * The second download checkpoint. Desktop: a sticky phone (cols 1–5) walks
 * through Welcome → Reel → the free first call (with the 60-second ring) →
 * sign-in while the steps scroll on the right, then the phone morphs into
 * the LinClone app icon beside the store badges. Mobile: a vertical timeline
 * with a cropped screen per step. Server HTML is the final state: every step
 * done, ring full at 0:60, the app icon resting in its pad.
 */
export function HowChapter({ d, lang }: SectionProps) {
  const t = d.home.how;
  const screens: Record<StepKey, ReactNode> = {
    download: <Welcome00a d={d} lang={lang} persona="oshi" />,
    pick: <PickReel00b d={d} lang={lang} persona="oshi" />,
    call: <FirstCall00c d={d} lang={lang} persona="oshi" />,
    signin: <GuestGate02 d={d} lang={lang} persona="oshi" />,
  };
  const sliceLabel: Record<StepKey, string> = {
    download: d.mock.fan.welcome.alt,
    pick: d.mock.fan.reel.alt,
    call: d.mock.fan.firstCall.alt,
    signin: d.mock.fan.gate.alt,
  };

  return (
    <Section id="how-it-works" surface="cream" labelledBy="how-title" className={s.section}>
      <div className={s.sunrise} aria-hidden="true" data-sunrise="">
        <CallGlow variant="fan" />
      </div>

      <div className={`container-site ${s.grid}`}>
        {/* ── desktop sticky phone column ── */}
        <div className={s.phoneCol}>
          <div className={s.phoneSticky}>
            <div className={s.phoneScale} data-phone-scale="">
              <div className={s.morph} data-morph="">
                <div className={s.ring} data-ring60="" aria-hidden="true">
                  <Ring size={420} tone="teal" stroke={8} />
                </div>
                <PhoneFrame size={{ mobile: 330, desktop: 330 }} label={t.stageAlt} theme="night" className={s.phone}>
                  <ScreenStack>
                    {STEPS.map((k) => (
                      <Fragment key={k}>{screens[k]}</Fragment>
                    ))}
                  </ScreenStack>
                </PhoneFrame>
                <span className={s.ringChip} data-ring-chip="" aria-hidden="true">
                  <Icon name="timer" filled size={18} />
                  <RingTimer label={t.ringLabel} size="lg" />
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element -- static brand PNG, decorative morph target */}
                <img className={s.morphIcon} data-app-icon="" src={APP_ICON} alt="" width={330} height={330} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>

        {/* ── copy + steps ── */}
        <div className={s.main}>
          <header className={s.head}>
            <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
            <h2 id="how-title" className={`t-h2 ${s.title}`}>
              <Units text={t.title} lang={lang} mode="phrase" />
            </h2>
            <p className={`t-lead ${s.lead}`}>{t.lead}</p>
          </header>

          <div className={s.stepsWrap} data-steps="">
            <span className={s.line} aria-hidden="true">
              <span className={s.lineFill} data-line-fill="" />
            </span>
            <ol className={s.steps}>
              {STEPS.map((k, i) => (
                <li key={k} id={`how-step-${k}`} className={s.step} data-step={i} data-done="">
                  <span className={s.dot} aria-hidden="true">
                    <Icon name="check" size={18} />
                  </span>
                  <div className={s.stepCopy}>
                    <ScrollFillText
                      as="h3"
                      text={t.steps[k].title}
                      lang={lang}
                      mode="units"
                      unit="phrase"
                      tone="ink"
                      start="top 70%"
                      end="top 40%"
                      className={`t-h3 ${s.stepTitle}`}
                    />
                    <p className={`t-body ${s.stepBody}`}>{t.steps[k].body}</p>
                  </div>
                  <div className={s.slice} data-slice={k}>
                    <ScreenSlice label={sliceLabel[k]} width={{ mobile: 300 }} crop={CROPS[k]} radius={24}>
                      {screens[k]}
                    </ScreenSlice>
                    {k === 'call' ? (
                      <span className={`glass-fake ${s.miniRing}`} data-ring-mini="" aria-hidden="true">
                        <Ring size={110} tone="teal" stroke={6} label={<RingTimer label={t.ringLabel} size="sm" />} />
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ── icon pad (desktop) ── */}
        <div className={s.padCol} aria-hidden="true">
          <span className={s.pad} data-icon-pad="">
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand PNG */}
            <img src={APP_ICON} alt="" width={120} height={120} loading="lazy" decoding="async" />
          </span>
        </div>

        {/* ── CTA block ── */}
        <div id="how-cta" className={s.cta} data-download-block="">
          <div className={s.ctaHead}>
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand PNG, mobile only */}
            <img className={s.ctaIcon} src={APP_ICON} alt="" width={72} height={72} loading="lazy" decoding="async" />
            <p className={`t-h3 ${s.ctaTitle}`}>{t.ctaTitle}</p>
          </div>
          <StoreBadges d={d} lang={lang} placement="how" qr showFriction />
          <FrictionList d={d} items={['first60', 'trialBeforeSignup', 'noPassword']} />
          <ScreenNote d={d} />
        </div>
      </div>

      <HowAnimator />
    </Section>
  );
}
