import type { SectionProps } from '@/i18n/types';
import { CLAIMS, STUDIO_LIVE } from '@/lib/site-config';
import { Units } from '@/lib/units';
import { Section, FaqList, RevealGroup, type FaqItem } from '@/components/site';
import '../creators.css';

/**
 * #faq: creator FAQ (spec §6.11), the shared native-<details> FaqList (no
 * JS). `legacy` only with CLAIMS.legacyCarryOver; `release` swaps to
 * `releaseLive` when STUDIO_LIVE. Desktop: a sticky title column beside
 * the list.
 */
export function StudioFaq({ d, lang }: SectionProps) {
  const t = d.creators.faq;
  const i = t.items;
  const items: FaqItem[] = [
    i.what,
    i.who,
    i.cost,
    i.studio,
    i.time,
    i.control,
    i.label,
    i.agency,
    { q: i.stop.q, a: i.stop.a, link: { href: '/privacy', label: i.stop.linkLabel } },
    ...(CLAIMS.legacyCarryOver ? [i.legacy] : []),
    STUDIO_LIVE ? i.releaseLive : i.release,
  ];
  return (
    <Section id="faq" surface="cream" labelledBy="faq-title" className="cr-faq">
      <div className="container-site cr-faq-grid">
        <div className="cr-faq-aside">
          <h2 id="faq-title" className="t-h2">
            <Units text={t.title} lang={lang} mode="phrase" />
          </h2>
        </div>
        <div className="cr-faq-list">
          <RevealGroup selector=".faq-item" stagger={0.05}>
            <FaqList items={items} headingLevel="h3" />
          </RevealGroup>
        </div>
      </div>
    </Section>
  );
}
