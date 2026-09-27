import type { SectionProps } from '@/i18n/types';
import { Section } from '@/components/site/Section';
import { Eyebrow } from '@/components/site/Eyebrow';
import { StoreBadges } from '@/components/site/download/StoreBadges';
import { Disclosure } from '@/components/site/Disclosure';
import { Units } from '@/lib/units';

/** #hero: the page's single H1 and first download point (spec §5.1). STUB (WP0a), owned by WP1: replace wholesale. */
export function HomeHero({ d, lang }: SectionProps) {
  const t = d.home.hero;
  return (
    <Section id="hero" surface="dawn" labelledBy="hero-title">
      <Eyebrow label={t.eyebrow} />
      <h1 id="hero-title" className="t-display-xl">
        <Units text={t.title} lang={lang} mode="phrase" />
      </h1>
      <p className="t-lead">{t.lead}</p>
      <StoreBadges d={d} lang={lang} placement="hero" size="lg" qr showFriction />
      <Disclosure d={d} variant="line" />
    </Section>
  );
}
