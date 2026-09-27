import type { SectionProps } from '@/i18n/types';
import { STUDIO_LIVE } from '@/lib/site-config';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { MailtoButton } from '@/components/site/download/MailtoButton';
import { CopyEmail } from '@/components/site/download/CopyEmail.client';
import { StudioStoreCTA } from '@/components/site/download/StudioStoreCTA';
import { Units } from '@/lib/units';

/** #join: 08 参加方法 (spec §6.10). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioJoin({ d, lang }: SectionProps) {
  const t = d.creators.join;
  const steps = [t.steps.request, t.steps.contact, STUDIO_LIVE ? t.steps.getLive : t.steps.get, t.steps.setup];
  return (
    <Section id="join" surface="lavender" labelledBy="join-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} tone="violet" />
      <h2 id="join-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <ol>
        {steps.map((s) => (
          <li key={s.title}>
            <h3 className="t-h3">{s.title}</h3>
            <p className="t-body">{s.body}</p>
          </li>
        ))}
      </ol>
      <p className="t-h3">{t.ctaTitle}</p>
      <p className="t-body">{t.ctaBody}</p>
      <MailtoButton d={d} lang={lang} variant="primary" placement="join" />
      <p>
        {t.emailLabel} <code>info@linclone.com</code>
      </p>
      <CopyEmail label={t.copyEmail} copiedLabel={t.copied} placement="join" />
      <StudioStoreCTA d={d} lang={lang} />
      <p className="t-small">{t.fine}</p>
    </Section>
  );
}
