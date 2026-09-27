import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #insights: 07 データと収益 (spec §6.9). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioInsights({ d, lang }: SectionProps) {
  const t = d.creators.insights;
  return (
    <Section id="insights" surface="studio-cyan" labelledBy="insights-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="insights-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-body">{t.analyticsBody}</p>
      <p className="t-small">{t.privacy}</p>
      <h3 className="t-h3">{t.earningsTitle}</h3>
      <p className="t-body">{t.earningsBody}</p>
    </Section>
  );
}
