import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Section, Eyebrow, FaqList, Icon, type FaqItem } from '@/components/site';
import { Units } from '@/lib/units';
import s from './faq.module.css';

const ORDER = ['what', 'real', 'free', 'account', 'video', 'morning', 'memory', 'payment', 'oshikatsu', 'delete', 'creator'] as const;

/**
 * #faq: よくある質問 (spec §5.11). No JS: native <details> rows (the shared
 * FaqList, `.glass` without backdrop-filter), the question as an H3 inside
 * each summary. Desktop: the heading column stays in view (sticky) while the
 * accordion scrolls. `content-visibility: auto` keeps it off the critical path.
 * No FAQPage JSON-LD (the visible content is the value).
 */
export function Faq({ d, lang }: SectionProps) {
  const t = d.home.faq;
  const items: FaqItem[] = ORDER.map((k) => {
    const item = t.items[k];
    const link =
      k === 'delete'
        ? { href: '/delete-user', label: t.items.delete.linkLabel }
        : k === 'creator'
          ? { href: localePath(lang, 'creators'), label: t.items.creator.linkLabel }
          : undefined;
    return { q: item.q, a: item.a, link };
  });

  return (
    <Section id="faq" surface="cream" labelledBy="faq-title" className={s.section}>
      <div className={`container-site ${s.grid}`}>
        <div className={s.aside}>
          <div className={s.sticky}>
            <Eyebrow num={t.eyebrow.num || undefined} label={t.eyebrow.label} />
            <h2 id="faq-title" className={`t-h2 ${s.title}`}>
              <Units text={t.title} lang={lang} mode="phrase" />
            </h2>
            <p className={`t-body ${s.lead}`}>
              {t.lead}{' '}
              <a href="/support" className={s.support}>
                {t.supportLink}
                <Icon name="arrow_forward" size={16} />
              </a>
            </p>
          </div>
        </div>
        <div className={s.list}>
          <FaqList items={items} headingLevel="h3" />
        </div>
      </div>
    </Section>
  );
}
