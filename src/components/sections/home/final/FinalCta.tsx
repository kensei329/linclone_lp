import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { StoreBadges } from '@/components/site/download/StoreBadges';
import { Disclosure } from '@/components/site/Disclosure';
import { Units } from '@/lib/units';

/** #download: final CTA, stage #3 reverse collapse (spec §5.13). STUB (WP0a), owned by WP3: replace wholesale. */
export function FinalCta({ d, lang }: SectionProps) {
  const t = d.home.final;
  return (
    <Section id="download" surface="night" labelledBy="download-title" download immersive>
      <Eyebrow label={t.eyebrow} tone="white" />
      <h2 id="download-title" className="t-display-l">
        <Units text={t.title} lang={lang} mode={lang === 'ja' ? 'char' : 'word'} />
      </h2>
      <p>{t.sub}</p>
      <StoreBadges d={d} lang={lang} placement="final" qr showFriction />
      <Disclosure d={d} variant="line" />
    </Section>
  );
}
