import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #check: 03 たしかめる, clone-check stage (spec §6.5). STUB (WP0a), owned by WP6: replace wholesale. */
export function CloneCheck({ d, lang }: SectionProps) {
  const t = d.creators.check;
  return (
    <Section id="check" surface="night" labelledBy="check-title" immersive skipTo="#control" skipLabel={d.common.skip.stage}>
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
      <h2 id="check-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
    </Section>
  );
}
