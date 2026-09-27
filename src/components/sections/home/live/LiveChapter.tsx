import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';
import { LiveRequestRow } from './LiveRequestRow';

/** #live: 04 LIVE配信, stage #2 (spec §5.7). STUB (WP0a), owned by WP2: replace wholesale. */
export function LiveChapter({ d, lang }: SectionProps) {
  const t = d.home.live;
  return (
    <Section id="live" surface="night" labelledBy="live-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="white" />
      <h2 id="live-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p>{t.audioChip}</p>
      <p className="t-lead">{t.lead}</p>
      <LiveRequestRow d={d} lang={lang} />
    </Section>
  );
}
