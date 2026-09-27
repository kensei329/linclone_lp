import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #how: 01 しくみ, command-centre stage (spec §6.3). STUB (WP0a), owned by WP6: replace wholesale. */
export function CommandCentre({ d, lang }: SectionProps) {
  const t = d.creators.home;
  return (
    <Section id="how" surface="studio" labelledBy="how-title" immersive skipTo="#setup" skipLabel={d.common.skip.stage}>
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="how-title" className="t-h2">
        <Units text={t.fill} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
    </Section>
  );
}
