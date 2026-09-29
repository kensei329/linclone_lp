import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { getUrl, storeUrl } from '@/lib/store-links';
import { Icon } from '../icons/Icon';
import { Disclosure } from '../Disclosure';
import { StoreBadges } from '../download/StoreBadges';
import { StudioStoreCTA } from '../download/StudioStoreCTA';
import { MailtoButton } from '../download/MailtoButton';
import { QrBlock } from '../download/QrBlock';
import { LangPill } from './LangPill';
import { LangAvailableChip } from './LangPill.client';
import { HeaderBehavior } from './HeaderBehavior.client';

const MENU_ID = 'site-menu';
const QR_ID = 'header-qr';

/**
 * Fixed site header (spec §4.1). Everything is server-rendered and works
 * without JS: the fan CTA is four same-size siblings of which CSS shows one
 * (`/get` fallback, App Store, Play, or the desktop QR popover button), keyed
 * off `html[data-platform]` from the head script. HeaderBehavior only adds
 * scroll glass, surface theming, auto-hide, the progress line and the menu.
 */
export function Header({ d, lang, page }: { d: Dictionary; lang: Locale; page: 'home' | 'creators' }) {
  const creators = page === 'creators';
  const other: Locale = lang === 'ja' ? 'en' : 'ja';
  const nav = creators
    ? ([
        ['#how', d.creators.header.nav.how],
        ['#setup', d.creators.header.nav.setup],
        ['#control', d.creators.header.nav.control],
        ['#insights', d.creators.header.nav.earnings],
        ['#faq', d.creators.header.nav.faq],
      ] as const)
    : ([
        ['#call', d.header.nav.call],
        ['#morning-call', d.header.nav.morning],
        ['#chat', d.header.nav.chat],
        ['#live', d.header.nav.live],
        ['#grow', d.header.nav.grow],
        ['#faq', d.header.nav.faq],
      ] as const);
  const navLabel = creators ? d.creators.header.navLabel : d.header.navLabel;
  const crossLink = creators
    ? { href: localePath(lang, 'home'), label: d.creators.header.fanApp, analytics: undefined }
    : { href: localePath(lang, 'creators'), label: d.header.forCreators, analytics: 'creators_nav:header' };
  const ctaLabel = (
    <>
      <span className="lbl-lg">{d.header.getApp}</span>
      <span className="lbl-sm">{d.header.getAppShort}</span>
    </>
  );
  // Opens the sheet natively where Invoker Commands exist; HeaderBehavior handles the rest.
  const menuCommand = { commandfor: MENU_ID, command: 'show-modal' } as Record<string, string>;

  return (
    <header className="site-header" data-page={page} data-top="">
      <div className="header-inner">
        <a href={localePath(lang, page)} aria-label={creators ? d.creators.header.homeLabel : d.header.homeLabel} className="header-lockup">
          {/* eslint-disable-next-line @next/next/no-img-element -- 28px brand mark */}
          <img src="/brand/mark-56.png" alt="" width={28} height={28} />
          {creators ? <span className="lockup-studio">{d.creators.header.lockup}</span> : <span className="wordmark">{d.common.brand}</span>}
        </a>

        <nav aria-label={navLabel} className="header-nav">
          <ul>
            {nav.map(([href, label]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <a href={crossLink.href} className="header-link header-desktop-only" data-analytics={crossLink.analytics}>
          {crossLink.label}
        </a>
        <span className="header-desktop-only">
          <LangPill lang={lang} page={page} d={d} />
        </span>

        {creators ? (
          <span className="header-cta">
            <MailtoButton d={d} lang={lang} variant="header" placement="header" />
          </span>
        ) : (
          <span className="header-cta">
            <a href={getUrl('header', lang)} className="btn-primary cta-get" data-analytics="cta_click:header">
              {ctaLabel}
            </a>
            <a href={storeUrl('ios', lang, 'header')} className="btn-primary cta-ios" data-analytics="cta_click:header" data-store="ios">
              {ctaLabel}
            </a>
            <a href={storeUrl('android', lang, 'header')} className="btn-primary cta-android" data-analytics="cta_click:header" data-store="android">
              {ctaLabel}
            </a>
            <button type="button" className="btn-primary cta-desktop" popoverTarget={QR_ID} data-analytics="qr_open:header">
              {ctaLabel}
            </button>
          </span>
        )}

        <button type="button" className="menu-btn" aria-label={d.header.menuOpen} aria-haspopup="dialog" aria-controls={MENU_ID} {...menuCommand}>
          <Icon name="menu" size={24} />
        </button>
      </div>
      <span className="header-progress" aria-hidden="true" />

      {creators ? null : (
        <div id={QR_ID} popover="auto" className="qr-popover glass-live">
          <button type="button" className="qr-popover-close" popoverTarget={QR_ID} popoverTargetAction="hide" aria-label={d.common.close}>
            <Icon name="close" size={22} />
          </button>
          <p className="t-h3">{d.header.qrPopoverTitle}</p>
          <p className="t-small">{d.header.qrPopoverBody}</p>
          <QrBlock d={d} lang={lang} placement="qr_header" size={120} caption="" />
          <StoreBadges d={d} lang={lang} placement="header" />
        </div>
      )}

      <dialog id={MENU_ID} className="header-sheet" aria-label={navLabel} data-lenis-prevent="">
        <div className="sheet-top">
          <a href={localePath(lang, page)} aria-label={creators ? d.creators.header.homeLabel : d.header.homeLabel} className="header-lockup">
            {/* eslint-disable-next-line @next/next/no-img-element -- 28px brand mark */}
            <img src="/brand/mark-56.png" alt="" width={28} height={28} />
            {creators ? <span className="lockup-studio">{d.creators.header.lockup}</span> : <span className="wordmark">{d.common.brand}</span>}
          </a>
          <button type="button" className="menu-btn" data-menu-close="" aria-label={d.header.menuClose} {...({ commandfor: MENU_ID, command: 'close' } as Record<string, string>)}>
            <Icon name="close" size={24} />
          </button>
        </div>
        <div className="sheet-body">
          <nav aria-label={navLabel} className="sheet-nav">
            <ul>
              {nav.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="t-h2" data-menu-close="">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sheet-row">
            <a href={crossLink.href} className="btn-ghost" data-analytics={crossLink.analytics}>
              {crossLink.label}
            </a>
            <LangPill lang={lang} page={page} d={d} />
          </div>
          {creators ? <StudioStoreCTA d={d} lang={lang} compact labelled /> : <StoreBadges d={d} lang={lang} placement="header" />}
          <Disclosure d={d} variant="line" />
        </div>
      </dialog>

      <LangAvailableChip
        lang={lang}
        href={localePath(other, page)}
        label={lang === 'ja' ? d.common.lang.englishAvailable : d.common.lang.japaneseAvailable}
        dismissLabel={d.common.lang.dismiss}
      />
      <HeaderBehavior />
    </header>
  );
}
