import type { CSSProperties } from 'react';
import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Units } from '@/lib/units';
import { Section, Eyebrow, MailtoButton, CopyEmail, StudioStoreCTA, CaptionMarker, Icon, ScreenNote } from '@/components/site';
import { PhoneFrame } from '@/components/mockups/kit';
import { S09Building } from '@/components/mockups/studio/S09Building';
import '../creators.css';

const rise = (i: number) => ({ '--i': i }) as CSSProperties;

/**
 * #top: /creators hero and the page's only H1 (spec §6.1). First viewport at
 * 390×664: eyebrow (招待制), H1, lead, the violet mailto CTA, copy-address
 * fallback, 近日公開 pills and the invite note. Entrance is transform-only
 * (the H1 is the LCP element and is never transparent); the S09 ring fill and
 * the building → ready swap are WP5's pure-CSS S09 sequence (no client file).
 */
export function CreatorsHero({ d, lang }: SectionProps) {
  const t = d.creators.hero;
  return (
    <Section id="top" surface="studio" labelledBy="creators-title" className="cr-hero">
      <div className="container-site cr-hero-grid">
        <div className="cr-hero-copy">
          <div className="cr-rise" style={rise(0)}>
            <Eyebrow label={t.eyebrow} tone="violet" />
          </div>
          <h1 id="creators-title" className="t-display-xl cr-hero-title cr-rise" style={rise(1)}>
            <Units text={t.title} lang={lang} mode="phrase" />
          </h1>
          <CaptionMarker targetId="creators-title" tone="violet" restOn="last" />
          <p className="t-lead cr-hero-lead cr-rise" style={rise(2)}>
            {t.lead}
          </p>
          <p className="t-body ink-2 cr-hero-audience cr-rise" style={rise(3)}>
            {t.audience}
          </p>
          <div className="cr-hero-actions cr-rise" style={rise(3)}>
            <div className="cr-cta-row">
              <MailtoButton d={d} lang={lang} variant="primary" placement="hero" />
              <CopyEmail label={t.copyEmail} copiedLabel={t.copied} selectedLabel={d.common.copySelected} placement="hero" />
            </div>
            <StudioStoreCTA d={d} lang={lang} />
            <p className="t-small cr-note">
              <Icon name="lock" size={14} />
              <span>{t.note}</span>
            </p>
          </div>
          <div className="cr-hero-foot cr-rise" style={rise(4)}>
            <p className="t-small disclosure-line cr-hero-disclosure">
              <Icon name="verified" filled size={16} />
              <span>{t.disclosure}</span>
            </p>
            <p className="t-small cr-fanlink">
              <a href={localePath(lang, 'home')} data-analytics="creators_nav:creators_hero">
                {t.fanLink}
              </a>
            </p>
          </div>
        </div>

        <div className="cr-hero-visual">
          <div className="cr-hero-orb" aria-hidden="true">
            <span className="cr-hero-halo" data-loop="" />
            <span className="cr-hero-halo" data-loop="" />
            <span className="cr-hero-halo" data-loop="" />
          </div>
          <PhoneFrame size={{ mobile: 300, desktop: 340 }} label={t.phoneAlt} className="cr-hero-phone">
            <S09Building d={d} lang={lang} persona="aoi" state="building" />
          </PhoneFrame>
          <div className="cr-hero-note">
            <ScreenNote d={d} />
          </div>
        </div>
      </div>
    </Section>
  );
}
