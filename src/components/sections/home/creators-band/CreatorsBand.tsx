import type { SectionProps } from '@/i18n/types';
import { localePath } from '@/i18n/paths';
import { Section, Eyebrow, ButtonLink, Ring, Aura } from '@/components/site';
import { Units } from '@/lib/units';
import { BandRing } from './BandRing.client';
import s from './creators-band.module.css';

/**
 * #creators: the secondary entry to /creators (spec §5.12). A lavender band
 * inset from the page edge: copy + a violet ghost link on one side, and on
 * the other a glass card where Aoi's clone ring fills as the band scrolls in
 * (作成中 → クローンの準備ができました). No percentage anywhere. Server HTML is
 * the final state (ring full, "ready").
 */
export function CreatorsBand({ d, lang }: SectionProps) {
  const t = d.home.creatorsBand;
  return (
    <Section id="creators" surface="cream" labelledBy="creators-band-title" className={s.section}>
      <div className={s.band}>
        <div className={`container-site ${s.grid}`}>
          <div className={s.copy}>
            <Eyebrow label={t.eyebrow} tone="violet" />
            <h2 id="creators-band-title" className={`t-h2 ${s.title}`}>
              <Units text={t.title} lang={lang} mode="phrase" />
            </h2>
            <p className={`t-body ${s.body}`}>{t.body}</p>
          </div>

          <div className={s.cardCol}>
            <div className={`glass ${s.card}`} role="img" aria-label={t.alt} data-band-card="">
              <span className={s.lockup} aria-hidden="true">
                <span className={s.lockupMark} />
                {d.creators.header.lockup}
              </span>
              <span className={s.ringWrap} aria-hidden="true">
                <span className={s.ringHalo} />
                <Ring size={220} tone="violet" stroke={10} />
                <span className={s.avatar}>
                  <Aura persona="aoi" shape="avatar" size={150} />
                  <span className={s.dim} data-band-dim="" />
                </span>
              </span>
              <span className={s.labels} aria-hidden="true" data-band-labels="" data-ready="">
                <span className={s.labelBuilding}>
                  <span className={s.pulse} data-loop="" />
                  {t.ringBuilding}
                </span>
                <span className={s.labelReady}>{t.ringReady}</span>
              </span>
              <span className={s.name} aria-hidden="true">
                {d.personas.aoi.name}
              </span>
            </div>
          </div>

          <div className={s.linkRow}>
            <ButtonLink
              href={localePath(lang, 'creators')}
              variant="ghost"
              iconEnd="arrow_forward"
              className={s.link}
              data-analytics="creators_nav:band"
            >
              {t.link}
            </ButtonLink>
          </div>
        </div>
      </div>
      <BandRing />
    </Section>
  );
}
