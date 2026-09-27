import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { getUrl } from '@/lib/store-links';
import { LangPill } from './LangPill';
import { HeaderBehavior } from './HeaderBehavior.client';
import { MailtoButton } from '../download/MailtoButton';

/**
 * Fixed site header (spec §4.1). STUB (WP0a): semantic structure, real links
 * and the no-JS `/get` CTA; WP0b adds the platform CTAs, QR popover, mobile
 * sheet and styling.
 */
export function Header({ d, lang, page }: { d: Dictionary; lang: Locale; page: 'home' | 'creators' }) {
  const creators = page === 'creators';
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
  return (
    <header className="site-header" data-page={page}>
      <a href={localePath(lang, page)} aria-label={creators ? d.creators.header.homeLabel : d.header.homeLabel} className="header-lockup">
        {/* eslint-disable-next-line @next/next/no-img-element -- 28px brand mark */}
        <img src="/brand/mark-128.png" alt="" width={28} height={28} />
        <span className="wordmark">{creators ? d.creators.header.lockup : d.common.brand}</span>
      </a>
      <nav aria-label={creators ? d.creators.header.navLabel : d.header.navLabel}>
        <ul>
          {nav.map(([href, label]) => (
            <li key={href}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </nav>
      {creators ? (
        <a href={localePath(lang, 'home')}>{d.creators.header.fanApp}</a>
      ) : (
        <a href={localePath(lang, 'creators')} data-analytics="creators_nav:header">
          {d.header.forCreators}
        </a>
      )}
      <LangPill lang={lang} page={page} d={d} />
      {creators ? (
        <MailtoButton d={d} lang={lang} variant="header" placement="header" />
      ) : (
        <a href={getUrl('header', lang)} className="btn-primary cta-get">
          {d.header.getApp}
        </a>
      )}
      <HeaderBehavior />
    </header>
  );
}
