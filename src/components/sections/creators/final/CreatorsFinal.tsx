import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Units } from '@/lib/units';
import { Section, MailtoButton, CopyEmail, StudioStoreCTA, CaptionMarker, Aura, Icon } from '@/components/site';
import '../creators.css';

/**
 * #final: もう一人の自分に、会いにいこう。 (spec §6.12). Studio surface with a
 * violet aura; the "two of you" emblem (a hairline self beside the aura
 * clone), the H2 with the violet caption marker (after idle, not scrubbed),
 * the mailto, copy fallback, 近日公開 pills and the link back to the fan app.
 */
export function CreatorsFinal({ d, lang }: SectionProps) {
  const t = d.creators.final;
  return (
    <Section id="final" surface="studio" labelledBy="final-title" className="cr-final">
      <span className="cr-final-aura" aria-hidden="true" />
      <div className="container-site cr-final-inner">
        <div className="cr-twin" aria-hidden="true">
          <span className="cr-twin-self" />
          <span className="cr-twin-clone">
            <Aura persona="aoi" shape="avatar" size={88} ring="story" monogram={false} />
          </span>
        </div>
        <h2 id="final-title" className="t-display-l cr-final-title">
          <Units text={t.title} lang={lang} mode="phrase" />
        </h2>
        <CaptionMarker targetId="final-title" tone="violet" restOn="last" />
        <p className="t-lead ink-2 cr-final-sub">{t.sub}</p>
        <div className="cr-final-cta">
          <MailtoButton d={d} lang={lang} variant="primary" placement="final" />
          <CopyEmail label={d.creators.hero.copyEmail} copiedLabel={d.creators.hero.copied} selectedLabel={d.common.copySelected} placement="final" />
        </div>
        <StudioStoreCTA d={d} lang={lang} />
        <p className="t-small cr-fanlink cr-final-home">
          <a href={localePath(lang, 'home')} data-analytics="creators_nav:creators_final">
            {t.fanLink}
          </a>
          <Icon name="arrow_forward" size={16} />
        </p>
      </div>
    </Section>
  );
}
