import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { Units } from '@/lib/units';

/** #creators: the secondary entry to /creators (spec §5.12). STUB (WP0a), owned by WP3: replace wholesale. */
export function CreatorsBand({ d, lang }: SectionProps) {
  const t = d.home.creatorsBand;
  return (
    <Section id="creators" surface="lavender" labelledBy="creators-band-title">
      <Eyebrow label={t.eyebrow} tone="violet" />
      <h2 id="creators-band-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-body">{t.body}</p>
      <a href={localePath(lang, 'creators')} data-analytics="creators_nav:band">
        {t.link}
      </a>
    </Section>
  );
}
