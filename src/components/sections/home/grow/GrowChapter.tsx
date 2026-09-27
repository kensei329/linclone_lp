import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #grow: 05 育成 (spec §5.8). STUB (WP0a), owned by WP2: replace wholesale. */
export function GrowChapter({ d, lang }: SectionProps) {
  const t = d.home.grow;
  return (
    <Section id="grow" surface="lavender" labelledBy="grow-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="violet" />
      <h2 id="grow-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.lead}</p>
    </Section>
  );
}
