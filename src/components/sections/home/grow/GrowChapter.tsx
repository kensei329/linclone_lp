import type { SectionProps } from '@/i18n/types';
import { Section, Eyebrow, ScrollFillText, ScreenNote, Carousel, Icon, type IconName } from '@/components/site';
import { PhoneFrame, ScreenSlice } from '@/components/mockups/kit';
import { GrowPicker07 } from '@/components/mockups/fan/GrowPicker07';
import { CreatorProfile08 } from '@/components/mockups/fan/CreatorProfile08';
import { ReviewStatus10 } from '@/components/mockups/fan/ReviewStatus10';
import { Units } from '@/lib/units';
import { GrowAnimator } from './GrowAnimator.client';
import s from './grow.module.css';

const PIPELINE: { key: 'submit' | 'ai' | 'community' | 'approved'; icon: IconName }[] = [
  { key: 'submit', icon: 'edit_note' },
  { key: 'ai', icon: 'auto_awesome' },
  { key: 'community', icon: 'groups' },
  { key: 'approved', icon: 'verified' },
];

/**
 * #grow: 05 育成, 夜は、推しを育てる時間。 (spec §5.8), lavender surface.
 * Desktop: copy + purple fill left; a stack of three phones right that fans
 * out on scroll; then the review pipeline (submit → AI → community →
 * approved), the creator's final say and the rules.
 * Mobile: fill, a 3-slice carousel and a vertical pipeline.
 * SSR / reduced motion: fanned stack, all steps lit, status 承認済み.
 * The community review is never shown as binding or as a perk (10b is not built).
 */
export function GrowChapter({ d, lang }: SectionProps) {
  const t = d.home.grow;
  const m = d.mock.fan;
  const review = m.growReview;

  const phones = [
    { key: 'picker', label: m.growPicker.alt, node: <GrowPicker07 d={d} lang={lang} persona="sora" /> },
    { key: 'profile', label: m.growProfile.alt, node: <CreatorProfile08 d={d} lang={lang} persona="sora" /> },
    { key: 'review', label: review.alt, node: <ReviewStatus10 d={d} lang={lang} persona="sora" /> },
  ];
  const crops = { picker: { y: 80, h: 560 }, profile: { y: 60, h: 600 }, review: { y: 80, h: 560 } } as const;

  return (
    <Section id="grow" surface="lavender" labelledBy="grow-title" className={s.section}>
      <span className={s.moon} aria-hidden="true">
        <Icon name="nights_stay" size={64} filled />
      </span>
      <div className={s.root} data-grow-root="">
        <div className={`container-site ${s.top}`}>
          <div className={s.copy}>
            <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="violet" />
            <h2 id="grow-title" className={`t-h2 ${s.title}`}>
              <Units text={t.title} lang={lang} mode="phrase" />
            </h2>
            <ScrollFillText
              as="p"
              id="grow-fill"
              text={t.fill}
              lang={lang}
              mode="units"
              unit="phrase"
              tone="purple"
              start="top 70%"
              end="center 40%"
              scrub={1}
              className={`t-display-l ${s.fill}`}
            />
            <p className={`t-lead ${s.lead}`}>{t.lead}</p>
          </div>

          <div className={s.stackCol}>
            <div className={s.stack} data-stack="">
              {phones.map((p, i) => (
                <div key={p.key} className={s.card} data-stack-card={i} data-grow-mock={p.key}>
                  <PhoneFrame size={{ mobile: 280, desktop: 280 }} label={p.label}>
                    {p.node}
                  </PhoneFrame>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={s.carousel}>
          <Carousel
            label={t.stageAlt}
            d={d}
            itemWidth="max(78vw, 316px)"
            items={phones.map((p) => (
              <div key={p.key} className={s.slice} data-grow-mock={p.key}>
                <ScreenSlice label={p.label} width={{ mobile: 300 }} crop={crops[p.key as keyof typeof crops]} radius={24}>
                  {p.node}
                </ScreenSlice>
              </div>
            ))}
          />
        </div>

        <div className="container-site">
          <div className={s.pipeWrap}>
            <div className={s.pipeline} data-pipeline="">
              <span className={s.track} aria-hidden="true">
                <span className={s.trackFill} data-pipe-line="" />
              </span>
              <ol className={s.steps}>
                {PIPELINE.map((step, i) => (
                  <li key={step.key} className={s.step} data-pipe-step={i}>
                    <span className={s.disc}>
                      <span className={s.discOff}>
                        <Icon name={step.icon} size={22} />
                      </span>
                      <span className={s.discOn} data-pipe-on="">
                        <Icon name={step.icon} size={22} filled={step.key === 'approved'} />
                      </span>
                    </span>
                    <span className={s.stepLabel}>{t.pipeline[step.key]}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={s.after}>
              <p className={s.finalSay}>
                <Icon name="verified_user" size={20} filled />
                <span>{t.finalSay}</span>
              </p>
              <p className={`t-small ${s.rules}`}>
                <Icon name="block" size={16} />
                <span>{t.rules}</span>
              </p>
            </div>
          </div>
          <ScreenNote d={d} />
        </div>
        <GrowAnimator statuses={{ ai: review.statusAi, community: review.statusCommunity, approved: review.statusApproved }} />
      </div>
    </Section>
  );
}
