import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Section } from '@/components/site/Section';
import { MailtoButton } from '@/components/site/download/MailtoButton';
import { CopyEmail } from '@/components/site/download/CopyEmail.client';
import { StudioStoreCTA } from '@/components/site/download/StudioStoreCTA';
import { Units } from '@/lib/units';

/** #final (spec §6.12). STUB (WP0a), owned by WP6: replace wholesale. */
export function CreatorsFinal({ d, lang }: SectionProps) {
  const t = d.creators.final;
  return (
    <Section id="final" surface="studio" labelledBy="final-title">
      <h2 id="final-title" className="t-display-l">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">{t.sub}</p>
      <MailtoButton d={d} lang={lang} variant="primary" placement="final" />
      <CopyEmail label={d.creators.hero.copyEmail} copiedLabel={d.creators.hero.copied} placement="final" />
      <StudioStoreCTA d={d} lang={lang} />
      <a href={localePath(lang, 'home')} data-analytics="creators_nav:creators_final">
        {t.fanLink}
      </a>
    </Section>
  );
}
