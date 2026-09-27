import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { FaqList, type FaqItem } from '@/components/site/faq/FaqList';
import { Units } from '@/lib/units';

const ORDER = ['what', 'real', 'free', 'account', 'video', 'morning', 'memory', 'payment', 'oshikatsu', 'delete', 'creator'] as const;

/** #faq (spec §5.11). STUB (WP0a), owned by WP3: replace wholesale. */
export function Faq({ d, lang }: SectionProps) {
  const t = d.home.faq;
  const items: FaqItem[] = ORDER.map((k) => {
    const item = t.items[k];
    const link =
      k === 'delete' ? { href: '/delete-user', label: t.items.delete.linkLabel }
      : k === 'creator' ? { href: localePath(lang, 'creators'), label: t.items.creator.linkLabel }
      : undefined;
    return { q: item.q, a: item.a, link };
  });
  return (
    <Section id="faq" surface="cream" labelledBy="faq-title">
      <Eyebrow num={t.eyebrow.num} label={t.eyebrow.label} />
      <h2 id="faq-title" className="t-h2">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h2>
      <p className="t-lead">
        {t.lead} <a href="/support">{t.supportLink}</a>
      </p>
      <FaqList items={items} headingLevel="h3" />
    </Section>
  );
}
