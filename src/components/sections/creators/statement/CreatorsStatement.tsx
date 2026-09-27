import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Units } from '@/lib/units';

/** #about: statement fill (spec §6.2). STUB (WP0a), owned by WP6: replace wholesale. */
export function CreatorsStatement({ d, lang }: SectionProps) {
  const t = d.creators.statement;
  return (
    <Section id="about" surface="studio" labelledBy="creators-statement">
      <h2 id="creators-statement" className="t-display-l">
        <Units text={t.fill} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.sub}</p>
    </Section>
  );
}
