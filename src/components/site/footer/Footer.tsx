import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/config';
import { localePath } from '@/i18n/paths';
import { mailtoStudio } from '@/lib/store-links';
import { SOCIAL } from '@/lib/site-config';
import { StoreBadges } from '../download/StoreBadges';
import { StudioStoreCTA } from '../download/StudioStoreCTA';
import { LangPill } from '../header/LangPill';

/**
 * Site footer (spec §4.1). STUB (WP0a): every link and the disclosure are in
 * place; WP0b adds the night-deep surface, watermark and accordions.
 * Legacy pages are plain <a> (different root layout → full load).
 */
export function Footer({ d, lang, page }: { d: Dictionary; lang: Locale; page: 'home' | 'creators' }) {
  const L = d.footer.links;
  const anchor = (hash: string) => (page === 'home' ? hash : localePath(lang, 'home', hash));
  return (
    <footer className="site-footer" data-surface="dark">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element -- brand mark */}
        <img src="/brand/mark-white-256.png" alt={d.common.brand} width={40} height={40} />
        <p className="wordmark">{d.common.brand}</p>
        <p>{d.footer.tagline}</p>
        {page === 'home' ? <StoreBadges d={d} lang={lang} placement="footer" /> : <StudioStoreCTA d={d} lang={lang} compact />}
      </div>
      <nav aria-label={d.footer.columns.app}>
        <p>{d.footer.columns.app}</p>
        <ul>
          <li><a href={anchor('#call')}>{L.call}</a></li>
          <li><a href={anchor('#morning-call')}>{L.morning}</a></li>
          <li><a href={anchor('#chat')}>{L.chat}</a></li>
          <li><a href={anchor('#live')}>{L.live}</a></li>
          <li><a href={anchor('#grow')}>{L.grow}</a></li>
          <li><a href={anchor('#faq')}>{L.faq}</a></li>
          <li><a href={localePath(lang, 'home')}>{L.fanApp}</a></li>
        </ul>
      </nav>
      <nav aria-label={d.footer.columns.creators}>
        <p>{d.footer.columns.creators}</p>
        <ul>
          <li><a href={localePath(lang, 'creators')}>{L.studio}</a></li>
          <li><a href={mailtoStudio(lang, d)} data-analytics="studio_mailto:footer">{L.requestInvite}</a></li>
        </ul>
      </nav>
      <nav aria-label={d.footer.columns.support}>
        <p>{d.footer.columns.support}</p>
        <ul>
          <li><a href="/support">{L.support}</a></li>
          <li><a href="/delete-user">{L.deleteUser}</a></li>
        </ul>
      </nav>
      <nav aria-label={d.footer.columns.legal}>
        <p>{d.footer.columns.legal}</p>
        <ul>
          <li><a href="/privacy">{L.privacy}</a></li>
          <li><a href="/terms">{L.terms}</a></li>
          <li><a href="/cookies">{L.cookies}</a></li>
          <li><a href="/policies/child-protection-policy">{L.childSafety}</a></li>
        </ul>
      </nav>
      {SOCIAL.length ? (
        <ul>
          {SOCIAL.map((s) => (
            <li key={s.url}><a href={s.url} rel="me noopener">{s.name}</a></li>
          ))}
        </ul>
      ) : null}
      <div>
        <LangPill lang={lang} page={page} d={d} />
        <p className="t-small">{d.footer.copyright}</p>
        <p className="t-small">{d.common.disclosure}</p>
      </div>
    </footer>
  );
}
