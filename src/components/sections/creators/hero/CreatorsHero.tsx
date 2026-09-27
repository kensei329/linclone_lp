import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { MailtoButton } from '@/components/site/download/MailtoButton';
import { CopyEmail } from '@/components/site/download/CopyEmail.client';
import { StudioStoreCTA } from '@/components/site/download/StudioStoreCTA';
import { Units } from '@/lib/units';

/** #top: /creators hero and H1 (spec §6.1). STUB (WP0a), owned by WP6: replace wholesale. */
export function CreatorsHero({ d, lang }: SectionProps) {
  const t = d.creators.hero;
  return (
    <Section id="top" surface="studio" labelledBy="creators-title">
      <Eyebrow label={t.eyebrow} tone="violet" />
      <h1 id="creators-title" className="t-display-xl">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h1>
      <p className="t-lead">{t.lead}</p>
      <MailtoButton d={d} lang={lang} variant="primary" placement="hero" />
      <CopyEmail label={t.copyEmail} copiedLabel={t.copied} placement="hero" />
      <StudioStoreCTA d={d} lang={lang} />
      <p className="t-small">{t.note}</p>
      <p className="t-body">{t.audience}</p>
      <p className="t-small">{t.disclosure}</p>
      <a href={localePath(lang, 'home')}>{t.fanLink}</a>
    </Section>
  );
}
