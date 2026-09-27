import type { ReactNode } from 'react';
import type { SectionProps } from '@/i18n/types';
import { Units } from '@/lib/units';
import { Section, Eyebrow, StickySteps, Ring, Icon, ScreenNote, RevealGroup, type IconName, type StickyStep } from '@/components/site';
import { ScreenSlice } from '@/components/mockups/kit';
import { S04QuickPicks } from '@/components/mockups/studio/S04QuickPicks';
import { S04aOwnWords } from '@/components/mockups/studio/S04aOwnWords';
import { S05Photos } from '@/components/mockups/studio/S05Photos';
import { S06ModesFree } from '@/components/mockups/studio/S06ModesFree';
import { S07NgTopics } from '@/components/mockups/studio/S07NgTopics';
import { S08bRecord } from '@/components/mockups/studio/S08bRecord';
import { SetupMicro } from './SetupMicro.client';
import '../creators.css';

type StepKey = 'picks' | 'words' | 'photos' | 'modes' | 'ng' | 'voice';

/**
 * Step → icon, mobile crop (§7.2, in 390×844 screen px) and its mockup alt key.
 * Crops end just under each screen's last meaningful row (no empty tail), so
 * the six stacked phone cards stay short; desktop shows the full screens.
 */
const STEPS: { key: StepKey; icon: IconName; crop: { y: number; h: number }; alt: 'picks' | 'words' | 'photos' | 'modes' | 'ng' | 'record' }[] = [
  { key: 'picks', icon: 'badge', crop: { y: 100, h: 400 }, alt: 'picks' },
  { key: 'words', icon: 'edit_note', crop: { y: 100, h: 470 }, alt: 'words' },
  { key: 'photos', icon: 'photo_library', crop: { y: 100, h: 330 }, alt: 'photos' },
  { key: 'modes', icon: 'favorite', crop: { y: 100, h: 395 }, alt: 'modes' },
  { key: 'ng', icon: 'do_not_disturb_on', crop: { y: 100, h: 465 }, alt: 'ng' },
  { key: 'voice', icon: 'mic', crop: { y: 118, h: 450 }, alt: 'record' },
];

/**
 * #setup: 02 セットアップ (spec §6.4). Desktop: the six setup screens change
 * in a sticky phone as the steps scroll by (StickySteps), each playing its
 * micro-sequence when its step becomes current; mobile: a vertical list of
 * glass cards with cropped ScreenSlices that play once on enter. Then the
 * "ready" card. Server HTML: every screen in its final state.
 */
export function StudioSetup({ d, lang }: SectionProps) {
  const t = d.creators.setup;
  const m = d.mock.studio;
  const screen = (key: StepKey): ReactNode => {
    const p = { d, lang, persona: 'aoi' as const };
    switch (key) {
      case 'picks':
        return <S04QuickPicks {...p} />;
      case 'words':
        return <S04aOwnWords {...p} />;
      case 'photos':
        return <S05Photos {...p} />;
      case 'modes':
        return <S06ModesFree {...p} />;
      case 'ng':
        return <S07NgTopics {...p} />;
      case 'voice':
        return <S08bRecord {...p} />;
    }
  };

  const steps: StickyStep[] = STEPS.map((s) => ({
    id: `setup-${s.key}`,
    title: t.steps[s.key].title,
    body: (
      <span className="cr-step-body">
        <span className="cr-step-icon" aria-hidden="true">
          <Icon name={s.icon} size={20} />
        </span>
        <span>{t.steps[s.key].body}</span>
      </span>
    ),
    mobileSlice: (
      <ScreenSlice label={m[s.alt].alt} width={{ mobile: 300 }} crop={s.crop} radius={24}>
        {screen(s.key)}
      </ScreenSlice>
    ),
  }));

  return (
    <Section id="setup" surface="studio-cyan" labelledBy="setup-title" className="cr-setup">
      <div className="container-site">
        <RevealGroup selector=".cr-sec-head > *">
          <header className="cr-sec-head cr-setup-head">
            <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
            <h2 id="setup-title" className="t-h2">
              <Units text={t.title} lang={lang} mode="phrase" />
            </h2>
            <p className="t-lead ink-2">{t.lead}</p>
            <p className="glass cr-trust t-small">
              <span className="cr-trust-icon" aria-hidden="true">
                <Icon name="link" size={18} />
              </span>
              <span>{t.trust}</span>
            </p>
          </header>
        </RevealGroup>

        <StickySteps
          id="setup-steps"
          steps={steps}
          screens={STEPS.map((s) => screen(s.key))}
          phoneSize={{ desktop: 320 }}
          phoneLabel={t.stageAlt}
          side="right"
          stepMinHeight="45svh"
          mobileLayout="list"
        />

        <div className="glass cr-ready" data-ready="">
          <Ring size={96} tone="violet" stroke={6} label={<Icon name="check" size={36} className="cr-ready-check" />} />
          <div className="cr-ready-copy">
            <p className="t-h3">{t.readyTitle}</p>
            <p className="t-body ink-2">{t.readyBody}</p>
          </div>
        </div>
        <ScreenNote d={d} />
      </div>
      <SetupMicro />
    </Section>
  );
}
