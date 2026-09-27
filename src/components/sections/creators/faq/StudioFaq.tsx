import type { SectionProps } from '@/i18n/types';
import { CLAIMS, STUDIO_LIVE } from '@/lib/site-config';
import { Section } from '@/components/site/Section';
import { FaqList, type FaqItem } from '@/components/site/faq/FaqList';
import { Units } from '@/lib/units';

/** #faq: creator FAQ (spec §6.11). STUB (WP0a), owned by WP6: replace wholesale. */
export function StudioFaq({ d, lang }: SectionProps) {
  const t = d.creators.faq;
  const i = t.items;
  const items: FaqItem[] = [
    i.what, i.who, i.cost, i.studio, i.time, i.control, i.label, i.agency,
    { q: i.stop.q, a: i.stop.a, link: { href: '/privacy', label: i.stop.linkLabel } },
    ...(CLAIMS.legacyCarryOver ? [i.legacy] : []),
    STUDIO_LIVE ? i.releaseLive : i.release,
  ];
  return (
    <Section id="faq" surface="cream" labelledBy="faq-title">
      <h2 id="faq-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <FaqList items={items} headingLevel="h3" />
    </Section>
  );
}
