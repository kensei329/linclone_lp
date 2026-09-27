import type { SectionProps } from '@/i18n/types';
import { CLAIMS } from '@/lib/site-config';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #real: 05 本人として (spec §6.7). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioReal({ d, lang }: SectionProps) {
  const t = d.creators.real;
  return (
    <Section id="real" surface="cream" labelledBy="real-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="real-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-body">{t.officialBody}</p>
      <p className="t-body">{t.pauseBody}</p>
      <h3 className="t-h3">{t.liveTitle}</h3>
      <p className="t-body">{t.liveBody}</p>
      {CLAIMS.liveDropIn ? <p className="t-body">{t.dropIn}</p> : null}
    </Section>
  );
}
