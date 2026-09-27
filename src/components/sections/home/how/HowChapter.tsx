import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { StoreBadges } from '@/components/site/download/StoreBadges';
import { FrictionList } from '@/components/site/download/FrictionList';
import { Units } from '@/lib/units';

const STEPS = ['download', 'pick', 'call', 'signin'] as const;

/** #how-it-works: 06 はじめかた (spec §5.10). STUB (WP0a), owned by WP3: replace wholesale. */
export function HowChapter({ d, lang }: SectionProps) {
  const t = d.home.how;
  return (
    <Section id="how-it-works" surface="cream" labelledBy="how-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="how-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
      <ol>
        {STEPS.map((k) => (
          <li key={k} id={`how-step-${k}`}>
            <h3 className="t-h3">{t.steps[k].title}</h3>
            <p className="t-body">{t.steps[k].body}</p>
          </li>
        ))}
      </ol>
      <div id="how-cta" data-download-block="">
        <p className="t-h3">{t.ctaTitle}</p>
        <StoreBadges d={d} lang={lang} placement="how" qr showFriction />
        <FrictionList d={d} />
      </div>
    </Section>
  );
}
